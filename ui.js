/* ================= ARAYÜZ ================= */
let TAB = "ana";
let ARSA_IL = "İstanbul";
let PROJE_FILTRE = "aktif";
let ARSA_GORUNUM = "harita";
let TASARIM = null;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
const nativeVar = () => typeof Android !== "undefined" && Android;

function toast(m, c) {
  const d = document.createElement("div");
  d.className = "tst " + (c || "");
  d.textContent = m;
  $("#toast").appendChild(d);
  setTimeout(() => { d.style.opacity = 0; setTimeout(() => d.remove(), 260); }, 2800);
}
function sheet(title, body, footer) {
  const ov = document.createElement("div");
  ov.className = "ov";
  ov.innerHTML = '<div class="sheet"><div class="sh"><h3>' + title + '</h3><button data-act="kapat">✕</button></div>' +
    '<div class="sb">' + body + '</div>' + (footer ? '<div class="sf">' + footer + '</div>' : '') + '</div>';
  ov.addEventListener("click", e => { if (e.target === ov) ov.remove(); });
  ov.querySelector('[data-act=kapat]').onclick = () => ov.remove();
  document.body.appendChild(ov);
  return ov;
}
const kapatHepsi = () => document.querySelectorAll(".ov").forEach(x => x.remove());

/* ---------- İKONLAR ---------- */
const IK = {
  ev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>',
  harita: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="m3 6.5 6-2.5 6 2.5 6-2.5v14l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v14M15 6.5v14"/></svg>',
  bina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 21V5.5L13 3v18"/><path d="M13 9.5h7V21"/><path d="M7 8h3M7 12h3M7 16h3M16 13h1.5M16 17h1.5"/></svg>',
  cekic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 3 21 10.5l-3 3L10.5 6z"/><path d="m11 8-8 8v5h5l8-8"/></svg>',
  grafik: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M5 16V9M10 16V5M15 16v-6M20 16v-9"/></svg>',
  banka: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/></svg>',
  ayar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/></svg>',
  kupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5V8a3 3 0 0 0 3 3M17 5.5h2.5V8a3 3 0 0 1-3 3"/><path d="M12 14v3M9 20h6l-.6-3H9.6z"/></svg>',
  cark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"/></svg>',
  kisi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16.5 5.5a3.4 3.4 0 0 1 0 6M18 20c0-2.6-1-4.4-2.5-5.3"/></svg>',
  kutu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9"/></svg>',
  yildiz: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  para: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M16.5 7c-.8-1.3-2.4-2-4.5-2-2.8 0-4.5 1.3-4.5 3.2 0 4.3 9 2.3 9 6.6 0 2-1.9 3.2-4.5 3.2-2.3 0-4-.8-4.8-2.2"/></svg>',
  belge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
  dukkan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 8h16l-1 3.5a3 3 0 0 1-5.8 0 3 3 0 0 1-6.4 0A3 3 0 0 1 5 11.5z"/><path d="M5 4h14M5.5 13v7h13v-7"/></svg>',
  itibar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 3.5 20 7v5.5c0 4.3-3.2 7.4-8 8.5-4.8-1.1-8-4.2-8-8.5V7z"/><path d="m8.7 12 2.3 2.3 4.3-4.6"/></svg>',
  takvim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
};

/* ---------- SAYI ---------- */
function fmtK(n) { return fmt(n); }
function yuzde(x) { return (x * 100).toFixed(0) + "%"; }

/* ================= İLLÜSTRASYONLAR ================= */
/* Şantiye / bitmiş proje sahnesi */
function sahneSVG(p) {
  const bitti = ["satis", "isletme", "tamam"].includes(p.durum);
  const il = bitti ? 1 : (p.ilerleme || 0);
  const kat = clamp(p.kat || Math.max(2, Math.round((p.toplamM2 || 800) / 350)), 1, 20);
  const kal = p.kalite || "standart";
  const govde = kal === "luks" ? "#d9c08a" : kal === "ekonomik" ? "#7d8c99" : "#a8b9c6";
  const koyu = kal === "luks" ? "#b89a5f" : kal === "ekonomik" ? "#5f6e7a" : "#7f909d";
  const cam = bitti ? "#ffd98a" : "#1d3a4d";
  const gece = p.tip === "otel";
  const gok1 = gece ? "#14314a" : bitti ? "#2d5f7d" : "#1d4155";
  const gok2 = gece ? "#2a5572" : bitti ? "#6aa7c4" : "#3d7694";
  const W = 240, H = 104, zemin = 84;
  let g = '<defs><linearGradient id="gk' + p.id + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + gok1 + '"/><stop offset="1" stop-color="' + gok2 + '"/></linearGradient></defs>';
  g += '<rect width="' + W + '" height="' + H + '" fill="url(#gk' + p.id + ')"/>';
  /* güneş/ay */
  g += '<circle cx="' + (gece ? 205 : 32) + '" cy="24" r="' + (gece ? 7 : 9) + '" fill="' + (gece ? "#d8e6f0" : "#ffe6a4") + '" opacity=".75"/>';
  /* arka plan silüeti */
  let sx = 0;
  let seed = (p.id || "x").charCodeAt(1) || 7;
  while (sx < W) {
    const bw = 16 + (seed % 14); const bh = 20 + ((seed * 7) % 30);
    g += '<rect x="' + sx + '" y="' + (zemin - bh) + '" width="' + bw + '" height="' + bh + '" fill="#13344a" opacity=".65"/>';
    sx += bw + 3; seed = (seed * 31 + 11) % 97;
  }
  /* zemin ve yol */
  g += '<rect x="0" y="' + zemin + '" width="' + W + '" height="' + (H - zemin) + '" fill="#1b2d38"/>';
  g += '<rect x="0" y="' + (zemin + 7) + '" width="' + W + '" height="6" fill="#16252e"/>';
  for (let i = 4; i < W; i += 22) g += '<rect x="' + i + '" y="' + (zemin + 9.4) + '" width="10" height="1.6" fill="#44606f" opacity=".8"/>';
  /* ana bina */
  const bw = clamp(58 + kat * 2.4, 58, 104);
  const bx = (W - bw) / 2;
  const katY = clamp((zemin - 16) / kat, 5.5, 11);
  const bitenKat = Math.max(0, Math.round(kat * il));
  for (let i = 0; i < kat; i++) {
    const y = zemin - (i + 1) * katY;
    if (y < 4) break;
    const yap = i < bitenKat;
    g += '<rect x="' + bx + '" y="' + y.toFixed(1) + '" width="' + bw + '" height="' + (katY - 1).toFixed(1) + '" ' +
      'fill="' + (yap ? govde : "none") + '" stroke="' + (yap ? koyu : "#4a6a7d") + '" stroke-width="' + (yap ? .7 : 1) + '"' +
      (yap ? '' : ' stroke-dasharray="3 2"') + '/>';
    if (yap && katY >= 7) {
      const n = Math.max(3, Math.floor(bw / 14));
      for (let w = 0; w < n; w++) {
        const px = bx + 4 + w * (bw - 8) / n;
        const yanik = ((i * 7 + w * 3 + seed) % 10) > 3;
        g += '<rect x="' + px.toFixed(1) + '" y="' + (y + 1.8).toFixed(1) + '" width="4.4" height="' + (katY - 4.4).toFixed(1) +
          '" fill="' + (yanik ? cam : "#15303f") + '" opacity="' + (yanik ? ".9" : ".75") + '"/>';
      }
    }
  }
  /* vinç + kamyon */
  if (!bitti) {
    const vy = clamp(zemin - kat * katY - 16, 5, 60);
    g += '<rect x="' + (bx - 15) + '" y="' + vy + '" width="2.6" height="' + (zemin - vy) + '" fill="#e5a93a"/>';
    g += '<rect x="' + (bx - 24) + '" y="' + vy + '" width="46" height="2.6" fill="#e5a93a"/>';
    g += '<rect x="' + (bx + 16) + '" y="' + (vy + 2.6) + '" width="1.2" height="9" fill="#9fb6c4"/>';
    g += '<rect x="' + (bx + 13) + '" y="' + (vy + 11) + '" width="7" height="4" rx="1" fill="#f5b63d"/>';
    g += '<rect x="14" y="' + (zemin - 9) + '" width="22" height="7" rx="1.5" fill="#e07b3c"/>' +
      '<rect x="30" y="' + (zemin - 13) + '" width="11" height="11" rx="1.5" fill="#f0a05a"/>' +
      '<circle cx="20" cy="' + (zemin - 1) + '" r="2.6" fill="#132430"/><circle cx="37" cy="' + (zemin - 1) + '" r="2.6" fill="#132430"/>';
  } else {
    g += '<circle cx="' + (bx - 16) + '" cy="' + (zemin - 7) + '" r="7" fill="#2f7a4e"/>' +
      '<rect x="' + (bx - 17.2) + '" y="' + (zemin - 4) + '" width="2.4" height="5" fill="#3f4f3a"/>';
    g += '<circle cx="' + (bx + bw + 16) + '" cy="' + (zemin - 6) + '" r="6" fill="#2f7a4e"/>' +
      '<rect x="' + (bx + bw + 15) + '" y="' + (zemin - 3.5) + '" width="2.2" height="4.5" fill="#3f4f3a"/>';
    g += '<rect x="22" y="' + (zemin - 6) + '" width="17" height="5" rx="2" fill="#cf4a4a"/>' +
      '<circle cx="27" cy="' + (zemin - .6) + '" r="2" fill="#132430"/><circle cx="35" cy="' + (zemin - .6) + '" r="2" fill="#132430"/>';
  }
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice">' + g + '</svg>';
}

/* Arsa parsel çizimi */
function parselSVG(a) {
  const W = 224, H = 96;
  const en = clamp(Math.sqrt(a.m2) * 1.35, 60, 150);
  const boy = clamp(a.m2 / Math.sqrt(a.m2) * 1.0, 34, 56);
  const x = (W - en) / 2, y = 20;
  let g = '<rect width="' + W + '" height="' + H + '" fill="#132430"/>';
  /* komşu parseller */
  g += '<rect x="0" y="' + y + '" width="' + (x - 7) + '" height="' + boy + '" fill="#8d4f41" opacity=".55"/>';
  g += '<rect x="' + (x + en + 7) + '" y="' + y + '" width="' + (W - x - en - 7) + '" height="' + boy + '" fill="#6d7b86" opacity=".5"/>';
  /* parsel */
  g += '<rect x="' + x + '" y="' + y + '" width="' + en + '" height="' + boy + '" fill="#c8ab6a" opacity=".9"/>';
  g += '<rect x="' + x + '" y="' + y + '" width="' + en + '" height="' + boy + '" fill="none" stroke="#f5b63d" stroke-width="1.6" stroke-dasharray="5 3"/>';
  /* ağaçlar */
  for (let i = 0; i < 4; i++) {
    const tx = x + 8 + i * (en - 16) / 3;
    g += '<circle cx="' + tx.toFixed(1) + '" cy="' + (y + boy + 8) + '" r="4.2" fill="#2f7a4e"/>';
  }
  /* yol */
  g += '<rect x="0" y="' + (y + boy + 14) + '" width="' + W + '" height="' + (H - y - boy - 14) + '" fill="#1b2d38"/>';
  for (let i = 6; i < W; i += 20) g += '<rect x="' + i + '" y="' + (y + boy + 20) + '" width="9" height="1.5" fill="#44606f"/>';
  /* ölçüler */
  g += '<text x="' + (W / 2) + '" y="' + (y + boy / 2 + 4) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#122028">' + a.m2 + ' m²</text>';
  g += '<path d="M' + x + ' ' + (y + boy + 4) + 'h' + en + '" stroke="#f5b63d" stroke-width="1.2"/>';
  g += '<text x="' + (W / 2) + '" y="' + (y - 7) + '" text-anchor="middle" font-size="9.5" font-weight="700" fill="#93aec0" letter-spacing="1">' +
    (a.imarAd || "").toUpperCase() + ' · EMSAL ' + a.emsal + '</text>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice">' + g + '</svg>';
}

