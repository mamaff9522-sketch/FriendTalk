/* ศรีมงคล 99 — driver app + admin control centre (Firebase Firestore) */
(() => {
'use strict';

/* ================= icons ================= */
const IC = {
  menu:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>',
  truck:'<svg viewBox="0 0 40 26" fill="currentColor"><rect x="1" y="4" width="23" height="14" rx="2"/><path d="M25 8h7l6 7v3H25z"/><circle cx="8" cy="21" r="3.4"/><circle cx="32" cy="21" r="3.4"/></svg>',
  truckw:'<svg viewBox="0 0 46 30"><rect x="1" y="4" width="26" height="16" rx="2" fill="#fff"/><path d="M29 8h8l7 8v4H29z" fill="#fff"/><path d="M31 10h5l5 5.5H31z" fill="#123778"/><circle cx="9" cy="23.5" r="3.6" fill="#ef7a16" stroke="#fff" stroke-width="1.6"/><circle cx="37" cy="23.5" r="3.6" fill="#ef7a16" stroke="#fff" stroke-width="1.6"/></svg>',
  cab:'<svg viewBox="0 0 40 26" fill="currentColor"><path d="M12 3h13a3 3 0 0 1 3 3v12H12z"/><path d="M15 6h10v5H15z" fill="#fff" opacity=".85"/><circle cx="16" cy="21" r="3.4"/><circle cx="25" cy="21" r="3.4"/></svg>',
  trailer:'<svg viewBox="0 0 40 26" fill="currentColor"><rect x="2" y="4" width="34" height="13" rx="2"/><circle cx="24" cy="21" r="3.4"/><circle cx="32" cy="21" r="3.4"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 11l1.6-4.3A2 2 0 0 1 8.5 5.4h7a2 2 0 0 1 1.9 1.3L19 11v7h-2v-2H7v2H5zm2.2-1h9.6l-1-2.9H8.2zM7.5 14a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6zm9 0a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z"/></svg>',
  driver:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#dbe7fb"/><path d="M12 60c2-12 10-17 20-17s18 5 20 17" fill="#1d4fae"/><path d="M27 43h10l-5 8z" fill="#fff"/><circle cx="32" cy="27" r="11" fill="#f2c6a0"/><path d="M20 24c0-7 5-12 12-12s12 5 12 12c-3-2-6-3-12-3s-9 1-12 3z" fill="#1b2d57"/><path d="M19 22h26v3H19z" fill="#123778"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 21V3h2v1.2h12l-2.6 4.6L19 13.4H7V21z"/></svg>',
  dock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 10 12 3l10 7v11h-3v-9H5v9H2zm5 4h10v2H7zm0 4h10v3H7z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
  okc:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.8 14.6-4.4-4.4 1.4-1.4 3 3 6.6-6.6 1.4 1.4z"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 21h22zm1 15h-2v-2h2zm0-4h-2V9h2z"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6v-5a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v7a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V22h2v-3.1a7 7 0 0 0 6-6.9z"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  fuel:'<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M3 3h10v18H3zM5 5v5h6V5zM14 7.5l2.5-2.5 1.4 1.4-1 1 1.6 1.6V17a2.5 2.5 0 0 1-5 0v-4h-1v-2h3v6a.5.5 0 0 0 1 0V9.8l-1.9-1.9z"/></svg>',
  factory:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21V10l6 3V10l6 3V4h3l1 9h4v8zm4-4v2h3v-2zm5 0v2h3v-2zm5 0v2h3v-2z"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m9 5 7 7-7 7"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3zm12 8H5v9h14zM7 12h3v3H7z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2" stroke-linecap="round"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>',
  gps:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 3h-2.06A7 7 0 0 0 13 5.06V3h-2v2.06A7 7 0 0 0 5.06 11H3v2h2.06A7 7 0 0 0 11 18.94V21h2v-2.06A7 7 0 0 0 18.94 13H21zm-9 6a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h12V5zm2 2h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 13c-4 0-7 2-7 4.5V20h14v-2.5C16 15 13 13 9 13zm7 0c-.6 0-1.2 0-1.8.1 1.1.9 1.8 2 1.8 3.4V20h6v-2.5c0-2.4-2.7-4.5-6-4.5z"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.7 1.7 1L11 21h4l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm-1 14-4-4 1.4-1.4 2.6 2.6 5.6-5.6L18 9z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h11l-3-3 1.4-1.4L22 8l-5.6 5.4L15 12l3-3H7zm10 10H6l3 3-1.4 1.4L2 16l5.6-5.4L9 12l-3 3h11z"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6v-2H5V5h5zm6.6 4.6L15.2 9l2 2H9v2h8.2l-2 2 1.4 1.4L21 12z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4.5"/><path d="M11 1h2v3h-2zm0 19h2v3h-2zM1 11h3v2H1zm19 0h3v2h-3zM4.2 5.6l1.4-1.4 2.1 2.1-1.4 1.4zm12.1 12.1 1.4-1.4 2.1 2.1-1.4 1.4zM4.2 18.4l2.1-2.1 1.4 1.4-2.1 2.1zM16.3 6.3l2.1-2.1 1.4 1.4-2.1 2.1z"/></svg>',
  photo:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm1 13h14l-4.5-6-3.5 4.5-2.5-3z"/></svg>',
  speak:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1A9 9 0 0 0 14 3.2z"/></svg>',
  bigtruck:'<svg viewBox="0 0 70 44"><rect x="2" y="6" width="42" height="24" rx="2" fill="#eef2f8" stroke="#9aa8c0"/><path d="M46 12h11l10 11v8H46z" fill="#2b4f9e"/><path d="M49 15h7l7 7.5H49z" fill="#bcd3f5"/><rect x="2" y="30" width="65" height="4" fill="#334"/><circle cx="12" cy="36" r="5" fill="#222"/><circle cx="24" cy="36" r="5" fill="#222"/><circle cx="56" cy="36" r="5" fill="#222"/><circle cx="12" cy="36" r="2" fill="#aaa"/><circle cx="24" cy="36" r="2" fill="#aaa"/><circle cx="56" cy="36" r="2" fill="#aaa"/></svg>',
};
const ico = (k, cls='') => `<i data-i="${k}"${cls?` class="${cls}"`:''}>${IC[k]||''}</i>`;
function paintIcons(root=document){ root.querySelectorAll('i[data-i]:empty').forEach(el => { el.innerHTML = IC[el.dataset.i] || ''; }); }

/* ================= helpers ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad2 = n => String(n).padStart(2,'0');
const fmtT = ms => { if(!ms) return '–'; const d = new Date(ms); return `${pad2(d.getHours())}:${pad2(d.getMinutes())} น.`; };
const TH_M = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const dayLbl = ms => { const d=new Date(ms), n=new Date(); const k=Math.round((new Date(d.toDateString())-new Date(n.toDateString()))/864e5);
  return k===0?'วันนี้':k===1?'พรุ่งนี้':k===-1?'เมื่อวาน':`${d.getDate()} ${TH_M[d.getMonth()]}`; };
const fmtDT = ms => ms ? `${dayLbl(ms)}, ${fmtT(ms)}` : '–';
const mins = ms => Math.max(0, Math.floor((Date.now() - (ms||Date.now())) / 60000));
const durTxt = m => m < 60 ? `${m} นาที` : `${Math.floor(m/60)} ชม. ${m%60} นาที`;
const num = v => (+v||0).toLocaleString('th-TH', {maximumFractionDigits:2});
const ls = { get(k,d){ try{ const v=localStorage.getItem('sm_'+k); return v===null?d:JSON.parse(v); }catch(e){ return d; } },
             set(k,v){ try{ localStorage.setItem('sm_'+k, JSON.stringify(v)); }catch(e){} } };
const A = window.Android || null;
const call = (fn, ...a) => { try { return A && A[fn] ? A[fn](...a) : undefined; } catch(e){ return undefined; } };
const telHref = p => 'tel:' + String(p||'').replace(/[^\d+]/g,'');
function toast(msg){ const t=$('toast'); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true, 3000); }
function show(id){ ['scrStart','scrPick','scrDriver','scrPin','scrAdmin','scrSetup'].forEach(s => $(s).hidden = s!==id); }
const rid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* read coordinates from a Google Maps link or "lat, lng" text */
function parseLoc(text){
  const s = String(text||'').trim(); if(!s) return null;
  const pats = [/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/, /@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/, /[?&](?:q|query|ll|destination|center)=(?:loc:)?(-?\d{1,2}\.\d+)(?:,|%2C)\s*(-?\d{1,3}\.\d+)/i, /(-?\d{1,2}\.\d{3,})\s*,\s*(-?\d{1,3}\.\d{3,})/];
  for (const p of pats){ const m = s.match(p); if (m){ const lat=+m[1], lng=+m[2]; if (Math.abs(lat)<=90 && Math.abs(lng)<=180) return {lat, lng}; } }
  return null;
}

/* shrink a photo so it fits in the database (about 100 KB) */
function readPhoto(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = () => { const img = new Image(); img.onerror = rej; img.onload = () => {
      const max = 1024, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width*k); c.height = Math.round(img.height*k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let q = .7, out = c.toDataURL('image/jpeg', q);
      while (out.length > 300000 && q > .3){ q -= .1; out = c.toDataURL('image/jpeg', q); }
      res(out);
    }; img.src = r.result; };
    r.readAsDataURL(file);
  });
}
function bindPhoto(inputId, prevId, store){
  $(inputId).addEventListener('change', async e => {
    const f = e.target.files[0]; if(!f) return;
    try { const d = await readPhoto(f); store.data = d; $(prevId).src = d; $(prevId).hidden = false; }
    catch(err){ toast('เปิดรูปไม่ได้ ลองรูปอื่น'); }
    e.target.value = '';
  });
}
async function savePhoto(data, truckId){
  if (!data) return '';
  const ref = db.collection('photos').doc();
  await ref.set({data, truck: truckId||'', at: Date.now()});
  return ref.id;
}

/* ================= constants ================= */
const ST = {
  idle:{t:'ว่าง', c:'', pin:'#8b97ad'},
  assigned:{t:'ได้รับงานแล้ว', c:'c-amber', pin:'#c27c12'},
  standby:{t:'สแตนบายต้นทาง', c:'c-navy', pin:'#1f5fd6'},
  loading:{t:'หัว-หางเข้าช่อง', c:'c-orange', pin:'#f07d18'},
  enroute:{t:'กำลังเดินทาง', c:'c-green', pin:'#1f9d50'},
  arrived:{t:'ถึงปลายทาง', c:'c-navy', pin:'#1f5fd6'},
  done:{t:'จบงาน', c:'', pin:'#8b97ad'},
};
const EV = {
  assign:{t:'แอดมินมอบหมายงาน', i:'list', bg:'#c27c12'},
  standby:{t:'สแตนบายต้นทาง', i:'flag', bg:'#1f5fd6'},
  hitch:{t:'หัว-หางเข้าช่อง', i:'dock', bg:'#f07d18'},
  depart:{t:'ออกเดินทาง', i:'play', bg:'#1f9d50'},
  arrive:{t:'ถึงปลายทาง', i:'pin', bg:'#1f5fd6'},
  done:{t:'จบงาน', i:'check', bg:'#1b2d57'},
  delay:{t:'แจ้งเหตุล่าช้า', i:'warn', bg:'#e0352b'},
  ring:{t:'แอดมินกดกริ่ง', i:'bell', bg:'#f07d18'},
  announce:{t:'แอดมินประกาศเสียง', i:'mic', bg:'#1f5fd6'},
  ack:{t:'คนขับรับทราบกริ่ง', i:'okc', bg:'#1f9d50'},
  fuel:{t:'เติมน้ำมัน', i:'fuel', bg:'#0f7a78'},
  gpsmock:{t:'⚠ ตรวจพบ GPS ปลอม', i:'warn', bg:'#e0352b'},
  gpsoff:{t:'⚠ คนขับปิด GPS', i:'warn', bg:'#e0352b'},
  gpsreal:{t:'GPS กลับมาปกติ', i:'gps', bg:'#1f9d50'},
  logout:{t:'คนขับออกจากระบบ (GPS หยุด)', i:'logout', bg:'#5d6a84'},
};
const DEFAULT_CENTER = [13.7563, 100.5018];

/* ================= state ================= */
let db = null, auth = null, user = null, fbCfg = null;
const S = { trucks:{}, events:[], places:{}, config:null, cmd:null, myEvents:[], connected:false };
let role = ls.get('role', '');
let myTruck = ls.get('truck', '');
let dScreen = 'home', dTab = 'home';
let aTab = 'ov', selTruck = null;
let unsub = [];
let hitchType = 'both';
const hPhoto = {}, dlPhoto = {}, fuPhoto = {};
let fuLoc = null;
let thr = 30;
const seenAlerts = new Set();

