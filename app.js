    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);
const $=id=>document.getElementById(id);
let currentUser=null,currentProfile=null;

$("today").textContent=new Intl.DateTimeFormat("id-ID",{dateStyle:"full"}).format(new Date());
$("dateFilter").value=new Date().toISOString().slice(0,10);

$("loginForm").addEventListener("submit",async e=>{
 e.preventDefault(); $("loginError").textContent="";
 try{await signInWithEmailAndPassword(auth,$("email").value,$("password").value)}
 catch(err){$("loginError").textContent="Login gagal. Periksa email dan password."}
});
$("logoutBtn").onclick=()=>signOut(auth);

onAuthStateChanged(auth,async user=>{
 currentUser=user;
 if(!user){$("loginPage").classList.remove("hidden");$("mainPage").classList.add("hidden");return}
 $("loginPage").classList.add("hidden");$("mainPage").classList.remove("hidden");
 const snap=await getDoc(doc(db,"users",user.uid));
 currentProfile=snap.exists()?snap.data():{name:user.email,role:"teacher"};
 $("greeting").textContent=`Halo, ${currentProfile.name||"Guru"}`;
 $("roleBadge").textContent=currentProfile.role==="admin"?"ADMIN":"GURU";
 if(currentProfile.role==="admin"){ $("adminPanel").classList.remove("hidden"); $("teacherPanel").classList.add("hidden"); await loadAdmin(); }
 else { $("teacherPanel").classList.remove("hidden"); $("adminPanel").classList.add("hidden"); await loadTeacher(); }
});

const dateKey=()=>new Date().toISOString().slice(0,10);
const timeNow=()=>new Intl.DateTimeFormat("id-ID",{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());

async function loadTeacher(){
 const id=`${currentUser.uid}_${dateKey()}`, s=await getDoc(doc(db,"attendance",id));
 const d=s.exists()?s.data():{};
 $("startTime").textContent="07:00"; $("endTime").textContent="14:00";
 $("myStatus").textContent=d.status||"Belum absen";
 $("attendanceStatus").innerHTML=d.checkIn?`<p>Masuk: <b>${d.checkIn}</b></p>`:"<p>Belum melakukan absen masuk.</p>";
 $("checkInBtn").disabled=!!d.checkIn; $("checkOutBtn").disabled=!d.checkIn||!!d.checkOut;
 $("checkInBtn").onclick=()=>mark("checkIn");
 $("checkOutBtn").onclick=()=>mark("checkOut");
 const q=query(collection(db,"attendance"),where("uid","==",currentUser.uid),orderBy("date","desc"),limit(30));
 const ss=await getDocs(q); $("myHistory").innerHTML="";
 ss.forEach(x=>{const d=x.data();$("myHistory").innerHTML+=`<tr><td>${d.date}</td><td>${d.checkIn||"-"}</td><td>${d.checkOut||"-"}</td><td>${d.status||"-"}</td></tr>`});
}
async function mark(type){
 const id=`${currentUser.uid}_${dateKey()}`, ref=doc(db,"attendance",id), s=await getDoc(ref), d=s.exists()?s.data():{uid:currentUser.uid,name:currentProfile.name||currentUser.email,date:dateKey(),status:"Hadir"};
 if(type==="checkIn"){d.checkIn=timeNow(); if(d.checkIn>"07:00") d.status="Terlambat"}
 if(type==="checkOut") d.checkOut=timeNow();
 await setDoc(ref,d,{merge:true}); await loadTeacher(); alert(type==="checkIn"?"Absen masuk berhasil.":"Absen pulang berhasil.");
}
async function loadAdmin(){
 const selected=$("dateFilter").value; const users=await getDocs(query(collection(db,"users"),where("role","==","teacher")));
 const rows=[]; let hadir=0,late=0,permit=0,missing=0;
 for(const u of users.docs){const p=u.data(), a=await getDoc(doc(db,"attendance",`${u.id}_${selected}`)); const d=a.exists()?a.data():null; if(!d)missing++; else {if(d.status==="Hadir")hadir++; if(d.status==="Terlambat")late++; if(["Izin","Sakit"].includes(d.status))permit++} rows.push({name:p.name||u.id,checkIn:d?.checkIn||"-",checkOut:d?.checkOut||"-",status:d?.status||"Belum Absen"});}
 $("sHadir").textContent=hadir;$("sLate").textContent=late;$("sPermit").textContent=permit;$("sMissing").textContent=missing;
 $("adminTable").innerHTML=rows.map(r=>`<tr><td>${r.name}</td><td>${r.checkIn}</td><td>${r.checkOut}</td><td class="${r.status==="Hadir"?"ok":r.status==="Terlambat"?"late":"missing"}">${r.status}</td></tr>`).join("");
 $("dateFilter").onchange=loadAdmin;
 $("exportBtn").onclick=()=>exportCSV(rows,selected);
 const all=await getDocs(query(collection(db,"attendance"),orderBy("date","desc"),limit(100)));
 $("allHistory").innerHTML=""; all.forEach(x=>{const d=x.data();$("allHistory").innerHTML+=`<tr><td>${d.date}</td><td>${d.name||d.uid}</td><td>${d.checkIn||"-"}</td><td>${d.checkOut||"-"}</td><td>${d.status||"-"}</td></tr>`});
}
function exportCSV(rows,date){
 let csv="Nama,Guru,Masuk,Pulang,Status\n"; rows.forEach(r=>csv+=`"${r.name}","${date}","${r.checkIn}","${r.checkOut}","${r.status}"\n`);
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`rekap-absensi-${date}.csv`;a.click();URL.revokeObjectURL(a.href);
}