/* Mini çizgi grafik */
function sparkSVG(dizi, renk) {
  if (!dizi || dizi.length < 2) return '';
  const W = 300, H = 46, mn = Math.min.apply(null, dizi), mx = Math.max.apply(null, dizi);
  const ar = (mx - mn) || 1;
  const nk = dizi.map((v, i) => [i * W / (dizi.length - 1), H - 4 - (v - mn) / ar * (H - 10)]);
  const d = nk.map((n, i) => (i ? "L" : "M") + n[0].toFixed(1) + " " + n[1].toFixed(1)).join(" ");
  const alan = d + " L" + W + " " + H + " L0 " + H + " Z";
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
    '<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + renk + '" stop-opacity=".32"/>' +
    '<stop offset="1" stop-color="' + renk + '" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="' + alan + '" fill="url(#sg)"/>' +
    '<path d="' + d + '" fill="none" stroke="' + renk + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<circle cx="' + nk[nk.length - 1][0].toFixed(1) + '" cy="' + nk[nk.length - 1][1].toFixed(1) + '" r="3" fill="' + renk + '"/></svg>';
}

/* Kredi puanı göstergesi */
function gostergeSVG(puan) {
  const o = clamp((puan - 600) / 1300, 0, 1);
  const a = Math.PI * (1 - o), r = 62, cx = 80, cy = 74;
  const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
  return '<svg class="gosterge" viewBox="0 0 160 92">' +
    '<path d="M18 74a62 62 0 0 1 124 0" fill="none" stroke="#1b2d38" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M18 74a62 62 0 0 1 41-58" fill="none" stroke="#ef5b63" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M59 16a62 62 0 0 1 42 0" fill="none" stroke="#f5b63d" stroke-width="12"/>' +
    '<path d="M101 16a62 62 0 0 1 41 58" fill="none" stroke="#38d08a" stroke-width="12" stroke-linecap="round"/>' +
    '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="7" fill="#e9f2f8" stroke="#0a1620" stroke-width="3"/>' +
    '</svg>';
}

/* ================= TÜRKİYE HARİTASI ================= */
const HRT = { W: 1000, H: 445, lo0: 25.6, lo1: 45.0, la0: 35.7, la1: 42.3 };
const hx = lo => ((lo - HRT.lo0) / (HRT.lo1 - HRT.lo0) * HRT.W);
const hy = la => ((HRT.la1 - la) / (HRT.la1 - HRT.la0) * HRT.H);
const hyol = ps => "M" + ps.map(a => hx(a[0]).toFixed(1) + " " + hy(a[1]).toFixed(1)).join(" L") + " Z";

function haritaSVG() {
  const uIdx = UNVANLAR.findIndex(x => x.ad === unvan().ad);
  let g = '<defs>' +
    '<linearGradient id="kara" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#1b3a49"/><stop offset="1" stop-color="#122a36"/></linearGradient>' +
    '<filter id="isik" x="-60%" y="-60%" width="220%" height="220%">' +
    '<feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs>';
  g += '<rect width="' + HRT.W + '" height="' + HRT.H + '" fill="#07131b"/>';
  /* deniz dalgaları */
  for (let i = 0; i < 7; i++) {
    const y = 18 + i * 62;
    g += '<path d="M0 ' + y + ' q 26 -7 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0 t 52 0" ' +
      'fill="none" stroke="#123042" stroke-width="1.2" opacity=".5"/>';
  }
  g += '<path d="' + hyol(TR_SINIR) + '" fill="url(#kara)" stroke="#36657d" stroke-width="2.2" stroke-linejoin="round"/>';
  g += '<path d="' + hyol(TR_MARMARA) + '" fill="#07131b" stroke="#36657d" stroke-width="1.4"/>';

  /* iller */
  let noktalar = "", yazilar = "";
  for (const i of ILLER) {
    const k = IL_KONUM[i.n]; if (!k) continue;
    const x = hx(k[0]), y = hy(k[1]);
    const acik = S.acikIller.includes(i.n);
    const kilit = uIdx < i.lv;
    const r = clamp(4 + i.d.length * 0.28, 4.4, 9.5);
    const grup = '<g data-act="haritail" data-il="' + i.n + '" style="cursor:pointer">';
    if (acik) {
      noktalar += grup + '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r + 7) + '" fill="#f5b63d" opacity=".10"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#f5b63d" stroke="#fff3d6" stroke-width="1.4" filter="url(#isik)"/>' +
        (i.n === ARSA_IL ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r + 5).toFixed(1) + '" fill="none" stroke="#fff3d6" stroke-width="1.8"/>' : '') +
        '</g>';
      yazilar += '<text x="' + x.toFixed(1) + '" y="' + (y - r - 6).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#ffeab8">' + i.n + '</text>';
    } else {
      noktalar += grup + '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" ' +
        'fill="' + (kilit ? "#20394a" : "#2d5d75") + '" stroke="' + (kilit ? "#395466" : "#5fa3c4") + '" stroke-width="1.3"/>' +
        (kilit ? '<path d="M' + (x - 2.4).toFixed(1) + ' ' + (y - .2).toFixed(1) + ' h4.8 v3.4 h-4.8 z" fill="#8aa4b4"/>' +
          '<path d="M' + (x - 1.4).toFixed(1) + ' ' + (y - .4).toFixed(1) + ' v-1.3 a1.4 1.4 0 0 1 2.8 0 v1.3" fill="none" stroke="#8aa4b4" stroke-width=".85"/>' : '') +
        '</g>';
      if (i.d.length >= 12) yazilar += '<text x="' + x.toFixed(1) + '" y="' + (y - r - 5).toFixed(1) +
        '" text-anchor="middle" font-size="11" font-weight="700" fill="#6f8ea2">' + i.n + '</text>';
    }
  }
  return '<svg class="hrt" viewBox="0 0 ' + HRT.W + ' ' + HRT.H + '">' + g + noktalar + yazilar + '</svg>';
}

/* ================= SOL RAY ================= */
const SEKMELER = [
  { k: "ana", ad: "Ana ekran", ik: "ev" },
  { k: "arsa", ad: "Arsalar", ik: "harita" },
  { k: "proje", ad: "Projeler", ik: "bina" },
  { k: "ihale", ad: "İhaleler", ik: "cekic" },
  { k: "piyasa", ad: "Piyasa", ik: "grafik" },
  { k: "odeme", ad: "Ödemeler", ik: "belge" },
  { k: "banka", ad: "Banka", ik: "banka" },
  { k: "sirket", ad: "Şirket", ik: "ayar" }
];
function cizRay() {
  let h = "";
  for (const t of SEKMELER) {
    let nokta = "";
    if (t.k === "odeme" && S.odemeler.length) nokta = '<i class="nokta"></i>';
    if (t.k === "ihale" && S.ihaleler.length) nokta = '<i class="nokta" style="background:var(--blue)"></i>';
    h += '<button class="rb ' + (TAB === t.k ? "on" : "") + '" data-tab="' + t.k + '">' +
      IK[t.ik] + '<span>' + t.ad + '</span>' + nokta + '</button>';
  }
  $("#ray").innerHTML = h;
}

/* ================= ÜST BAR ================= */
const BASLIKLAR = {
  ana: ["", ""], arsa: ["ARSA PAZARI", "Arsalar"], proje: ["PORTFÖY", "Projeler"],
  ihale: ["KAMU İŞLERİ", "İhaleler"], piyasa: ["ENDEKS VE MALZEME", "Piyasa"],
  odeme: ["BORÇ VE TAHAKKUK", "Ödemeler"], banka: ["KREDİ VE FİNANSMAN", "Banka"],
  sirket: ["YÖNETİM", "Şirket"]
};
function cizUst() {
  const u = unvan();
  const b = BASLIKLAR[TAB] || ["", ""];
  const ey = TAB === "ana" ? u.ad.toUpperCase() : b[0];
  const bas = TAB === "ana" ? S.sirket : b[1];
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const geciken = gecikenOdemeler().length;
  let h = '<div class="ubar">' +
    '<div class="ubas"><div class="ey">' + esc(ey) + '</div><h1>' + esc(bas) + '</h1></div>' +
    '<div class="uara"></div>' +
    '<div class="kasa"><span>KASA</span><b>' + fmt(S.nakit) + '</b></div>' +
    '<div class="rozet g">' + IK.itibar + itibarToplam().toFixed(0) + '</div>';
  if (geciken) h += '<div class="rozet r">' + IK.belge + geciken + ' geciken</div>';
  else if (S.odemeler.length) h += '<div class="rozet y">' + IK.belge + S.odemeler.length + ' ödeme</div>';
  if (borc > 0) h += '<div class="rozet">' + IK.banka + fmt(borc) + '</div>';
  h += '<div class="rozet">' + IK.takvim + tarih() + '</div></div>' +
    '<div class="gunbar"><i id="guncubuk"></i></div>';
  $("#ust").innerHTML = h;
}

/* ================= ANA EKRAN ================= */
function ekranAna() {
  const aktif = S.projeler.filter(p => p.durum === "insaat" || p.durum === "ruhsat");
  const satista = S.projeler.filter(p => p.durum === "satis");
  const isletme = S.projeler.filter(p => p.durum === "isletme");
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const kira = isletme.filter(p => p.tip === "avm").reduce((t, p) => t + (p.kiraAylik || 0), 0);
  const otel = isletme.filter(p => p.tip === "otel").reduce((t, p) => t + (p.otelGelir || 0), 0);
  const yidAy = S.yid.reduce((t, y) => t + y.aylik, 0);
  const net = S.gunlukGelir - S.gunlukGider;

  const uyari = nakitAkisUyarisi();
  let sol = "";
  if (iflasMi())
    sol += '<div class="card" style="border-color:var(--red);background:var(--redsoft)">' +
      '<div class="ct"><h3>İflas riski</h3><span class="tag r">Acil</span></div>' +
      '<div class="sub">Borçların varlıklarını aştı. Arsa, makine veya koleksiyon satabilir, yarım projeyi devredebilirsin.</div></div>';
  else if (uyari !== null)
    sol += '<div class="card" style="border-color:var(--gold)">' +
      '<div class="ct"><h3>Nakit akışı uyarısı</h3><span class="tag y">' + uyari + ' gün</span></div>' +
      '<div class="sub">Bu gidişle kasan ' + uyari + ' gün içinde biter. Kredi çek, fiyat düşürüp satışı hızlandır ya da gideri kıs.</div></div>';
  sol += '<div class="hero">' +
    '<div class="heroust"><span class="et">KASA</span>' +
    '<span class="tag ' + (S.konutEndeks >= 1 ? "g" : "r") + '">Konut endeksi ' + S.konutEndeks.toFixed(2) + '</span>' +
    '<span class="tag">' + muhasebe().ad + '</span></div>' +
    '<div class="heropara">' + fmtTam(S.nakit) + '</div>' +
    '<div class="herosat"><b style="color:' + (net >= 0 ? "var(--mint)" : "var(--red)") + '">' +
    (net >= 0 ? "▲ " : "▼ ") + fmt(Math.abs(net)) + '/gün</b> · net değer ' + fmt(ozVarlik()) + '</div>' +
    (S.nakitGecmis.length > 1 ? '<div class="herogrf">' + sparkSVG(S.nakitGecmis, "#38d08a") + '</div>' : '') +
    '<div class="g4" style="margin-top:11px">' +
    '<div class="mini"><span>Borç</span><b class="' + (borc ? "r" : "") + '">' + fmt(borc) + '</b></div>' +
    '<div class="mini"><span>Aylık kira</span><b class="g">' + fmt(kira + yidAy) + '</b></div>' +
    '<div class="mini"><span>Otel geliri</span><b class="g">' + fmt(otel) + '</b></div>' +
    '<div class="mini"><span>Aylık maaş</span><b class="r">' + fmt(aylikMaas()) + '</b></div>' +
    '</div></div>';

  sol += '<h2 class="sec">Devam eden projeler<span class="sag" data-act="tab" data-tab="proje">Tümü ›</span></h2>';
  sol += '<div class="kar">';
  for (const p of aktif.concat(satista).slice(0, 8)) sol += projeKart(p);
  sol += '<div class="yeni" data-act="tab" data-tab="arsa"><div class="art">+</div>' +
    '<b style="font-size:13.5px;color:var(--txt)">Yeni proje</b><small style="font-size:11.5px">Arsa seç</small></div>';
  sol += '</div>';

  if (isletme.length) {
    sol += '<h2 class="sec">İşletmedekiler</h2><div class="kar">';
    for (const p of isletme) sol += projeKart(p);
    sol += '</div>';
  }

  /* SAĞ SÜTUN */
  const gecikenN = gecikenOdemeler().length;
  let sag = '<h2 class="sec">Bugün</h2><div class="kutular">';
  sag += kutucuk("gold", "cark", "Şans çarkı", (S.toplamGun - S.carkGun < 5) ? ((5 - (S.toplamGun - S.carkGun)) + " gün sonra") : "Hazır", "cark");
  sag += kutucuk("purp", "bina", "Ofisim", OFISLER[S.ofisSeviye].ad, "tab", "sirket");
  sag += kutucuk(gecikenN ? "red" : "mint", "belge", "Ödemeler",
    S.odemeler.length ? (gecikenN ? gecikenN + " geciken · " + fmt(odemeToplam()) : S.odemeler.length + " bekleyen") : "Temiz", "tab", "odeme");
  sag += kutucuk("blue", "cekic", "İhaleler", S.ihaleler.length + " açık · teklif ver", "tab", "ihale");
  sag += kutucuk("mint", "banka", "Banka", borc ? "Borç " + fmt(borc) : "Borcun yok", "tab", "banka");
  sag += kutucuk("gold", "kisi", "Personel", toplamPersonel() + " kişi", "tab", "sirket");
  sag += kutucuk("blue", "grafik", "Piyasa", "Malzeme " + S.malzemeEndeks.toFixed(2), "tab", "piyasa");
  sag += kutucuk("purp", "kupa", "Başarımlar", (S.basarimlar.length) + "/" + BASARIMLAR.length, "tab", "sirket");
  sag += '</div>';
  sag += '<button class="cta" data-act="haritaya"><div>' +
    '<span>Türkiye · ' + S.acikIller.length + ' şehir açık</span><b>Arsaları keşfet</b></div><i>→</i></button>';

  const u = unvan();
  const ui = UNVANLAR.findIndex(x => x.ad === u.ad);
  const sonraki = UNVANLAR[ui + 1];
  sag += '<h2 class="sec">Şirket</h2><div class="card">' +
    '<div class="ct"><h3>' + u.ad + '</h3><span class="tag y">' + itibarToplam().toFixed(0) + ' itibar</span></div>';
  if (sonraki) {
    const pi = Math.min(1, (itibarToplam() / Math.max(1, sonraki.itibar) + S.bitenProje / Math.max(1, sonraki.proje)) / 2);
    sag += '<div class="bar g"><i style="width:' + (pi * 100).toFixed(0) + '%"></i></div>' +
      '<div class="sub">Sonraki: <b>' + sonraki.ad + '</b> — ' + sonraki.itibar + ' itibar, ' + sonraki.proje + ' biten proje</div>';
  }
  sag += '<div class="g2" style="margin-top:9px">' +
    '<div class="mini"><span>Biten proje</span><b>' + S.bitenProje + '</b></div>' +
    '<div class="mini"><span>Satılan birim</span><b>' + S.satilanDaire + '</b></div></div></div>';

  sag += '<h2 class="sec">Günlük</h2>';
  for (const l of S.log.slice(0, 8)) sag += '<div class="lg"><b>' + l.t + '</b>' + esc(l.m) + '</div>';

  return '<div class="iki"><div>' + sol + '</div><div>' + sag + '</div></div>';
}
function kutucuk(renk, ikon, bas, alt, act, tab) {
  return '<button class="kutu ' + renk + '" data-act="' + act + '"' + (tab ? ' data-tab="' + tab + '"' : '') + '>' +
    '<div class="ik">' + IK[ikon] + '</div><div><b>' + bas + '</b><small>' + esc(alt) + '</small></div></button>';
}