/* ================= boot ================= */
function boot(){
  paintIcons();
  fbCfg = window.FIREBASE_CONFIG;
  if (!fbCfg || !window.firebase){ show('scrSetup'); return; }
  firebase.initializeApp(fbCfg);
  auth = firebase.auth();
  db = firebase.firestore();
  try { db.enablePersistence({synchronizeTabs:false}).catch(()=>{}); } catch(e){}
  auth.onAuthStateChanged(u => { user = u; if (u) startData(); });
  signIn();
  route();
  setInterval(() => { if (role==='admin' && !$('scrAdmin').hidden) renderAdmin(); else if (role==='driver') renderDriver(); }, 30000);
  setInterval(() => { if (role==='driver' && myTruck && dScreen==='home' && !document.hidden && S.trucks[myTruck]) updateDriverMap(S.trucks[myTruck]); }, 3000);
  window.addEventListener('online', () => renderDriver());
  window.addEventListener('offline', () => renderDriver());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkCmd(); });
}

/* sign in (anonymous); keep retrying so the app recovers by itself */
let authErr = '';
function signIn(){
  if (auth.currentUser) return;
  auth.signInAnonymously().then(() => { authErr = ''; renderAll(); }).catch(err => {
    const code = (err && err.code) || '';
    authErr = code === 'auth/admin-restricted-operation' || code === 'auth/operation-not-allowed'
      ? 'ยังไม่ได้เปิดการเข้าสู่ระบบแบบ “ไม่ระบุชื่อ” ใน Firebase'
      : code === 'auth/network-request-failed' ? 'ไม่มีอินเทอร์เน็ต กำลังลองใหม่…'
      : 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กำลังลองใหม่…';
    if (code) authErr += ` (${code})`;
    $('startMsg').hidden = false; $('startMsg').textContent = authErr;
    renderAll(); if (!$('scrPick').hidden) renderPick();
    setTimeout(signIn, 5000);
  });
}

let dataStarted = false;
function startData(){
  if (dataStarted) return; dataStarted = true;
  unsub.push(db.collection('trucks').onSnapshot({includeMetadataChanges:true}, snap => {
    const next = {}; snap.forEach(d => next[d.id] = d.data());
    S.trucks = next; S.connected = !snap.metadata.fromCache;
    if (role==='driver' && myTruck && !snap.metadata.fromCache){
      const mt = S.trucks[myTruck];
      if (!mt) driverLogout('บัญชีนี้ถูกลบแล้ว ติดต่อแอดมิน');
      else if ((mt.loginVer||0) !== ls.get('loginVer', 0)) driverLogout('แอดมินเปลี่ยนรหัสผ่านแล้ว กรุณาเข้าสู่ระบบใหม่');
    }
    renderAll();
  }, () => {}));
  unsub.push(db.collection('places').onSnapshot(snap => { const p={}; snap.forEach(d => p[d.id]=d.data()); S.places=p; renderAll(); }, () => {}));
  unsub.push(db.doc('config/main').onSnapshot(d => { const prev = S.config && S.config.liveSec; S.config = d.exists ? d.data() : {}; thr = +(S.config.thr||30);
    if (role==='driver' && myTruck && prev !== undefined && prev !== S.config.liveSec) startTracking();
    renderAll(); }, () => { S.config = {}; }));
  unsub.push(db.collection('events').orderBy('at','desc').limit(120).onSnapshot(snap => {
    S.events = snap.docs.map(d => Object.assign({id:d.id}, d.data())); renderAll();
  }, () => {}));
  if (role==='driver' && myTruck) driverStart();
}
function renderAll(){
  if (role==='driver'){ if (!$('scrPick').hidden) renderPick(); else renderDriver(); }
  else if (role==='admin' && !$('scrAdmin').hidden) renderAdmin();
}

function route(){
  if (role==='driver'){ if (myTruck) { show('scrDriver'); go('home'); } else { show('scrPick'); renderPick(); } }
  else if (role==='admin' && ls.get('adminOk', false)) { show('scrAdmin'); renderAdmin(); setTimeout(initAdminMap, 50); }
  else show('scrStart');
}

/* ================= start / role ================= */
$('goDriver').onclick = () => { role='driver'; ls.set('role', role); if (myTruck){ show('scrDriver'); driverStart(); go('home'); } else { $('lgUser').value = ls.get('loginUser',''); show('scrPick'); renderPick(); } };
$('goAdmin').onclick = () => { openPin(); };
document.addEventListener('click', e => {
  const n = e.target.closest('[data-nav]'); if (n){ e.preventDefault(); const k = n.dataset.nav;
    closeDrawer();
    if (k==='start'){ role=''; ls.set('role',''); show('scrStart'); return; }
    go(k); return; }
  const t = e.target.closest('[data-tab]'); if (t){ closeDrawer(); goTab(t.dataset.tab); return; }
  const a = e.target.closest('[data-at]'); if (a){ aTab = a.dataset.at; closeSide(); renderAdmin(); window.scrollTo({top:0}); if (aTab==='ov') setTimeout(()=>aMap&&aMap.resize(),60); return; }
  const ph = e.target.closest('[data-photo]'); if (ph){ openPhoto(ph.dataset.photo); return; }
});

