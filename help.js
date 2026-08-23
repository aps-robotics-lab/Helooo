
const form=document.getElementById("helpForm"), submitBtn=document.getElementById("submitBtn"), formStatus=document.getElementById("formStatus");
const submitText=document.getElementById("submitText"), submitLoading=document.getElementById("submitLoading");
const trackerForm=document.getElementById("helpTrackerForm"), trackerInput=document.getElementById("trackerReference");
const trackerStatus=document.getElementById("trackerStatus"), trackerResult=document.getElementById("trackerResult");
const trackerProgress=document.getElementById("trackerProgress"), trackerProgressText=document.getElementById("trackerProgressText");
const trackerStatusText=document.getElementById("trackerStatusText"), trackerUpdated=document.getElementById("trackerUpdated"), trackerNote=document.getElementById("trackerNote");
const message=document.getElementById("message"), messageCount=document.getElementById("messageCount");
message?.addEventListener("input",()=>messageCount.textContent=message.value.length);
function status(t,c=""){formStatus.textContent=t;formStatus.className=`form-status ${c}`.trim();}
form?.addEventListener("submit",async e=>{
 e.preventDefault(); status("");
 if(!form.checkValidity()){form.reportValidity();return;}
 submitBtn.disabled=true;submitText.classList.add("hidden");submitLoading.classList.remove("hidden");
 const data=Object.fromEntries(new FormData(form).entries());
 try{
  const out=RoboDB.addTicket(data);
  location.href=`/help/thank-you/?ref=${encodeURIComponent(out.referenceId)}`;
 }catch(err){status(err.message,"error");submitBtn.disabled=false;submitText.classList.remove("hidden");submitLoading.classList.add("hidden");}
});
trackerForm?.addEventListener("submit",async e=>{
 e.preventDefault();trackerStatus.textContent="Checking…";trackerResult.classList.add("hidden");
 try{
  const out=RoboDB.ticket(trackerInput.value.trim());
  if(!out)throw new Error("Unable to check progress right now.");
  trackerStatus.textContent="";trackerResult.classList.remove("hidden");
  trackerStatusText.textContent=out.status;trackerProgressText.textContent=`${out.progress}%`;trackerProgress.style.width=`${out.progress}%`;
  trackerNote.textContent=out.status_note;trackerUpdated.textContent=new Date(out.updated_at).toLocaleString();
 }catch(err){trackerStatus.textContent=err.message;}
});
