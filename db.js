/* RoboKriti browser database: localStorage-backed, no server/Python required. */
(() => {
  const KEY='robokriti_db_v1';
  const now=()=>new Date().toISOString();
  const seed={registrations:[],tickets:[],home:{}};
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(seed)}catch{return structuredClone(seed)}}
  function save(db){localStorage.setItem(KEY,JSON.stringify(db));return db}
  function id(prefix){return prefix+'-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,7).toUpperCase()}
  window.RoboDB={
    all(){return load()},
    addRegistration(data){const db=load(),x={...data,id:id('RK'),registrationId:id('REG'),status:'Pending',created_at:now(),updated_at:now()};db.registrations.unshift(x);save(db);return x},
    addTicket(data){const db=load(),x={...data,id:id('TK'),referenceId:id('HELP'),status:'Open',progress:10,status_note:'Your request has been received.',created_at:now(),updated_at:now()};db.tickets.unshift(x);save(db);return x},
    ticket(ref){return load().tickets.find(x=>x.referenceId===ref||x.id===ref)},
    update(type,id,data){const db=load(),a=type==='registration'?db.registrations:db.tickets,x=a.find(v=>v.id===id||v.registrationId===id||v.referenceId===id);if(!x)return null;Object.assign(x,data,{updated_at:now()});save(db);return x},
    remove(type,id){const db=load(),key=type==='registration'?'registrations':'tickets';db[key]=db[key].filter(x=>x.id!==id&&x.registrationId!==id&&x.referenceId!==id);save(db)}
  };
})();