/* ================= driver: log in with username + password ================= */
const normUser = u => String(u||'').trim().toLowerCase();
const validUser = u => /^[a-z0-9._-]{3,20}$/.test(u);
async function hashPw(pw, salt){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function renderPick(){
  const m = $('lgMsg');
  if (!user && authErr){ m.hidden = false; m.textContent = authErr; }
  else if (m.dataset.kind === 'auth'){ m.hidden = true; }
  if (!user && authErr) m.dataset.kind = 'auth';
}
$('lgEye').onclick = () => { const i=$('lgPass'); i.type = i.type==='password' ? 'text' : 'password'; $('lgEye').textContent = i.type==='password' ? 'แสดง' : 'ซ่อน'; };
$('lgPass').addEventListener('keydown', e => { if (e.key==='Enter') $('lgGo').click(); });
$('lgUser').addEventListener('keydown', e => { if (e.key==='Enter') $('lgPass').focus(); });
$('lgGo').onclick = async () => {
  const m = $('lgMsg'); const fail = t => { m.hidden = false; m.dataset.kind = ''; m.textContent = t; };
  const u = normUser($('lgUser').value), pw = $('lgPass').value;
  if (!u || !pw){ fail('กรอกชื่อผู้ใช้และรหัสผ่าน'); return; }
  if (!user){ fail(authErr || 'กำลังเชื่อมต่อ รอสักครู่แล้วลองใหม่'); return; }
  $('lgGo').disabled = true;
  try {
    const d = await db.doc('logins/'+u).get({source:'server'});
    if (!d.exists){ fail('ไม่พบชื่อผู้ใช้นี้ ตรวจสอบกับแอดมิน'); return; }
    const L = d.data();
    if (await hashPw(pw, L.salt) !== L.hash){ fail('รหัสผ่านไม่ถูกต้อง'); return; }
    const t = await db.doc('trucks/'+L.truckId).get({source:'server'});
    if (!t.exists){ fail('บัญชีนี้ถูกลบแล้ว ติดต่อแอดมิน'); return; }
    myTruck = L.truckId; ls.set('truck', myTruck); ls.set('loginVer', L.ver || 0); ls.set('loginUser', u);
    S.trucks[myTruck] = t.data();
    $('lgPass').value = ''; m.hidden = true;
    show('scrDriver'); driverStart(); go('home');
    toast(`สวัสดี ${t.data().driver || ''}`);
  } catch(e){ fail('เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่'); }
  finally { $('lgGo').disabled = false; }
};
function driverLogout(msg){
  call('stopTracking'); myTruck=''; ls.set('truck',''); ls.set('loginVer', 0);
  if (cmdUnsub){ cmdUnsub(); cmdUnsub=null; } if (myEvUnsub){ myEvUnsub(); myEvUnsub=null; }
  if (webWatch !== null){ try{ navigator.geolocation.clearWatch(webWatch); }catch(e){} webWatch = null; }
  if (dMap){ dMap.remove(); dMap=null; dMk=null; dDestMk=null; dFollow=true; }
  closeDrawer(); $('lgUser').value = ls.get('loginUser','');
  show('scrPick'); renderPick(); if (msg) toast(msg);
}

/* ================= driver ================= */
let cmdUnsub = null, myEvUnsub = null, webWatch = null;
function driverStart(){
  if (!user || !myTruck) return;
  if (cmdUnsub) cmdUnsub(); if (myEvUnsub) myEvUnsub();
  cmdUnsub = db.doc('commands/'+myTruck).onSnapshot(d => { S.cmd = d.exists ? d.data() : null; checkCmd(); }, () => {});
  myEvUnsub = db.collection('events').where('truck','==',myTruck).limit(150).onSnapshot(snap => {
    S.myEvents = snap.docs.map(d => Object.assign({id:d.id}, d.data())).sort((a,b)=>b.at-a.at); if (dTab==='hist') renderDriver();
  }, () => {});
  startTracking();
  call('keepScreenOn', !!ls.get('screenOn', false));
}
function startTracking(){
  if (!user || !myTruck) return;
  if (A){
    if (!call('hasLocation')) { call('askLocation'); return; }
    call('startTracking', JSON.stringify({truckId: myTruck, apiKey: fbCfg.apiKey, projectId: fbCfg.projectId, refreshToken: user.refreshToken, liveSec: liveSec()}));
  } else if (navigator.geolocation && webWatch === null){
    // browser fallback (testing without the APK): send position while the page is open
    let lastW = 0, anchor = null, lastMove = Date.now(), moving = false;
    webWatch = navigator.geolocation.watchPosition(p => {
      const now = Date.now(), lat = p.coords.latitude, lng = p.coords.longitude;
      ls.set('lastLoc', {lat, lng, acc:p.coords.accuracy, at:now});
      const dist = anchor ? haversine(anchor, {lat,lng}) : 0;
      let force = false;
      if (!anchor || dist > 80){ anchor = {lat,lng}; lastMove = now; force = moving === false && dist > 80; moving = dist > 80 || moving; }
      if (moving && now - lastMove > 180000){ moving = false; force = true; }
      if (force || now - lastW > (moving ? liveSec()*1000 : 120000)){ lastW = now;
        db.doc('trucks/'+myTruck).update({lat, lng, acc:p.coords.accuracy, gpsAt:now, lastMoveAt:lastMove, moving, speed:(p.coords.speed||0)*3.6, heading: p.coords.heading==null||isNaN(p.coords.heading)?-1:p.coords.heading, gpsSrc:'web'}).catch(()=>{}); }
    }, () => {}, {enableHighAccuracy:true, maximumAge:15000});
  }
}
window.onAndroidPerms = () => { if (role==='driver' && myTruck) startTracking(); renderDriver(); };
window.onAndroidResume = () => { checkUpdate(false); if (role==='driver' && myTruck){ startTracking(); checkCmd(); renderDriver(); } };
function haversine(a, b){ const R=6371000, r=x=>x*Math.PI/180; const dLat=r(b.lat-a.lat), dLng=r(b.lng-a.lng);
  const h=Math.sin(dLat/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(h)); }
function lastLoc(){
  try { const s = call('getLastLocation'); if (s) { const j = JSON.parse(s); if (j && j.lat != null) return j; } } catch(e){}
  return ls.get('lastLoc', null);
}

function go(screen){
  if (role!=='driver') return;
  dScreen = screen;
  if (['home','jobs','hist','prof'].includes(screen)) dTab = screen;
  if (screen==='standby') prepStandby();
  if (screen==='fuel') prepFuel();
  renderDriver(); window.scrollTo({top:0});
}
function goTab(tab){ dTab = tab; go(tab); }

const TITLES = {home:'ศรีมงคล 99', standby:'แจ้งสแตนบาย', hitch:'หัว-หางเข้าช่อง', delay:'แจ้งเหตุล่าช้า', fuel:'เติมน้ำมัน', jobs:'งานของฉัน', hist:'ประวัติงาน', prof:'โปรไฟล์'};
function renderDriver(){
  if (role!=='driver' || $('scrDriver').hidden) return;
  const t = S.trucks[myTruck];
  const SCR = {home:'dHome', standby:'dStandby', hitch:'dHitch', delay:'dDelay', fuel:'dFuel', jobs:'dJobs', hist:'dHist', prof:'dProf'};
  Object.entries(SCR).forEach(([k, el]) => $(el).hidden = dScreen !== k);
  document.querySelectorAll('.tabbar [data-tab]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tab===dTab)));
  // app bar: home shows menu + brand, sub screens show back + title
  const sub = !['home','jobs','hist','prof'].includes(dScreen);
  $('dMenuBtn').innerHTML = ico(sub ? 'back' : 'menu');
  $('dMenuBtn').setAttribute('aria-label', sub ? 'กลับ' : 'เมนู');
  const brand = document.querySelector('#dBar .ab-brand i');
  brand.hidden = dScreen!=='home';
  $('dBarTitle').textContent = TITLES[dScreen] || 'ศรีมงคล 99';
  if (!t){ $('dName').textContent = 'กำลังโหลด…'; return; }

  // profile
  $('dName').textContent = t.driver || '–'; $('dCode').textContent = t.code || '–'; $('dPlate').textContent = t.plate || '–';
  const tracking = A ? !!call('isTracking') : webWatch !== null;
  const online = navigator.onLine && (tracking || !A);
  $('dOnline').className = 'chip ' + (online ? 'c-green' : ''); $('dOnline').textContent = online ? 'ออนไลน์' : 'ออฟไลน์';

  // GPS card
  const hasPerm = A ? !!call('hasLocation') : true;
  const gpsCard = document.querySelector('#dHome .gps');
  gpsCard.classList.toggle('off', !hasPerm || !tracking);
  $('gpsTitle').textContent = t.gpsMock ? '⚠ ตรวจพบแอป GPS ปลอม' : t.gpsOff ? '⚠ GPS ของมือถือปิดอยู่' : !hasPerm ? 'ยังไม่ได้อนุญาต GPS' : tracking ? 'GPS กำลังติดตาม' : 'GPS ยังไม่ทำงาน';
  if (t.gpsMock || t.gpsOff) gpsCard.classList.add('off', 'bad');
  else gpsCard.classList.remove('bad');
  $('gpsAllow').hidden = hasPerm && tracking;
  $('gpsAllow').textContent = hasPerm ? 'เริ่มติดตาม' : 'อนุญาต GPS';
  { const l = lastLoc(), fresh = l && Date.now()-(l.at||0) < 60000;
    const kmh = fresh ? Math.round(l.kmh||0) : (t.moving ? Math.round(t.speed||0) : 0);
    if (t.gpsMock){ $('gpsSub').textContent = 'ปิดแอปจำลองตำแหน่ง (Fake GPS) ระบบใช้เฉพาะ GPS จริง และแจ้งแอดมินแล้ว'; }
    else if (t.gpsOff){ $('gpsSub').textContent = 'เปิด “ตำแหน่ง” ของมือถือ ระบบแจ้งแอดมินแล้ว'; }
    else $('gpsSub').textContent = (fresh || t.gpsAt) ? `อัปเดตล่าสุด: ${fmtT(fresh ? l.at : t.gpsAt)} · ${kmh} กม./ชม.` : 'รอสัญญาณ GPS…'; }
  updateDriverMap(t);

  // job strip
  const hasJob = hasAssignedJob(t);
  $('jobStrip').hidden = !hasJob; $('noJob').hidden = hasJob;
  if (hasJob){ const st = ST[t.status]||ST.idle; $('jobOrigin').textContent = t.originName || '–'; $('jobDest').textContent = t.destName || '–'; $('jobEta').textContent = t.etaAt ? fmtDT(t.etaAt) : '–'; $('jobSt').className = 'chip ' + st.c; $('jobSt').textContent = st.t; }

  // fuel CTA
  const fu = fuelOf(t), n = fu.length + 1;
  $('fuelCta').textContent = `เติมน้ำมัน ครั้งที่ ${n}`;
  $('fuelCtaSub').textContent = fu.length ? fuelSumTxt(fu) : 'บันทึกการเติมน้ำมันของงานนี้';

  if (dScreen==='standby') renderStandbyAuto();
  if (dScreen==='hitch') renderHitch(t);
  if (dScreen==='fuel') renderFuel(t);
  if (dScreen==='jobs') renderJobs(t);
  if (dScreen==='hist') $('dHistList').innerHTML = feedHTML(S.myEvents, false) || `<li class="empty" style="display:block">ยังไม่มีประวัติ</li>`;
  if (dScreen==='prof'){
    $('pfName').textContent = t.driver || '–';
    $('pfInfo').textContent = `รหัส ${t.code||'–'} · ทะเบียน ${t.plate||'–'}`;
    $('pfGps').textContent = tracking ? 'ทำงานอยู่' : 'ปิดอยู่';
    $('pfGps').style.color = tracking ? 'var(--green)' : 'var(--amber)';
    $('pfScreen').checked = !!ls.get('screenOn', false);
  }
}
$('dMenuBtn').onclick = () => {
  if (!['home','jobs','hist','prof'].includes(dScreen)) { go(dTab || 'home'); return; }
  $('dDrawer').hidden = false; $('dDrawerBg').hidden = false;
};
function closeDrawer(){ $('dDrawer').hidden = true; $('dDrawerBg').hidden = true; }
$('dDrawerBg').onclick = closeDrawer;
$('gpsAllow').onclick = () => { if (A && !call('hasLocation')) call('askLocation'); else startTracking(); setTimeout(renderDriver, 800); };

/* ================= 3D real-time map (MapLibre) ================= */
const STYLE_3D = 'https://tiles.openfreemap.org/styles/liberty';
const RASTER_STYLE = {version:8, sources:{osm:{type:'raster', tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize:256, maxzoom:19, attribution:'© OpenStreetMap'}}, layers:[{id:'osm', type:'raster', source:'osm'}]};
const ll = o => [+o.lng, +o.lat];
function makeMap(el, center, zoom, pitch){
  if (!window.maplibregl){ $(el).innerHTML = '<div class="map-fallback">โหลดแผนที่ไม่ได้ (ตรวจอินเทอร์เน็ต)</div>'; return null; }
  let map;
  try {
    map = new maplibregl.Map({container: el, style: STYLE_3D, center, zoom, pitch, maxPitch: 75, attributionControl: {compact: true}, dragRotate: true});
  } catch(e){ $(el).innerHTML = '<div class="map-fallback">มือถือเครื่องนี้แสดงแผนที่ 3D ไม่ได้</div>'; return null; }
  let ok = false;
  map.on('load', () => { ok = true; });
  // if the 3D street style cannot load, fall back to the plain OpenStreetMap picture
  setTimeout(() => { if (!ok && !map._fell){ map._fell = true; map.setStyle(RASTER_STYLE); } }, 9000);
  map.on('error', () => { if (!ok && !map._fell){ map._fell = true; map.setStyle(RASTER_STYLE); } });
  return map;
}
/* a truck marker: coloured disc with an arrow that points where the truck is heading */
function truckEl(){
  const el = document.createElement('div'); el.className = 'tm';
  el.innerHTML = '<span class="pulse" hidden></span><div class="tm-lbl" hidden></div><div class="tm-dot"><div class="tm-in"></div></div><div class="tm-plate" hidden></div>';
  return el;
}
function paintTruck(el, {color, heading, label, alert, plate, bearing, selected}){
  el.querySelector('.tm-dot').style.background = color;
  el.classList.toggle('sel', !!selected);
  const inner = el.querySelector('.tm-in');
  const hasDir = heading != null && heading >= 0;
  const want = hasDir ? 'arrow' : 'truck';
  if (inner.dataset.k !== want){ inner.dataset.k = want; inner.innerHTML = hasDir ? '<svg viewBox="0 0 24 24"><path d="M12 2 20 21 12 16.5 4 21z" fill="#fff"/></svg>' : IC.truck; }
  inner.style.transform = hasDir ? `rotate(${heading - (bearing||0)}deg)` : '';
  const lb = el.querySelector('.tm-lbl'); lb.hidden = !label; if (label) lb.innerHTML = ico('warn') + esc(label);
  el.querySelector('.pulse').hidden = !alert;
  const pl = el.querySelector('.tm-plate'); pl.hidden = !plate; if (plate) pl.textContent = plate;
}
/* glide a marker to its new position so movement looks live */
function glide(marker, to, ms){
  const from = marker.getLngLat(); if (!from){ marker.setLngLat(to); return; }
  const dx = to[0]-from.lng, dy = to[1]-from.lat;
  if (Math.abs(dx) + Math.abs(dy) > 0.05 || ms <= 0){ marker.setLngLat(to); return; }   // far jump: no animation
  cancelAnimationFrame(marker._raf); const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / ms), e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
    marker.setLngLat([from.lng + dx*e, from.lat + dy*e]); if (k < 1) marker._raf = requestAnimationFrame(step); };
  marker._raf = requestAnimationFrame(step);
}
const liveSec = () => Math.max(2, Math.min(60, +((S.config && S.config.liveSec) || 5)));
function setLine(map, id, coords){
  if (!map || !map.isStyleLoaded()) return;
  const data = {type:'Feature', geometry:{type:'LineString', coordinates: coords || []}};
  const src = map.getSource(id);
  if (src) src.setData(data);
  else { map.addSource(id, {type:'geojson', data}); map.addLayer({id, type:'line', source:id, paint:{'line-color':'#1f5fd6', 'line-width':5, 'line-dasharray':[1.5,1.2]}}); }
}

/* driver map: follows the driver's own truck, turned to the driving direction */
let dMap = null, dMk = null, dDestMk = null, dFollow = true;
function updateDriverMap(t){
  const l = lastLoc();
  const fresh = l && Date.now() - (l.at||0) < 60000;
  const pos = fresh ? l : (t.lat != null ? t : l);
  if (!dMap){
    dMap = makeMap('dMap', pos ? ll(pos) : [DEFAULT_CENTER[1], DEFAULT_CENTER[0]], pos ? 15.5 : 10, 55);
    if (!dMap) return;
    dMap.on('dragstart', () => { dFollow = false; $('dRecenter') && ($('dRecenter').hidden = false); });
    dMap.on('rotate', () => { if (dMk) updateDriverMarker(); });
    dMap.on('styledata', () => updateDriverMap._line && setLine(dMap, 'route', updateDriverMap._line));
    const btn = document.createElement('button'); btn.id = 'dRecenter'; btn.className = 'map-btn'; btn.hidden = true; btn.innerHTML = ico('gps') + 'ตามรถ';
    btn.onclick = () => { dFollow = true; btn.hidden = true; updateDriverMap(S.trucks[myTruck] || {}); };
    $('dMap').appendChild(btn);
  }
  if (!pos) return;
  const heading = fresh && l.heading != null ? l.heading : (t.heading != null ? t.heading : -1);
  const moving = fresh ? (l.kmh||0) >= 6 : !!t.moving;
  updateDriverMap._st = {heading: moving ? heading : (heading>=0?heading:-1)};
  if (!dMk){ dMk = new maplibregl.Marker({element: truckEl(), anchor:'center'}).setLngLat(ll(pos)).addTo(dMap); }
  else glide(dMk, ll(pos), 1500);
  updateDriverMarker();
  const d = t.destId && S.places[t.destId];
  updateDriverMap._line = (d && d.lat != null) ? [ll(pos), ll(d)] : [];
  setLine(dMap, 'route', updateDriverMap._line);
  if (d && d.lat != null){
    if (!dDestMk){ const e = document.createElement('div'); e.className = 'mk-dest'; dDestMk = new maplibregl.Marker({element:e}).setLngLat(ll(d)).addTo(dMap); }
    else dDestMk.setLngLat(ll(d));
  } else if (dDestMk){ dDestMk.remove(); dDestMk = null; }
  if (dFollow){
    const opt = {center: ll(pos), duration: 1200};
    if (moving && heading >= 0){ opt.bearing = heading; opt.pitch = 60; opt.zoom = Math.max(dMap.getZoom(), 16); }
    dMap.easeTo(opt);
  }
}
function updateDriverMarker(){
  if (!dMk) return;
  paintTruck(dMk.getElement(), {color:'#1f5fd6', heading: (updateDriverMap._st||{}).heading, bearing: dMap.getBearing()});
}