/* ---------- PROJE KARTI ---------- */
function projeKart(p) {
  let et = "", cls = "", alt = "";
  if (p.durum === "ruhsat") { et = "RUHSAT"; cls = "b"; }
  else if (p.durum === "insaat") { et = p.durduruldu ? "DURDU" : "ŞANTİYE"; cls = p.durduruldu ? "r" : "y"; }
  else if (p.durum === "satis") { et = "SATIŞTA"; cls = "g"; }
  else if (p.durum === "isletme") { et = p.tip === "avm" ? "AVM" : "OTEL"; cls = "p"; }
  else { et = "BİTTİ"; cls = ""; }
  if (p.durum === "ruhsat") alt = '<span>Ruhsat</span><b>' + (p.ruhsatGun || 0) + ' gün</b>';
  else if (p.durum === "insaat") {
    const aktifSay = Math.max(1, S.projeler.filter(x => x.durum === "insaat").length);
    const kalanGun = Math.ceil(p.kalanIs / Math.max(1, ekipKapasite() / AY_GUN / aktifSay));
    const kalanDk = Math.max(1, Math.round(kalanGun * GUN_MS / 60000));
    alt = '<span>%' + (p.ilerleme * 100).toFixed(0) + ' yapıldı</span><b>~' + kalanDk + ' dk kaldı</b>';
  } else if (p.durum === "satis") {
    const s = p.birimler.reduce((t, b) => t + b.satilan, 0), tp = p.birimler.reduce((t, b) => t + b.adet, 0);
    alt = '<span>' + s + '/' + tp + ' satıldı</span><b>' + fmt(p.gelir) + '</b>';
  } else if (p.durum === "isletme") {
    alt = '<span>Aylık</span><b>' + fmt(p.tip === "avm" ? (p.kiraAylik || 0) : (p.otelGelir || 0)) + '</b>';
  } else alt = '<span>Toplam</span><b>' + fmt(p.gelir) + '</b>';
  const oran = p.durum === "satis"
    ? (p.birimler.reduce((t, b) => t + b.satilan, 0) / Math.max(1, p.birimler.reduce((t, b) => t + b.adet, 0)))
    : p.ilerleme;
  return '<div class="pkart" data-act="proje" data-id="' + p.id + '">' +
    '<div class="sahne">' + sahneSVG(p) +
    '<div class="rozetust"><span class="tag ' + cls + '">' + et + '</span></div>' +
    (p.maketSatis && p.durum === "insaat" ? '<div class="rozetsag"><span class="tag g">MAKET</span></div>' : '') +
    '</div><div class="alt"><h4>' + esc(p.ad) + '</h4>' +
    '<div class="yer">' + p.ilce + ' · ' + Math.round(p.toplamM2).toLocaleString("tr-TR") + ' m²</div>' +
    '<div class="bar ince' + (p.durum === "satis" ? " g" : "") + '"><i style="width:' + (clamp(oran, 0, 1) * 100).toFixed(0) + '%"></i></div>' +
    '<div class="ilerleme">' + alt + '</div></div></div>';
}

/* ================= ÖDEMELER ================= */
function ekranOdeme() {
  const m = muhasebe();
  const geciken = gecikenOdemeler();
  let h = '<div class="iki"><div>';
  h += '<h2 class="sec">Bekleyen ödemeler<span class="sag">' + fmt(odemeToplam()) + '</span></h2>';
  if (!S.odemeler.length) {
    h += '<div class="empty"><b>✓</b>Bekleyen ödemen yok.<br>Maaş, kredi ve vergi her ayın 1\'inde tahakkuk eder.</div>';
  }
  for (const o of S.odemeler.slice().sort((a, b) => a.vade - b.vade)) {
    const kalan = o.vade - S.toplamGun;
    const gec = kalan < 0;
    const ikon = o.tur === "maas" ? "kisi" : o.tur === "kredi" ? "banka" : "belge";
    h += '<div class="card"><div class="ct">' +
      '<h3>' + esc(o.ad) + '</h3>' +
      '<span class="tag ' + (gec ? "r" : kalan <= 2 ? "y" : "") + '">' +
      (gec ? Math.abs(kalan) + " gün gecikti" : kalan + " gün kaldı") + '</span></div>' +
      '<div class="kv"><span>Tutar</span><b class="' + (gec ? "r" : "y") + '">' + fmtTam(o.tutar) + '</b></div>' +
      (o.zam > 0 ? '<div class="kv"><span>Gecikme zammı</span><b class="r">+' + fmtTam(o.zam) + '</b></div>' : '') +
      (o.kisi ? '<div class="kv"><span>Personel</span><b>' + o.kisi + ' kişi</b></div>' : '') +
      '<button class="btn' + (S.nakit < o.tutar ? ' sec' : '') + '" data-act="ode" data-id="' + o.id + '">' +
      (S.nakit < o.tutar ? 'Nakit yetersiz' : 'Öde') + '</button></div>';
  }
  if (S.odemeler.length > 1) h += '<button class="btn gr" data-act="odehepsi">Hepsini Öde · ' + fmt(odemeToplam()) + '</button>';

  h += '</div><div>';
  h += '<h2 class="sec">Muhasebe</h2>';
  h += '<div class="card"><div class="ct"><h3>' + m.ad + '</h3>' +
    '<span class="tag ' + (m.oto ? "g" : "r") + '">' + (m.oto ? "Otomatik" : "Elle") + '</span></div>' +
    '<div class="sub">' + m.aciklama + '</div>' +
    (m.maas ? '<div class="kv" style="margin-top:7px"><span>Aylık ücret</span><b>' + fmt(m.maas) + '</b></div>' : '') +
    '</div>';
  for (const x of MUHASEBE) {
    if (x.k === S.muhasebeci) continue;
    h += '<div class="card"><div class="ct"><h3>' + x.ad + '</h3>' +
      '<span class="tag ' + (x.maas ? "y" : "") + '">' + (x.maas ? fmt(x.maas) + '/ay' : 'ücretsiz') + '</span></div>' +
      '<div class="sub">' + x.aciklama + '</div>' +
      '<button class="btn sec" data-act="muhasebe" data-v="' + x.k + '">' +
      (x.k === 0 ? 'Muhasebeciyi bırak' : (x.k > S.muhasebeci ? 'Yükselt' : 'Geç')) + '</button></div>';
  }
  h += '<h2 class="sec">Gecikme Durumu</h2><div class="card">' +
    '<div class="kv"><span>Geciken ödeme</span><b class="' + (geciken.length ? "r" : "g") + '">' + geciken.length + '</b></div>' +
    '<div class="kv"><span>Gecikme zammı (aylık)</span><b>%' + (GECIKME_AYLIK * 100).toFixed(1) + '</b></div>' +
    '<div class="kv"><span>Bugüne kadar ödenen zam</span><b class="r">' + fmt(S.toplamGecikmeZammi || 0) + '</b></div>' +
    '<div class="kv"><span>Kredi puanı</span><b>' + S.krediPuani + '</b></div>' +
    '<div class="sub">Gecikirsen her gün zam işler, itibarın ve kredi puanın düşer. Maaş gecikirse ekip yavaşlar.</div></div>';
  h += '</div></div>';
  return h;
}

/* ================= ARSALAR ================= */
function ekranArsa() {
  if (!S.acikIller.includes(ARSA_IL)) ARSA_IL = S.acikIller[0];
  let h = '<div class="pills">' +
    '<button class="pill ' + (ARSA_GORUNUM === "harita" ? "on" : "") + '" data-act="agor" data-v="harita">🗺 Harita</button>' +
    '<button class="pill ' + (ARSA_GORUNUM === "liste" ? "on" : "") + '" data-act="agor" data-v="liste">☰ Arsa listesi</button>' +
    '</div>';
  if (ARSA_GORUNUM === "harita") return h + ekranHarita();
  h += '<div class="pills">';
  for (const ad of S.acikIller) h += '<button class="pill ' + (ad === ARSA_IL ? 'on' : '') + '" data-act="il" data-il="' + ad + '">' + ad + '</button>';
  h += '<button class="pill" data-act="sehirac">+ Şehir Aç</button></div>';

  if (S.arsalar.length) {
    h += '<h2 class="sec">Arsalarım<span class="sag">' + S.arsalar.length + ' parsel</span></h2><div class="arsagrid">';
    for (const a of S.arsalar) {
      h += '<div class="pkart"><div class="sahne">' + parselSVG(a) +
        '<div class="rozetust"><span class="tag ' + (a.kkAnlasma ? 'p' : 'g') + '">' +
        (a.kkAnlasma ? 'KAT KARŞILIĞI %' + a.kkPay : 'MÜLKİYET') + '</span></div></div>' +
        '<div class="alt"><h4>' + a.ilce + '</h4><div class="yer">' + a.il + ' · max ' + a.maxKat + ' kat</div>' +
        '<div class="brow"><button class="btn" data-act="tasarla" data-id="' + a.id + '">Proje Tasarla</button>' +
        '<button class="btn sec" data-act="arsasat" data-id="' + a.id + '" style="flex:0 0 42%">' +
        (a.kkAnlasma ? 'Bırak' : 'Sat') + '</button></div></div></div>';
    }
    h += '</div>';
  }

  const list = S.pazar[ARSA_IL] || [];
  const ort = list.length ? list.reduce((t, a) => t + a.fiyat / a.m2, 0) / list.length : 0;
  h += '<h2 class="sec">' + ARSA_IL + ' arsa pazarı<span class="sag">' + list.length + ' ilan</span></h2>';
  h += '<div class="card" style="padding:10px 12px"><div class="g4">' +
    '<div class="mini"><span>Ortalama</span><b class="y">' + fmtTam(ort) + '/m²</b></div>' +
    '<div class="mini"><span>Konut endeksi</span><b>' + S.konutEndeks.toFixed(2) + '</b></div>' +
    '<div class="mini"><span>Kat karşılığı</span><b>' + list.filter(a => a.katKarsiligi).length + ' arsa</b></div>' +
    '<div class="mini"><span>Pazar yenilenme</span><b>' + Math.max(0, 20 - (S.toplamGun - (S.pazarGun || 0))) + ' gün</b></div>' +
    '</div></div>';
  h += '<div class="arsagrid">';
  for (const a of list) {
    const insM2 = Math.min(a.m2 * a.emsal, a.m2 * a.taks * a.maxKat);
    h += '<div class="pkart" data-act="arsa" data-id="' + a.id + '"><div class="sahne">' + parselSVG(a) +
      '<div class="rozetust"><span class="tag ' + (a.katKarsiligi ? 'p' : 'y') + '">' +
      (a.katKarsiligi ? 'KAT KARŞILIĞI' : fmt(a.fiyat)) + '</span></div>' +
      (a.sahil ? '<div class="rozetsag"><span class="tag b">SAHİL</span></div>' : '') +
      '</div><div class="alt"><h4>' + a.ilce + ' · ' + a.m2.toLocaleString("tr-TR") + ' m²</h4>' +
      '<div class="yer">' + Math.round(insM2).toLocaleString("tr-TR") + ' m² inşaat hakkı</div>' +
      '<div class="ilerleme"><span>' + fmtTam(a.fiyat / a.m2) + '/m²</span><b>max ' + a.maxKat + ' kat</b></div>' +
      '</div></div>';
  }
  h += '</div>';
  if (!list.length) h += '<div class="empty"><b>🗺</b>Bu ilde şu an arsa yok.</div>';
  return h;
}

