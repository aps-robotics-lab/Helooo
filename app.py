from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3, secrets, os
from pathlib import Path
from datetime import datetime

BASE = Path(__file__).resolve().parent
DB = BASE / "robokriti.db"
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change-this-secret-in-production")

EVENTS = ["Robo Race", "Robo War", "Robo Tug of War", "Robo Soccer"]

def db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration_id TEXT UNIQUE NOT NULL,
        team_size INTEGER NOT NULL,
        participation_type TEXT NOT NULL,
        team_name TEXT,
        leader_name TEXT NOT NULL,
        leader_class TEXT NOT NULL,
        leader_section TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT NOT NULL,
        events TEXT NOT NULL,
        members_json TEXT NOT NULL,
        remarks TEXT,
        status TEXT NOT NULL DEFAULT 'Pending Approval',
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS help_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        registration_id TEXT,
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Open',
        created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)
    defaults = {
        "hero_title":"BUILD. BATTLE. INNOVATE.",
        "hero_description":"Design machines. Engineer solutions. Enter the arena. APS Tinkering Lab Robokriti 2026 brings young innovators together for a high-energy robotics experience built around speed, control, power and strategy."
    }
    for k,v in defaults.items():
        conn.execute("INSERT OR IGNORE INTO site_settings(key,value) VALUES(?,?)",(k,v))
    conn.commit()
    conn.close()

@app.context_processor
def globals():
    return {"events": EVENTS}

@app.route("/")
def home():
    conn=db()
    settings={r["key"]:r["value"] for r in conn.execute("SELECT key,value FROM site_settings")}
    conn.close()
    return render_template("index.html", settings=settings)

def dept_required(dept):
    return session.get("department") == dept