/* standby */
function placeList(){ return Object.entries(S.places).sort((a,b)=>(a[1].name||'').localeCompare(b[1].name||'','th')); }
const hasAssignedJob = t => !!(t && t.destName && t.status && t.status !== 'idle' && t.status !== 'done');
function prepStandby(){
  const t = S.trucks[myTruck] || {};
  const ok = hasAssignedJob(t);
  $('sbNoJob').hidden = ok; $('sbSave').disabled = !ok;
  $('sbOrigin').textContent = ok ? (t.originName || '–') : '–';
  $('sbDestName').textContent = ok ? (t.destName || '–') : '–';
  if (t.etaAt){ const d = new Date(t.etaAt); $('sbTime').value = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    const k = Math.round((new Date(d.toDateString()) - new Date(new Date().toDateString()))/864e5); $('sbDay').value = String(Math.min(2, Math.max(0, k))); }
  renderStandbyAuto();
}
function renderStandbyAuto(){
  $('sbTimeNow').textContent = fmtT(Date.now());
  const l = lastLoc(), t = S.trucks[myTruck];
  const p = l || (t && t.lat != null ? t : null);
  $('sbGps').textContent = p ? `${(+p.lat).toFixed(4)}, ${(+p.lng).toFixed(4)}` : 'รอสัญญาณ GPS…';
}
$('sbSave').onclick = async () => {
  const t0 = S.trucks[myTruck] || {};
  if (!hasAssignedJob(t0)){ toast('ยังไม่มีงาน รอแอดมินมอบหมายก่อน'); return; }
  const destName = t0.destName, originName = t0.originName || '';
  const tm = $('sbTime').value; if (!tm){ toast('กรุณาใส่เวลาถึงปลายทาง'); return; }
  const [hh, mm] = tm.split(':').map(Number); const d = new Date(); d.setDate(d.getDate() + (+$('sbDay').value)); d.setHours(hh, mm, 0, 0);
  const t = S.trucks[myTruck] || {}, now = Date.now(), l = lastLoc();
  const patch = {status:'standby', etaAt: d.getTime(), delay:null, updatedAt: now, standbyAt: now};
  if (l){ patch.standbyLat = l.lat; patch.standbyLng = l.lng; }
  await writeTruck(patch);
  addEvent('standby', `${originName ? originName + ' → ' : ''}${destName} · นัดถึง ${fmtDT(d.getTime())}`, '', l);
  dFollow = true;
  toast('บันทึกสแตนบายแล้ว'); go('home');
};

/* hitch */
document.querySelectorAll('.opt[data-h]').forEach(b => b.onclick = () => { hitchType = b.dataset.h; document.querySelectorAll('.opt[data-h]').forEach(x => x.setAttribute('aria-pressed', String(x===b))); });
function stHTML(ms){ return ms ? `<div class="st-ok">${ico('okc')}เข้าช่องแล้ว</div><div class="small muted">เวลา: ${fmtT(ms)}</div>` : `<div class="st-no">ยังไม่เข้าช่อง</div><div class="small muted">&nbsp;</div>`; }
function renderHitch(t){ $('hHead').innerHTML = stHTML(t.headIn); $('hTail').innerHTML = stHTML(t.tailIn); }
bindPhoto('hPhoto', 'hPrev', hPhoto);
$('hSave').onclick = async () => {
  if (!hasAssignedJob(S.trucks[myTruck])){ toast('ยังไม่มีงาน รอแอดมินมอบหมายก่อน'); return; }
  const now = Date.now(), patch = {status:'loading', updatedAt: now};
  if (hitchType !== 'tail') patch.headIn = now;
  if (hitchType !== 'head') patch.tailIn = now;
  const note = $('hNote').value.trim();
  const label = {both:'หัว-หางเข้าช่องพร้อมกัน', head:'หัวเข้าช่อง', tail:'หางเข้าช่อง'}[hitchType];
  $('hSave').disabled = true;
  try {
    const pid = await savePhoto(hPhoto.data, myTruck);
    await writeTruck(patch);
    addEvent('hitch', label + (note ? ` · หมายเหตุ: ${note}` : ''), pid);
    $('hNote').value = ''; $('hPrev').hidden = true; hPhoto.data = null;
    toast('บันทึกเข้าช่องแล้ว'); go('home');
  } catch(e){ toast('บันทึกไม่สำเร็จ ลองใหม่'); }
  $('hSave').disabled = false;
};

/* delay */
document.querySelectorAll('#dlQuick button').forEach(b => b.onclick = () => { $('dlReason').value = b.textContent; });
bindPhoto('dlPhoto', 'dlPrev', dlPhoto);
$('dlSend').onclick = async () => {
  const reason = $('dlReason').value.trim(); if (!reason){ toast('กรุณาระบุสาเหตุ'); return; }
  $('dlSend').disabled = true;
  try {
    const pid = await savePhoto(dlPhoto.data, myTruck);
    await writeTruck({delay:{reason, at:Date.now()}, updatedAt:Date.now()});
    addEvent('delay', reason, pid, lastLoc());
    $('dlReason').value = ''; $('dlPrev').hidden = true; dlPhoto.data = null;
    toast('ส่งแจ้งเหตุล่าช้าแล้ว'); go('home');
  } catch(e){ toast('ส่งไม่สำเร็จ ลองใหม่'); }
  $('dlSend').disabled = false;
};

/* depart / arrive / done */
$('aDepart').onclick = async () => {
  const t = S.trucks[myTruck] || {};
  if (!hasAssignedJob(t)){ toast('ยังไม่มีงาน รอแอดมินมอบหมายก่อน'); return; }
  if (t.status === 'enroute'){ toast('กำลังเดินทางอยู่แล้ว'); return; }
  const now = Date.now();
  await writeTruck({status:'enroute', departAt: now, lastMoveAt: now, updatedAt: now});
  addEvent('depart', `ปลายทาง ${t.destName}`, '', lastLoc());
  startTracking(); toast('เริ่มเดินทาง ขับปลอดภัยครับ');
};
$('aArrive').onclick = async () => {
  const t = S.trucks[myTruck] || {};
  if (t.status !== 'enroute'){ toast('ยังไม่ได้กด “ออกเดินทาง”'); return; }
  await writeTruck({status:'arrived', arriveAt: Date.now(), delay:null, updatedAt: Date.now()});
  addEvent('arrive', t.destName || '', '', lastLoc()); toast('บันทึกถึงปลายทางแล้ว');
};
$('aDone').onclick = async () => {
  const t = S.trucks[myTruck] || {};
  if (!hasAssignedJob(t)){ toast('ยังไม่มีงานที่ต้องจบ'); return; }
  if ($('aDone').dataset.sure !== '1'){ $('aDone').dataset.sure = '1'; toast('แตะ “จบงาน” อีกครั้งเพื่อยืนยัน'); setTimeout(() => $('aDone').dataset.sure = '', 3500); return; }
  $('aDone').dataset.sure = '';
  const route = `${t.originName ? t.originName + ' → ' : ''}${t.destName || ''}`;
  await writeTruck({status:'done', doneAt: Date.now(), delay:null, updatedAt: Date.now(),
    lastJob: route, originId:'', originName:'', destId:'', destName:'', etaAt:null, headIn:null, tailIn:null});
  addEvent('done', route); dFollow = true; toast('จบงานแล้ว ขอบคุณครับ รอแอดมินมอบหมายงานถัดไป');
};

/* fuel */
const fuelOf = t => Array.isArray(t && t.fuel) ? t.fuel : [];
function fuelSumTxt(fu){ if(!fu.length) return ''; const L=fu.reduce((a,f)=>a+(+f.liters||0),0), B=fu.reduce((a,f)=>a+(+f.baht||0),0); return `รวม ${fu.length} ครั้ง · ${num(L)} ลิตร${B?` · ${num(B)} บาท`:''}`; }
function fuelRows(fu, del){
  return fu.map((f,i) => { const prev = fu[i-1];
    const km = (f.odo && prev && prev.odo && f.odo > prev.odo) ? ` (+${num(f.odo-prev.odo)} กม.)` : '';
    const bits = [fmtDT(f.at), f.station||'', f.odo ? `ไมล์ ${num(f.odo)}${km}` : ''].filter(Boolean).map(esc).join(' · ');
    const map = f.lat != null ? `<a href="https://www.google.com/maps?q=${(+f.lat).toFixed(6)},${(+f.lng).toFixed(6)}" target="_blank" rel="noopener">📍 ดูตำแหน่งปั๊ม</a>` : '<span class="small muted">ไม่มีตำแหน่ง</span>';
    const ph = f.photoId ? ` · <button class="ph" data-photo="${esc(f.photoId)}" style="background:none;border:0;color:var(--blue);font-weight:700;font-size:13px;padding:0">ดูรูป</button>` : '';
    const delB = del && i === fu.length-1 ? `<button class="btn btn-ghost btn-sm" data-fdel="1">ลบ</button>` : '';
    return `<div class="fuel-row"><span class="fuel-n">ครั้งที่ ${i+1}</span><div class="grow"><b>${num(f.liters)} ลิตร</b>${f.baht?` · ${num(f.baht)} บาท`:''}<div class="small muted">${bits}</div>${map}${ph}</div>${delB}</div>`; }).join('');
}
function showFuLoc(){
  const chip = $('fuLocChip');
  if (!fuLoc){ chip.className='chip c-amber'; chip.textContent='ยังไม่ได้ตำแหน่ง'; $('fuLocTxt').textContent=''; return; }
  chip.className='chip c-green'; chip.textContent='ได้ตำแหน่งแล้ว';
  $('fuLocTxt').textContent = `${fuLoc.lat.toFixed(6)}, ${fuLoc.lng.toFixed(6)}${fuLoc.acc?` (±${Math.round(fuLoc.acc)} ม.)`:''}`;
}
function readGps(){
  $('fuLocChip').className='chip'; $('fuLocChip').textContent='กำลังหาตำแหน่ง…';
  if (A){   // the app's own GPS (fake-GPS apps are rejected there); the driver cannot type or pick a location
    const l = lastLoc();
    if (l && Date.now() - (l.at||0) < 3*60000){ fuLoc = {lat:+l.lat, lng:+l.lng, acc:l.acc}; showFuLoc(); }
    else { fuLoc = null; showFuLoc(); toast('ยังไม่มีสัญญาณ GPS ล่าสุด รอสักครู่แล้วกดอ่านใหม่'); }
    return;
  }
  const fallback = () => { const l = lastLoc(); if (l && Date.now() - (l.at||0) < 10*60000){ fuLoc = {lat:+l.lat, lng:+l.lng, acc:l.acc}; } showFuLoc(); if(!fuLoc) toast('อ่าน GPS ไม่ได้ ลองออกไปที่โล่งแล้วกดอ่านใหม่'); };
  if (!navigator.geolocation){ fallback(); return; }
  navigator.geolocation.getCurrentPosition(p => { fuLoc = {lat:p.coords.latitude, lng:p.coords.longitude, acc:p.coords.accuracy}; showFuLoc(); }, fallback, {enableHighAccuracy:true, timeout:12000, maximumAge:30000});
}
function prepFuel(){ fuLoc = null; readGps(); }
$('fuGps').onclick = readGps;
bindPhoto('fuPhoto', 'fuPrev', fuPhoto);
function renderFuel(t){
  const fu = fuelOf(t), n = fu.length + 1;
  $('fuTitle').textContent = `เติมน้ำมัน ครั้งที่ ${n}`; $('fuSaveTxt').textContent = `บันทึกเติมน้ำมันครั้งที่ ${n}`;
  $('fuSum').textContent = fu.length ? fuelSumTxt(fu) : 'ยังไม่ได้เติมในงานนี้';
  $('fuList').innerHTML = fu.length ? fuelRows(fu, true) : '<div class="small muted" style="padding:8px 0">ยังไม่มีรายการ</div>';
}
$('fuList').addEventListener('click', async e => {
  const b = e.target.closest('[data-fdel]'); if(!b) return;
  if (b.dataset.sure !== '1'){ b.dataset.sure = '1'; b.textContent = 'แตะอีกครั้งเพื่อลบ'; b.style.color = 'var(--red)'; setTimeout(()=>{ if(b.isConnected){ b.dataset.sure=''; b.textContent='ลบ'; b.style.color=''; } }, 3000); return; }
  const fu = fuelOf(S.trucks[myTruck]).slice(0, -1); await writeTruck({fuel: fu, updatedAt: Date.now()}); toast('ลบรายการล่าสุดแล้ว');
});
$('fuSave').onclick = async () => {
  const t = S.trucks[myTruck]; if(!t) return;
  const liters = parseFloat($('fuL').value); if (!(liters > 0)){ toast('กรุณากรอกจำนวนลิตร'); $('fuL').focus(); return; }
  const baht = parseFloat($('fuB').value)||0, odo = parseFloat($('fuO').value)||0, station = $('fuS').value.trim();
  const fu = fuelOf(t).slice(), n = fu.length + 1;
  if (odo && fu.length && fu[fu.length-1].odo && odo < fu[fu.length-1].odo){ toast('เลขไมล์น้อยกว่าครั้งก่อน ตรวจสอบอีกครั้ง'); return; }
  $('fuSave').disabled = true;
  try {
    const photoId = await savePhoto(fuPhoto.data, myTruck);
    const entry = {liters, baht, odo, station, at: Date.now(), photoId};
    if (fuLoc){ entry.lat = +fuLoc.lat.toFixed(6); entry.lng = +fuLoc.lng.toFixed(6); if (fuLoc.acc) entry.acc = Math.round(fuLoc.acc); }
    fu.push(entry);
    await writeTruck({fuel: fu, updatedAt: Date.now()});
    addEvent('fuel', `ครั้งที่ ${n} · ${num(liters)} ลิตร${baht?` · ${num(baht)} บาท`:''}${station?` · ${station}`:''}`, photoId, fuLoc);
    ['fuL','fuB','fuO','fuS'].forEach(i => $(i).value = ''); $('fuPrev').hidden = true; fuPhoto.data = null;
    toast(`บันทึกเติมน้ำมันครั้งที่ ${n} แล้ว`); go('home');
  } catch(e){ toast('บันทึกไม่สำเร็จ ลองใหม่'); }
  $('fuSave').disabled = false;
};