function ekranHarita() {
  const uIdx = UNVANLAR.findIndex(x => x.ad === unvan().ad);
  const kapali = ILLER.filter(i => !S.acikIller.includes(i.n));
  const acilabilir = kapali.filter(i => uIdx >= i.lv && S.nakit >= ilAcmaBedel(i.n));
  let h = '<div class="card haritakart">' + haritaSVG() + '</div>';
  h += '<div class="g4">' +
    '<div class="mini"><span>Açık şehir</span><b class="y">' + S.acikIller.length + ' / 81</b></div>' +
    '<div class="mini"><span>Şimdi açabileceğin</span><b class="g">' + acilabilir.length + ' il</b></div>' +
    '<div class="mini"><span>Seçili</span><b>' + ARSA_IL + '</b></div>' +
    '<div class="mini"><span>Unvan</span><b>' + unvan().ad + '</b></div></div>';
  h += '<div class="card" style="margin-top:10px"><div class="hlej">' +
    '<span><i class="d acik"></i>Açık — dokun, arsalarını gör</span>' +
    '<span><i class="d kapali"></i>Kapalı — bedelini ödeyip aç</span>' +
    '<span><i class="d kilit"></i>Unvan yetersiz</span>' +
    '</div></div>';
  if (acilabilir.length) {
    h += '<h2 class="sec">Şimdi açabileceklerin</h2><div class="arsagrid">';
    for (const i of acilabilir.sort((a, b) => ilAcmaBedel(a.n) - ilAcmaBedel(b.n)).slice(0, 6)) {
      h += '<div class="card"><div class="ct"><h3>' + i.n + '</h3><span class="tag y">' + fmt(ilAcmaBedel(i.n)) + '</span></div>' +
        '<div class="sub">' + i.d.length + ' ilçe · ort. konut ' + fmtTam(i.b) + '/m²</div>' +
        '<button class="btn" data-act="ilac" data-il="' + i.n + '">Şehri Aç</button></div>';
    }
    h += '</div>';
  }
  return h;
}

/* ================= PROJELER ================= */
function ekranProje() {
  const say = {
    aktif: S.projeler.filter(p => ["ruhsat", "insaat"].includes(p.durum)).length,
    satis: S.projeler.filter(p => p.durum === "satis").length,
    isletme: S.projeler.filter(p => p.durum === "isletme").length,
    bitti: S.projeler.filter(p => p.durum === "tamam").length
  };
  const f = [["aktif", "İnşaatta"], ["satis", "Satışta"], ["isletme", "İşletmede"], ["bitti", "Bitti"], ["tum", "Tümü"]];
  let h = '<div class="pills">';
  for (const x of f) {
    const n = x[0] === "tum" ? S.projeler.length : say[x[0]];
    h += '<button class="pill ' + (PROJE_FILTRE === x[0] ? 'on' : '') + '" data-act="pfiltre" data-v="' + x[0] + '">' +
      x[1] + '<small>' + n + '</small></button>';
  }
  h += '</div>';
  let liste = S.projeler;
  if (PROJE_FILTRE === "aktif") liste = S.projeler.filter(p => ["ruhsat", "insaat"].includes(p.durum));
  else if (PROJE_FILTRE !== "tum") liste = S.projeler.filter(p => p.durum === (PROJE_FILTRE === "bitti" ? "tamam" : PROJE_FILTRE));
  if (!liste.length) return h + '<div class="empty"><b>🏗</b>Bu başlıkta proje yok.</div>';
  h += '<div class="arsagrid">';
  for (const p of liste) h += projeKart(p);
  h += '</div>';
  return h;
}

/* ================= İHALELER ================= */
function ekranIhale() {
  let h = '<div class="card"><div class="sub">Kamu ihalelerinde rakiplerin altına teklif vermelisin; yaklaşık maliyeti aşarsan elenirsin, maliyetinin altına inersen zarar edersin. Yap-işlet-devret projeleri bitince yıllarca aylık gelir getirir.</div></div>';
  if (!S.ihaleler.length) h += '<div class="empty"><b>📋</b>Şu an açık ihale yok.</div>';
  h += '<div class="arsagrid">';
  for (const ih of S.ihaleler) {
    h += '<div class="pkart" data-act="ihale" data-id="' + ih.id + '"><div class="alt">' +
      '<div class="ct"><h3>' + ih.ad + '</h3><span class="tag ' + (ih.yid ? 'p' : 'b') + '">' + (ih.yid ? 'YİD' : 'KAMU') + '</span></div>' +
      '<div class="yer">' + ih.ilce + ' / ' + ih.il + ' · ' + ih.m2.toLocaleString("tr-TR") + ' m² · ' + ih.sure + ' ay</div>' +
      '<div class="kv" style="margin-top:7px"><span>Yaklaşık maliyet</span><b class="y">' + fmt(ih.yaklasikMaliyet) + '</b></div>' +
      '<div class="kv"><span>Senin maliyetin</span><b>' + fmt(ih.tahminMaliyet) + '</b></div>' +
      '<div class="kv"><span>Rakip firma</span><b>' + ih.rakip + '</b></div>' +
      (ih.yid ? '<div class="kv"><span>YİD geliri</span><b class="p">' + fmt(ih.yidAylik) + ' × ' + ih.yidSure + ' ay</b></div>' : '') +
      '<div class="kv"><span>Son teklif</span><b>' + Math.max(0, ih.sonGun - S.toplamGun) + ' gün</b></div>' +
      '<button class="btn">Teklif Ver</button></div></div>';
  }
  h += '</div>';
  const biten = S.projeler.filter(p => p.tip === "ihale" && p.durum === "tamam");
  if (biten.length) {
    h += '<h2 class="sec">Tamamlananlar</h2>';
    for (const p of biten.slice(-6)) h += '<div class="card"><div class="ct"><h3>' + esc(p.ad) + '</h3><span class="tag g">' + fmt(p.gelir) + '</span></div></div>';
  }
  return h;
}

/* ================= PİYASA ================= */
function ekranPiyasa() {
  let h = '<div class="iki"><div>';
  h += '<h2 class="sec">Malzeme piyasası</h2>';
  h += '<div class="card"><div class="sub">Toptan alırsan %6 indirim. Şantiyede stok yoksa malzeme spot fiyattan %12 zamlı alınır — fiyat düşükken stoklamak maliyeti ciddi düşürür.</div></div>';
  h += '<div class="arsagrid">';
  for (const m of MALZEMELER) {
    const birim = m.fiyat * S.malzemeEndeks;
    const stok = S.stok[m.k] || 0;
    const ihtiyac = S.projeler.filter(p => p.durum === "insaat")
      .reduce((t, p) => t + m.m2 * p.toplamM2 * (1 - p.ilerleme) * (p.kalite ? kalite(p.kalite).malzemeCarpan : 1), 0);
    const yeterli = stok >= ihtiyac;
    h += '<div class="card"><div class="ct"><h3>' + m.ad + '</h3>' +
      '<span class="tag y">' + fmtTam(birim * 0.94) + '</span></div>' +
      '<div class="kv"><span>Stok</span><b class="' + (yeterli ? 'g' : '') + '">' + Math.round(stok).toLocaleString("tr-TR") + ' ' + m.birim + '</b></div>' +
      '<div class="kv"><span>İhtiyaç</span><b class="' + (yeterli ? '' : 'r') + '">' + Math.round(ihtiyac).toLocaleString("tr-TR") + ' ' + m.birim + '</b></div>' +
      '<div class="bar' + (yeterli ? ' g' : '') + '"><i style="width:' + clamp(ihtiyac ? stok / ihtiyac * 100 : 100, 0, 100).toFixed(0) + '%"></i></div>' +
      '<div class="brow"><button class="btn sec" data-act="malal" data-k="' + m.k + '">Al</button>' +
      '<button class="btn sec" data-act="malsat" data-k="' + m.k + '">Sat</button></div></div>';
  }
  h += '</div></div><div>';
  h += '<h2 class="sec">Endeksler</h2><div class="card"><div class="g2">' +
    '<div class="mini"><span>Konut</span><b class="' + (S.konutEndeks >= 1 ? 'g' : 'r') + '">' + S.konutEndeks.toFixed(3) + '</b></div>' +
    '<div class="mini"><span>Malzeme</span><b class="' + (S.malzemeEndeks <= 1 ? 'g' : 'r') + '">' + S.malzemeEndeks.toFixed(3) + '</b></div>' +
    '<div class="mini"><span>Maliyet</span><b>' + S.maliyetEndeks.toFixed(3) + '</b></div>' +
    '<div class="mini"><span>Aylık faiz</span><b class="y">%' + (S.faiz * 100).toFixed(2) + '</b></div>' +
    '</div><div class="sub">Konut endeksi yükselince satış fiyatların artar; malzeme endeksi yükselince inşaat maliyetin artar.</div></div>';
  const stokDeger = MALZEMELER.reduce((t, m) => t + (S.stok[m.k] || 0) * m.fiyat * S.malzemeEndeks, 0);
  h += '<h2 class="sec">Stok değeri</h2><div class="card">' +
    '<div class="heropara" style="font-size:24px">' + fmt(stokDeger) + '</div>' +
    '<div class="sub">Depodaki malzemenin güncel piyasa değeri.</div></div>';
  h += '</div></div>';
  return h;
}