@app.route("/registration", methods=["GET","POST"])
def registration():
    if not dept_required("registration"):
        return redirect(url_for("department_login", next="/registration"))
    if request.method == "GET":
        return render_template("registration.html")
    data=request.get_json(silent=True) or request.form
    try:
        team_size=int(data.get("team_size",1))
        leader_name=(data.get("leader_name") or "").strip()
        leader_class=(data.get("leader_class") or "").strip()
        leader_section=(data.get("leader_section") or "").strip()
        mobile=(data.get("mobile") or "").strip()
        email=(data.get("email") or "").strip()
        team_name=(data.get("team_name") or "").strip()
        remarks=(data.get("remarks") or "").strip()
        events=data.get("events", [])
        if isinstance(events,str): events=[events]
        members=data.get("members", [])
        if isinstance(members,str):
            import json
            members=json.loads(members)
        if team_size not in range(1,6) or not leader_name or not leader_class or not leader_section or not mobile or not email:
            raise ValueError("Please complete all required participant fields.")
        if not events or any(e not in EVENTS for e in events):
            raise ValueError("Select at least one valid event.")
        if len(members) != max(0,team_size-1):
            raise ValueError("Team member details do not match the selected team size.")
        rid="RK26-"+secrets.token_hex(4).upper()
        now=datetime.now().isoformat(timespec="seconds")
        import json
        conn=db()
        conn.execute("""INSERT INTO registrations
        (registration_id,team_size,participation_type,team_name,leader_name,leader_class,leader_section,mobile,email,events,members_json,remarks,created_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (rid,team_size,"Solo" if team_size==1 else "Team",team_name,leader_name,leader_class,leader_section,mobile,email,json.dumps(events),json.dumps(members),remarks,now))
        conn.commit(); conn.close()
        return jsonify(ok=True, registration_id=rid)
    except Exception as e:
        return jsonify(ok=False,error=str(e)),400

@app.route("/help", methods=["GET","POST"])
def help_center():
    if not dept_required("help"):
        return redirect(url_for("department_login", next="/help"))
    if request.method=="GET":
        return render_template("help.html")
    data=request.get_json(silent=True) or request.form
    try:
        name=(data.get("name") or "").strip()
        email=(data.get("email") or "").strip()
        registration_id=(data.get("registration_id") or "").strip()
        category=(data.get("category") or "").strip()
        message=(data.get("message") or "").strip()
        if not all([name,email,category,message]): raise ValueError("Complete all required fields.")
        tid="HELP-"+secrets.token_hex(4).upper()
        conn=db()
        conn.execute("""INSERT INTO help_requests(ticket_id,name,email,registration_id,category,message,created_at)
        VALUES(?,?,?,?,?,?,?)""",(tid,name,email,registration_id,category,message,datetime.now().isoformat(timespec="seconds")))
        conn.commit(); conn.close()
        return jsonify(ok=True,ticket_id=tid)
    except Exception as e:
        return jsonify(ok=False,error=str(e)),400

@app.route("/rules")
def rules(): return render_template("rules.html")

@app.route("/events/<slug>")
def event(slug):
    mapping={
        "robo-race":("Robo Race","SPEED / PRECISION","Push acceleration, control and line discipline through a demanding robotic track."),
        "robo-soccer":("Robo Soccer","CONTROL / TEAMWORK","Master robotic movement and scoring through controlled, tactical gameplay."),
        "robot-tug-of-war":("Robot Tug of War","POWER / TRACTION","Torque, grip and mechanical strength decide who controls the line."),
        "robo-war":("Robo War","STRATEGY / COMBAT","Engineer a robust machine and outmaneuver your opponent inside the arena.")
    }
    if slug not in mapping: return redirect(url_for("home"))
    return render_template("event.html", event=mapping[slug])

@app.route("/department-login", methods=["GET","POST"])
def department_login():
    if request.method == "POST":
        username=(request.form.get("username") or "").strip()
        password=request.form.get("password") or ""
        dept=request.form.get("department") or ""
        # Replace these credentials with strong unique values before deployment.
        credentials={
            "registration": {"username":"registration","password":"RK26-REG-CHANGE-ME"},
            "help": {"username":"helpdesk","password":"RK26-HELP-CHANGE-ME"}
        }
        if dept in credentials and username==credentials[dept]["username"] and password==credentials[dept]["password"]:
            session["department"]=dept
            return redirect(request.form.get("next") or url_for("home"))
        return render_template("department_login.html", error="Invalid department credentials.", next=request.form.get("next","/"))
    return render_template("department_login.html", next=request.args.get("next","/"))

@app.route("/admin")
def admin():
    if not session.get("department"):
        return redirect(url_for("department_login", next="/admin"))
    conn=db()
    registrations=conn.execute("SELECT * FROM registrations ORDER BY id DESC").fetchall() if session["department"]=="registration" else []
    helps=conn.execute("SELECT * FROM help_requests ORDER BY id DESC").fetchall() if session["department"]=="help" else []
    conn.close()
    return render_template("admin.html", registrations=registrations, helps=helps, login=False, department=session["department"])

@app.post("/admin/status")
def admin_status():
    dept=session.get("department")
    if not dept: return jsonify(ok=False),403
    data=request.get_json() or {}
    table=data.get("table"); row_id=data.get("id"); status=data.get("status")
    allowed={"registration":{"registrations":{"Pending Approval","Approved","Rejected"}},
             "help":{"help_requests":{"Open","In Progress","Resolved"}}}
    if table not in allowed.get(dept,{}) or status not in allowed[dept][table]:
        return jsonify(ok=False,error="Not permitted"),403
    conn=db()
    conn.execute(f"UPDATE {table} SET status=? WHERE id=?",(status,row_id))
    conn.commit(); conn.close()
    return jsonify(ok=True)

@app.post("/admin/delete-help")
def admin_delete_help():
    if session.get("department")!="help": return jsonify(ok=False),403
    rid=(request.get_json() or {}).get("id")
    conn=db(); conn.execute("DELETE FROM help_requests WHERE id=?",(rid,)); conn.commit(); conn.close()
    return jsonify(ok=True)

@app.get("/logout")
def logout():
    session.clear(); return redirect(url_for("home"))

if __name__=="__main__":
    init_db()
    app.run(debug=True, host="127.0.0.1", port=5000)