/* my job */
function renderJobs(t){
  const st = ST[t.status]||ST.idle;
  const has = hasAssignedJob(t);
  const late = has && t.etaAt && Date.now() > t.etaAt && !['arrived','done'].includes(t.status);
  $('jobCard').innerHTML = !has ? `<div class="empty">ยังไม่มีงาน รอแอดมินมอบหมายต้นทาง–ปลายทาง${t.lastJob?`<div class="small" style="margin-top:6px">งานล่าสุด: ${esc(t.lastJob)}</div>`:''}</div>` : `
    <div class="row between"><b class="sec">งานปัจจุบัน</b><span class="chip ${st.c}">${st.t}</span></div>
    <div class="autobox" style="margin:10px 0 0">
      <div class="kv">${ico('flag')}<span>ต้นทาง</span><b>: ${esc(t.originName||'–')}</b></div>
      <div class="kv">${ico('factory')}<span>ปลายทาง</span><b>: ${esc(t.destName||'–')}</b></div>
      <div class="kv">${ico('cal')}<span>นัดถึง</span><b>: ${fmtDT(t.etaAt)} ${late?'<span class="chip c-red">เลยเวลานัด</span>':''}</b></div>
      <div class="kv">${ico('flag')}<span>สแตนบาย</span><b>: ${fmtDT(t.standbyAt)}</b></div>
      <div class="kv">${ico('dock')}<span>หัว / หาง</span><b>: ${t.headIn?fmtT(t.headIn):'–'} / ${t.tailIn?fmtT(t.tailIn):'–'}</b></div>
      <div class="kv">${ico('play')}<span>ออกเดินทาง</span><b>: ${t.departAt && t.departAt>=(t.jobStart||0)?fmtDT(t.departAt):'–'}</b></div>
      <div class="kv">${ico('pin')}<span>ถึงปลายทาง</span><b>: ${t.arriveAt && t.arriveAt>=(t.jobStart||0)?fmtDT(t.arriveAt):'–'}</b></div>
      ${t.delay?`<div class="kv">${ico('warn')}<span>แจ้งล่าช้า</span><b>: ${esc(t.delay.reason)}</b></div>`:''}
    </div>`;
  const fu = fuelOf(t);
  $('jobFuel').innerHTML = fu.length ? `<div class="small muted">${esc(fuelSumTxt(fu))}</div>${fuelRows(fu,false)}` : '<div class="small muted" style="padding:8px 0">ยังไม่ได้เติมน้ำมันในงานนี้</div>';
}

/* profile */
$('pfScreen').onchange = e => { ls.set('screenOn', e.target.checked); call('keepScreenOn', e.target.checked); };
$('pfLogout').onclick = () => { if ($('pfLogout').dataset.sure !== '1'){ $('pfLogout').dataset.sure='1'; $('pfLogout').querySelector('.grow').textContent='แตะอีกครั้งเพื่อออกจากระบบ (GPS จะหยุดส่ง)'; setTimeout(()=>{ $('pfLogout').dataset.sure=''; $('pfLogout').querySelector('.grow').textContent='ออกจากระบบ'; }, 3500); return; }
  addEvent('logout', ''); db.doc('trucks/'+myTruck).update({loggedOutAt: Date.now()}).catch(()=>{});
  driverLogout('ออกจากระบบแล้ว'); };

/* writes */
function writeTruck(patch){
  if (!myTruck) return Promise.resolve();
  Object.assign(S.trucks[myTruck] || {}, patch); renderDriver();
  return db.doc('trucks/'+myTruck).update(patch).catch(e => { toast('บันทึกไม่สำเร็จ ตรวจอินเทอร์เน็ต'); throw e; });
}
function addEvent(type, text, photoId, loc, truckId){
  const id = truckId || myTruck; const t = S.trucks[id] || {};
  const ev = {truck:id, plate:t.plate||'', driver:t.driver||'', type, text:text||'', at:Date.now()};
  if (photoId) ev.photoId = photoId;
  if (loc && loc.lat != null){ ev.lat = +(+loc.lat).toFixed(5); ev.lng = +(+loc.lng).toFixed(5); }
  return db.collection('events').add(ev).catch(()=>{});
}

/* ================= commands on the driver phone ================= */
let audioEl = null;
function seenNonce(){ return (A ? call('lastNonce') : '') || ls.get('lastNonce',''); }
function markSeen(n){ call('markSeen', n); ls.set('lastNonce', n); }
function checkCmd(){
  const c = S.cmd; if (!c || role!=='driver' || document.hidden) return;
  if (c.nonce && c.nonce === seenNonce()){
    if (c.type === 'ring' && call('isRinging') && $('cmdOv').hidden){ showCmd(c, true); }
    return;
  }
  if (Date.now() - (c.at||0) > 10*60000) { markSeen(c.nonce); return; }
  markSeen(c.nonce);
  showCmd(c);
}
let ovTimer = null, beepTimer = null, actx = null;
function showCmd(c, alreadyRinging){
  const ring = c.type === 'ring';
  $('cmdBell').hidden = !ring; $('cmdMic').hidden = ring;
  $('cmdMsg').hidden = ring || !c.text; $('cmdMsg').textContent = c.text || '';
  $('cmdPill').textContent = 'ไม่ต้องกดรับ';
  $('cmdOk').textContent = ring ? 'รับทราบ' : 'ปิด';
  $('cmdOv').hidden = false; $('cmdOv').dataset.type = c.type;
  try { navigator.vibrate && navigator.vibrate(ring ? [500,250,500,250,500] : [200]); } catch(e){}
  clearTimeout(ovTimer);
  if (ring){
    if (A && A.ring){ if (!alreadyRinging) call('ring'); } else beepLoop();
  } else {
    if (c.audio && A && A.playClip){ call('playClip', c.audio); ovTimer = setTimeout(closeCmd, 30000); }
    else if (c.audio){ try { audioEl && audioEl.pause(); audioEl = new Audio(c.audio); audioEl.volume = 1; audioEl.play().catch(()=>{}); audioEl.onended = () => { ovTimer = setTimeout(closeCmd, 2500); }; } catch(e){} }
    else if (c.text){ if (A && A.speak) call('speak', c.text); else speakWeb(c.text); ovTimer = setTimeout(closeCmd, Math.max(8000, c.text.length*280)); }
    ovTimer = ovTimer || setTimeout(closeCmd, 30000);
  }
}
function closeCmd(){ $('cmdOv').hidden = true; clearTimeout(ovTimer); ovTimer=null; clearInterval(beepTimer); call('stopRing'); try{ audioEl && audioEl.pause(); }catch(e){} }
$('cmdOk').onclick = () => { const ring = $('cmdOv').dataset.type === 'ring'; closeCmd(); if (ring && myTruck) addEvent('ack', ''); };
function beepLoop(){
  try { actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume(); } catch(e){ return; }
  const beep = () => { for (let i=0;i<4;i++){ tone(988, i*.32, .14); tone(784, i*.32+.16, .14); } };
  beep(); let n = 0; clearInterval(beepTimer); beepTimer = setInterval(() => { if (++n > 10 || $('cmdOv').hidden){ clearInterval(beepTimer); return; } beep(); }, 2500);
}
function tone(f, start, dur){ const o=actx.createOscillator(), g=actx.createGain(); o.type='square'; o.frequency.value=f; o.connect(g); g.connect(actx.destination);
  const t=actx.currentTime+start; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.25,t+.01); g.gain.linearRampToValueAtTime(0,t+dur); o.start(t); o.stop(t+dur+.02); }