/* ================= BANKA ================= */
function ekranBanka() {
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const limit = Math.max(0, krediLimit() - borc);
  const durum = S.krediPuani >= 1500 ? "Çok iyi" : S.krediPuani >= 1200 ? "İyi" : S.krediPuani >= 900 ? "Orta" : "Riskli";
  let h = '<div class="iki"><div>';
  h += '<h2 class="sec">Kredilerin</h2>';
  if (!S.krediler.length) h += '<div class="empty"><b>✓</b>Hiç kredi borcun yok.</div>';
  for (const k of S.krediler) {
    const odenen = 1 - k.kalan / (k.anapara * Math.pow(1 + k.faiz, k.vade / 12));
    h += '<div class="card"><div class="ct"><h3>' + fmt(k.anapara) + (k.acil ? ' · acil' : '') + '</h3>' +
      '<span class="tag r">' + fmt(k.kalan) + ' kalan</span></div>' +
      '<div class="bar b"><i style="width:' + clamp(odenen * 100, 0, 100).toFixed(0) + '%"></i></div>' +
      '<div class="kv"><span>Taksit</span><b>' + fmt(k.taksit) + ' × ' + k.kalanVade + ' ay</b></div>' +
      '<div class="kv"><span>Aylık faiz</span><b>%' + (k.faiz * 100).toFixed(2) + '</b></div>' +
      '<button class="btn sec" data-act="kredikapat" data-id="' + k.id + '">Erken Kapat · ' + fmt(k.kalan * 0.96) + '</button></div>';
  }
  h += '<button class="btn" data-act="kredial">Yeni Kredi Çek</button>';
  h += '</div><div>';
  h += '<h2 class="sec">Kredi puanı</h2><div class="card">' + gostergeSVG(S.krediPuani) +
    '<div style="text-align:center;margin-top:-6px"><div class="heropara" style="font-size:30px">' + S.krediPuani + '</div>' +
    '<span class="tag ' + (S.krediPuani >= 1200 ? 'g' : S.krediPuani >= 900 ? 'y' : 'r') + '">' + durum + '</span></div>' +
    '<div class="kv" style="margin-top:11px"><span>Zamanında ödeme</span><b class="g">+6</b></div>' +
    '<div class="kv"><span>Gecikme</span><b class="r">her 5 günde −12</b></div>' +
    '<div class="kv"><span>Erken kapatma</span><b class="g">+40</b></div></div>';
  h += '<h2 class="sec">Finansman</h2><div class="card">' +
    '<div class="kv"><span>Toplam borç</span><b class="r">' + fmt(borc) + '</b></div>' +
    '<div class="kv"><span>Kullanılabilir limit</span><b class="g">' + fmt(limit) + '</b></div>' +
    '<div class="kv"><span>Öz varlık</span><b>' + fmt(ozVarlik()) + '</b></div>' +
    '<div class="kv"><span>Muhasebe faiz indirimi</span><b>%' + (muhasebe().faizIndirim * 100).toFixed(0) + '</b></div>' +
    '</div>';
  h += '</div></div>';
  return h;
}

/* ================= ŞİRKET ================= */
function ekranSirket() {
  let h = '<div class="iki"><div>';
  h += '<h2 class="sec">Ekip<span class="sag">' + Math.round(ekipKapasite()).toLocaleString("tr-TR") + ' m²/ay kapasite</span></h2>';
  h += '<div class="card"><div class="g3">' +
    '<div class="mini"><span>Kapasite</span><b class="y">' + Math.round(ekipKapasite()).toLocaleString("tr-TR") + ' m²</b></div>' +
    '<div class="mini"><span>Kalite puanı</span><b class="' + (ekipKalite() >= 0.8 ? 'g' : 'r') + '">' + ekipKalite().toFixed(2) + '</b></div>' +
    '<div class="mini"><span>Aylık bordro</span><b class="r">' + fmt(aylikMaas()) + '</b></div>' +
    '</div>' + (S.maasGecikti ? '<div class="sub" style="color:var(--red)">Maaşlar gecikti — ekip yavaş çalışıyor.</div>' : '') + '</div>';
  h += '<div class="arsagrid">';
  for (const p of PERSONEL) {
    h += '<div class="card"><div class="ct"><h3>' + p.ad + '</h3><span class="tag">' + (S.personel[p.k] || 0) + ' kişi</span></div>' +
      '<div class="kv"><span>Maaş</span><b>' + fmt(p.maas) + '</b></div>' +
      '<div class="kv"><span>Kapasite</span><b>' + p.kapasite + ' m²/ay</b></div>' +
      '<div class="brow"><button class="btn sec" data-act="pal" data-k="' + p.k + '">+1</button>' +
      '<button class="btn sec" data-act="pal5" data-k="' + p.k + '">+5</button>' +
      '<button class="btn sec" data-act="pcik" data-k="' + p.k + '">−1</button></div></div>';
  }
  h += '<div class="card"><div class="ct"><h3>Satış Danışmanı</h3><span class="tag">' + S.satisDanismani + ' kişi</span></div>' +
    '<div class="kv"><span>Maaş</span><b>' + fmt(45000) + '</b></div>' +
    '<div class="kv"><span>Etki</span><b class="g">+%17 satış hızı</b></div>' +
    '<div class="brow"><button class="btn sec" data-act="sdal">+1</button>' +
    '<button class="btn sec" data-act="sdcik">−1</button></div></div>';
  h += '<div class="card"><div class="ct"><h3>Satış Ofisi</h3><span class="tag ' + (S.satisOfisi ? 'g' : '') + '">' +
    (S.satisOfisi ? 'Açık' : 'Kapalı') + '</span></div>' +
    '<div class="kv"><span>Kuruluş / aylık</span><b>' + fmt(500000) + ' · ' + fmt(85000) + '</b></div>' +
    '<div class="kv"><span>Etki</span><b class="g">+%22 satış hızı</b></div>' +
    '<button class="btn sec" data-act="satisofis">' + (S.satisOfisi ? 'Kapat' : 'Aç') + '</button></div>';
  h += '</div>';

  h += '<h2 class="sec">İş makineleri</h2><div class="arsagrid">';
  for (const m of MAKINELER) {
    const v = S.makineler.includes(m.k);
    h += '<div class="card"><div class="ct"><h3>' + m.ad + '</h3><span class="tag ' + (v ? 'g' : 'y') + '">' + (v ? 'Sahipsin' : fmt(m.fiyat)) + '</span></div>' +
      '<div class="kv"><span>Kapasite</span><b class="g">+' + m.kapasite + ' m²/ay</b></div>' +
      '<div class="kv"><span>Bakım</span><b>' + fmt(m.bakim) + '/ay</b></div>' +
      (v ? '<button class="btn sec" data-act="makinesat" data-k="' + m.k + '">Sat · ' + fmt(m.fiyat * 0.68) + '</button>'
        : '<button class="btn sec" data-act="makal" data-k="' + m.k + '">Satın Al</button>') + '</div>';
  }
  h += '</div>';

  h += '</div><div>';
  const o = OFISLER[S.ofisSeviye];
  h += '<h2 class="sec">Ofis</h2><div class="card"><div class="ct"><h3>' + o.ad + '</h3>' +
    '<span class="tag y">Seviye ' + (S.ofisSeviye + 1) + '/' + OFISLER.length + '</span></div>' +
    '<div class="kv"><span>Aylık gider</span><b>' + fmt(o.gider) + '</b></div>' +
    '<div class="kv"><span>İtibar</span><b class="g">+' + o.itibar + '</b></div>' +
    '<div class="kv"><span>Kapasite bonusu</span><b class="g">+%' + (o.kapasiteBonus * 100).toFixed(0) + '</b></div>' +
    (S.ofisSeviye < OFISLER.length - 1
      ? '<button class="btn" data-act="ofis">' + OFISLER[S.ofisSeviye + 1].ad + ' · ' + fmt(OFISLER[S.ofisSeviye + 1].fiyat) + '</button>' : '') +
    '</div>';

  if (S.nakitGecmis && S.nakitGecmis.length > 1) {
    h += '<h2 class="sec">Öz varlık</h2><div class="card">' +
      '<div class="heropara" style="font-size:24px">' + fmt(ozVarlik()) + '</div>' +
      '<div class="herogrf" style="height:56px">' + sparkSVG(S.nakitGecmis, "#f5b63d") + '</div>' +
      '<div class="sub">Her ay sonunda kaydedilir.</div></div>';
  }

  h += '<h2 class="sec">Sponsorluk</h2>';
  for (const p of SPONSORLUK) {
    const on = S.sponsorluklar.includes(p.k);
    h += '<div class="card"><div class="ct"><h3>' + p.ad + '</h3><span class="tag ' + (on ? 'g' : '') + '">' +
      (on ? 'Aktif' : fmt(p.gider) + '/ay') + '</span></div>' +
      '<div class="kv"><span>Aylık itibar</span><b class="g">+' + p.itibar + '</b></div>' +
      '<button class="btn sec" data-act="spon" data-k="' + p.k + '">' + (on ? 'Bitir' : 'Başlat') + '</button></div>';
  }

  h += '<h2 class="sec">Koleksiyon</h2>';
  for (const k of KOLEKSIYON) {
    const v = S.koleksiyon.includes(k.k);
    h += '<div class="card"><div class="ct"><h3>' + k.ad + '</h3><span class="tag ' + (v ? 'g' : 'y') + '">' + (v ? 'Sahipsin' : fmt(k.fiyat)) + '</span></div>' +
      '<div class="kv"><span>İtibar</span><b class="g">+' + k.itibar + '</b></div>' +
      (v ? '<button class="btn sec" data-act="kolsat" data-k="' + k.k + '">Sat · ' + fmt(k.fiyat * 0.84) + '</button>'
        : '<button class="btn sec" data-act="kolal" data-k="' + k.k + '">Satın Al</button>') + '</div>';
  }

  h += '<h2 class="sec">Başarımlar<span class="sag">' + S.basarimlar.length + '/' + BASARIMLAR.length + '</span></h2><div class="card">';
  for (const b of BASARIMLAR) {
    const on = S.basarimlar.includes(b.k);
    h += '<div class="bsr ' + (on ? 'on' : '') + '"><div class="ik">' + (on ? '★' : '☆') + '</div>' +
      '<div><b>' + b.ad + '</b><small>' + b.aciklama + '</small></div></div>';
  }
  h += '</div>';

  h += '<h2 class="sec">Kayıt & sürüm</h2><div class="card">' +
    '<div class="sub">Oyun otomatik kaydedilir, internet gerekmez.</div>' +
    (nativeVar() ? '<div class="kv" style="margin-top:7px"><span>Uygulama</span><b>' + esc(Android.surum()) + '</b></div>' : '') +
    (nativeVar() && Android.guncellemeAcikMi() ? '<button class="btn sec" data-act="g_kontrol">Güncelleme Denetle</button>' : '') +
    '<button class="btn sec" data-act="yenioyun">Yeni Oyuna Başla</button></div>';
  h += '</div></div>';
  return h;
}

/* ================= PANELLER ================= */
function sheetArsa(id) {
  let a = null;
  for (const k in S.pazar) { const f = S.pazar[k].find(x => x.id === id); if (f) a = f; }
  if (!a) return;
  const sM2 = satisM2(a.il, a.ilce, "standart", a.imar);
  const insM2 = Math.min(a.m2 * a.emsal, a.m2 * a.taks * a.maxKat);
  const hasilat = insM2 * 0.8 * sM2, maliyet = insM2 * insaatM2TL("standart");
  let b = '<div class="card" style="padding:0;overflow:hidden"><div style="height:120px">' + parselSVG(a) + '</div></div>' +
    '<div class="card"><div class="ct"><h3>' + a.ilce + ' / ' + a.il + '</h3><span class="tag y">' + a.imarAd + '</span></div>' +
    '<div class="g4" style="margin-top:9px">' +
    '<div class="mini"><span>Alan</span><b>' + a.m2.toLocaleString("tr-TR") + ' m²</b></div>' +
    '<div class="mini"><span>Emsal</span><b>' + a.emsal + '</b></div>' +
    '<div class="mini"><span>TAKS</span><b>' + a.taks + '</b></div>' +
    '<div class="mini"><span>Max kat</span><b>' + a.maxKat + '</b></div></div>' +
    '<div class="kv" style="margin-top:9px"><span>İnşaat hakkı</span><b>' + Math.round(insM2).toLocaleString("tr-TR") + ' m²</b></div>' +
    '<div class="kv"><span>Satılabilir alan</span><b>' + Math.round(insM2 * 0.8).toLocaleString("tr-TR") + ' m²</b></div></div>' +
    '<div class="card"><h3 style="font-size:14px;margin-bottom:7px">Standart kalite ön hesap</h3>' +
    '<div class="kv"><span>Bölge konut m²</span><b>' + fmtTam(sM2) + '</b></div>' +
    '<div class="kv"><span>Tahmini hasılat</span><b class="g">' + fmt(hasilat) + '</b></div>' +
    '<div class="kv"><span>İnşaat maliyeti</span><b class="r">' + fmt(maliyet) + '</b></div>' +
    '<div class="kv"><span>Arsa bedeli</span><b class="r">' + fmt(a.fiyat) + '</b></div>' +
    '<div class="kv"><span>Kaba kâr</span><b class="' + (hasilat - maliyet - a.fiyat > 0 ? 'g' : 'r') + '">' + fmt(hasilat - maliyet - a.fiyat) + '</b></div></div>';
  if (a.katKarsiligi) {
    b += '<div class="card"><h3 style="font-size:14px">Kat karşılığı</h3>' +
      '<div class="sub">Arsa sahibi dairelerin <b>%' + a.kkPay + '</b>\'ini istiyor. Nakit ödemezsin.</div>' +
      '<label class="fl">Karşı teklifin</label>' +
      '<input type="range" id="kkr" min="10" max="' + a.kkPay + '" value="' + Math.max(10, a.kkPay - 8) + '">' +
      '<div class="rv"><span>%10</span><b id="kkv">%' + Math.max(10, a.kkPay - 8) + '</b><span>%' + a.kkPay + '</span></div>' +
      '<button class="btn sec" data-act="kkteklif" data-id="' + a.id + '">Pazarlık Et</button></div>';
  }
  const ov = sheet(a.ilce + " Arsası", b,
    '<button class="btn" data-act="arsaal" data-id="' + a.id + '">' + fmt(a.fiyat) + ' — Peşin Satın Al</button>');
  const r = ov.querySelector("#kkr");
  if (r) r.oninput = () => ov.querySelector("#kkv").textContent = "%" + r.value;
}

