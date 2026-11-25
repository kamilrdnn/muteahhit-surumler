/* ================= MÜTEAHHİT SİMÜLASYONU - MOTOR ================= */
const SAVEKEY = "muteahhit_save_v1";
let S = null;
let uid = 1;
const nid = () => "x" + (uid++) + Date.now().toString(36).slice(-3);

/* ---------- yardımcılar ---------- */
const R = (a, b) => a + Math.random() * (b - a);
const RI = (a, b) => Math.floor(R(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function fmt(n) {
  n = Math.round(n);
  const neg = n < 0; n = Math.abs(n);
  let s;
  if (n >= 1e9) s = (n / 1e9).toFixed(2) + " Mr";
  else if (n >= 1e6) s = (n / 1e6).toFixed(2) + " M";
  else if (n >= 1e3) s = (n / 1e3).toFixed(0) + " B";
  else s = String(n);
  return (neg ? "-" : "") + s + " ₺";
}
function fmtTam(n) {
  return Math.round(n).toLocaleString("tr-TR") + " ₺";
}
const GUN_MS = 20000;          /* 1 oyun günü = 20 saniye (1 ay ≈ 10 dk) */
const AY_GUN = 30;             /* her ay 30 gün */
const ENFAZLA_GUN = 1200;      /* tek seferde işlenecek en fazla gün */
function tarih() { return (S.gun || 1) + " " + AYLAR[S.ay % 12] + " " + S.yil; }
function kisaTarih() { return (S.gun || 1) + " " + AYLAR[S.ay % 12].slice(0, 3); }
function sonrakiGuneKalanMs() {
  const gecen = Date.now() - (S.sonTik || Date.now());
  return Math.max(0, GUN_MS - (gecen % GUN_MS));
}

const il = ad => ILLER.find(x => x.n === ad);
function ilceVeri(ilAd, ilceAd) {
  const i = il(ilAd); if (!i) return null;
  const d = i.d.find(x => x[0] === ilceAd); if (!d) return null;
  return { mult: d[1], talep: d[2] === undefined ? 1 : d[2], base: i.b };
}
const kalite = k => KALITELER.find(x => x.k === k);
const imarT = k => IMAR_TIPLERI.find(x => x.k === k);
const karma = k => KARMALAR.find(x => x.k === k);
const daireT = k => DAIRE_TIPLERI.find(x => x.k === k);

/* ---------- fiyat modeli ---------- */
function satisM2(ilAd, ilceAd, kaliteK, imarK) {
  const d = ilceVeri(ilAd, ilceAd); if (!d) return 0;
  return d.base * Math.pow(d.mult, 0.62) * kalite(kaliteK).satisCarpan * imarT(imarK).satisCarpan * S.konutEndeks;
}
function malzemeM2TL(kaliteK) {
  let t = 0;
  for (const m of MALZEMELER) t += m.m2 * m.fiyat * S.malzemeEndeks;
  return t * kalite(kaliteK).malzemeCarpan;
}
function insaatM2TL(kaliteK) {
  const k = kalite(kaliteK);
  const mal = malzemeM2TL(kaliteK);
  const diger = (k.maliyetM2 - mal / S.malzemeEndeks) * 0.78 * S.maliyetEndeks;
  return mal + Math.max(0, diger);
}
function ilceBeklenti(mult) { return 0.55 + mult * 0.45; }

/* ---------- arsa üretimi ---------- */
const PROJE_TIPLERI = [
  { k: "konut", ad: "Konut Projesi", imar: "konut", min: 250 },
  { k: "rezidans", ad: "Rezidans", imar: "ticari", min: 600 },
  { k: "villa", ad: "Villa Sitesi", imar: "villa", min: 800 },
  { k: "avm", ad: "AVM", imar: "ticari", min: 2500 },
  { k: "otel", ad: "Sahil Oteli", imar: "ticari", min: 1500 }
];
const SAHIL_ILLER = ["Antalya", "Muğla", "İzmir", "Aydın", "Mersin", "Balıkesir", "Çanakkale", "Trabzon", "Samsun", "Ordu", "Sinop", "Bartın", "Hatay", "Yalova", "Rize", "Giresun", "Tekirdağ", "Kocaeli", "İstanbul", "Zonguldak", "Düzce", "Artvin", "Kırklareli", "Edirne"];

function arsaUret(ilAd, ilceAd, kucuk) {
  const i = il(ilAd);
  const d = i.d.find(x => x[0] === ilceAd);
  const mult = d[1], talep = d[2] === undefined ? 1 : d[2];
  const imKey = pick(["konut", "konut", "konut", "ticari", "villa"]);
  const im = imarT(imKey);
  const emsal = +R(im.emsalAralik[0], im.emsalAralik[1]).toFixed(2);
  let m2;
  if (kucuk) m2 = RI(2, 8) * 100;
  else if (imKey === "villa") m2 = RI(6, 40) * 100;
  else if (imKey === "ticari") m2 = RI(5, 60) * 100;
  else m2 = RI(2, 45) * 100;
  const taks = +R(0.30, 0.45).toFixed(2);
  const maxKat = clamp(Math.ceil(emsal / taks), 2, imKey === "villa" ? 3 : 32);
  const sM2 = i.b * Math.pow(mult, 0.62) * S.konutEndeks * im.satisCarpan;
  const hasilatM2Arsa = emsal * 0.80 * sM2;
  const pay = clamp(0.365 * Math.pow(mult, 0.55) + R(-0.035, 0.045), 0.18, 0.78);
  const fiyat = Math.round(hasilatM2Arsa * pay * m2 / 1000) * 1000;
  const sahil = SAHIL_ILLER.includes(ilAd) && mult >= 0.9 && Math.random() < 0.35;
  return {
    id: nid(), il: ilAd, ilce: ilceAd, m2, imar: imKey, imarAd: im.ad,
    emsal, taks, maxKat, fiyat, mult, talep, sahil,
    katKarsiligi: Math.random() < 0.3, kkPay: RI(32, 48)
  };
}
function pazarYenile() {
  S.pazar = {};
  for (const ad of S.acikIller) {
    const i = il(ad);
    const list = [];
    const say = clamp(Math.round(i.d.length * 0.8), 6, 16);
    const ucuzIlceler = i.d.slice().sort((x, y) => x[1] - y[1]).slice(0, Math.max(3, Math.ceil(i.d.length / 2)));
    for (let k = 0; k < say; k++) {
      if (k < 4) {
        const d = pick(k < 3 ? ucuzIlceler.slice(0, Math.max(3, Math.ceil(ucuzIlceler.length / 3))) : ucuzIlceler);
        const a = arsaUret(ad, d[0], true);
        a.katKarsiligi = k === 3;
        if (a.imar !== "konut") { a.imar = "konut"; a.imarAd = "Konut"; a.emsal = +R(1.3, 2.2).toFixed(2); a.maxKat = clamp(Math.ceil(a.emsal / a.taks), 3, 12); }
        a.fiyat = Math.round(a.fiyat * 0.85 / 1000) * 1000;
        list.push(a);
      } else {
        const d = pick(i.d);
        list.push(arsaUret(ad, d[0]));
      }
    }
    /* oyuncunun bütçesiyle alınabilecek en az iki parsel her zaman bulunsun */
    const hedef = Math.max(5000000, S.nakit * 0.55);
    const alinabilir = () => list.filter(a => !a.katKarsiligi && a.fiyat <= hedef).length;
    const kucukten = list.filter(a => !a.katKarsiligi).sort((x, y) => x.fiyat - y.fiyat);
    for (const a of kucukten) {
      if (alinabilir() >= 2) break;
      if (a.fiyat <= hedef) continue;
      const oran = hedef * 0.8 / a.fiyat;
      const yeniM2 = Math.max(150, Math.round(a.m2 * oran / 10) * 10);
      a.fiyat = Math.round(a.fiyat * (yeniM2 / a.m2) / 1000) * 1000;
      a.m2 = yeniM2;
    }
    list.sort((x, y) => x.fiyat - y.fiyat);
    S.pazar[ad] = list;
  }
  S.pazarAy = S.ay;
}

/* ---------- proje hesabı ---------- */
function projeHesap(c) {
  const a = c.arsa;
  const emsalAlan = a.m2 * a.emsal;
  const tabanAlan = a.m2 * a.taks;
  const toplamM2 = Math.min(emsalAlan, tabanAlan * c.kat) * (c.blok ? 1 : 1);
  const satilabilirM2 = toplamM2 * (c.tip === "avm" ? 0.72 : c.tip === "otel" ? 0.70 : 0.80);
  const kal = kalite(c.kalite);
  let m2Mal = insaatM2TL(c.kalite);
  if (c.tip === "avm") m2Mal *= 1.15;
  if (c.tip === "otel") m2Mal *= 1.25;
  if (c.tip === "villa") m2Mal *= 1.45;
  let donatiMaliyet = 0, donatiSatis = 0, donatiTalep = 0;
  for (const dk of c.donatilar) {
    const D = DONATILAR.find(x => x.k === dk); if (!D) continue;
    donatiMaliyet += D.sabit ? D.sabit : D.m2Maliyet * toplamM2;
    donatiSatis += D.satis; donatiTalep += D.talep;
  }
  const insaatMaliyet = toplamM2 * m2Mal;
  const arsaMaliyet = c.katKarsiligi ? 0 : a.fiyat;
  const ruhsatHarc = toplamM2 * 220;
  const maliyet = insaatMaliyet + arsaMaliyet + donatiMaliyet + ruhsatHarc;
  const sM2 = satisM2(a.il, a.ilce, c.kalite, a.imar) * (1 + donatiSatis);
  let hasilat = 0, birimler = [];
  if (c.tip === "avm") {
    const magaza = Math.max(1, Math.round(satilabilirM2 / 180));
    const aylikKira = satilabilirM2 * (sM2 * 0.0062);
    hasilat = aylikKira * 12 * 9;
    birimler = [{ tip: "Mağaza", adet: magaza, m2: 180, birimFiyat: aylikKira / magaza }];
  } else if (c.tip === "otel") {
    const oda = Math.max(10, Math.round(satilabilirM2 / 42));
    const yildiz = c.yildiz || 4;
    const geceFiyat = (sM2 / 1000) * (18 + yildiz * 9) * (1 + donatiSatis);
    hasilat = oda * geceFiyat * 110 * 0.72 * 8;
    birimler = [{ tip: yildiz + " Yıldız Oda", adet: oda, m2: 42, birimFiyat: geceFiyat }];
  } else {
    const km = karma(c.karma);
    const liste = DAIRE_TIPLERI.filter(dt => (km.dagilim[dt.k] || 0) > 0);
    const adetler = {};
    for (const dt of liste) adetler[dt.k] = Math.floor(satilabilirM2 * km.dagilim[dt.k] / dt.m2);
    let kullanilan = liste.reduce((t, dt) => t + adetler[dt.k] * dt.m2, 0);
    let kalan = satilabilirM2 - kullanilan;
    const enKucuk = Math.min.apply(null, liste.map(d => d.m2));
    let g = 0;
    while (kalan >= enKucuk && g++ < 600) {
      const uyanlar = liste.filter(d => d.m2 <= kalan);
      if (!uyanlar.length) break;
      /* kalan alanı en az boşlukla dolduracak tipi seç */
      let sec = uyanlar.filter(d => kalan - d.m2 === 0 || kalan - d.m2 >= enKucuk)
        .sort((a, b) => b.m2 - a.m2)[0];
      if (!sec) sec = uyanlar.slice().sort((a, b) => (kalan - a.m2) - (kalan - b.m2))[0];
      adetler[sec.k]++; kalan -= sec.m2;
    }
    let toplamAdet = liste.reduce((t, dt) => t + adetler[dt.k], 0);
    if (toplamAdet < 1) {
      const kucuk = liste.slice().sort((a, b) => a.m2 - b.m2)[0];
      adetler[kucuk.k] = Math.max(1, Math.floor(satilabilirM2 / kucuk.m2));
    }
    for (const dt of liste) {
      const adet = adetler[dt.k]; if (adet < 1) continue;
      const bf = dt.m2 * sM2 * dt.carpan;
      birimler.push({ tip: dt.k, adet, m2: dt.m2, birimFiyat: bf });
      hasilat += adet * bf;
    }
  }
  if (c.katKarsiligi) hasilat *= (1 - a.kkPay / 100);
  const isYuku = toplamM2 * kal.sureCarpan * (c.tip === "avm" ? 1.2 : c.tip === "otel" ? 1.3 : 1);
  const kapasite = Math.max(60, ekipKapasite());
  const sureAy = Math.ceil(isYuku / kapasite);
  const sure = sureAy;
  const sureGun = Math.ceil(isYuku / (kapasite / AY_GUN));
  const sureDk = Math.max(1, Math.round(sureGun * GUN_MS / 60000));
  return { toplamM2, satilabilirM2, maliyet, insaatMaliyet, arsaMaliyet, donatiMaliyet, ruhsatHarc, hasilat, kar: hasilat - maliyet, birimler, sM2, isYuku, sure, sureGun, sureDk, donatiTalep, donatiSatis, m2Mal };
}

function ekipKapasite() {
  let k = 0;
  for (const p of PERSONEL) k += (S.personel[p.k] || 0) * p.kapasite;
  for (const m of S.makineler) { const M = MAKINELER.find(x => x.k === m); if (M) k += M.kapasite; }
  k *= (1 + OFISLER[S.ofisSeviye].kapasiteBonus);
  return k;
}
function ekipKalite() {
  let t = 0, n = 0;
  for (const p of PERSONEL) { const a = S.personel[p.k] || 0; t += a * p.kalite; n += a; }
  return n ? clamp(t / n, 0, 2.5) : 0;
}
/* Aylık maaş bordrosu (ayın 1'inde ödenecek olarak çıkar) */
function aylikMaas() {
  let g = 0;
  for (const p of PERSONEL) g += (S.personel[p.k] || 0) * p.maas;
  g += S.satisDanismani * 45000;
  g += MUHASEBE[S.muhasebeci || 0].maas;
  return g;
}
/* Günlük işleyen sabit giderler (ofis, bakım, sponsorluk) */
function aylikIsletmeGideri() {
  let g = OFISLER[S.ofisSeviye].gider;
  for (const m of S.makineler) { const M = MAKINELER.find(x => x.k === m); if (M) g += M.bakim; }
  for (const sp of S.sponsorluklar) { const P = SPONSORLUK.find(x => x.k === sp); if (P) g += P.gider; }
  if (S.satisOfisi) g += 85000;
  return g;
}
function aylikPersonelGider() { return aylikMaas() + aylikIsletmeGideri(); }
const muhasebe = () => MUHASEBE[S.muhasebeci || 0];

/* ---------- ödemeler ---------- */
function odemeEkle(tur, ad, tutar, vadeGun, ek) {
  if (tutar <= 0) return null;
  const o = Object.assign({
    id: nid(), tur, ad, tutar: Math.round(tutar), asil: Math.round(tutar),
    vade: S.toplamGun + vadeGun, zam: 0
  }, ek || {});
  S.odemeler.push(o);
  return o;
}
function odemeYap(id) {
  const o = S.odemeler.find(x => x.id === id);
  if (!o) return "Ödeme bulunamadı.";
  if (S.nakit < o.tutar) return "Yetersiz nakit (" + fmt(o.tutar) + ").";
  S.nakit -= o.tutar;
  if (o.tur === "kredi") {
    const k = S.krediler.find(x => x.id === o.krediId);
    if (k) {
      k.kalan -= o.asil; k.kalanVade--;
      if (k.kalan <= 1) { k.kalan = 0; k.kalanVade = 0; S.krediPuani = clamp(S.krediPuani + 30, 600, 1900); }
    }
    S.krediPuani = clamp(S.krediPuani + (o.vade >= S.toplamGun ? 6 : -4), 600, 1900);
  }
  if (o.tur === "maas" && o.vade >= S.toplamGun) S.itibar = clamp(S.itibar + 0.3, 0, 100);
  S.krediler = S.krediler.filter(k => k.kalan > 0);
  S.odemeler = S.odemeler.filter(x => x.id !== id);
  logEkle(o.ad + " ödendi: " + fmt(o.tutar));
  save(); return null;
}
function odemeHepsi() {
  const toplam = S.odemeler.reduce((t, o) => t + o.tutar, 0);
  if (!S.odemeler.length) return "Bekleyen ödeme yok.";
  if (S.nakit < toplam) return "Hepsini ödemeye nakit yetmiyor (" + fmt(toplam) + ").";
  const kopya = S.odemeler.slice();
  for (const o of kopya) odemeYap(o.id);
  return null;
}
function gecikenOdemeler() { return S.odemeler.filter(o => o.vade < S.toplamGun); }
function odemeToplam() { return S.odemeler.reduce((t, o) => t + o.tutar, 0); }

/* ayın 1'inde tahakkuk eden ödemeler */
function ayBasiTahakkuk(rapor) {
  const m = muhasebe();
  /* maaş */
  const maas = aylikMaas();
  if (maas > 0) odemeEkle("maas", AYLAR[S.ay % 12] + " maaş bordrosu", maas, 5, { kisi: toplamPersonel() });
  /* kredi taksitleri */
  for (const k of S.krediler) {
    if (k.kalanVade <= 0) continue;
    const t = Math.min(k.taksit, k.kalan);
    odemeEkle("kredi", "Kredi taksiti " + (k.vade - k.kalanVade + 1) + "/" + k.vade, t, 7, { krediId: k.id });
  }
  /* vergi: önceki ayın kârı üzerinden */
  if (S.ayKar > 0) {
    let vergi = S.ayKar * 0.15 * (1 - m.vergiIndirim);
    odemeEkle("vergi", "Kurum vergisi (" + AYLAR[(S.ay + 11) % 12] + ")", vergi, 12, {});
  }
  S.ayKar = 0;
  /* muhasebeci varsa ve para yetiyorsa hemen öder */
  if (m.oto) {
    for (const o of S.odemeler.slice()) {
      if (S.nakit >= o.tutar) odemeYap(o.id);
    }
    if (S.odemeler.length && rapor) rapor.onemli.push("Muhasebeci ödemeleri yapamadı: nakit yetersiz.");
  } else if (rapor) {
    rapor.onemli.push("Yeni ödemeler tahakkuk etti: " + fmt(odemeToplam()));
  }
}

/* günlük gecikme zammı ve cezalar */
function odemeTick(rapor) {
  const m = muhasebe();
  if (m.oto) {
    for (const o of S.odemeler.slice()) if (S.nakit >= o.tutar) odemeYap(o.id);
  }
  let geciken = 0, maasGecikti = false;
  for (const o of S.odemeler) {
    if (o.vade >= S.toplamGun) continue;
    geciken++;
    const zam = o.tutar * (GECIKME_AYLIK / AY_GUN);
    o.tutar += zam; o.zam += zam;
    S.toplamGecikmeZammi += zam;
    if (o.tur === "maas") maasGecikti = true;
  }
  S.maasGecikti = maasGecikti;
  if (geciken) {
    S.gecikenGun++;
    S.itibar = clamp(S.itibar - 0.08 * geciken, 0, 100);
    if (S.gecikenGun % 5 === 0) {
      S.krediPuani = clamp(S.krediPuani - 12 * geciken, 600, 1900);
      if (rapor) rapor.onemli.push(geciken + " ödeme gecikti, kredi puanı düşüyor.");
      logEkle(geciken + " ödeme gecikmede. Gecikme zammı işliyor, kredi puanı düşüyor.");
    }
  } else S.gecikenGun = 0;
}
function toplamPersonel() {
  let n = 0;
  for (const p of PERSONEL) n += (S.personel[p.k] || 0);
  return n + S.satisDanismani + (S.muhasebeci ? 1 : 0);
}
function muhasebeciAl(seviye) {
  const m = MUHASEBE[seviye]; if (!m) return "Geçersiz seçim.";
  if (S.muhasebeci === seviye) return "Zaten bu kademedesin.";
  S.muhasebeci = seviye;
  logEkle(seviye ? m.ad + " işe alındı." : "Muhasebeci ile yollar ayrıldı.");
  save(); return null;
}

const MAKINELER = [
  { k: "kepce", ad: "Kepçe (Ekskavatör)", fiyat: 2850000, kapasite: 512, bakim: 42000 },
  { k: "kamyon", ad: "Hafriyat Kamyonu", fiyat: 1950000, kapasite: 288, bakim: 28000 },
  { k: "vinc", ad: "Kule Vinç", fiyat: 6400000, kapasite: 1024, bakim: 95000 },
  { k: "pompa", ad: "Beton Pompası", fiyat: 4200000, kapasite: 768, bakim: 68000 },
  { k: "forklift", ad: "Forklift", fiyat: 980000, kapasite: 176, bakim: 15000 },
  { k: "silindir", ad: "Silindir & Dozer", fiyat: 3100000, kapasite: 448, bakim: 46000 }
];
const OFISLER = [
  { ad: "Konteyner Ofis", fiyat: 0, gider: 25000, itibar: 0, kapasiteBonus: 0 },
  { ad: "Küçük Büro", fiyat: 1800000, gider: 90000, itibar: 3, kapasiteBonus: 0.06 },
  { ad: "Plaza Katı", fiyat: 9500000, gider: 280000, itibar: 8, kapasiteBonus: 0.14 },
  { ad: "Kendi Plazası", fiyat: 42000000, gider: 750000, itibar: 16, kapasiteBonus: 0.24 },
  { ad: "Holding Kulesi", fiyat: 165000000, gider: 2100000, itibar: 28, kapasiteBonus: 0.38 }
];
const KOLEKSIYON = [
  { k: "arac1", ad: "Şirket Aracı (Pickup)", fiyat: 2400000, itibar: 1 },
  { k: "arac2", ad: "Makam Aracı (Sedan)", fiyat: 5600000, itibar: 3 },
  { k: "arac3", ad: "Lüks SUV", fiyat: 12500000, itibar: 6 },
  { k: "saat1", ad: "Klasik Kol Saati", fiyat: 1800000, itibar: 2 },
  { k: "saat2", ad: "Nadir Koleksiyon Saati", fiyat: 14000000, itibar: 7 },
  { k: "yat1", ad: "Tekne", fiyat: 18000000, itibar: 8 },
  { k: "yat2", ad: "Yat", fiyat: 85000000, itibar: 18 },
  { k: "helikopter", ad: "Helikopter", fiyat: 240000000, itibar: 30 }
];
const SPONSORLUK = [
  { k: "amator", ad: "Amatör Kulüp Sponsorluğu", gider: 120000, itibar: 0.35 },
  { k: "lig2", ad: "2. Lig Takımı", gider: 650000, itibar: 0.9 },
  { k: "lig1", ad: "1. Lig Takımı", gider: 2400000, itibar: 1.8 },
  { k: "super", ad: "Süper Lig Takımı", gider: 9500000, itibar: 3.4 }
];

/* ---------- yeni oyun ---------- */
function newGame(sirketAd) {
  S = {
    ver: 3, sirket: sirketAd || "Özkan İnşaat", gun: 1, ay: 0, yil: 2026,
    toplamGun: 0, sonTik: Date.now(),
    nakit: 10000000, itibar: 5, krediPuani: 1200,
    acikIller: ["İstanbul"], pazar: {}, pazarAy: -1,
    arsalar: [], projeler: [], ihaleler: [], yid: [],
    personel: { isci: 4, usta: 1, muhendis: 1, mimar: 0, sefi: 0 },
    satisDanismani: 0, satisOfisi: false, muhasebeci: 0,
    odemeler: [], ayKar: 0, gecikenGun: 0, toplamGecikmeZammi: 0,
    stok: {}, krediler: [], ofisSeviye: 0,
    makineler: [], koleksiyon: [], sponsorluklar: [],
    konutEndeks: 1, malzemeEndeks: 1, maliyetEndeks: 1, faiz: 0.041,
    log: [], carkGun: -99, bitenProje: 0, toplamKar: 0, satilanDaire: 0,
    basarimlar: [], nakitGecmis: [], gunlukGelir: 0, gunlukGider: 0,
    olaylar: []
  };
  for (const m of MALZEMELER) S.stok[m.k] = 0;
  pazarYenile();
  logEkle("Şirket kuruldu: " + S.sirket + ". Kasada " + fmt(10000000) + " var. İstanbul'da işe başla.");
  save();
}
function logEkle(t) {
  S.log.unshift({ t: kisaTarih(), m: t });
  if (S.log.length > 120) S.log.pop();
}
function save() { try { localStorage.setItem(SAVEKEY, JSON.stringify({ S, uid })); } catch (e) { } }
function load() {
  try {
    const raw = localStorage.getItem(SAVEKEY); if (!raw) return false;
    const o = JSON.parse(raw); if (!o || !o.S) return false;
    S = o.S; uid = o.uid || 1;
    gocEt();
    if (!S.pazar || !Object.keys(S.pazar).length) pazarYenile();
    return true;
  } catch (e) { return false; }
}
function sil() { localStorage.removeItem(SAVEKEY); }

/* eski (aylık) kayıtları gerçek zamanlı sisteme çevirir */
function gocEt() {
  if (S.gun === undefined) {
    S.gun = 1;
    S.toplamGun = (S.ay || 0) * AY_GUN;
    S.sonTik = Date.now();
    S.ver = 2;
    for (const p of S.projeler) {
      if (p.ruhsatKalan !== undefined && p.ruhsatGun === undefined) p.ruhsatGun = p.ruhsatKalan * AY_GUN;
      if (p.gecen !== undefined) p.gecenGun = p.gecen * AY_GUN;
    }
    for (const ih of S.ihaleler) if (ih.sonGun === undefined) ih.sonGun = S.toplamGun + 45;
  }
  if ((S.ver || 1) < 3) {
    /* hız güncellemesi: eski projelerin ruhsat süresi aylıktan günlüğe çekilir */
    for (const p of S.projeler) if (p.ruhsatGun > 14) p.ruhsatGun = Math.max(2, Math.round(p.ruhsatGun / 30) + 2);
    S.ver = 3;
  }
  if (!S.basarimlar) S.basarimlar = [];
  if (!S.nakitGecmis) S.nakitGecmis = [];
  if (S.carkGun === undefined) S.carkGun = -99;
  if (S.muhasebeci === undefined) S.muhasebeci = 0;
  if (!S.odemeler) S.odemeler = [];
  if (S.ayKar === undefined) S.ayKar = 0;
  if (S.gecikenGun === undefined) S.gecikenGun = 0;
  if (S.toplamGecikmeZammi === undefined) S.toplamGecikmeZammi = 0;
  if (!S.sonTik) S.sonTik = Date.now();
}

/* ---------- unvan ---------- */
function unvan() {
  let u = UNVANLAR[0];
  const it = itibarToplam();
  for (const x of UNVANLAR) if (it >= x.itibar && S.bitenProje >= x.proje) u = x;
  return u;
}
function itibarToplam() {
  let e = 0;
  e += OFISLER[S.ofisSeviye].itibar;
  for (const k of S.koleksiyon) { const K = KOLEKSIYON.find(x => x.k === k); if (K) e += K.itibar; }
  return clamp(S.itibar + e, 0, 100);
}

/* ---------- il açma ---------- */
function ilAcmaBedel(ad) {
  const i = il(ad);
  return Math.round((2500000 + i.b * 95 + i.d.length * 450000) / 1000) * 1000;
}
function ilAc(ad) {
  const i = il(ad);
  const bedel = ilAcmaBedel(ad);
  if (S.acikIller.includes(ad)) return "Bu il zaten açık.";
  const u = UNVANLAR.findIndex(x => x.ad === unvan().ad);
  if (u < i.lv) return "Bu il için en az " + UNVANLAR[i.lv].ad + " unvanı gerekiyor.";
  if (S.nakit < bedel) return "Yetersiz nakit. Gerekli: " + fmt(bedel);
  S.nakit -= bedel; S.acikIller.push(ad);
  S.itibar = clamp(S.itibar + 1.5, 0, 100);
  pazarYenile();
  logEkle(ad + " açıldı. " + fmt(bedel) + " ödendi.");
  save(); return null;
}

/* ---------- arsa alım ---------- */
function arsaAl(id, katKarsiligiPay) {
  let a = null, ilAd = null;
  for (const k in S.pazar) { const f = S.pazar[k].find(x => x.id === id); if (f) { a = f; ilAd = k; } }
  if (!a) return "Arsa bulunamadı.";
  if (katKarsiligiPay != null) {
    a.kkAnlasma = true; a.kkPay = katKarsiligiPay;
    S.arsalar.push(a);
    S.pazar[ilAd] = S.pazar[ilAd].filter(x => x.id !== id);
    logEkle(a.ilce + " arsası kat karşılığı alındı (%" + katKarsiligiPay + " pay).");
    save(); return null;
  }
  if (S.nakit < a.fiyat) return "Yetersiz nakit. Arsa bedeli " + fmt(a.fiyat);
  S.nakit -= a.fiyat; a.kkAnlasma = false;
  S.arsalar.push(a);
  S.pazar[ilAd] = S.pazar[ilAd].filter(x => x.id !== id);
  logEkle(a.ilce + "'de " + a.m2 + " m² arsa alındı: " + fmt(a.fiyat));
  save(); return null;
}
/* kat karşılığı pazarlık: karşı teklif */
function kkPazarlik(arsa, teklif) {
  const istek = arsa.kkPay;
  const fark = istek - teklif;
  const itb = itibarToplam();
  const sans = clamp(0.5 + (fark <= 0 ? 0.5 : -fark * 0.075) + itb * 0.004, 0.03, 0.95);
  if (Math.random() < sans) return { ok: true, pay: teklif };
  const ara = Math.round((istek + teklif) / 2);
  if (Math.random() < 0.5) return { ok: false, karsi: ara };
  return { ok: false, karsi: istek, red: true };
}

/* ---------- proje başlat ---------- */
function projeBaslat(c) {
  const h = projeHesap(c);
  const pesin = h.ruhsatHarc;
  if (S.nakit < pesin) return "Ruhsat harcı için yetersiz nakit (" + fmt(pesin) + ").";
  S.nakit -= pesin;
  const itb = itibarToplam();
  const ruhsatSure = clamp(RI(3, 8) + (c.tip === "avm" || c.tip === "otel" ? 3 : 0) - Math.floor(itb / 20), 2, 14);
  const p = {
    id: nid(), ad: c.ad, tip: c.tip, il: c.arsa.il, ilce: c.arsa.ilce,
    arsaId: c.arsa.id, arsaM2: c.arsa.m2, emsal: c.arsa.emsal, kat: c.kat,
    kalite: c.kalite, karma: c.karma, donatilar: c.donatilar.slice(),
    yildiz: c.yildiz || 0, imar: c.arsa.imar,
    toplamM2: h.toplamM2, satilabilirM2: h.satilabilirM2,
    butce: h.maliyet, harcanan: pesin + h.arsaMaliyet, ilerleme: 0, asama: 0,
    durum: "ruhsat", ruhsatGun: ruhsatSure,
    birimler: h.birimler.map(b => ({ ...b, satilan: 0, fiyat: b.birimFiyat })),
    fiyatAyar: 1.0, maketSatis: false, kkPay: c.katKarsiligi ? c.arsa.kkPay : 0,
    donatiTalep: h.donatiTalep, donatiSatis: h.donatiSatis,
    m2Mal: h.m2Mal, isYuku: h.isYuku, kalanIs: h.isYuku,
    tahminHasilat: h.hasilat, gelir: 0, kiraAylik: 0, otelGelir: 0,
    baslangic: tarih(), kusur: 0
  };
  S.projeler.push(p);
  S.arsalar = S.arsalar.filter(x => x.id !== c.arsa.id);
  logEkle(p.ad + " için ruhsat başvurusu yapıldı (" + ruhsatSure + " ay).");
  save(); return null;
}

/* ---------- maketten satış ---------- */
function maketAc(p) {
  if (p.maketSatis) return "Zaten maketten satış açık.";
  p.maketSatis = true;
  logEkle(p.ad + " maketten satışa açıldı (%12 indirimli).");
  save(); return null;
}

/* ---------- kredi ---------- */
function krediLimit() {
  const teminat = S.projeler.reduce((t, p) => t + p.toplamM2 * p.m2Mal * 0.35, 0) +
    S.arsalar.reduce((t, a) => t + a.fiyat * 0.5, 0);
  return Math.max(5000000, (teminat + S.nakit * 0.6) * (S.krediPuani / 1400));
}
function krediCek(tutar, vade) {
  tutar = Math.round(tutar);
  if (tutar <= 0) return "Geçersiz tutar.";
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  if (tutar + borc > krediLimit()) return "Kredi limitin yetmiyor. Limit: " + fmt(krediLimit() - borc);
  const faiz = S.faiz * (S.krediPuani < 1000 ? 1.35 : S.krediPuani > 1600 ? 0.85 : 1) * (1 - muhasebe().faizIndirim);
  const toplam = tutar * Math.pow(1 + faiz, vade / 12);
  const taksit = toplam / vade;
  S.krediler.push({ id: nid(), anapara: tutar, kalan: toplam, taksit, vade, kalanVade: vade, faiz });
  S.nakit += tutar;
  logEkle(fmt(tutar) + " kredi çekildi. Aylık taksit " + fmt(taksit) + " (" + vade + " ay).");
  save(); return null;
}
function krediKapat(id) {
  const k = S.krediler.find(x => x.id === id); if (!k) return "Kredi yok.";
  const indirimli = k.kalan * 0.96;
  if (S.nakit < indirimli) return "Yetersiz nakit. Gerekli: " + fmt(indirimli);
  S.nakit -= indirimli;
  S.krediler = S.krediler.filter(x => x.id !== id);
  S.odemeler = S.odemeler.filter(o => o.krediId !== id);
  S.krediPuani = clamp(S.krediPuani + 40, 600, 1900);
  logEkle("Kredi erken kapatıldı: " + fmt(indirimli) + ". Kredi puanı yükseldi.");
  save(); return null;
}

/* ---------- malzeme ---------- */
function malzemeAl(k, miktar) {
  const m = MALZEMELER.find(x => x.k === k);
  const birim = m.fiyat * S.malzemeEndeks * 0.94; /* toptan */
  const tutar = birim * miktar;
  if (S.nakit < tutar) return "Yetersiz nakit (" + fmt(tutar) + ").";
  S.nakit -= tutar; S.stok[k] = (S.stok[k] || 0) + miktar;
  S.gunlukGider += tutar;
  logEkle(m.ad + " alındı: " + miktar.toLocaleString("tr-TR") + " " + m.birim + " / " + fmt(tutar));
  save(); return null;
}
function malzemeSat(k, miktar) {
  const m = MALZEMELER.find(x => x.k === k);
  if ((S.stok[k] || 0) < miktar) return "Stok yetersiz.";
  const tutar = m.fiyat * S.malzemeEndeks * 0.88 * miktar;
  S.stok[k] -= miktar; S.nakit += tutar; S.gunlukGelir += tutar;
  logEkle(m.ad + " satıldı: " + fmt(tutar)); save(); return null;
}

/* ---------- personel / varlık ---------- */
function personelAl(k, n) {
  S.personel[k] = (S.personel[k] || 0) + n;
  logEkle(PERSONEL.find(x => x.k === k).ad + " x" + n + " işe alındı.");
  save();
}
function personelCikar(k, n) {
  const v = S.personel[k] || 0; n = Math.min(n, v);
  const tazminat = PERSONEL.find(x => x.k === k).maas * n * 1.5;
  if (S.nakit < tazminat) return "Tazminat için yetersiz nakit (" + fmt(tazminat) + ").";
  S.nakit -= tazminat; S.personel[k] = v - n;
  S.itibar = clamp(S.itibar - 0.3 * n, 0, 100);
  logEkle(n + " kişi çıkarıldı. Tazminat: " + fmt(tazminat)); save(); return null;
}
function satinAl(tip, k) {
  let L, hedef;
  if (tip === "makine") { L = MAKINELER; hedef = S.makineler; }
  else if (tip === "koleksiyon") { L = KOLEKSIYON; hedef = S.koleksiyon; }
  else return "?";
  const o = L.find(x => x.k === k); if (!o) return "Bulunamadı.";
  if (hedef.includes(k)) return "Zaten sahipsin.";
  if (S.nakit < o.fiyat) return "Yetersiz nakit (" + fmt(o.fiyat) + ").";
  S.nakit -= o.fiyat; hedef.push(k);
  logEkle(o.ad + " alındı: " + fmt(o.fiyat)); save(); return null;
}
function ofisYukselt() {
  if (S.ofisSeviye >= OFISLER.length - 1) return "En üst seviyedesin.";
  const o = OFISLER[S.ofisSeviye + 1];
  if (S.nakit < o.fiyat) return "Yetersiz nakit (" + fmt(o.fiyat) + ").";
  S.nakit -= o.fiyat; S.ofisSeviye++;
  logEkle("Ofis yükseltildi: " + o.ad); save(); return null;
}
function sponsorToggle(k) {
  const P = SPONSORLUK.find(x => x.k === k);
  if (S.sponsorluklar.includes(k)) {
    S.sponsorluklar = S.sponsorluklar.filter(x => x !== k);
    logEkle(P.ad + " sonlandırıldı.");
  } else { S.sponsorluklar.push(k); logEkle(P.ad + " başladı."); }
  save();
}

/* ---------- şans çarkı ---------- */
const CARK = [
  { ad: "Nakit ikramiye", f: () => { const t = RI(5, 60) * 100000; S.nakit += t; return fmt(t) + " kazandın!"; } },
  { ad: "Kredi puanı", f: () => { S.krediPuani = clamp(S.krediPuani + 35, 600, 1900); return "Kredi puanı +35"; } },
  { ad: "İtibar", f: () => { S.itibar = clamp(S.itibar + 1.2, 0, 100); return "İtibar +1.2"; } },
  { ad: "Malzeme hediyesi", f: () => { const m = pick(MALZEMELER); const q = Math.round(m.m2 * RI(200, 900)); S.stok[m.k] += q; return m.ad + " +" + q + " " + m.birim; } },
  { ad: "Boş", f: () => "Bu tur boş çıktı." },
  { ad: "Nadir saat", f: () => { const k = pick(["saat1", "saat2"]); if (!S.koleksiyon.includes(k)) { S.koleksiyon.push(k); return KOLEKSIYON.find(x => x.k === k).ad + " kazandın!"; } S.nakit += 1500000; return fmt(1500000) + " kazandın!"; } },
  { ad: "Vergi iadesi", f: () => { const t = RI(3, 25) * 100000; S.nakit += t; return "Vergi iadesi: " + fmt(t); } },
  { ad: "Arsa ipucu", f: () => { pazarYenile(); return "Arsa pazarı yenilendi!"; } }
];
function carkCevir() {
  if (S.toplamGun - S.carkGun < 5) return { hata: "Çark " + (5 - (S.toplamGun - S.carkGun)) + " gün sonra yeniden hazır." };
  S.carkGun = S.toplamGun;
  const o = pick(CARK);
  const m = o.f();
  logEkle("Şans çarkı: " + m); save();
  return { ad: o.ad, mesaj: m };
}

/* ---------- ihaleler ---------- */
const IHALE_TIPLERI = [
  { k: "okul", ad: "İlkokul Binası", m2: [2200, 5500], sure: [6, 11], yid: false },
  { k: "otopark", ad: "Katlı Otopark", m2: [3000, 9000], sure: [7, 13], yid: false },
  { k: "pazar", ad: "Semt Pazarı", m2: [1500, 4000], sure: [4, 8], yid: false },
  { k: "kavsak", ad: "Köprülü Kavşak", m2: [6000, 18000], sure: [10, 20], yid: false },
  { k: "spor", ad: "Spor Kompleksi", m2: [4000, 12000], sure: [8, 16], yid: false },
  { k: "hastane", ad: "Devlet Hastanesi", m2: [12000, 40000], sure: [16, 30], yid: false },
  { k: "yidotopark", ad: "YİD Katlı Otopark", m2: [4000, 11000], sure: [9, 16], yid: true },
  { k: "yidterminal", ad: "YİD Otogar", m2: [9000, 26000], sure: [14, 26], yid: true }
];
function ihaleUret() {
  const t = pick(IHALE_TIPLERI);
  const ilAd = pick(S.acikIller);
  const i = il(ilAd); const d = pick(i.d);
  const m2 = RI(t.m2[0], t.m2[1]);
  const birimMaliyet = 16500 * S.maliyetEndeks * (1 + (d[1] - 1) * 0.12);
  const maliyet = m2 * birimMaliyet;
  const yaklasik = maliyet * R(1.18, 1.42);
  const sure = RI(t.sure[0], t.sure[1]);
  const rakip = RI(2, 5);
  return {
    id: nid(), tip: t.k, ad: t.ad, il: ilAd, ilce: d[0], m2, sure,
    yaklasikMaliyet: Math.round(yaklasik), tahminMaliyet: Math.round(maliyet),
    rakip, sonGun: S.toplamGun + RI(20, 70), yid: t.yid,
    yidAylik: t.yid ? Math.round(maliyet * R(0.014, 0.022)) : 0, yidSure: t.yid ? RI(72, 144) : 0
  };
}
function ihaleTeklif(id, teklif) {
  const ih = S.ihaleler.find(x => x.id === id); if (!ih) return "İhale bulunamadı.";
  const itb = itibarToplam();
  let enIyiRakip = Infinity;
  for (let i = 0; i < ih.rakip; i++) {
    const r = ih.tahminMaliyet * R(1.04, 1.34);
    if (r < enIyiRakip) enIyiRakip = r;
  }
  enIyiRakip *= (1 - itb * 0.0012);
  if (teklif > ih.yaklasikMaliyet * 1.05) { S.ihaleler = S.ihaleler.filter(x => x.id !== id); return "Teklifin yaklaşık maliyetin üstünde, ihale dışı kaldın."; }
  if (teklif >= enIyiRakip) {
    S.ihaleler = S.ihaleler.filter(x => x.id !== id);
    logEkle(ih.ad + " ihalesini kaybettin. Kazanan teklif ~" + fmt(enIyiRakip));
    save(); return "İhaleyi kaybettin. Kazanan teklif yaklaşık " + fmt(enIyiRakip) + ".";
  }
  const teminat = teklif * 0.03;
  if (S.nakit < teminat) return "Teminat için yetersiz nakit (" + fmt(teminat) + ").";
  S.nakit -= teminat;
  const p = {
    id: nid(), ad: ih.ad + " (" + ih.ilce + ")", tip: "ihale", il: ih.il, ilce: ih.ilce,
    toplamM2: ih.m2, kalite: "standart", durum: "insaat", ilerleme: 0, asama: 0,
    isYuku: ih.m2 * 1.05, kalanIs: ih.m2 * 1.05, m2Mal: ih.tahminMaliyet / ih.m2,
    butce: ih.tahminMaliyet, harcanan: teminat, bedel: teklif, sure: ih.sure,
    donatilar: [], birimler: [], gelir: 0, teminat,
    yid: ih.yid, yidAylik: ih.yidAylik, yidSure: ih.yidSure,
    cezaAy: ih.sure, baslangic: tarih(), kusur: 0, fiyatAyar: 1, donatiTalep: 0, donatiSatis: 0, gecenGun: 0
  };
  S.projeler.push(p);
  S.ihaleler = S.ihaleler.filter(x => x.id !== id);
  logEkle(ih.ad + " ihalesi " + fmt(teklif) + " ile kazanıldı!");
  S.itibar = clamp(S.itibar + 2, 0, 100);
  save(); return null;
}

/* ---------- satış mekaniği ---------- */
function projeTalep(p) {
  const d = ilceVeri(p.il, p.ilce); if (!d) return 0;
  const km = p.karma ? karma(p.karma) : { talep: 1 };
  const beklenti = ilceBeklenti(d.mult);
  const kb = kalite(p.kalite).beklenti;
  const uyum = Math.exp(-Math.pow(kb - beklenti, 2) / 0.42);
  const itb = itibarToplam();
  let t = 5.0 * d.talep * km.talep * uyum * (1 + p.donatiTalep);
  t *= (0.70 + itb / 100 * 0.65);
  t *= (1 + S.satisDanismani * 0.17);
  if (S.satisOfisi) t *= 1.22;
  t *= Math.pow(1 / clamp(p.fiyatAyar, 0.6, 1.6), 2.4);
  t *= S.konutEndeks;
  if (p.maketSatis && p.durum !== "satis") t *= 0.55;
  const mevsim = [0.8, 0.85, 1.05, 1.15, 1.2, 1.1, 0.9, 0.85, 1.15, 1.2, 1.05, 0.9][S.ay % 12];
  t *= mevsim;
  t *= (1 - p.kusur * 0.1);
  if (p.tip === "villa") t *= 0.55;
  if (p.tip === "rezidans") t *= 0.85;
  return Math.max(0, t);
}
function satisTick(p) {
  if (p.tip === "avm" || p.tip === "otel" || p.tip === "ihale") return;
  if (p.durum !== "satis" && !(p.maketSatis && p.durum === "insaat")) return;
  p.satisBirikim = (p.satisBirikim || 0) + projeTalep(p) / AY_GUN;
  if (p.satisBirikim < 1) return;
  let kalanTalep = Math.floor(p.satisBirikim);
  p.satisBirikim -= kalanTalep;
  const indirim = (p.durum === "insaat" && p.maketSatis) ? 0.88 : 1;
  let gelir = 0, adet = 0;
  const sira = p.birimler.slice().sort(() => Math.random() - .5);
  for (const b of sira) {
    const kalan = b.adet - b.satilan; if (kalan <= 0) continue;
    const pay = b.adet / p.birimler.reduce((t, x) => t + x.adet, 0);
    let sat = Math.min(kalan, Math.floor(kalanTalep * pay + (Math.random() < (kalanTalep * pay % 1) ? 1 : 0)));
    if (sat <= 0) continue;
    kalanTalep -= sat;
    const f = b.fiyat * p.fiyatAyar * indirim;
    b.satilan += sat; gelir += sat * f; adet += sat;
  }
  if (gelir > 0) {
    S.nakit += gelir; p.gelir += gelir; S.satilanDaire += adet;
    S.toplamKar += gelir; S.gunlukGelir += gelir;
    logEkle(p.ad + ": " + adet + " birim satıldı, " + fmt(gelir) + " tahsil edildi.");
  }
  const toplam = p.birimler.reduce((t, x) => t + x.adet, 0);
  const satilan = p.birimler.reduce((t, x) => t + x.satilan, 0);
  if (toplam > 0 && satilan >= toplam && p.durum === "satis") {
    p.durum = "tamam"; S.bitenProje++;
    S.itibar = clamp(S.itibar + 3.5, 0, 100);
    logEkle(p.ad + " tamamen satıldı! İtibar arttı.");
  }
}

/* ---------- inşaat ---------- */
function insaatTick() {
  const aktif = S.projeler.filter(p => p.durum === "insaat");
  if (!aktif.length) return;
  const kap = ekipKapasite() / AY_GUN;   /* günlük kapasite */
  const pay = kap / aktif.length;
  const ekipK = ekipKalite();
  for (const p of aktif) {
    const onceki = p.ilerleme;
    let hiz = pay;
    if (ekipK < 0.35) hiz *= 0.85;
    if (S.maasGecikti) hiz *= 0.55;   /* maaşını alamayan ekip yavaşlar */
    hiz *= R(0.92, 1.08);
    const yapilan = Math.min(p.kalanIs, hiz);
    p.kalanIs -= yapilan;
    p.ilerleme = clamp(1 - p.kalanIs / p.isYuku, 0, 1);
    let yeniM2 = (p.ilerleme - onceki) * p.toplamM2;
    if (yeniM2 > 0) {
      const gerekli = tahminiAylikGider(p, yeniM2);
      const kullanilabilir = Math.max(0, S.nakit);
      if (gerekli > kullanilabilir) {
        const oran = gerekli > 0 ? kullanilabilir / gerekli : 0;
        const geri = yeniM2 * (1 - oran);
        p.kalanIs += geri * (p.isYuku / p.toplamM2);
        p.ilerleme = clamp(1 - p.kalanIs / p.isYuku, 0, 1);
        yeniM2 = yeniM2 * oran;
        if (oran < 0.95 && !p.durduruldu) { p.durduruldu = true; logEkle(p.ad + ": nakit yetersiz, şantiye yavaşladı."); }
      } else p.durduruldu = false;
      if (yeniM2 > 0) odemeVeMalzeme(p, yeniM2);
    }
    /* aşama */
    let kum = 0, idx = 0;
    for (let i = 0; i < ASAMALAR.length; i++) { kum += ASAMALAR[i].pay; if (p.ilerleme <= kum + 0.0001) { idx = i; break; } idx = i; }
    if (idx !== p.asama) { p.asama = idx; logEkle(p.ad + ": " + ASAMALAR[idx].ad + " aşamasına geçildi."); }
    if (p.ilerleme >= 0.999) tamamla(p);
  }
}
function tahminiAylikGider(p, m2) {
  const kc = p.kalite ? kalite(p.kalite).malzemeCarpan : 1;
  let t = 0;
  for (const m of MALZEMELER) {
    const ihtiyac = m.m2 * m2 * kc;
    const eksik = Math.max(0, ihtiyac - (S.stok[m.k] || 0));
    t += eksik * m.fiyat * S.malzemeEndeks * 1.12;
  }
  const digerPay = p.tip === "ihale" ? p.m2Mal * 0.55 : Math.max(0, p.m2Mal - malzemeM2TL(p.kalite));
  return t + m2 * digerPay;
}
function odemeVeMalzeme(p, m2) {
  /* malzeme tüketimi */
  const kc = p.kalite ? kalite(p.kalite).malzemeCarpan : 1;
  let eksikTutar = 0;
  for (const m of MALZEMELER) {
    const ihtiyac = m.m2 * m2 * kc;
    const mevcut = S.stok[m.k] || 0;
    const kullan = Math.min(mevcut, ihtiyac);
    S.stok[m.k] = mevcut - kullan;
    const eksik = ihtiyac - kullan;
    if (eksik > 0) eksikTutar += eksik * m.fiyat * S.malzemeEndeks * 1.12;
  }
  const digerPay = p.tip === "ihale" ? p.m2Mal * 0.55 : Math.max(0, p.m2Mal - malzemeM2TL(p.kalite));
  const nakitGider = m2 * digerPay + eksikTutar;
  S.nakit -= nakitGider; p.harcanan += nakitGider;
  S.gunlukGider += nakitGider;
  if (S.nakit < 0 && !S.krediler.some(k => k.acil)) {
    /* zorunlu gecikme kredisi - aynı anda yalnızca bir tane */
    const ihtiyac = Math.ceil(-S.nakit / 100000) * 100000;
    const faiz = S.faiz * 1.8;
    S.krediler.push({ id: nid(), anapara: ihtiyac, kalan: ihtiyac * Math.pow(1 + faiz, 1), taksit: ihtiyac * Math.pow(1 + faiz, 1) / 12, vade: 12, kalanVade: 12, faiz, acil: true });
    S.nakit += ihtiyac;
    S.krediPuani = clamp(S.krediPuani - 45, 600, 1900);
    logEkle("Nakit yetmedi, " + fmt(ihtiyac) + " acil kredi kullanıldı (yüksek faiz).");
  }
}
function tamamla(p) {
  p.ilerleme = 1;
  if (p.tip === "ihale") {
    let bedel = p.bedel;
    const gecikme = Math.max(0, Math.floor((p.gecenGun || 0) / AY_GUN) - p.sure);
    if (gecikme > 0) { bedel *= (1 - clamp(gecikme * 0.02, 0, 0.25)); logEkle(p.ad + ": " + gecikme + " ay gecikme cezası uygulandı."); }
    S.nakit += bedel + p.teminat;
    p.gelir = bedel; p.durum = "tamam"; S.bitenProje++;
    S.toplamKar += bedel;
    S.itibar = clamp(S.itibar + 3, 0, 100);
    S.krediPuani = clamp(S.krediPuani + 25, 600, 1900);
    logEkle(p.ad + " teslim edildi. " + fmt(bedel) + " tahsil edildi.");
    if (p.yid) {
      S.yid.push({ id: nid(), ad: p.ad, aylik: p.yidAylik, kalan: p.yidSure });
      logEkle(p.ad + " yap-işlet-devret geliri başladı: " + fmt(p.yidAylik) + "/ay, " + p.yidSure + " ay.");
    }
    return;
  }
  if (p.tip === "avm") {
    p.durum = "isletme"; p.kiraAylik = 0;
    logEkle(p.ad + " tamamlandı. Mağaza kiralamaları başlıyor.");
    S.bitenProje++; S.itibar = clamp(S.itibar + 3, 0, 100);
    return;
  }
  if (p.tip === "otel") {
    p.durum = "isletme";
    logEkle(p.ad + " tamamlandı. Sezon geliri başlıyor.");
    S.bitenProje++; S.itibar = clamp(S.itibar + 3.5, 0, 100);
    return;
  }
  p.durum = "satis";
  logEkle(p.ad + " iskan aldı, satışa açıldı.");
  S.itibar = clamp(S.itibar + 1.5, 0, 100);
}

/* ---------- işletme gelirleri ---------- */
function isletmeTick() {
  for (const p of S.projeler) {
    if (p.durum !== "isletme") continue;
    if (p.tip === "avm") {
      const b = p.birimler[0];
      p.kiraBirikim = (p.kiraBirikim || 0) + projeTalep(p) * 0.9 / AY_GUN;
      const bos = b.adet - b.satilan;
      const yeni = Math.min(bos, Math.floor(p.kiraBirikim));
      if (yeni > 0) { b.satilan += yeni; p.kiraBirikim -= yeni; logEkle(p.ad + ": " + yeni + " mağaza kiraya verildi."); }
      const kira = b.satilan * b.birimFiyat * p.fiyatAyar / AY_GUN;
      S.nakit += kira; p.gelir += kira; p.kiraAylik = kira * AY_GUN; S.toplamKar += kira;
      S.gunlukGelir += kira;
    } else if (p.tip === "otel") {
      const b = p.birimler[0];
      const ay = S.ay % 12;
      const sezon = [0.18, 0.18, 0.28, 0.42, 0.68, 0.92, 1.0, 1.0, 0.85, 0.52, 0.26, 0.20][ay];
      const itb = itibarToplam();
      const doluluk = clamp(sezon * (0.55 + itb / 200) * (1 + p.donatiSatis) / clamp(p.fiyatAyar, .6, 1.6), 0, 0.98);
      const gelir = b.adet * b.birimFiyat * p.fiyatAyar * doluluk;   /* günlük */
      const isletmeGider = gelir * 0.34 + b.adet * 7000 / AY_GUN;
      const net = gelir - isletmeGider;
      S.nakit += net; p.gelir += net; p.otelGelir = net * AY_GUN; S.toplamKar += net;
      S.gunlukGelir += net;
    }
  }
  for (const y of S.yid) {
    if (y.kalan > 0) {
      const g = y.aylik / AY_GUN;
      S.nakit += g; S.toplamKar += g; S.gunlukGelir += g;
      y.gunSayac = (y.gunSayac || 0) + 1;
      if (y.gunSayac >= AY_GUN) { y.gunSayac = 0; y.kalan--; }
    }
  }
  S.yid = S.yid.filter(y => y.kalan > 0);
}

/* ---------- olaylar ---------- */
const OLAYLAR = [
  { k: "kaza", ad: "İş Kazası", p: .07, f: () => { const akt = S.projeler.filter(p => p.durum === "insaat"); if (!akt.length) return null; const p = pick(akt); const ceza = p.toplamM2 * RI(250, 700); S.nakit -= ceza; S.itibar = clamp(S.itibar - 3, 0, 100); p.kalanIs += p.isYuku * 0.04; return p.ad + " şantiyesinde iş kazası. Ceza " + fmt(ceza) + ", itibar -3, inşaat gecikti."; } },
  { k: "imar", ad: "İmar Değişikliği", p: .05, f: () => { if (!S.arsalar.length) return null; const a = pick(S.arsalar); const yon = Math.random() < .55 ? 1 : -1; const d = +(R(0.1, 0.35) * yon).toFixed(2); a.emsal = Math.max(0.4, +(a.emsal + d).toFixed(2)); a.maxKat = clamp(Math.ceil(a.emsal / a.taks), 2, 32); return a.ilce + " arsanda emsal " + (yon > 0 ? "arttı" : "düştü") + ": yeni emsal " + a.emsal; } },
  { k: "faiz", ad: "Faiz Kararı", p: .09, f: () => { const d = R(-0.008, 0.012); S.faiz = clamp(S.faiz + d, 0.018, 0.085); return "Merkez Bankası kararı: aylık kredi faizi %" + (S.faiz * 100).toFixed(1) + "."; } },
  { k: "malzeme", ad: "Malzeme Şoku", p: .10, f: () => { const d = R(-0.07, 0.14); S.malzemeEndeks = clamp(S.malzemeEndeks * (1 + d), 0.6, 3.2); return "Malzeme fiyatları %" + (d * 100).toFixed(0) + " değişti. Endeks: " + S.malzemeEndeks.toFixed(2); } },
  { k: "konut", ad: "Konut Piyasası", p: .12, f: () => { const d = R(-0.06, 0.09); S.konutEndeks = clamp(S.konutEndeks * (1 + d), 0.55, 3.5); return "Konut piyasası %" + (d * 100).toFixed(0) + " hareket etti. Endeks: " + S.konutEndeks.toFixed(2); } },
  { k: "yonetmelik", ad: "Deprem Yönetmeliği", p: .035, f: () => { S.maliyetEndeks = clamp(S.maliyetEndeks * R(1.04, 1.12), 0.8, 2.5); return "Yeni deprem yönetmeliği yürürlükte. İnşaat maliyet endeksi " + S.maliyetEndeks.toFixed(2) + "."; } },
  { k: "tesvik", ad: "Kentsel Dönüşüm Teşviki", p: .05, f: () => { const t = RI(8, 40) * 100000; S.nakit += t; return "Kentsel dönüşüm teşviki alındı: " + fmt(t); } },
  { k: "denetim", ad: "Yapı Denetimi", p: .06, f: () => { const akt = S.projeler.filter(p => p.durum === "insaat"); if (!akt.length) return null; const p = pick(akt); if (ekipKalite() < 0.45) { p.kusur = Math.min(3, p.kusur + 1); S.itibar = clamp(S.itibar - 2, 0, 100); return p.ad + " denetimden kusurlu geçti. Kalifiye personel al! Kusur: " + p.kusur; } S.itibar = clamp(S.itibar + 1.5, 0, 100); return p.ad + " denetimi sorunsuz geçti. İtibar +1.5"; } },
  { k: "rakip", ad: "Rakip Kampanyası", p: .07, f: () => { const sat = S.projeler.filter(p => p.durum === "satis"); if (!sat.length) return null; const p = pick(sat); p.kusur = p.kusur; S.konutEndeks *= 0.985; return "Rakip firma " + p.ilce + "'de fiyat kırdı. Satışlar bu dönem yavaşlayabilir."; } },
  { k: "musteri", ad: "Memnun Müşteri", p: .07, f: () => { S.itibar = clamp(S.itibar + 2, 0, 100); return "Teslim ettiğin dairelerden referans geldi. İtibar +2"; } },
  { k: "doviz", ad: "Döviz Hareketi", p: .06, f: () => { const d = R(-0.05, 0.09); S.malzemeEndeks = clamp(S.malzemeEndeks * (1 + d * 0.7), 0.6, 3.2); S.konutEndeks = clamp(S.konutEndeks * (1 + d * 0.4), 0.55, 3.5); return "Döviz kurunda hareket: malzeme ve konut endeksleri etkilendi."; } },
  { k: "hirsizlik", ad: "Şantiye Hırsızlığı", p: .04, f: () => { const m = pick(MALZEMELER); const q = (S.stok[m.k] || 0) * R(0.1, 0.4); if (q < 1) return null; S.stok[m.k] -= q; return "Şantiyeden " + Math.round(q) + " " + m.birim + " " + m.ad + " çalındı."; } },
  { k: "banka", ad: "Banka Teklifi", p: .05, f: () => { S.krediPuani = clamp(S.krediPuani + RI(10, 45), 600, 1900); return "Bankayla ilişkiler iyi gidiyor. Kredi puanı " + S.krediPuani + "."; } }
];
function olayTick() {
  const cikan = [];
  for (const o of OLAYLAR) {
    if (Math.random() < o.p / AY_GUN) {
      const m = o.f();
      if (m) { cikan.push({ ad: o.ad, m }); logEkle(o.ad + ": " + m); }
    }
  }
  return cikan;
}

/* ---------- gün döngüsü ---------- */
function gunIlerle(rapor) {
  S.gunlukGelir = 0; S.gunlukGider = 0;
  const basNakit = S.nakit;

  /* ruhsat */
  for (const p of S.projeler) {
    if (p.durum === "ruhsat") {
      p.ruhsatGun--;
      if (p.ruhsatGun <= 0) {
        p.durum = "insaat";
        logEkle(p.ad + " ruhsatı alındı, hafriyat başlıyor.");
        if (rapor) rapor.onemli.push(p.ad + " ruhsatı çıktı.");
      }
    }
    if (p.durum === "insaat" || p.durum === "ruhsat") p.gecenGun = (p.gecenGun || 0) + 1;
  }

  insaatTick();
  for (const p of S.projeler) satisTick(p);
  isletmeTick();

  /* günlük işletme gideri (ofis, bakım, sponsorluk) */
  const gider = aylikIsletmeGideri() / AY_GUN;
  S.nakit -= gider; S.gunlukGider += gider;

  /* ayın ilk günü: maaş, kredi ve vergi tahakkuku */
  if (S.gun === 1) {
    ayBasiTahakkuk(rapor);
    for (const sp of S.sponsorluklar) { const P = SPONSORLUK.find(x => x.k === sp); if (P) S.itibar = clamp(S.itibar + P.itibar, 0, 100); }
  }
  odemeTick(rapor);

  /* itibar ve endeksler */
  S.itibar = clamp(S.itibar - 0.25 / AY_GUN, 0, 100);
  S.konutEndeks = clamp(S.konutEndeks * (1 + R(-0.012, 0.022) / AY_GUN), 0.55, 3.5);
  S.malzemeEndeks = clamp(S.malzemeEndeks * (1 + R(-0.008, 0.020) / AY_GUN), 0.6, 3.2);

  /* olaylar */
  const olaylar = olayTick();
  if (rapor) for (const o of olaylar) { rapor.olaylar.push(o); }

  /* ihaleler */
  S.ihaleler = S.ihaleler.filter(x => x.sonGun >= S.toplamGun);
  if (Math.random() < 0.02 || S.ihaleler.length === 0) S.ihaleler.push(ihaleUret());
  if (S.ihaleler.length > 6) S.ihaleler.shift();

  /* nakit eksiye düşerse acil kredi */
  if (S.nakit < 0 && !S.krediler.some(k => k.acil)) {
    const ih = Math.ceil((-S.nakit + aylikPersonelGider()) / 100000) * 100000;
    const fz = S.faiz * 1.8;
    const tp = ih * Math.pow(1 + fz, 1.5);
    S.krediler.push({ id: nid(), anapara: ih, kalan: tp, taksit: tp / 18, vade: 18, kalanVade: 18, faiz: fz, acil: true });
    S.nakit += ih;
    S.krediPuani = clamp(S.krediPuani - 50, 600, 1900);
    logEkle("Kasa eksiye düştü, " + fmt(ih) + " acil kredi kullanıldı.");
    if (rapor) rapor.onemli.push("Acil kredi kullanıldı: " + fmt(ih));
  }

  /* zaman */
  S.gun++; S.toplamGun++;
  if (S.gun > AY_GUN) {
    S.gun = 1; S.ay++;
    if (S.ay >= 12) { S.ay = 0; S.yil++; }
    S.nakitGecmis.push(Math.round(ozVarlik()));
    if (S.nakitGecmis.length > 48) S.nakitGecmis.shift();
  }
  /* arsa pazarı 20 günde bir yenilenir */
  if (S.toplamGun - (S.pazarGun || 0) >= 20) { pazarYenile(); S.pazarGun = S.toplamGun; }

  basarimKontrol(rapor);
  S.ayKar += Math.max(0, S.gunlukGelir - S.gunlukGider);
  if (rapor) {
    rapor.gelir += S.gunlukGelir;
    rapor.gider += S.gunlukGider;
    rapor.netDegisim += (S.nakit - basNakit);
  }
}

/* Gerçek zamandan kaç gün geçtiğini hesaplar ve işler. */
function zamanIlerlet() {
  if (!S.sonTik) S.sonTik = Date.now();
  const gecen = Date.now() - S.sonTik;
  let gun = Math.floor(gecen / GUN_MS);
  if (gun < 1) return null;
  const atlanan = Math.max(0, gun - ENFAZLA_GUN);
  if (gun > ENFAZLA_GUN) gun = ENFAZLA_GUN;
  S.sonTik += (gun + atlanan) * GUN_MS;
  const rapor = {
    gun, atlanan, olaylar: [], onemli: [], gelir: 0, gider: 0, netDegisim: 0,
    basNakit: S.nakit, basTarih: tarih(), basProje: S.bitenProje, basDaire: S.satilanDaire
  };
  for (let i = 0; i < gun; i++) gunIlerle(rapor);
  rapor.bitTarih = tarih();
  rapor.yeniProje = S.bitenProje - rapor.basProje;
  rapor.yeniDaire = S.satilanDaire - rapor.basDaire;
  /* aynı olaydan çok sayıda varsa özetle */
  const sayac = {};
  for (const o of rapor.olaylar) sayac[o.ad] = (sayac[o.ad] || 0) + 1;
  rapor.olayOzet = Object.keys(sayac).map(k => ({ ad: k, adet: sayac[k], son: rapor.olaylar.filter(x => x.ad === k).pop().m }));
  save();
  return rapor;
}

/* ---------- başarımlar ---------- */
const BASARIMLAR = [
  { k: "ilkproje", ad: "İlk Kazma", aciklama: "İlk projeni tamamla", kos: () => S.bitenProje >= 1 },
  { k: "on_proje", ad: "Seri Üretim", aciklama: "10 proje tamamla", kos: () => S.bitenProje >= 10 },
  { k: "yuz_daire", ad: "Yüz Daire", aciklama: "100 birim sat", kos: () => S.satilanDaire >= 100 },
  { k: "milyar", ad: "Milyarder", aciklama: "Öz varlığın 1 milyar ₺ olsun", kos: () => ozVarlik() >= 1e9 },
  { k: "on_il", ad: "Anadolu Turu", aciklama: "10 il aç", kos: () => S.acikIller.length >= 10 },
  { k: "tum_il", ad: "81 İl", aciklama: "Türkiye'nin tamamını aç", kos: () => S.acikIller.length >= 81 },
  { k: "avm", ad: "AVM Patronu", aciklama: "Bir AVM işletmeye al", kos: () => S.projeler.some(p => p.tip === "avm" && p.durum === "isletme") },
  { k: "otel", ad: "Sahil Keyfi", aciklama: "Bir otel işletmeye al", kos: () => S.projeler.some(p => p.tip === "otel" && p.durum === "isletme") },
  { k: "ihale", ad: "Kamu İşi", aciklama: "Bir ihale kazan", kos: () => S.projeler.some(p => p.tip === "ihale") },
  { k: "holding", ad: "Holding", aciklama: "Holding Kulesi'ne taşın", kos: () => S.ofisSeviye >= 4 },
  { k: "itibar", ad: "Namlı Müteahhit", aciklama: "İtibarın 80'i geçsin", kos: () => itibarToplam() >= 80 },
  { k: "muhasebe", ad: "Düzenli Defter", aciklama: "Mali Müşavirlik Ofisi kur", kos: () => S.muhasebeci >= 3 },
  { k: "borcsuz", ad: "Borçsuz", aciklama: "100 M ₺ üstü kasayla hiç borcun olmasın", kos: () => S.nakit > 1e8 && S.krediler.length === 0 }
];
function basarimKontrol(rapor) {
  for (const b of BASARIMLAR) {
    if (S.basarimlar.includes(b.k)) continue;
    let ok = false;
    try { ok = b.kos(); } catch (e) { ok = false; }
    if (ok) {
      S.basarimlar.push(b.k);
      logEkle("Başarım kazanıldı: " + b.ad);
      if (rapor) rapor.onemli.push("Başarım: " + b.ad);
    }
  }
}

/* ---------- bitiş kontrolü ---------- */
function nakitAkisUyarisi() {
  /* önümüzdeki 10 günde nakit biter mi? */
  const gunlukNet = (S.gunlukGelir || 0) - (S.gunlukGider || 0);
  if (gunlukNet >= 0) return null;
  const gun = Math.floor(S.nakit / -gunlukNet);
  if (gun > 10) return null;
  return gun;
}
function iflasMi() {
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const varlik = S.nakit + S.arsalar.reduce((t, a) => t + a.fiyat, 0) +
    S.projeler.reduce((t, p) => t + (p.durum === "satis" || p.durum === "isletme" ? p.harcanan * 0.6 : p.harcanan * 0.4), 0);
  return S.nakit < -2000000 && varlik < borc * 0.5;
}
function ozVarlik() {
  const borc = S.krediler.reduce((t, k) => t + k.kalan, 0);
  const arsa = S.arsalar.reduce((t, a) => t + a.fiyat, 0);
  const proje = S.projeler.reduce((t, p) => {
    if (p.durum === "tamam") return t;
    if (p.durum === "satis") { const kalan = p.birimler.reduce((s, b) => s + (b.adet - b.satilan) * b.fiyat * p.fiyatAyar, 0); return t + kalan * 0.9; }
    if (p.durum === "isletme") return t + p.harcanan * 1.1;
    return t + p.harcanan * 0.85;
  }, 0);
  const stok = MALZEMELER.reduce((t, m) => t + (S.stok[m.k] || 0) * m.fiyat * S.malzemeEndeks, 0);
  const varliklar = S.makineler.reduce((t, k) => t + MAKINELER.find(x => x.k === k).fiyat * 0.7, 0) +
    S.koleksiyon.reduce((t, k) => t + KOLEKSIYON.find(x => x.k === k).fiyat * 0.85, 0);
  return S.nakit + arsa + proje + stok + varliklar - borc;
}