function speakWeb(text){ try { const u = new SpeechSynthesisUtterance(text); u.lang='th-TH'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch(e){} }

/* ================= admin: PIN ================= */
function openPin(){
  show('scrPin'); $('pinIn').value=''; $('pinIn2').value='';
  const setNew = () => { const first = S.config && !S.config.pin;
    $('pinTitle').textContent = first ? 'ตั้งรหัสแอดมินครั้งแรก' : 'ใส่รหัสแอดมิน';
    $('pinHelp').textContent = first ? 'ตั้งรหัส 4–6 หลัก ไว้ใช้เข้าศูนย์ควบคุมครั้งต่อไป' : 'รหัส 4–6 หลัก';
    $('pinIn2').hidden = !first; $('pinGo').textContent = first ? 'ตั้งรหัสและเข้าสู่ระบบ' : 'เข้าสู่ระบบ'; };
  if (S.config === null){ $('pinTitle').textContent = 'กำลังเชื่อมต่อ…'; $('pinHelp').textContent = authErr || 'รอสักครู่';
    const w = setInterval(() => { if (S.config !== null){ clearInterval(w); setNew(); } else if (authErr) $('pinHelp').textContent = authErr; }, 500); }
  else setNew();
  setTimeout(() => $('pinIn').focus(), 100);
}
$('pinGo').onclick = async () => {
  if (S.config === null){ toast('กำลังเชื่อมต่อ รอสักครู่'); return; }
  const p = $('pinIn').value.trim();
  if (!/^\d{4,6}$/.test(p)){ toast('รหัสต้องเป็นตัวเลข 4–6 หลัก'); return; }
  if (!S.config.pin){
    if (p !== $('pinIn2').value.trim()){ toast('รหัสสองช่องไม่ตรงกัน'); return; }
    try { await db.doc('config/main').set({pin:p, thr:30}, {merge:true}); } catch(e){ toast('บันทึกไม่สำเร็จ ตรวจอินเทอร์เน็ต'); return; }
  } else if (p !== String(S.config.pin)){ toast('รหัสไม่ถูกต้อง'); $('pinIn').value=''; return; }
  role = 'admin'; ls.set('role','admin'); ls.set('adminOk', true);
  show('scrAdmin'); renderAdmin(); setTimeout(initAdminMap, 50);
};
$('pinIn').addEventListener('keydown', e => { if (e.key==='Enter'){ if ($('pinIn2').hidden) $('pinGo').click(); else $('pinIn2').focus(); } });
$('pinIn2').addEventListener('keydown', e => { if (e.key==='Enter') $('pinGo').click(); });

/* ================= admin ================= */
const online = t => t.gpsAt && Date.now() - t.gpsAt < 7*60000;
const isParked = t => t.status==='enroute' && !t.moving && mins(t.lastMoveAt||t.departAt) >= thr;
const isLost = t => ['enroute','loading','standby'].includes(t.status) && t.gpsAt && mins(t.gpsAt) >= 20;
const isLate = t => t.etaAt && Date.now() > t.etaAt && ['standby','loading','enroute'].includes(t.status);
const hasDelay = t => t.delay && t.status !== 'done';
const isFake = t => !!t.gpsMock;
const isOff = t => !!t.gpsOff;
const isAlert = t => isFake(t) || isOff(t) || isParked(t) || hasDelay(t) || isLost(t);
function alertText(t){
  if (isFake(t)) return 'ตรวจพบ GPS ปลอม';
  if (isOff(t)) return 'คนขับปิด GPS';
  if (isParked(t)) return `รถจอดนิ่งเกิน ${thr} นาที`;
  if (hasDelay(t)) return 'แจ้งเหตุล่าช้า';
  if (isLost(t)) return 'สัญญาณ GPS หาย';
  return '';
}
function closeSide(){ $('aSide').classList.remove('open'); $('aSideBg').hidden = true; }
$('aMenuBtn').onclick = () => { $('aSide').classList.add('open'); $('aSideBg').hidden = false; };
$('aSideBg').onclick = closeSide;

let aMap = null, aFollow = false; const aMarkers = {};
function initAdminMap(){
  if (aMap || $('scrAdmin').hidden) return;
  const pts = Object.values(S.trucks).filter(t => t.lat != null);
  aMap = makeMap('aMap', pts.length ? ll(pts[0]) : [DEFAULT_CENTER[1], DEFAULT_CENTER[0]], pts.length ? 11 : 9, 50);
  if (!aMap) return;
  aMap.addControl(new maplibregl.NavigationControl({visualizePitch: true}), 'top-right');
  aMap.on('rotate', () => updateAdminMap(null, true));
  aMap.on('dragstart', () => { if (aFollow){ aFollow = false; paintFollowBtn(); } });
  const bar = document.createElement('div'); bar.className = 'map-tools';
  bar.innerHTML = `<button class="map-btn" id="mFollow">${ico('gps')}ตามรถที่เลือก</button><button class="map-btn" id="m3d">2D</button><button class="map-btn" id="mAll">${ico('truck')}ดูทุกคัน</button>`;
  $('aMap').appendChild(bar);
  $('mFollow').onclick = () => { aFollow = !aFollow; paintFollowBtn(); if (aFollow) followSel(true); };
  $('m3d').onclick = () => { const flat = aMap.getPitch() > 5; aMap.easeTo({pitch: flat ? 0 : 55, bearing: flat ? 0 : aMap.getBearing()}); $('m3d').textContent = flat ? '3D' : '2D'; };
  $('mAll').onclick = () => { aFollow = false; paintFollowBtn(); fitAll(); };
  aMap.on('load', () => { fitAll(); renderAdmin(); });
  renderAdmin();
}
function paintFollowBtn(){ const b = $('mFollow'); if (b) b.classList.toggle('on', aFollow); }
function fitAll(){
  const pts = Object.values(S.trucks).filter(t => t.lat != null).map(ll);
  if (!aMap || !pts.length) return;
  if (pts.length === 1){ aMap.easeTo({center: pts[0], zoom: 15, pitch: 55}); return; }
  const b = new maplibregl.LngLatBounds(pts[0], pts[0]); pts.forEach(p => b.extend(p));
  aMap.fitBounds(b, {padding: 60, maxZoom: 14, pitch: 50});
}
function followSel(first){
  const t = selTruck && S.trucks[selTruck]; if (!aMap || !t || t.lat == null) return;
  const opt = {center: ll(t), duration: first ? 1500 : 1200};
  if (first){ opt.zoom = Math.max(aMap.getZoom(), 16); opt.pitch = 60; }
  if (t.moving && t.heading >= 0) opt.bearing = t.heading;
  aMap.easeTo(opt);
}
function updateAdminMap(sorted, onlyRotate){
  if (!aMap) return;
  const bearing = aMap.getBearing();
  sorted = sorted || Object.keys(aMarkers);
  const live = new Set();
  sorted.forEach(id => { const t = S.trucks[id]; if (!t || t.lat == null) return; live.add(id);
    const al = isAlert(t), color = al ? '#e0352b' : (online(t) ? (ST[t.status]||ST.idle).pin : '#8b97ad');
    let m = aMarkers[id];
    if (!m){
      m = aMarkers[id] = new maplibregl.Marker({element: truckEl(), anchor:'center'}).setLngLat(ll(t)).addTo(aMap);
      m.getElement().addEventListener('click', ev => { ev.stopPropagation(); selTruck = id; renderAdmin(); if (aFollow) followSel(true); });
    } else if (!onlyRotate && (m._lat !== t.lat || m._lng !== t.lng)) glide(m, ll(t), Math.min(liveSec()*1000, 3000));
    m._lat = t.lat; m._lng = t.lng;
    paintTruck(m.getElement(), {color, heading: t.moving ? t.heading : (t.heading >= 0 ? t.heading : -1), bearing,
      label: al ? alertText(t) : '', alert: al, plate: (t.plate||'').split(' ')[0], selected: id === selTruck});
    m.getElement().style.zIndex = al ? 3 : (id === selTruck ? 2 : 1);
  });
  if (onlyRotate) return;
  Object.keys(aMarkers).forEach(id => { if (!live.has(id)){ aMarkers[id].remove(); delete aMarkers[id]; } });
  if (aFollow) followSel(false);
}

function renderAdmin(){
  if (role!=='admin' || $('scrAdmin').hidden) return;
  const ids = Object.keys(S.trucks);
  const sorted = ids.slice().sort((a,b) => (isAlert(S.trucks[b]) - isAlert(S.trucks[a])) || (S.trucks[a].plate||'').localeCompare(S.trucks[b].plate||'','th'));
  if (!selTruck || !S.trucks[selTruck]) selTruck = sorted[0] || null;
  const alerts = sorted.filter(id => isAlert(S.trucks[id]));
  $('alBadge').hidden = !alerts.length; $('alBadge').textContent = alerts.length;
  $('aSys').className = 'chip ' + (S.connected && navigator.onLine ? 'c-green' : 'c-amber');
  $('aSys').textContent = S.connected && navigator.onLine ? 'ระบบออนไลน์' : 'กำลังเชื่อมต่อ…';
  document.querySelectorAll('.side [data-at]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.at===aTab)));
  $('atOv').hidden = aTab!=='ov'; $('atAl').hidden = aTab!=='al'; $('atJobs').hidden = aTab!=='jobs';
  $('atEv').hidden = aTab!=='ev'; $('atUsers').hidden = aTab!=='users'; $('atSet').hidden = aTab!=='set';
  alertSound(alerts);

  if (aTab==='ov'){
    updateAdminMap(sorted);
    renderSel();
    $('aList').innerHTML = ids.length ? sorted.map(id => { const t=S.trucks[id], st=ST[t.status]||ST.idle;
      const chip = isAlert(t) ? `<span class="chip c-red">${esc(alertText(t))}</span>` : `<span class="chip ${st.c}">${st.t}</span>`;
      return `<button class="trk" data-sel="${id}" aria-current="${id===selTruck}"><span class="dot ${online(t)?'on':''}"></span><div class="grow"><b>${esc(t.plate)}</b> <span class="small muted">· ${esc(t.driver)}</span><div class="small muted">${hasAssignedJob(t) ? esc((t.originName ? t.originName + ' → ' : '') + t.destName) : 'ยังไม่มีงาน'}</div></div>${chip}</button>`; }).join('')
      : `<div class="empty">ยังไม่มีรถ เพิ่มได้ที่เมนู “จัดการผู้ใช้งาน”</div>`;
    $('liveList').innerHTML = feedHTML(S.events.slice(0,6), true) || `<li class="empty" style="display:block">ยังไม่มีเหตุการณ์</li>`;
  }
  if (aTab==='al'){
    $('atAl').innerHTML = alerts.length ? alerts.map(id => { const t = S.trucks[id];
      const detail = isFake(t) ? `ตั้งแต่ ${fmtT(t.gpsMockAt)} · ระบบไม่รับตำแหน่งปลอม แผนที่แสดงตำแหน่งจริงล่าสุด` : isOff(t) ? `ตั้งแต่ ${fmtT(t.gpsOffAt)}` : isParked(t) ? `จอดมาแล้ว ${durTxt(mins(t.lastMoveAt||t.departAt))}` : hasDelay(t) ? `${esc(t.delay.reason)} · ${fmtT(t.delay.at)}` : `ไม่มีสัญญาณมา ${durTxt(mins(t.gpsAt))}`;
      return `<div class="al-item"><span class="sev"></span><div class="grow"><b>${esc(t.plate)}</b> <span class="small muted">· ${esc(t.driver)}</span><div><b style="color:var(--red)">${esc(alertText(t))}</b> <span class="small">${detail}</span></div></div><button class="btn btn-ghost btn-sm" data-goto="${id}">ดูรถ</button></div>`; }).join('')
      : `<div class="empty">ไม่มีเหตุแจ้งเตือนตอนนี้ 👍</div>`;
  }
  if (aTab==='jobs'){
    $('atJobs').innerHTML = ids.length ? `<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>ทะเบียน / คนขับ</th><th>สถานะ</th><th>ต้นทาง → ปลายทาง</th><th>นัดถึง</th><th>น้ำมัน</th><th></th></tr></thead><tbody>${
      sorted.map(id => { const t=S.trucks[id], st=ST[t.status]||ST.idle;
        return `<tr><td><b>${esc(t.plate)}</b><div class="small muted">${esc(t.driver)}</div></td><td><span class="chip ${st.c}">${st.t}</span>${isAlert(t)?`<div class="small" style="color:var(--red);font-weight:700">${esc(alertText(t))}</div>`:''}</td><td>${hasAssignedJob(t)?`${esc(t.originName||'–')} → <b>${esc(t.destName)}</b>`:'<span class="muted">ยังไม่มีงาน</span>'}</td><td>${t.etaAt?fmtDT(t.etaAt):'–'}${isLate(t)?'<div class="small" style="color:var(--red);font-weight:700">เลยเวลานัด</div>':''}</td><td class="small">${esc(fuelSumTxt(fuelOf(t))||'–')}</td><td><button class="btn btn-sm btn-orange" data-assign="${id}">${hasAssignedJob(t)?'แก้งาน':'มอบหมาย'}</button></td></tr>`; }).join('')
    }</tbody></table></div>` : `<div class="empty">ยังไม่มีรถ</div>`;
  }
  if (aTab==='ev') $('evList').innerHTML = feedHTML(S.events, true) || `<li class="empty" style="display:block">ยังไม่มีเหตุการณ์</li>`;
  if (aTab==='users'){
    fillNewAccount();
    $('uList').innerHTML = ids.length ? `<div class="pad"><b class="sec">รถและคนขับในระบบ (${ids.length})</b></div>` + sorted.map(id => { const t=S.trucks[id];
      return `<div class="al-item" style="flex-wrap:wrap"><div class="avatar" style="width:40px;height:40px">${ico('driver')}</div><div class="grow"><b>${esc(t.driver)}</b> · ${esc(t.plate)}<div class="small muted">${t.username?`ชื่อผู้ใช้: <b style="color:var(--ink)">${esc(t.username)}</b>`:'<span style="color:var(--red)">ยังไม่มีบัญชี</span>'} ${esc(t.code||'')} ${esc(t.phone||'')}</div></div><div class="row" style="gap:6px"><button class="btn btn-ghost btn-sm" data-ureset="${id}">${t.username?'ตั้งรหัสใหม่':'สร้างบัญชี'}</button><button class="btn btn-ghost btn-sm" data-udel="${id}">ลบ</button></div></div>`; }).join('')
      : `<div class="empty">ยังไม่มีรถในระบบ</div>`;
    const pl = placeList();
    $('pList').innerHTML = pl.length ? pl.map(([id,p]) => `<div class="al-item" style="padding:10px 0">${ico('factory')}<div class="grow"><b>${esc(p.name)}</b><div class="small muted">${p.lat!=null?`${(+p.lat).toFixed(4)}, ${(+p.lng).toFixed(4)}`:'ไม่มีพิกัด'}</div></div><button class="btn btn-ghost btn-sm" data-pdel="${id}">ลบ</button></div>`).join('') : '<div class="small muted">ยังไม่มีปลายทาง</div>';
  }
  if (aTab==='set'){ $('thrSel').value = String(thr); $('liveSel').value = String(liveSec()); }
  paintIcons($('scrAdmin'));
}

function renderSel(){
  const id = selTruck, t = id && S.trucks[id];
  if (!t){ $('selCard').innerHTML = `<div class="empty">เลือกรถจากแผนที่หรือรายการ</div>`; return; }
  const al = isAlert(t), st = ST[t.status]||ST.idle;
  const head = al ? `<div class="sel-h">${ico('warn')}${esc(alertText(t))}</div>` : `<div class="sel-h ok">${ico('truck')}${st.t}</div>`;
  const on = online(t);
  $('selCard').innerHTML = head + `
    <div class="sel-truck"><span class="tk">${IC.bigtruck}</span><div class="grow"><b class="pl">${esc(t.plate)}</b><div>คนขับ: ${esc(t.driver)}</div></div><span class="chip ${on?'c-green':''}">${on?'ออนไลน์':'ออฟไลน์'}</span></div>
    <div class="pad" style="padding-bottom:0"><div class="autobox" style="margin:0">
      <div class="kv">${ico('flag')}<span>ต้นทาง</span><b>: ${esc(t.originName||'–')}</b></div>
      <div class="kv">${ico('factory')}<span>ปลายทาง</span><b>: ${esc(t.destName||'–')}${t.etaAt?` · นัด ${fmtDT(t.etaAt)}`:''}</b></div>
      <div class="kv">${ico('gps')}<span>ความเร็ว</span><b>: <span class="spd">${t.moving ? Math.round(t.speed||0) : 0}</span> กม./ชม. ${t.moving?'<span class="chip c-green">กำลังวิ่ง</span>':'<span class="chip">จอดอยู่</span>'}</b></div>
      <div class="kv">${ico('pin')}<span>GPS ล่าสุด</span><b>: ${t.gpsAt?`<span id="selAgo" data-at="${t.gpsAt}">${agoTxt(t.gpsAt)}</span>`:'–'}${t.lat!=null?` · <a href="https://www.google.com/maps?q=${(+t.lat).toFixed(6)},${(+t.lng).toFixed(6)}" target="_blank" rel="noopener">เปิดแผนที่</a>`:''}</b></div>
      <div class="kv">${ico('clock')}<span>ขยับล่าสุด</span><b>: ${t.lastMoveAt?`${fmtT(t.lastMoveAt)} (${durTxt(mins(t.lastMoveAt))}ที่แล้ว)`:'–'}</b></div>
      ${fuelOf(t).length?`<div class="kv">${ico('fuel')}<span>เติมน้ำมัน</span><b>: ${esc(fuelSumTxt(fuelOf(t)))}</b></div>`:''}
    </div></div>
    <div class="pad" style="padding:8px 14px 0"><button class="btn btn-orange btn-block" data-assign="${id}">${ico('list')}${hasAssignedJob(t)?'เปลี่ยนต้นทาง / ปลายทาง':'มอบหมายงานใหม่'}</button></div>
    <div class="cmd3">
      <button class="cbtn cb-ring" id="cRing">${ico('bell')}กดกริ่ง<small>(แจ้งเตือนดัง)</small></button>
      <button class="cbtn cb-mic" id="cMic">${ico('mic')}พูดผ่านไมค์<small>(กดค้างเพื่อพูด)</small></button>
      <a class="cbtn cb-call" id="cCall" href="${t.phone?telHref(t.phone):'#'}">${ico('phone')}โทร<small>${esc(t.phone||'ไม่มีเบอร์')}</small></a>
    </div>
    <div class="mic-note">${ico('mic')}<span>ไมค์จากแอดมิน : พูดเสียงไปยังมือถือคนขับได้ทันที <em>ไม่ต้องกดรับ</em> (แบบทางเดียว)</span></div>
    <div class="say"><input class="input" id="sayTxt" placeholder="หรือพิมพ์ข้อความ ให้มือถือคนขับอ่านออกเสียง"><button class="btn btn-navy" id="saySend">${ico('speak')}ส่ง</button></div>`;
  bindMic();
}

document.addEventListener('click', async e => {
  const s = e.target.closest('[data-sel]'); if (s){ selTruck = s.dataset.sel; renderAdmin(); const t=S.trucks[selTruck]; if (aMap && t && t.lat!=null) aMap.easeTo({center: ll(t), duration: 800}); if (innerWidth<=820) $('selCard').scrollIntoView({behavior:'smooth', block:'start'}); return; }
  const g = e.target.closest('[data-goto]'); if (g){ selTruck = g.dataset.goto; aTab='ov'; renderAdmin(); setTimeout(()=>{ if(!aMap) return; aMap.resize(); const t=S.trucks[selTruck]; if (t && t.lat!=null) aMap.flyTo({center: ll(t), zoom: 16, pitch: 60}); }, 60); return; }
  if (e.target.closest('#cRing')){ sendCmd(selTruck, {type:'ring'}); return; }
  if (e.target.closest('#saySend')){ const txt = $('sayTxt').value.trim(); if (!txt){ toast('พิมพ์ข้อความก่อน'); return; } sendCmd(selTruck, {type:'announce', text:txt}); $('sayTxt').value=''; return; }
  const c = e.target.closest('#cCall'); if (c){ const t = S.trucks[selTruck]; if (!t || !t.phone){ e.preventDefault(); toast('ยังไม่มีเบอร์คนขับ เพิ่มได้ที่ “จัดการผู้ใช้งาน”'); } else if (A){ e.preventDefault(); call('openUrl', telHref(t.phone)); } return; }
  const ur = e.target.closest('[data-ureset]'); if (ur){ resetPw(ur.dataset.ureset); return; }
  const ud = e.target.closest('[data-udel]'); if (ud){ if (ud.dataset.sure!=='1'){ sure(ud); return; }
    const t = S.trucks[ud.dataset.udel];
    try { if (t && t.username) await db.doc('logins/'+t.username).delete(); await db.doc('trucks/'+ud.dataset.udel).delete(); toast('ลบคนขับแล้ว'); } catch(err){ toast('ลบไม่สำเร็จ'); }
    return; }
  const pd = e.target.closest('[data-pdel]'); if (pd){ if (pd.dataset.sure!=='1'){ sure(pd); return; } await db.doc('places/'+pd.dataset.pdel).delete().catch(()=>toast('ลบไม่สำเร็จ')); return; }
});
function sure(b){ b.dataset.sure='1'; b.textContent='แตะอีกครั้งเพื่อลบ'; b.style.color='var(--red)'; setTimeout(()=>{ if(b.isConnected){ b.dataset.sure=''; b.textContent='ลบ'; b.style.color=''; } }, 3000); }

function sendCmd(id, cmd){
  const t = S.trucks[id]; if (!t) return;
  const body = Object.assign({text:'', audio:''}, cmd, {at: Date.now(), nonce: rid()});
  db.doc('commands/'+id).set(body).then(() => {
    toast(online(t) ? `ส่งถึงมือถือ ${t.plate} แล้ว` : `ส่งแล้ว — มือถือ ${t.plate} ดูเหมือนออฟไลน์ จะได้รับเมื่อกลับมาออนไลน์`);
  }).catch(() => toast('ส่งไม่สำเร็จ ตรวจอินเทอร์เน็ต'));
  addEvent(cmd.type, cmd.type==='announce' ? (cmd.text || 'ข้อความเสียง') : '', '', null, id);
}

/* ===== admin: assign a job (origin -> destination) ===== */
let asgTruck = null;
function openAssign(id){
  const t = S.trucks[id]; if (!t) return;
  asgTruck = id;
  const pl = placeList();
  const opts = sel => `<option value="">— เลือก —</option>` + pl.map(([pid,p]) => `<option value="${pid}"${pid===sel?' selected':''}>${esc(p.name)}</option>`).join('');
  $('asgWho').textContent = `${t.driver} · ${t.plate}`;
  $('asgO').innerHTML = opts(hasAssignedJob(t) ? t.originId : ''); $('asgD').innerHTML = opts(hasAssignedJob(t) ? t.destId : '');
  $('asgHelp').hidden = pl.length >= 2;
  if (hasAssignedJob(t) && t.etaAt){ const d = new Date(t.etaAt); $('asgTime').value = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    const k = Math.round((new Date(d.toDateString()) - new Date(new Date().toDateString()))/864e5); $('asgDay').value = String(Math.min(2, Math.max(0, k))); }
  else $('asgDay').value = '';
  $('asgGo').textContent = hasAssignedJob(t) ? 'บันทึกการเปลี่ยนงาน' : 'มอบหมายงาน';
  $('asgOv').hidden = false; paintIcons($('asgOv'));
}
$('asgClose').onclick = () => { $('asgOv').hidden = true; asgTruck = null; };
$('asgGo').onclick = async () => {
  const id = asgTruck, t = S.trucks[id]; if (!t) return;
  const o = $('asgO').value, d = $('asgD').value;
  if (!o || !d){ toast('เลือกต้นทางและปลายทาง'); return; }
  if (o === d){ toast('ต้นทางกับปลายทางต้องไม่ใช่ที่เดียวกัน'); return; }
  const oName = S.places[o].name, dName = S.places[d].name, now = Date.now();
  let etaAt = null;
  if ($('asgDay').value !== '' && $('asgTime').value){ const [hh, mm] = $('asgTime').value.split(':').map(Number); const x = new Date(); x.setDate(x.getDate() + (+$('asgDay').value)); x.setHours(hh, mm, 0, 0); etaAt = x.getTime(); }
  const isNew = !hasAssignedJob(t);
  const patch = {originId:o, originName:oName, destId:d, destName:dName, etaAt, assignedAt: now, updatedAt: now};
  if (isNew) Object.assign(patch, {status:'assigned', fuel:[], jobStart: now, jobId: rid(), headIn:null, tailIn:null, delay:null, standbyAt:null, departAt:null, arriveAt:null});
  $('asgGo').disabled = true;
  try {
    await db.doc('trucks/'+id).update(patch);
    addEvent('assign', `${oName} → ${dName}${etaAt?` · นัดถึง ${fmtDT(etaAt)}`:''}`, '', null, id);
    if ($('asgSay').checked) sendCmd(id, {type:'announce', text: `${isNew ? 'มีงานใหม่' : 'เปลี่ยนงาน'} ต้นทาง ${oName} ปลายทาง ${dName}`});
    $('asgOv').hidden = true; asgTruck = null; toast(isNew ? 'มอบหมายงานแล้ว' : 'บันทึกการเปลี่ยนงานแล้ว');
  } catch(e){ toast('บันทึกไม่สำเร็จ ตรวจอินเทอร์เน็ต'); }
  finally { $('asgGo').disabled = false; }
};
document.addEventListener('click', e => { const b = e.target.closest('[data-assign]'); if (b){ e.stopPropagation(); openAssign(b.dataset.assign); } });

/* "x seconds ago" that ticks every second for the selected truck */
function agoTxt(ms){ const s = Math.max(0, Math.round((Date.now()-ms)/1000)); return s < 60 ? `${s} วินาทีที่แล้ว` : s < 3600 ? `${Math.floor(s/60)} นาทีที่แล้ว` : `${fmtT(ms)}`; }
setInterval(() => { const el = $('selAgo'); if (el && !$('scrAdmin').hidden) el.textContent = agoTxt(+el.dataset.at); }, 1000);

/* hold-to-talk */
let rec = null, recChunks = [], recStart = 0, recTimer = null, recCancel = false, micStream = null;
function bindMic(){
  const b = $('cMic'); if (!b) return;
  let pressing = false;
  const start = async e => {
    e.preventDefault(); recCancel = false; pressing = true;
    try { b.setPointerCapture(e.pointerId); } catch(err){}
    if (!navigator.mediaDevices || !window.MediaRecorder){ toast('มือถือเครื่องนี้อัดเสียงไม่ได้ ใช้ช่องพิมพ์ข้อความแทน'); return; }
    if (!micStream){
      try { micStream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true}}); }
      catch(err){ toast('ยังไม่ได้อนุญาตไมค์'); return; }
      if (!pressing){ toast('พร้อมแล้ว กดค้างอีกครั้งแล้วพูด'); return; }
    }
    if (!pressing) return;
    let mime = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';
    try { rec = new MediaRecorder(micStream, mime ? {mimeType:mime, audioBitsPerSecond:24000} : {}); } catch(err){ rec = new MediaRecorder(micStream); }
    recChunks = []; rec.ondataavailable = ev => { if (ev.data && ev.data.size) recChunks.push(ev.data); };
    rec.onstop = finishRec;
    rec.start(); recStart = Date.now(); b.classList.add('rec-on');
    $('recBox').hidden = false; $('recSec').textContent = '0';
    clearInterval(recTimer); recTimer = setInterval(() => { const s = Math.floor((Date.now()-recStart)/1000); $('recSec').textContent = s; if (s >= 30) stop(); }, 250);
  };
  const stop = () => { pressing = false; if (rec && rec.state === 'recording'){ rec.stop(); } b.classList.remove('rec-on'); $('recBox').hidden = true; clearInterval(recTimer); };
  b.addEventListener('pointerdown', start);
  b.addEventListener('pointerup', e => {
    const r = b.getBoundingClientRect();
    const outside = e.clientX < r.left - 30 || e.clientX > r.right + 30 || e.clientY < r.top - 60 || e.clientY > r.bottom + 30;
    if (outside && rec && rec.state==='recording'){ recCancel = true; toast('ยกเลิกแล้ว'); }
    stop();
  });
  b.addEventListener('pointercancel', () => { recCancel = true; stop(); });
  b.addEventListener('contextmenu', e => e.preventDefault());
}
function finishRec(){
  const r = rec; rec = null;
  if (recCancel) return;
  const dur = Date.now() - recStart;
  if (dur < 700){ toast('กดค้างไว้แล้วพูด ปล่อยนิ้วเมื่อพูดจบ'); return; }
  const blob = new Blob(recChunks, {type: (r && r.mimeType) || 'audio/webm'});
  if (blob.size > 650000){ toast('เสียงยาวเกินไป พูดให้สั้นลง'); return; }
  const fr = new FileReader();
  fr.onload = () => sendCmd(selTruck, {type:'announce', audio: fr.result, text:''});
  fr.readAsDataURL(blob);
}