function sheetSehirDetay(ad) {
  const i = il(ad); if (!i) return;
  const uIdx = UNVANLAR.findIndex(x => x.ad === unvan().ad);
  const kilit = uIdx < i.lv;
  const bedel = ilAcmaBedel(ad);
  const ucuz = i.d.slice().sort((a, b) => a[1] - b[1])[0];
  const pahali = i.d.slice().sort((a, b) => b[1] - a[1])[0];
  const b = '<div class="card"><div class="ct"><h3>' + ad + '</h3>' +
    '<span class="tag ' + (kilit ? "r" : "y") + '">' + fmt(bedel) + '</span></div>' +
    '<div class="g4" style="margin-top:9px">' +
    '<div class="mini"><span>İlçe</span><b>' + i.d.length + '</b></div>' +
    '<div class="mini"><span>Ortalama konut</span><b>' + fmtTam(i.b) + '/m²</b></div>' +
    '<div class="mini"><span>En pahalı</span><b>' + pahali[0] + '</b></div>' +
    '<div class="mini"><span>En uygun</span><b>' + ucuz[0] + '</b></div></div>' +
    (kilit ? '<div class="sub" style="color:var(--red);margin-top:9px">Bu il için en az <b>' + UNVANLAR[i.lv].ad + '</b> unvanı gerekiyor.</div>'
      : '<div class="sub" style="margin-top:9px">Şehri açınca ' + i.d.length + ' ilçedeki arsalar pazarına girer ve itibarın biraz artar.</div>') +
    '</div>' +
    '<h2 class="sec">İlçeler</h2><div class="card"><div>' +
    i.d.slice().sort((a, b) => b[1] - a[1]).map(d =>
      '<span class="chip">' + d[0] + ' · ' + fmtTam(i.b * Math.pow(d[1], 0.62)) + '</span>').join("") +
    '</div></div>';
  sheet(ad, b, kilit ? '' : '<button class="btn" data-act="ilac" data-il="' + ad + '">Şehri Aç · ' + fmt(bedel) + '</button>');
}

function sheetSehir() {
  const kapali = ILLER.filter(i => !S.acikIller.includes(i.n)).sort((a, b) => ilAcmaBedel(a.n) - ilAcmaBedel(b.n));
  const uIdx = UNVANLAR.findIndex(x => x.ad === unvan().ad);
  let b = '<div class="sub" style="margin-bottom:11px">Yeni şehir açınca o ilin tüm ilçelerindeki arsalar pazarına girer.</div><div class="arsagrid">';
  for (const i of kapali) {
    const bedel = ilAcmaBedel(i.n), kilit = uIdx < i.lv;
    b += '<div class="card"><div class="ct"><h3>' + i.n + '</h3><span class="tag ' + (kilit ? 'r' : 'y') + '">' + fmt(bedel) + '</span></div>' +
      '<div class="sub">' + i.d.length + ' ilçe · ort. konut ' + fmtTam(i.b) + '/m²' + (kilit ? ' · 🔒 ' + UNVANLAR[i.lv].ad : '') + '</div>' +
      '<button class="btn' + (kilit || S.nakit < bedel ? ' sec' : '') + '" data-act="ilac" data-il="' + i.n + '"' + (kilit ? ' disabled' : '') + '>' +
      (kilit ? 'Unvan yetersiz' : 'Şehri Aç') + '</button></div>';
  }
  b += '</div>';
  sheet("Şehir Aç · " + kapali.length + " kapalı il", b);
}

function sheetTasarla(arsaId) {
  const a = S.arsalar.find(x => x.id === arsaId); if (!a) return;
  const tipler = uygunTipler(a);
  TASARIM = {
    arsa: a, tip: tipler[0].k, kat: Math.min(a.maxKat, Math.max(2, Math.ceil(a.emsal / a.taks))),
    kalite: "standart", karma: "dengeli", donatilar: [], yildiz: 4,
    katKarsiligi: !!a.kkAnlasma, ad: a.ilce + " " + tipler[0].ad
  };
  const ov = sheet("Proje Tasarımı", '<div id="tsr"></div>',
    '<button class="btn" data-act="projebaslat">Ruhsat Başvurusu Yap</button>');
  cizTasarim(ov);
}
function uygunTipler(a) {
  const t = PROJE_TIPLERI.filter(t => a.m2 >= t.min && (t.k !== "otel" || a.sahil) &&
    (t.k !== "villa" || a.imar === "villa" || a.emsal <= 1.0) && (t.k !== "avm" || a.imar === "ticari"));
  return t.length ? t : [PROJE_TIPLERI[0]];
}
function cizTasarim(ov) {
  const c = TASARIM, a = c.arsa, h = projeHesap(c);
  const tipler = uygunTipler(a);
  let b = '<div class="iki"><div>';
  b += '<label class="fl">Proje adı</label><input type="text" id="pad" value="' + esc(c.ad) + '">';
  b += '<label class="fl">Proje tipi</label><div>';
  for (const t of tipler) b += '<span class="chip ' + (c.tip === t.k ? 'on' : '') + '" data-act="t_tip" data-v="' + t.k + '">' + t.ad + '</span>';
  b += '</div>';
  b += '<label class="fl">Kat sayısı · ' + c.kat + ' kat</label>' +
    '<input type="range" id="pkat" min="1" max="' + a.maxKat + '" value="' + c.kat + '">' +
    '<div class="rv"><span>1</span><span>emsal sınırı ' + Math.round(a.m2 * a.emsal).toLocaleString("tr-TR") + ' m²</span><span>' + a.maxKat + '</span></div>';
  b += '<label class="fl">Malzeme kalitesi</label><div>';
  for (const k of KALITELER) b += '<span class="chip ' + (c.kalite === k.k ? 'on' : '') + '" data-act="t_kal" data-v="' + k.k + '">' + k.ad + '</span>';
  b += '</div>';
  if (c.tip === "otel") {
    b += '<label class="fl">Yıldız</label><div>';
    for (let y = 3; y <= 5; y++) b += '<span class="chip ' + (c.yildiz === y ? 'on' : '') + '" data-act="t_yil" data-v="' + y + '">' + y + ' Yıldız</span>';
    b += '</div>';
  } else if (c.tip !== "avm") {
    b += '<label class="fl">Daire planı</label><div>';
    for (const k of KARMALAR) b += '<span class="chip ' + (c.karma === k.k ? 'on' : '') + '" data-act="t_krm" data-v="' + k.k + '">' + k.ad + '</span>';
    b += '</div>';
  }
  b += '<label class="fl">Sosyal donatılar</label>';
  for (const d of DONATILAR) {
    const on = c.donatilar.includes(d.k);
    const mal = d.sabit ? d.sabit : d.m2Maliyet * h.toplamM2;
    b += '<div class="cbl ' + (on ? 'on' : '') + '" data-act="t_don" data-v="' + d.k + '"><div class="ci">' + (on ? '✓' : '') + '</div>' +
      '<div><b>' + d.ad + '</b><small>+' + (d.satis * 100).toFixed(1) + '% fiyat · +' + (d.talep * 100).toFixed(0) + '% talep</small></div>' +
      '<span class="tag">' + fmt(mal) + '</span></div>';
  }
  b += '</div><div>';
  b += '<div class="card" style="padding:0;overflow:hidden"><div style="height:128px">' +
    sahneSVG({ id: "onizleme", durum: "insaat", ilerleme: 0.62, kat: c.kat, kalite: c.kalite, tip: c.tip, toplamM2: h.toplamM2 }) + '</div></div>';
  b += '<div class="card" style="border-color:var(--gold)"><h3 style="font-size:14px;margin-bottom:8px">Maliyet ve kâr</h3>' +
    '<div class="g2">' +
    '<div class="mini"><span>İnşaat alanı</span><b>' + Math.round(h.toplamM2).toLocaleString("tr-TR") + ' m²</b></div>' +
    '<div class="mini"><span>Satılabilir</span><b>' + Math.round(h.satilabilirM2).toLocaleString("tr-TR") + ' m²</b></div></div>' +
    '<div class="kv" style="margin-top:8px"><span>Arsa</span><b>' + (c.katKarsiligi ? 'kat karşılığı %' + a.kkPay : fmt(h.arsaMaliyet)) + '</b></div>' +
    '<div class="kv"><span>İnşaat</span><b>' + fmt(h.insaatMaliyet) + '</b></div>' +
    '<div class="kv"><span>Donatı</span><b>' + fmt(h.donatiMaliyet) + '</b></div>' +
    '<div class="kv"><span>Ruhsat harcı (peşin)</span><b class="y">' + fmt(h.ruhsatHarc) + '</b></div>' +
    '<div class="kv"><span>Toplam maliyet</span><b class="r">' + fmt(h.maliyet) + '</b></div>' +
    '<div class="kv"><span>' + (c.tip === "avm" ? '9 yıl kira' : c.tip === "otel" ? '8 yıl net' : 'Hasılat') + '</span><b class="g">' + fmt(h.hasilat) + '</b></div>' +
    '<div class="kv"><span>Kâr</span><b class="' + (h.kar > 0 ? 'g' : 'r') + '">' + fmt(h.kar) + ' · %' + (h.maliyet ? (h.kar / h.maliyet * 100).toFixed(0) : 0) + '</b></div>' +
    '<div class="kv"><span>Süre</span><b>' + h.sureGun + ' gün · ~' + h.sureDk + ' dk</b></div></div>';
  if (h.birimler.length) {
    b += '<div class="card"><h3 style="font-size:14px;margin-bottom:6px">Birimler</h3>';
    for (const x of h.birimler) b += '<div class="kv"><span>' + x.tip + ' · ' + x.m2 + ' m²</span><b>' + x.adet + ' adet · ' + fmt(x.birimFiyat) + '</b></div>';
    b += '</div>';
  }
  b += '</div></div>';
  ov.querySelector("#tsr").innerHTML = b;
  const kat = ov.querySelector("#pkat");
  kat.oninput = () => { TASARIM.kat = +kat.value; cizTasarim(ov); };
  ov.querySelector("#pad").oninput = e => { TASARIM.ad = e.target.value; };
}

