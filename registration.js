
const form=document.getElementById("registrationForm");
const teamSizeInputs=document.querySelectorAll('input[name="TeamSize"]');
const membersSection=document.getElementById("membersSection");
const memberCards=document.getElementById("memberCards");
const participationType=document.getElementById("participationType");
const eventError=document.getElementById("eventError");
const formMessage=document.getElementById("formMessage");
const submitBtn=document.getElementById("submitBtn");
const successOverlay=document.getElementById("successOverlay");
const successRegistrationId=document.getElementById("successRegistrationId");
const continueBtn=document.getElementById("continueBtn");

const val=id=>(document.getElementById(id)?.value||"").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function updateMembers(){
  const size=Number(document.querySelector('input[name="TeamSize"]:checked')?.value||1);
  participationType.value=size===1?"Solo":`Team of ${size}`;
  membersSection.hidden=size===1;
  memberCards.innerHTML="";
  for(let i=2;i<=size;i++){
    memberCards.insertAdjacentHTML("beforeend",`
      <div class="member-card">
        <div class="field-grid">
          <div class="field full-field"><label>Member ${i} Full Name <span>*</span></label><input id="member${i}Name" required></div>
          <div class="field"><label>Class <span>*</span></label><select id="member${i}Class" required>
            <option value="">Select</option><option>VI</option><option>VII</option><option>VIII</option><option>IX</option><option>X</option><option>XI</option><option>XII</option>
          </select></div>
          <div class="field"><label>Section <span>*</span></label><input id="member${i}Section" maxlength="5" required></div>
        </div>
      </div>`);
  }
}
teamSizeInputs.forEach(x=>x.addEventListener("change",updateMembers));
updateMembers();

function selectedEvents(){return [...document.querySelectorAll('input[name="Events"]:checked')].map(x=>x.value);}
document.querySelectorAll('input[name="Events"]').forEach(x=>x.addEventListener("change",()=>eventError.textContent=""));
function msg(text,type=""){formMessage.textContent=text;formMessage.className=`form-message ${type}`.trim();}

form?.addEventListener("submit",async e=>{
  e.preventDefault(); msg(""); eventError.textContent="";
  if(!form.checkValidity()){form.reportValidity();return;}
  const events=selectedEvents();
  if(!events.length){eventError.textContent="Please select at least one event.";return;}
  const phone=val("mobileNumber");
  if(!/^[6-9]\d{9}$/.test(phone)){msg("Enter a valid 10-digit Indian mobile number.");return;}
  const size=Number(document.querySelector('input[name="TeamSize"]:checked').value);
  const data={
    TeamSize:size,ParticipationType:participationType.value,
    StudentName:val("studentName"),Class:val("studentClass"),Section:val("studentSection").toUpperCase(),
    MobileNumber:phone,EmailAddress:val("emailAddress").toLowerCase(),TeamName:val("teamName"),
    Events:events,Remarks:val("remarks")
  };
  for(let i=2;i<=size;i++){data[`Member${i}Name`]=val(`member${i}Name`);data[`Member${i}Class`]=val(`member${i}Class`);data[`Member${i}Section`]=val(`member${i}Section`).toUpperCase();}
  submitBtn.disabled=true; submitBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
  try{
    const out=RoboDB.addRegistration(data);
    sessionStorage.setItem("apsRegistrationId",out.registrationId);
    sessionStorage.setItem("apsRegistrationName",data.StudentName);
    successRegistrationId.textContent=out.registrationId; successOverlay.classList.remove("hidden");
  }catch(err){msg(err.message,"error");submitBtn.disabled=false;submitBtn.innerHTML='Submit Registration <i class="fa-solid fa-arrow-right"></i>';}
});
continueBtn?.addEventListener("click",()=>location.href="thankyou.html");