/* users / places / settings */
const genPw = () => String(Math.floor(100000 + Math.random()*900000));
function suggestUser(){
  const used = new Set(Object.values(S.trucks).map(t => t.username));
  for (let i = 1; i < 1000; i++){ const u = 'sm' + String(i).padStart(3,'0'); if (!used.has(u)) return u; }
  return 'sm' + Date.now().toString(36).slice(-4);
}
function fillNewAccount(){ if (!$('nUser').value) $('nUser').value = suggestUser(); if (!$('nPass').value) $('nPass').value = genPw(); }
$('nGen').onclick = () => { $('nPass').value = genPw(); };
async function writeLogin(u, pw, truckId, ver){
  const salt = rid();
  await db.doc('logins/'+u).set({truckId, salt, hash: await hashPw(pw, salt), ver, at: Date.now()});
}
$('nAdd').onclick = async () => {
  const plate = $('nPlate').value.trim(), driver = $('nDriver').value.trim();
  const u = normUser($('nUser').value), pw = $('nPass').value.trim();
  if (!driver || !plate){ toast('กรอกชื่อคนขับและทะเบียนรถ'); return; }
  if (!validUser(u)){ toast('ชื่อผู้ใช้ใช้ได้เฉพาะ a-z, 0-9 ยาว 3–20 ตัว'); $('nUser').focus(); return; }
  if (pw.length < 4){ toast('รหัสผ่านต้องยาวอย่างน้อย 4 ตัว'); $('nPass').focus(); return; }
  $('nAdd').disabled = true;
  try {
    const ex = await db.doc('logins/'+u).get({source:'server'});
    if (ex.exists){ toast('ชื่อผู้ใช้นี้มีคนใช้แล้ว เปลี่ยนชื่อใหม่'); return; }
    const id = 't' + Date.now().toString(36);
    await db.doc('trucks/'+id).set({plate, driver, code:$('nCode').value.trim(), phone:$('nPhone').value.trim(), username:u, loginVer:1, status:'idle', createdAt:Date.now(), updatedAt:Date.now()});
    await writeLogin(u, pw, id, 1);
    ['nPlate','nDriver','nCode','nPhone','nUser','nPass'].forEach(i => $(i).value='');
    showCred(driver, u, pw, 'สร้างบัญชีคนขับแล้ว');
  } catch(e){ toast('เพิ่มไม่สำเร็จ ตรวจอินเทอร์เน็ต'); }
  finally { $('nAdd').disabled = false; fillNewAccount(); }
};
async function resetPw(id){
  const t = S.trucks[id]; if (!t) return;
  let u = t.username;
  if (!u){ u = suggestUser(); }
  const pw = genPw(), ver = (t.loginVer||0) + 1;
  try {
    await writeLogin(u, pw, id, ver);
    await db.doc('trucks/'+id).update({username:u, loginVer:ver});
    showCred(t.driver, u, pw, 'ตั้งรหัสผ่านใหม่แล้ว');
  } catch(e){ toast('ตั้งรหัสไม่สำเร็จ ตรวจอินเทอร์เน็ต'); }
}
let credText = '';
function showCred(name, u, pw, title){
  $('credTitle').textContent = title; $('credName').textContent = name; $('credUser').textContent = u; $('credPass').textContent = pw;
  credText = `แอป ศรีมงคล 99 (คนขับ)\nคนขับ: ${name}\nชื่อผู้ใช้: ${u}\nรหัสผ่าน: ${pw}\nดาวน์โหลดแอป: https://github.com/mamaff9522-sketch/FriendTalk/releases/download/srimongkol99-apk/srimongkol99.apk`;
  $('credOv').hidden = false; paintIcons($('credOv'));
}
$('credClose').onclick = () => { $('credOv').hidden = true; credText = ''; };
$('credCopy').onclick = async () => {
  if (A && A.copy){ call('copy', credText); toast('คัดลอกแล้ว ไปวางในแชทได้เลย'); return; }
  try { await navigator.clipboard.writeText(credText); toast('คัดลอกแล้ว ไปวางในแชทได้เลย'); } catch(e){ toast('คัดลอกไม่ได้ จดชื่อผู้ใช้และรหัสผ่านไว้แทน'); }
};
$('credLine').onclick = () => { const url = 'https://line.me/R/msg/text/?' + encodeURIComponent(credText); if (A) call('openUrl', url); else window.open(url, '_blank'); };
$('pAdd').onclick = async () => {
  const name = $('pName').value.trim(); if (!name){ toast('พิมพ์ชื่อปลายทาง'); return; }
  const raw = $('pLoc').value.trim(), loc = parseLoc(raw);
  if (raw && !loc){ toast('อ่านพิกัดจากลิงก์ไม่ได้ ลองวางพิกัดแบบ 13.7563, 100.5018 หรือเว้นว่างไว้'); return; }
  const data = {name, createdAt:Date.now()}; if (loc){ data.lat = loc.lat; data.lng = loc.lng; }
  try { await db.collection('places').add(data); $('pName').value=''; $('pLoc').value=''; toast('เพิ่มปลายทางแล้ว'); } catch(e){ toast('เพิ่มไม่สำเร็จ'); }
};
$('liveSel').onchange = e => { db.doc('config/main').set({liveSec:+e.target.value}, {merge:true}).then(()=>toast('บันทึกแล้ว มือถือคนขับจะใช้ค่าใหม่ทันที')).catch(()=>toast('บันทึกไม่สำเร็จ')); };
$('thrSel').onchange = e => { db.doc('config/main').set({thr:+e.target.value}, {merge:true}).then(()=>toast('บันทึกแล้ว')).catch(()=>toast('บันทึกไม่สำเร็จ')); };
$('savePin').onclick = () => { const p = $('newPin').value.trim(); if (!/^\d{4,6}$/.test(p)){ toast('รหัสต้องเป็นตัวเลข 4–6 หลัก'); return; }
  db.doc('config/main').set({pin:p}, {merge:true}).then(()=>{ $('newPin').value=''; toast('เปลี่ยนรหัสแล้ว'); }).catch(()=>toast('บันทึกไม่สำเร็จ')); };