function sheetProje(id) {
  const p = S.projeler.find(x => x.id === id); if (!p) return;
  const durumAd = { ruhsat: "Ruhsat bekleniyor · " + (p.ruhsatGun || 0) + " gün", insaat: "İnşaat", satis: "Satışta", isletme: "İşletmede", tamam: "Tamamlandı" }[p.durum];
  let b = '<div class="iki"><div>';
  b += '<div class="card" style="padding:0;overflow:hidden"><div style="height:132px">' + sahneSVG(p) + '</div></div>';
  b += '<div class="card"><div class="ct"><h3>' + esc(p.ad) + '</h3><span class="tag y">' + p.ilce + '</span></div>' +
    '<div class="sub">' + durumAd + '</div>' +
    '<div class="bar' + (p.durum === "satis" ? " g" : "") + '"><i style="width:' + (p.ilerleme * 100).toFixed(0) + '%"></i></div>' +
    '<div class="g2" style="margin-top:9px">' +
    '<div class="mini"><span>İnşaat alanı</span><b>' + Math.round(p.toplamM2).toLocaleString("tr-TR") + ' m²</b></div>' +
    (p.kalite ? '<div class="mini"><span>Kalite</span><b>' + kalite(p.kalite).ad + '</b></div>' : '') +
    '<div class="mini"><span>Harcanan</span><b class="r">' + fmt(p.harcanan) + '</b></div>' +
    '<div class="mini"><span>Tahsilat</span><b class="g">' + fmt(p.gelir) + '</b></div>' +
    '</div>' +
    (p.kkPay ? '<div class="kv"><span>Arsa sahibi payı</span><b>%' + p.kkPay + '</b></div>' : '') +
    (p.kusur ? '<div class="kv"><span>Kusur kaydı</span><b class="r">' + p.kusur + '</b></div>' : '') + '</div>';
  if (p.donatilar && p.donatilar.length) {
    b += '<div class="card"><h3 style="font-size:14px;margin-bottom:7px">Donatılar</h3><div>';
    for (const d of p.donatilar) b += '<span class="chip on">' + DONATILAR.find(x => x.k === d).ad + '</span>';
    b += '</div></div>';
  }
  b += '</div><div>';
  if (p.birimler && p.birimler.length) {
    b += '<div class="card"><h3 style="font-size:14px;margin-bottom:6px">Birimler</h3>';
    for (const x of p.birimler) {
      const o = x.adet ? x.satilan / x.adet : 0;
      b += '<div class="kv"><span>' + x.tip + '</span><b>' + x.satilan + '/' + x.adet + ' · ' + fmt(x.fiyat * p.fiyatAyar) + '</b></div>' +
        '<div class="bar ince g"><i style="width:' + (o * 100).toFixed(0) + '%"></i></div>';
    }
    b += '</div>';
  }
  if (p.durum === "satis" || p.durum === "isletme" || (p.durum === "insaat" && p.maketSatis)) {
    const tl = projeTalep(p);
    b += '<div class="card"><h3 style="font-size:14px">Fiyat politikası</h3>' +
      '<div class="sub">Düşürürsen hızlı satarsın, yükseltirsen kâr artar ama yavaşlar.</div>' +
      '<label class="fl">Fiyat ayarı · %' + Math.round(p.fiyatAyar * 100) + '</label>' +
      '<input type="range" id="pfy" min="70" max="140" value="' + Math.round(p.fiyatAyar * 100) + '">' +
      '<div class="rv"><span>%70 hızlı</span><span>%140 kârlı</span></div>' +
      '<div class="kv"><span>Satış hızı</span><b>' + (tl / 30).toFixed(2) + ' birim/gün</b></div></div>';
  }
  if (p.durum === "insaat" && !p.maketSatis && !["ihale", "avm", "otel"].includes(p.tip))
    b += '<button class="btn sec" data-act="maket" data-id="' + p.id + '">Maketten Satışa Aç · %12 indirim</button>';
  if (p.tip === "ihale") {
    b += '<div class="card"><div class="kv"><span>Sözleşme bedeli</span><b class="g">' + fmt(p.bedel) + '</b></div>' +
      '<div class="kv"><span>Süre / geçen</span><b>' + p.sure + ' ay / ' + Math.floor((p.gecenGun || 0) / 30) + ' ay</b></div>' +
      (p.yid ? '<div class="kv"><span>YİD geliri</span><b class="p">' + fmt(p.yidAylik) + ' × ' + p.yidSure + ' ay</b></div>' : '') + '</div>';
  }
  if (p.durum !== "tamam")
    b += '<button class="btn sec" data-act="devret" data-id="' + p.id + '">Projeyi Devret</button>';
  b += '</div></div>';
  const ov = sheet("Proje Detayı", b);
  const fy = ov.querySelector("#pfy");
  if (fy) fy.onchange = () => { p.fiyatAyar = +fy.value / 100; save(); ov.remove(); sheetProje(id); ciz(); };
}

function sheetIhale(id) {
  const ih = S.ihaleler.find(x => x.id === id); if (!ih) return;
  const onerilen = Math.round(ih.tahminMaliyet * 1.15);
  const b = '<div class="card"><div class="ct"><h3>' + ih.ad + '</h3><span class="tag b">' + ih.ilce + '</span></div>' +
    '<div class="g2" style="margin-top:9px">' +
    '<div class="mini"><span>Alan</span><b>' + ih.m2.toLocaleString("tr-TR") + ' m²</b></div>' +
    '<div class="mini"><span>Süre</span><b>' + ih.sure + ' ay</b></div>' +
    '<div class="mini"><span>Yaklaşık maliyet</span><b class="y">' + fmt(ih.yaklasikMaliyet) + '</b></div>' +
    '<div class="mini"><span>Senin maliyetin</span><b class="r">' + fmt(ih.tahminMaliyet) + '</b></div></div>' +
    (ih.yid ? '<div class="kv" style="margin-top:8px"><span>YİD geliri</span><b class="p">' + fmt(ih.yidAylik) + ' × ' + ih.yidSure + ' ay</b></div>' : '') +
    '<div class="kv"><span>Teminat (%3, iade)</span><b>' + fmt(onerilen * 0.03) + '</b></div></div>' +
    '<label class="fl">Teklifin</label><input type="number" id="itk" value="' + onerilen + '" step="100000">' +
    '<div class="sub" style="margin-top:7px">Yaklaşık maliyetin üstüne çıkarsan elenirsin. Rakipler maliyetin %4–34 üstünde teklif verir; itibarın avantaj sağlar.</div>';
  sheet("İhale Teklifi", b, '<button class="btn" data-act="ihaleteklif" data-id="' + id + '">Teklifi Ver</button>');
}

function sheetMalzeme(k, satis) {
  const m = MALZEMELER.find(x => x.k === k);
  const birim = m.fiyat * S.malzemeEndeks * (satis ? 0.88 : 0.94);
  const ihtiyac = S.projeler.filter(p => p.durum === "insaat")
    .reduce((t, p) => t + m.m2 * p.toplamM2 * (1 - p.ilerleme) * (p.kalite ? kalite(p.kalite).malzemeCarpan : 1), 0);
  const b = '<div class="card"><div class="kv"><span>Birim fiyat</span><b class="y">' + fmtTam(birim) + ' / ' + m.birim + '</b></div>' +
    '<div class="kv"><span>Stok</span><b>' + Math.round(S.stok[k] || 0).toLocaleString("tr-TR") + '</b></div>' +
    '<div class="kv"><span>Aktif ihtiyaç</span><b>' + Math.round(ihtiyac).toLocaleString("tr-TR") + '</b></div></div>' +
    '<label class="fl">Miktar (' + m.birim + ')</label>' +
    '<input type="number" id="mq" value="' + Math.max(1, Math.round(satis ? (S.stok[k] || 0) : Math.max(100, ihtiyac * 0.5))) + '" step="10">' +
    '<div class="sub" id="mtot" style="margin-top:9px"></div>';
  const ov = sheet(m.ad + (satis ? " — Sat" : " — Satın Al"), b,
    '<button class="btn" data-act="' + (satis ? 'malsatok' : 'malalok') + '" data-k="' + k + '">' + (satis ? 'Sat' : 'Satın Al') + '</button>');
  const q = ov.querySelector("#mq");
  const upd = () => ov.querySelector("#mtot").innerHTML = "Toplam: <b>" + fmtTam(birim * (+q.value || 0)) + "</b>";
  q.oninput = upd; upd();
}

function sheetKredi() {
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const limit = Math.max(0, krediLimit() - borc);
  const faiz = S.faiz * (S.krediPuani < 1000 ? 1.35 : S.krediPuani > 1600 ? 0.85 : 1) * (1 - muhasebe().faizIndirim);
  let b = '<div class="card"><div class="g2">' +
    '<div class="mini"><span>Limit</span><b class="g">' + fmt(limit) + '</b></div>' +
    '<div class="mini"><span>Kredi puanı</span><b>' + S.krediPuani + '</b></div>' +
    '<div class="mini"><span>Aylık faiz</span><b class="y">%' + (faiz * 100).toFixed(2) + '</b></div>' +
    '<div class="mini"><span>Mevcut borç</span><b class="r">' + fmt(borc) + '</b></div></div></div>' +
    '<label class="fl">Tutar</label><input type="number" id="kt" value="' + Math.round(Math.min(limit, 5000000) / 100000) * 100000 + '" step="500000">' +
    '<label class="fl">Vade</label><div id="kvd">';
  for (const v of [6, 12, 24, 36, 60]) b += '<span class="chip ' + (v === 12 ? 'on' : '') + '" data-v="' + v + '">' + v + ' ay</span>';
  b += '</div><div class="sub" id="kinfo" style="margin-top:9px"></div>';
  const ov = sheet("Kredi Çek", b, '<button class="btn" data-act="kredicek">Krediyi Çek</button>');
  let vade = 12;
  const upd = () => {
    const t = +ov.querySelector("#kt").value || 0;
    const toplam = t * Math.pow(1 + faiz, vade / 12);
    ov.querySelector("#kinfo").innerHTML = "Aylık taksit <b>" + fmt(toplam / vade) + "</b> · toplam geri ödeme <b>" + fmt(toplam) + "</b>";
  };
  ov.querySelector("#kt").oninput = upd;
  ov.querySelectorAll("#kvd .chip").forEach(c => c.onclick = () => {
    ov.querySelectorAll("#kvd .chip").forEach(x => x.classList.remove("on"));
    c.classList.add("on"); vade = +c.dataset.v; upd();
  });
  window.__krediVade = () => vade;
  upd();
}

function sheetCark() {
  const b = '<div style="text-align:center"><div class="wptr"></div>' +
    '<div class="wheel" id="whl"></div>' +
    '<div class="sub">Her oyun gününde bir kez ücretsiz çevirebilirsin.</div></div>' +
    '<div class="card" id="cres" style="display:none;margin-top:14px"></div>';
  sheet("Şans Çarkı", b, '<button class="btn" data-act="carkcevir">Çevir</button>');
}

function sureMetni(gun) {
  if (gun < 30) return gun + " gün";
  const ay = Math.floor(gun / 30), k = gun % 30;
  return ay + " ay" + (k ? " " + k + " gün" : "");
}
function sheetGelisme(r) {
  let b = '<div class="card"><div class="ct"><h3>' + r.basTarih + ' → ' + r.bitTarih + '</h3>' +
    '<span class="tag y">' + sureMetni(r.gun) + '</span></div>' +
    '<div class="g4" style="margin-top:9px">' +
    '<div class="mini"><span>Tahsilat</span><b class="g">' + fmt(r.gelir) + '</b></div>' +
    '<div class="mini"><span>Gider</span><b class="r">' + fmt(r.gider) + '</b></div>' +
    '<div class="mini"><span>Satılan</span><b>' + r.yeniDaire + '</b></div>' +
    '<div class="mini"><span>Biten proje</span><b>' + r.yeniProje + '</b></div></div>' +
    '<div class="kv" style="margin-top:9px"><span>Kasa</span><b class="' + (r.netDegisim >= 0 ? 'g' : 'r') + '">' +
    fmt(r.basNakit) + ' → ' + fmt(S.nakit) + '</b></div></div>';
  if (r.onemli.length) {
    b += '<h2 class="sec">Öne çıkanlar</h2>';
    for (const m of r.onemli.slice(0, 14)) b += '<div class="lg">' + esc(m) + '</div>';
  }
  if (r.olayOzet && r.olayOzet.length) {
    b += '<h2 class="sec">Olaylar</h2><div class="arsagrid">';
    for (const o of r.olayOzet) b += '<div class="card"><div class="ct"><h3>' + o.ad + '</h3>' +
      (o.adet > 1 ? '<span class="tag">' + o.adet + '×</span>' : '') + '</div><div class="sub">' + esc(o.son) + '</div></div>';
    b += '</div>';
  }
  if (!r.onemli.length && (!r.olayOzet || !r.olayOzet.length))
    b += '<div class="sub" style="text-align:center;padding:16px">Sakin bir dönemdi.</div>';
  sheet("Yokken Neler Oldu", b);
}

/* ---------- GÜNCELLEME ---------- */
let guncellemeOv = null;
window.__guncellemeBulundu = function (surum, notlar, boyut) {
  if (guncellemeOv) return;
  const mb = boyut > 0 ? (boyut / 1048576).toFixed(1) + " MB" : "";
  const b = '<div class="card"><div class="ct"><h3>Sürüm ' + esc(surum) + '</h3>' +
    (mb ? '<span class="tag y">' + mb + '</span>' : '') + '</div>' +
    (notlar ? '<div class="sub">' + esc(notlar) + '</div>' : '') +
    '<div class="bar" id="gbar" style="display:none"><i style="width:0%"></i></div>' +
    '<div class="sub" id="gdurum"></div></div>' +
    '<div class="sub">Kurulum ekranı açılınca "Güncelle"ye dokun. Kayıtlı oyunun silinmez.</div>';
  guncellemeOv = sheet("Yeni Sürüm Hazır", b,
    '<div class="brow"><button class="btn" data-act="g_indir">İndir ve Kur</button>' +
    '<button class="btn sec" data-act="g_atla">Bu Sürümü Atla</button></div>');
};
window.__guncellemeIlerleme = function (y) {
  if (!guncellemeOv) return;
  const bar = guncellemeOv.querySelector("#gbar"), d = guncellemeOv.querySelector("#gdurum");
  if (bar) { bar.style.display = "block"; bar.querySelector("i").style.width = y + "%"; }
  if (d) d.textContent = y < 100 ? "İndiriliyor… %" + y : "İndirme tamam, kurulum başlıyor.";
};
window.__guncellemeHata = function (m) {
  toast("Güncelleme başarısız: " + m, "r");
  if (guncellemeOv) { guncellemeOv.remove(); guncellemeOv = null; }
};