$('aSound').checked = ls.get('aSound', true);
$('aSound').onchange = e => ls.set('aSound', e.target.checked);
$('aLogout').onclick = () => { ls.set('adminOk', false); role=''; ls.set('role',''); show('scrStart'); };

/* admin alert sound when a new alert appears */
function alertSound(alerts){
  const fresh = alerts.filter(id => !seenAlerts.has(id + alertText(S.trucks[id])));
  alerts.forEach(id => seenAlerts.add(id + alertText(S.trucks[id])));
  if (!alertSound.ready){ if (S.connected && Object.keys(S.trucks).length) alertSound.ready = true; return; }
  if (!fresh.length) return;
  if (!$('aSound').checked) return;
  try { navigator.vibrate && navigator.vibrate([300,150,300]); } catch(e){}
  try { actx = actx || new (window.AudioContext||window.webkitAudioContext)(); actx.resume(); tone(880,0,.2); tone(660,.25,.3); } catch(e){}
  toast(`⚠ ${S.trucks[fresh[0]].plate}: ${alertText(S.trucks[fresh[0]])}`);
}

/* shared feed */
function feedHTML(list, showPlate){
  return list.map(e => { const m = EV[e.type] || {t:e.type, i:'pin', bg:'#5d6a84'};
    const who = showPlate ? `${esc(e.plate)}${e.text?' – ':''}` : '';
    const ph = e.photoId ? ` <button class="ph" data-photo="${esc(e.photoId)}">${ico('photo')} ดูรูป</button>` : '';
    return `<li><span class="ic" style="background:${m.bg}">${ico(m.i)}</span><div><b>${esc(m.t)}</b><span class="small muted">${who}${esc(e.text)}</span>${ph}</div><time>${fmtT(e.at)}</time></li>`; }).join('');
}
async function openPhoto(id){
  $('photoOv').hidden = false; $('photoImg').removeAttribute('src');
  try { const d = await db.doc('photos/'+id).get(); if (d.exists) $('photoImg').src = d.data().data; else { toast('ไม่พบรูป'); $('photoOv').hidden = true; } }
  catch(e){ toast('โหลดรูปไม่ได้'); $('photoOv').hidden = true; }
}
$('photoClose').onclick = () => $('photoOv').hidden = true;

/* ================= in-app update ================= */
let updInfo = null, lastUpdCheck = 0, updBusy = false;
function checkUpdate(manual){
  if (!A || !A.checkUpdate){ if (manual) toast('ตรวจอัปเดตได้เฉพาะในแอปที่ติดตั้ง'); return; }
  if (!manual && Date.now() - lastUpdCheck < 20*60000) return;
  lastUpdCheck = Date.now(); checkUpdate.manual = !!manual;
  if (manual) toast('กำลังตรวจสอบ…');
  call('checkUpdate');
}
window.onUpdateInfo = info => {
  if (!info){ if (checkUpdate.manual) toast('ตรวจสอบไม่ได้ ตรวจอินเทอร์เน็ต'); return; }
  if (!info.newer){ updInfo = null; $('updPill').hidden = true; if (checkUpdate.manual) toast(`ใช้เวอร์ชันล่าสุดอยู่แล้ว (${info.current})`); return; }
  updInfo = info;
  const skipped = ls.get('updLater', 0) === info.versionCode;
  if (checkUpdate.manual || !skipped) openUpdate(); else $('updPill').hidden = false;
};
function openUpdate(){
  if (!updInfo) return;
  $('updTitle').textContent = 'มีเวอร์ชันใหม่';
  $('updVer').textContent = `เวอร์ชัน ${updInfo.versionName}  (เครื่องนี้ ${updInfo.current || '-'})`;
  $('updNotes').textContent = updInfo.notes || 'ปรับปรุงการทำงานของแอป';
  $('updNotes').hidden = !updInfo.notes;
  $('updBar').hidden = true; $('updMsg').textContent = ''; $('updGo').disabled = false; $('updGo').textContent = 'อัปเดตเลย';
  $('updOv').hidden = false; $('updPill').hidden = true;
}
$('updGo').onclick = () => { if (updBusy) return; updBusy = true; $('updGo').disabled = true; call('installUpdate'); };
$('updLater').onclick = () => { $('updOv').hidden = true; updBusy = false; if (updInfo){ ls.set('updLater', updInfo.versionCode); $('updPill').hidden = false; } };
$('updPill').onclick = openUpdate;
window.onUpdateState = (state, pc) => {
  if (state === 'progress'){ $('updBar').hidden = false; $('updBarIn').style.width = pc + '%'; $('updMsg').textContent = `กำลังดาวน์โหลด… ${pc}%`; $('updGo').textContent = 'กำลังดาวน์โหลด…'; }
  else if (state === 'need_permission'){ updBusy = false; $('updGo').disabled = false; $('updGo').textContent = 'อัปเดตเลย';
    $('updMsg').innerHTML = 'ครั้งแรกเท่านั้น: เปิด <b>“อนุญาตจากแหล่งนี้”</b> แล้วกดย้อนกลับมา แอปจะอัปเดตต่อให้เอง'; }
  else if (state === 'installing'){ updBusy = false; $('updGo').disabled = false; $('updGo').textContent = 'ติดตั้งอีกครั้ง'; $('updMsg').innerHTML = 'กด <b>“อัปเดต”</b> หรือ <b>“ติดตั้ง”</b> ที่หน้าต่างของ Android'; }
  else { updBusy = false; $('updGo').disabled = false; $('updGo').textContent = 'ลองใหม่'; $('updMsg').textContent = 'ดาวน์โหลดไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองใหม่'; }
};
document.addEventListener('click', e => { if (e.target.closest('[data-updcheck]')) checkUpdate(true); });
function paintVersion(){ const v = call('appVersion') || ''; document.querySelectorAll('.appver').forEach(el => el.textContent = v ? 'v' + v : ''); if ($('appVer')) $('appVer').textContent = v || '1.0'; }

/* Android back button */
window.onAndroidBack = () => {
  if (!$('photoOv').hidden){ $('photoOv').hidden = true; return true; }
  if (!$('updOv').hidden){ $('updLater').click(); return true; }
  if (!$('asgOv').hidden){ $('asgClose').click(); return true; }
  if (!$('credOv').hidden){ $('credClose').click(); return true; }
  if (!$('cmdOv').hidden){ $('cmdOk').click(); return true; }
  if (!$('dDrawer').hidden){ closeDrawer(); return true; }
  if ($('aSide').classList.contains('open')){ closeSide(); return true; }
  if (role==='driver' && !$('scrDriver').hidden && dScreen !== 'home'){
    if (['jobs','hist','prof'].includes(dScreen)) goTab('home'); else go(dTab || 'home');
    return true; }
  if (role==='admin' && !$('scrAdmin').hidden && aTab !== 'ov'){ aTab='ov'; renderAdmin(); setTimeout(()=>aMap&&aMap.resize(),60); return true; }
  if (!$('scrPick').hidden || !$('scrPin').hidden){ role=''; ls.set('role',''); show('scrStart'); return true; }
  return false;
};

boot();
paintVersion();
setTimeout(() => checkUpdate(false), 3000);
setInterval(() => checkUpdate(false), 3*3600000);
})();