/* ================= RENDER ================= */
function ciz() {
  cizRay(); cizUst();
  let h = "";
  if (TAB === "ana") h = ekranAna();
  else if (TAB === "arsa") h = ekranArsa();
  else if (TAB === "proje") h = ekranProje();
  else if (TAB === "ihale") h = ekranIhale();
  else if (TAB === "piyasa") h = ekranPiyasa();
  else if (TAB === "odeme") h = ekranOdeme();
  else if (TAB === "banka") h = ekranBanka();
  else if (TAB === "sirket") h = ekranSirket();
  $("#icerik").innerHTML = h;
}
const render = ciz;
function git(t) { TAB = t; $("#icerik").scrollTop = 0; ciz(); }

/* ================= CANLI ZAMAN ================= */
function zamanDongu() {
  if (!S) return;
  const r = zamanIlerlet();
  if (r) {
    ciz();
    if (r.gun >= 2 || r.onemli.length) sheetGelisme(r);
    else {
      for (const o of (r.olayOzet || []).slice(0, 2)) toast(o.ad + ": " + o.m);
      for (const m of r.onemli.slice(0, 2)) toast(m, "g");
    }
  }
  const kalanMs = sonrakiGuneKalanMs();
  const cub = document.getElementById("guncubuk");
  if (cub) cub.style.width = ((1 - kalanMs / GUN_MS) * 100).toFixed(1) + "%";
}
function dongubaslat() {
  if (window.__dongu) clearInterval(window.__dongu);
  window.__dongu = setInterval(zamanDongu, 1000);
  zamanDongu();
}

/* ================= OLAYLAR ================= */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act],[data-tab]"); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id, k = el.dataset.k;
  const ov = el.closest(".ov");

  if (!a && el.dataset.tab) { git(el.dataset.tab); return; }
  if (a === "tab") { kapatHepsi(); git(el.dataset.tab); return; }
  if (a === "haritaya") { kapatHepsi(); ARSA_GORUNUM = "harita"; git("arsa"); return; }
  if (a === "il") { ARSA_IL = el.dataset.il; ciz(); return; }
  if (a === "agor") { ARSA_GORUNUM = el.dataset.v; ciz(); return; }
  if (a === "haritail") {
    const ad = el.dataset.il;
    if (S.acikIller.includes(ad)) { ARSA_IL = ad; ARSA_GORUNUM = "liste"; ciz(); }
    else sheetSehirDetay(ad);
    return;
  }
  if (a === "pfiltre") { PROJE_FILTRE = el.dataset.v; ciz(); return; }
  if (a === "sehirac") { sheetSehir(); return; }
  if (a === "ilac") {
    const err = ilAc(el.dataset.il);
    if (err) toast(err, "r"); else { toast(el.dataset.il + " açıldı!", "g"); kapatHepsi(); ARSA_IL = el.dataset.il; ARSA_GORUNUM = "liste"; git("arsa"); }
    return;
  }
  if (a === "arsa") { sheetArsa(id); return; }
  if (a === "arsaal") {
    const err = arsaAl(id, null);
    if (err) toast(err, "r"); else { toast("Arsa alındı.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "kkteklif") {
    const teklif = +ov.querySelector("#kkr").value;
    let arsa = null; for (const kk in S.pazar) { const f = S.pazar[kk].find(x => x.id === id); if (f) arsa = f; }
    if (!arsa) return;
    const res = kkPazarlik(arsa, teklif);
    if (res.ok) { arsaAl(id, res.pay); toast("Anlaşma sağlandı · %" + res.pay + " pay", "g"); kapatHepsi(); ciz(); }
    else if (res.red) toast("Arsa sahibi reddetti, %" + arsa.kkPay + " altına inmiyor.", "r");
    else { arsa.kkPay = res.karsi; toast("Karşı teklif: %" + res.karsi); kapatHepsi(); sheetArsa(id); }
    return;
  }
  if (a === "arsasat") {
    const ar = S.arsalar.find(x => x.id === id);
    if (ar && !confirm((ar.kkAnlasma ? "Anlaşmayı bırakmak itibarını düşürür." : "Arsa piyasa değerinin biraz altına satılacak.") + " Onaylıyor musun?")) return;
    const err = arsaSat(id); if (err) toast(err, "r"); else { toast("İşlem tamam.", "g"); ciz(); }
    return;
  }
  if (a === "tasarla") { sheetTasarla(id); return; }
  if (a === "t_tip") { TASARIM.tip = el.dataset.v; TASARIM.ad = TASARIM.arsa.ilce + " " + PROJE_TIPLERI.find(x => x.k === el.dataset.v).ad; cizTasarim(ov); return; }
  if (a === "t_kal") { TASARIM.kalite = el.dataset.v; cizTasarim(ov); return; }
  if (a === "t_krm") { TASARIM.karma = el.dataset.v; cizTasarim(ov); return; }
  if (a === "t_yil") { TASARIM.yildiz = +el.dataset.v; cizTasarim(ov); return; }
  if (a === "t_don") {
    const v = el.dataset.v;
    TASARIM.donatilar = TASARIM.donatilar.includes(v) ? TASARIM.donatilar.filter(x => x !== v) : TASARIM.donatilar.concat([v]);
    cizTasarim(ov); return;
  }
  if (a === "projebaslat") {
    const err = projeBaslat(TASARIM);
    if (err) toast(err, "r"); else { toast("Ruhsat başvurusu yapıldı.", "g"); kapatHepsi(); git("proje"); }
    return;
  }
  if (a === "proje") { sheetProje(id); return; }
  if (a === "maket") {
    const err = maketAc(S.projeler.find(x => x.id === id));
    if (err) toast(err, "r"); else { toast("Maketten satış açıldı.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "devret") {
    if (!confirm("Proje başka firmaya devredilecek, itibarın düşecek. Onaylıyor musun?")) return;
    const err = projeDevret(id); if (err) toast(err, "r"); else { toast("Proje devredildi.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "ihale") { sheetIhale(id); return; }
  if (a === "ihaleteklif") {
    const err = ihaleTeklif(id, +ov.querySelector("#itk").value);
    if (err) toast(err, "r"); else toast("İhaleyi kazandın!", "g");
    kapatHepsi(); ciz(); return;
  }
  if (a === "ode") { const err = odemeYap(id); if (err) toast(err, "r"); else { toast("Ödendi.", "g"); ciz(); } return; }
  if (a === "odehepsi") { const err = odemeHepsi(); if (err) toast(err, "r"); else { toast("Tüm ödemeler yapıldı.", "g"); ciz(); } return; }
  if (a === "muhasebe") {
    const err = muhasebeciAl(+el.dataset.v);
    if (err) toast(err, "r"); else { toast("Muhasebe düzenin güncellendi.", "g"); ciz(); }
    return;
  }
  if (a === "malal") { sheetMalzeme(k, false); return; }
  if (a === "malsat") { sheetMalzeme(k, true); return; }
  if (a === "malalok") {
    const err = malzemeAl(k, +ov.querySelector("#mq").value);
    if (err) toast(err, "r"); else { toast("Malzeme alındı.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "malsatok") {
    const err = malzemeSat(k, +ov.querySelector("#mq").value);
    if (err) toast(err, "r"); else { toast("Satıldı.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "kredial") { sheetKredi(); return; }
  if (a === "kredicek") {
    const err = krediCek(+ov.querySelector("#kt").value, window.__krediVade ? window.__krediVade() : 12);
    if (err) toast(err, "r"); else { toast("Kredi hesabına geçti.", "g"); kapatHepsi(); ciz(); }
    return;
  }
  if (a === "kredikapat") { const err = krediKapat(id); if (err) toast(err, "r"); else { toast("Kredi kapatıldı.", "g"); ciz(); } return; }
  if (a === "pal") { personelAl(k, 1); ciz(); return; }
  if (a === "pal5") { personelAl(k, 5); ciz(); return; }
  if (a === "pcik") { const err = personelCikar(k, 1); if (err) toast(err, "r"); ciz(); return; }
  if (a === "satisofis") {
    if (S.satisOfisi) { S.satisOfisi = false; toast("Satış ofisi kapatıldı."); }
    else if (S.nakit < 500000) { toast("Kuruluş için 500 B ₺ gerekiyor.", "r"); return; }
    else { S.nakit -= 500000; S.satisOfisi = true; toast("Satış ofisi açıldı.", "g"); }
    save(); ciz(); return;
  }
  if (a === "sdal") { S.satisDanismani++; save(); ciz(); return; }
  if (a === "sdcik") { if (S.satisDanismani > 0) { S.satisDanismani--; save(); ciz(); } return; }
  if (a === "ofis") { const err = ofisYukselt(); if (err) toast(err, "r"); else { toast("Ofis yükseltildi!", "g"); ciz(); } return; }
  if (a === "makal") { const err = satinAl("makine", k); if (err) toast(err, "r"); else { toast("Makine alındı.", "g"); ciz(); } return; }
  if (a === "makinesat") { const err = varlikSat("makine", k); if (err) toast(err, "r"); else { toast("Satıldı.", "g"); ciz(); } return; }
  if (a === "kolal") { const err = satinAl("koleksiyon", k); if (err) toast(err, "r"); else { toast("Alındı.", "g"); ciz(); } return; }
  if (a === "kolsat") { const err = varlikSat("koleksiyon", k); if (err) toast(err, "r"); else { toast("Satıldı.", "g"); ciz(); } return; }
  if (a === "spon") { sponsorToggle(k); ciz(); return; }
  if (a === "cark") { sheetCark(); return; }
  if (a === "carkcevir") {
    const r = carkCevir();
    if (r.hata) { toast(r.hata, "r"); return; }
    const w = ov.querySelector("#whl");
    w.style.transform = "rotate(" + (1440 + Math.random() * 360) + "deg)";
    el.disabled = true;
    setTimeout(() => {
      const c = ov.querySelector("#cres");
      c.style.display = "block";
      c.innerHTML = '<div class="ct"><h3>' + r.ad + '</h3><span class="tag g">Kazandın</span></div><div class="sub">' + esc(r.mesaj) + '</div>';
      ciz();
    }, 3500);
    return;
  }
  if (a === "g_kontrol") { if (nativeVar()) { Android.guncellemeKontrol(); toast("Güncelleme denetleniyor…"); } return; }
  if (a === "g_indir") { if (nativeVar()) { el.disabled = true; Android.guncellemeIndir(); } return; }
  if (a === "g_atla") { if (nativeVar()) Android.guncellemeAtla(); kapatHepsi(); guncellemeOv = null; return; }
  if (a === "yenioyun") {
    if (!confirm("Mevcut kayıt silinecek ve yeni oyun başlayacak. Emin misin?")) return;
    sil(); kapatHepsi(); basla(true); return;
  }
});

/* ================= BAŞLANGIÇ ================= */
function basla(zorla) {
  if (!zorla && load()) {
    const r = zamanIlerlet();
    git("ana");
    if (r && (r.gun >= 2 || r.onemli.length)) sheetGelisme(r);
    dongubaslat();
    return;
  }
  const b = '<div class="card"><h3 style="font-size:16px">Müteahhit Simülasyonu</h3>' +
    '<div class="sub" style="margin-top:7px">10 milyon lirayla İstanbul\'da inşaat şirketini kur. Arsa al, ruhsat çıkar, proje tasarla, bina dik, daireleri sat. 81 ile yayıl; AVM, sahil oteli, kamu ihalesi ve yap-işlet-devret projelerine gir.</div>' +
    '<div class="g2" style="margin-top:11px">' +
    '<div class="mini"><span>Zaman</span><b>1 gün = 20 saniye</b></div>' +
    '<div class="mini"><span>Çevrimdışı</span><b class="g">Kapalıyken de işler</b></div></div></div>' +
    '<label class="fl">Şirket adın</label><input type="text" id="sad" value="Özkan İnşaat" maxlength="28">';
  const ov = sheet("Yeni Oyun", b, '<button class="btn" id="bas">Şirketi Kur</button>');
  ov.querySelector("#bas").onclick = () => {
    newGame(ov.querySelector("#sad").value.trim() || "Özkan İnşaat");
    ov.remove(); git("ana"); dongubaslat();
  };
}
basla(false);
