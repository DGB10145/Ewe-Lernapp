/* Eʋegbe – Audio: Töne analysieren, Tonmelodie summen, aufnehmen, Tonhöhe messen, Referenzaufnahmen speichern. */
(function () {
  'use strict';
  const ACUTE = '́', GRAVE = '̀', CARON = '̌', CIRC = '̂', TILDE = '̃';
  const VOWELS = 'aeɛioɔuəAEƐIOƆU';
  const TONE_MARKS = new RegExp('[' + ACUTE + GRAVE + CARON + CIRC + ']', 'g');

  /** Zerlegt Ewe-Text in Wörter → Silben mit Ton (H/L/R/F). */
  function analyze(text) {
    const words = [];
    const clean = text.normalize('NFD').replace(/[.,!?;:“”"„()…\-–/]/g, ' ');
    for (const raw of clean.split(/\s+/).filter(Boolean)) {
      // In Grapheme mit ihren Kombinationszeichen gruppieren
      const g = [];
      for (const ch of raw) {
        if (/\p{M}/u.test(ch) && g.length) g[g.length - 1] += ch; else g.push(ch);
      }
      const syl = []; let onset = '';
      g.forEach((gr, i) => {
        const base = gr[0];
        const marks = gr.slice(1);
        const isV = VOWELS.includes(base);
        const syllabicNasal = (base === 'm' || base === 'n') && /[́̀̌̂]/.test(marks) && (i === g.length - 1 || !VOWELS.includes((g[i + 1] || ' ')[0]));
        if (isV || syllabicNasal) {
          let tone = 'L';
          if (marks.includes(ACUTE)) tone = 'H';
          if (marks.includes(CARON)) tone = 'R';
          if (marks.includes(CIRC)) tone = 'F';
          syl.push({ text: (onset + gr).normalize('NFC'), tone, nasal: marks.includes(TILDE) });
          onset = '';
        } else {
          onset += gr;
        }
      });
      if (onset) {
        if (syl.length) syl[syl.length - 1].text = (syl[syl.length - 1].text + onset).normalize('NFC');
        else syl.push({ text: onset.normalize('NFC'), tone: 'L', nasal: false });
      }
      if (syl.length) words.push(syl);
    }
    return words;
  }

  function stripTones(s) { return s.normalize('NFD').replace(TONE_MARKS, '').normalize('NFC'); }
  function stripAll(s) { return s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC'); }

  const TONE_NAMES = { H: 'hoch', L: 'tief', R: 'steigend', F: 'fallend' };
  function toneSvg(t) {
    const y = { H: [3, 3], L: [13, 13], R: [13, 3], F: [3, 13] }[t];
    return `<svg viewBox="0 0 28 16" aria-label="${TONE_NAMES[t]}"><line x1="3" y1="${y[0]}" x2="25" y2="${y[1]}" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>`;
  }
  function toneChips(text) {
    const words = analyze(text);
    return '<div class="tones">' + words.map(w => w.map(s => `<span class="syl">${toneSvg(s.tone)}<span>${s.text}</span></span>`).join('')).join('<span class="syl gap"></span>') + '</div>';
  }

  // ---------- Audio-Kontext ----------
  let ctx = null;
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Summt die Tonmelodie (Tiefton/Hochton) des Textes. */
  function hum(text, opts = {}) {
    const a = ac();
    const low = opts.low || 150, high = opts.high || 215;
    const syl = 0.26, gap = 0.12;
    let t = a.currentTime + 0.05;
    const words = analyze(text);
    const master = a.createGain(); master.gain.value = 0.22; master.connect(a.destination);
    const filt = a.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 1200; filt.connect(master);
    for (const w of words) {
      for (const s of w) {
        const o = a.createOscillator(); o.type = 'triangle';
        const g = a.createGain(); g.gain.value = 0;
        o.connect(g); g.connect(filt);
        const f0 = { H: high, L: low, R: low, F: high }[s.tone];
        const f1 = { H: high, L: low, R: high * 1.04, F: low * 0.95 }[s.tone];
        o.frequency.setValueAtTime(f0, t);
        o.frequency.linearRampToValueAtTime(f1, t + syl);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(1, t + 0.03);
        g.gain.setValueAtTime(1, t + syl - 0.05);
        g.gain.linearRampToValueAtTime(0, t + syl);
        o.start(t); o.stop(t + syl + 0.02);
        t += syl + 0.02;
      }
      t += gap;
    }
    return new Promise(r => setTimeout(r, (t - a.currentTime) * 1000));
  }

  // ---------- Referenzaufnahmen (IndexedDB) ----------
  const DB = 'ewe-audio', STORE = 'refs';
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  const keyOf = t => t.normalize('NFC').trim().toLowerCase();
  async function getRef(text) {
    try { const d = await db(); return await new Promise(res => { const q = d.transaction(STORE).objectStore(STORE).get(keyOf(text)); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; }
  }
  async function putRef(text, blob) {
    const d = await db();
    return new Promise((res, rej) => { const tx = d.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put({ blob, type: blob.type, at: Date.now(), text }, keyOf(text)); refCache.delete(keyOf(text)); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  }
  async function delRef(text) {
    const d = await db();
    return new Promise(res => { const tx = d.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(keyOf(text)); tx.oncomplete = res; });
  }
  async function allRefKeys() {
    try { const d = await db(); return await new Promise(res => { const q = d.transaction(STORE).objectStore(STORE).getAllKeys(); q.onsuccess = () => res(q.result || []); q.onerror = () => res([]); }); } catch (e) { return []; }
  }
  async function exportRefs() {
    const d = await db();
    const all = await new Promise(res => { const out = []; const c = d.transaction(STORE).objectStore(STORE).openCursor(); c.onsuccess = () => { const cur = c.result; if (cur) { out.push([cur.key, cur.value]); cur.continue(); } else res(out); }; });
    const items = [];
    for (const [k, v] of all) {
      const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(v.blob); });
      items.push({ key: k, text: v.text, data: b64 });
    }
    return items;
  }
  async function importRefs(items) {
    let n = 0;
    for (const it of items) {
      const blob = await (await fetch(it.data)).blob();
      await putRef(it.text || it.key, blob); n++;
    }
    return n;
  }

  let currentAudio = null;
  function playBlob(blob, rate = 1) {
    return new Promise(res => {
      if (currentAudio) { currentAudio.pause(); }
      const url = URL.createObjectURL(blob);
      const au = new Audio(url); currentAudio = au;
      au.playbackRate = rate; au.preservesPitch = true; au.webkitPreservesPitch = true;
      au.onended = () => { URL.revokeObjectURL(url); res(); };
      au.onerror = () => res();
      au.play().catch(() => res());
    });
  }


  function stopAudio() { if (currentAudio) currentAudio.pause(); }
  // Float32 -> WAV (16 bit mono)
  function encodeWav(x, sr) {
    const b = new ArrayBuffer(44 + x.length * 2), v = new DataView(b);
    const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + x.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    w(36, 'data'); v.setUint32(40, x.length * 2, true);
    for (let i = 0; i < x.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, x[i])) * 0x7fff, true);
    return new Blob([b], { type: 'audio/wav' });
  }
  /** Zerlegt eine lange Aufnahme an Sprechpausen. */
  async function splitBySilence(blob, minPause = 0.35) {
    const d = await decode(blob);
    // auf ~22 kHz reduzieren, damit die Ausschnitte klein bleiben
    const k = Math.max(1, Math.floor(d.sr / 22050)), sr = d.sr / k;
    const x = new Float32Array(Math.floor(d.data.length / k));
    for (let i = 0; i < x.length; i++) { let s = 0; for (let j = 0; j < k; j++) s += d.data[i * k + j]; x[i] = s / k; }
    const hop = Math.round(sr * 0.01), e = [];
    for (let s = 0; s + hop <= x.length; s += hop) { let r = 0; for (let i = 0; i < hop; i++) r += x[s + i] * x[s + i]; e.push(Math.sqrt(r / hop)); }
    const sorted = [...e].sort((a, b) => a - b), noise = sorted[Math.floor(sorted.length * 0.1)], loud = sorted[Math.floor(sorted.length * 0.95)];
    const th = noise + (loud - noise) * 0.12, minGap = Math.round(minPause * 100);
    const segs = []; let start = -1, quiet = 0;
    e.forEach((v, i) => {
      if (v > th) { if (start < 0) start = i; quiet = 0; }
      else if (start >= 0 && ++quiet >= minGap) { segs.push([start, i - quiet]); start = -1; quiet = 0; }
    });
    if (start >= 0) segs.push([start, e.length - 1]);
    const out = segs.filter(([a, b]) => b - a >= 15).map(([a, b]) => {
      const s0 = Math.max(0, (a - 8) * hop), s1 = Math.min(x.length, (b + 12) * hop);
      return { start: s0 / sr, end: s1 / sr, blob: encodeWav(x.slice(s0, s1), sr) };
    });
    return out;
  }

  /** Spielt Referenzaufnahme, sonst Tonmelodie. Gibt 'ref' oder 'hum' zurück. */
  async function say(text) {
    ac();
    const r = await getRef(text);
    if (r && r.blob) { await playBlob(r.blob); return 'ref'; }
    await hum(text); return 'hum';
  }

  // ---------- Aufnahme ----------
  let stream = null, rec = null, chunks = [];
  function pickMime() {
    const c = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'];
    if (!window.MediaRecorder) return '';
    for (const m of c) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    return '';
  }
  async function startRec() {
    ac();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Mikrofon wird von diesem Browser nicht unterstützt.');
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true } });
    const mime = pickMime();
    rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.start();
  }
  function stopRec() {
    return new Promise(res => {
      if (!rec) return res(null);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' });
        stream.getTracks().forEach(t => t.stop());
        rec = null; stream = null; res(blob);
      };
      rec.stop();
    });
  }
  const isRecording = () => !!rec;

  // ---------- Dekodieren & Vorverarbeitung ----------
  async function decode(blob) {
    const a = ac();
    const ab = await blob.arrayBuffer();
    const buf = await new Promise((res, rej) => a.decodeAudioData(ab, res, rej));
    const n = buf.numberOfChannels, len = buf.length;
    const data = new Float32Array(len);
    for (let c = 0; c < n; c++) { const ch = buf.getChannelData(c); for (let i = 0; i < len; i++) data[i] += ch[i] / n; }
    return { data, sr: buf.sampleRate };
  }
  // auf ~11 kHz heruntertakten (Mittelwertfilter) – reicht für Tonhöhe und Klangmerkmale
  function downsample(d) {
    const k = Math.max(1, Math.floor(d.sr / 11025));
    if (k === 1) return d;
    const out = new Float32Array(Math.floor(d.data.length / k));
    for (let i = 0; i < out.length; i++) { let s = 0; for (let j = 0; j < k; j++) s += d.data[i * k + j]; out[i] = s / k; }
    return { data: out, sr: d.sr / k };
  }
  // Stille am Anfang/Ende abschneiden
  function trim(d) {
    const hop = Math.round(d.sr * 0.01), x = d.data;
    const e = []; let mx = 0;
    for (let s = 0; s + hop <= x.length; s += hop) { let r = 0; for (let i = 0; i < hop; i++) r += x[s + i] * x[s + i]; r = Math.sqrt(r / hop); e.push(r); mx = Math.max(mx, r); }
    const th = mx * 0.08;
    let a = e.findIndex(v => v > th), b = e.length - 1; while (b > 0 && e[b] <= th) b--;
    if (a < 0) return d;
    a = Math.max(0, a - 5); b = Math.min(e.length - 1, b + 5);
    return { data: x.slice(a * hop, (b + 1) * hop), sr: d.sr };
  }

  // ---------- Tonhöhe (normierte Autokorrelation) ----------
  function pitchFromData(d) {
    const { data, sr } = d;
    const win = Math.round(sr * 0.04), hop = Math.round(sr * 0.01);
    const minLag = Math.floor(sr / 450), maxLag = Math.floor(sr / 70);
    let peak = 0; for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
    const out = [];
    for (let s = 0; s + hop <= data.length; s += hop) {
      if (s + win + maxLag >= data.length) { out.push(null); continue; }
      let e0 = 0; for (let i = 0; i < win; i++) e0 += data[s + i] * data[s + i];
      if (Math.sqrt(e0 / win) < peak * 0.06) { out.push(null); continue; }
      const nc = new Float32Array(maxLag + 2);
      let best = 0, bestLag = 0;
      for (let lag = minLag; lag <= maxLag; lag++) {
        let c = 0, e1 = 0;
        for (let i = 0; i < win; i++) { c += data[s + i] * data[s + i + lag]; e1 += data[s + i + lag] * data[s + i + lag]; }
        nc[lag] = c / Math.sqrt(e0 * e1 + 1e-9);
        if (nc[lag] > best) { best = nc[lag]; bestLag = lag; }
      }
      // Oktavfehler vermeiden: kleinste Periode (lokales Maximum) nahe dem Bestwert
      for (let lag = minLag + 1; lag < bestLag; lag++) {
        if (nc[lag] >= best * 0.9 && nc[lag] >= nc[lag - 1] && nc[lag] >= nc[lag + 1]) { bestLag = lag; break; }
      }
      out.push(best > 0.55 ? sr / bestLag : null);
    }
    return out.map((v, i) => {
      if (v == null) return null;
      const w = out.slice(Math.max(0, i - 2), i + 3).filter(x => x != null).sort((x, y) => x - y);
      return w[Math.floor(w.length / 2)];
    });
  }
  async function pitchTrack(blob) {
    const d = downsample(await decode(blob));
    return { f0: pitchFromData(d), dt: 0.01 };
  }

  // ---------- Klangmerkmale (MFCC) ----------
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let j = 0; j < len / 2; j++) {
          const ur = re[i + j], ui = im[i + j], vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci, vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr;
          re[i + j] = ur + vr; im[i + j] = ui + vi; re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  }
  function mfcc(d) {
    const { data, sr } = d;
    const hop = Math.round(sr * 0.01), win = Math.round(sr * 0.025), N = 512, NB = 24, NC = 12;
    const mel = f => 2595 * Math.log10(1 + f / 700), imel = m => 700 * (10 ** (m / 2595) - 1);
    const lo = mel(100), hi = mel(Math.min(5000, sr / 2 - 100));
    const pts = [...Array(NB + 2)].map((_, i) => Math.floor(imel(lo + (hi - lo) * i / (NB + 1)) / sr * N));
    const ham = Float32Array.from({ length: win }, (_, i) => 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (win - 1)));
    const frames = [];
    for (let s = 0; s + hop <= data.length; s += hop) {
      const re = new Float32Array(N), im = new Float32Array(N);
      for (let i = 0; i < win && s + i < data.length; i++) re[i] = (data[s + i] - 0.97 * (data[s + i - 1] || 0)) * ham[i];
      fft(re, im);
      const p = new Float32Array(N / 2); for (let i = 0; i < N / 2; i++) p[i] = re[i] * re[i] + im[i] * im[i];
      const lm = new Float32Array(NB);
      for (let b = 0; b < NB; b++) {
        let e = 0;
        for (let k = pts[b]; k < pts[b + 2]; k++) e += p[k] * (k < pts[b + 1] ? (k - pts[b]) / Math.max(1, pts[b + 1] - pts[b]) : (pts[b + 2] - k) / Math.max(1, pts[b + 2] - pts[b + 1]));
        lm[b] = Math.log(e + 1e-8);
      }
      const c = new Float32Array(NC);
      for (let k = 1; k <= NC; k++) { let v = 0; for (let b = 0; b < NB; b++) v += lm[b] * Math.cos(Math.PI * k * (b + 0.5) / NB); c[k - 1] = v; }
      frames.push(c);
    }
    // Mittelwert- und Varianznormierung (gleicht Mikrofon & Sprecher teilweise aus)
    for (let k = 0; k < NC; k++) {
      let m = 0, v = 0; frames.forEach(f => (m += f[k])); m /= frames.length || 1;
      frames.forEach(f => (v += (f[k] - m) ** 2)); v = OPT.varnorm ? Math.sqrt(v / (frames.length || 1)) || 1 : 1;
      frames.forEach(f => (f[k] = (f[k] - m) / v));
    }
    return frames;
  }
  // Dynamic Time Warping
  const OPT = { band: 0.15, sym: false, varnorm: false };
  function dtw(A, B) {
    const n = A.length, m = B.length, band = Math.max(Math.abs(n - m) + 10, Math.round(Math.max(n, m) * OPT.band));
    const INF = 1e18, D = new Float64Array((n + 1) * (m + 1)).fill(INF), W = m + 1;
    const dist = (a, b) => { let s = 0; for (let k = 0; k < a.length; k++) s += (a[k] - b[k]) ** 2; return Math.sqrt(s); };
    D[0] = 0;
    for (let i = 1; i <= n; i++) {
      const c = Math.round(i * m / n);
      for (let j = Math.max(1, c - band); j <= Math.min(m, c + band); j++) {
        const dd = dist(A[i - 1], B[j - 1]);
        D[i * W + j] = OPT.sym ? Math.min(D[(i - 1) * W + j] + dd, D[i * W + j - 1] + dd, D[(i - 1) * W + j - 1] + 2 * dd) : dd + Math.min(D[(i - 1) * W + j], D[i * W + j - 1], D[(i - 1) * W + j - 1]);
      }
    }
    const path = []; let i = n, j = m;
    while (i > 0 && j > 0) {
      path.push([i - 1, j - 1]);
      const a = D[(i - 1) * W + j - 1], b = D[(i - 1) * W + j], c = D[i * W + j - 1];
      if (a <= b && a <= c) { i--; j--; } else if (b <= c) i--; else j--;
    }
    path.reverse();
    return { dist: D[n * W + m] / (OPT.sym ? n + m : path.length), path };
  }

  let SOUND_LO = 0.6, SOUND_HI = 0.92;
  const refCache = new Map();
  async function features(blob) {
    const d = trim(downsample(await decode(blob)));
    return { mf: mfcc(d), f0: pitchFromData(d), dur: d.data.length / d.sr };
  }
  const semis = f0 => {
    const st = f0.map(f => (f ? 12 * Math.log2(f) : null)), v = st.filter(x => x != null).sort((a, b) => a - b);
    const med = v.length ? v[Math.floor(v.length / 2)] : 0;
    return st.map(x => (x == null ? null : x - med));
  };
  /** Vergleicht eigene Aufnahme mit Referenzaufnahme. */
  async function compareToRef(userBlob, refBlob, key) {
    let R = key && refCache.get(key);
    if (!R) { R = await features(refBlob); if (key) refCache.set(key, R); }
    const U = await features(userBlob);
    if (U.mf.length < 15) return { ok: false, msg: 'Zu kurz oder zu leise – bitte nochmal deutlich sprechen.' };
    const al = dtw(R.mf, U.mf);
    // Klang: Abstand relativ zu einer Zufallsbasis (Referenz rückwärts) – unabhängig von Stimme & Mikrofon
    const base = dtw([...R.mf].reverse(), U.mf).dist;
    const ratio = al.dist / (base || 1);
    const sound = Math.round(Math.max(0, Math.min(100, 100 * (SOUND_HI - ratio) / (SOUND_HI - SOUND_LO))));
    // Ton: Halbtonkonturen entlang des Pfades
    const rs = semis(R.f0), us = semis(U.f0);
    const ref = rs.map(() => null), usr = rs.map(() => []);
    al.path.forEach(([i, j]) => { ref[i] = rs[i]; if (us[j] != null) usr[i].push(us[j]); });
    const userOnRef = usr.map(a => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null));
    const xs = [], ys = [];
    ref.forEach((v, i) => { if (v != null && userOnRef[i] != null) { xs.push(userOnRef[i]); ys.push(v); } });
    let tone = null;
    if (xs.length >= 8) {
      const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
      const mx = mean(xs), my = mean(ys);
      let num = 0, dx = 0, dy = 0, mad = 0;
      for (let k = 0; k < xs.length; k++) { num += (xs[k] - mx) * (ys[k] - my); dx += (xs[k] - mx) ** 2; dy += (ys[k] - my) ** 2; mad += Math.abs(xs[k] - mx - (ys[k] - my)); }
      mad /= xs.length;
      const corr = dx > 1e-6 && dy > 1e-6 ? num / Math.sqrt(dx * dy) : 0;
      const madScore = Math.max(0, 100 - mad * 22);
      tone = Math.round(Math.sqrt(dy / ys.length) < 0.8 ? madScore : 0.55 * Math.max(0, corr) * 100 + 0.45 * madScore);
    }
    const total = tone == null ? sound : Math.round(0.5 * sound + 0.5 * tone);
    return { ok: true, sound, tone, total, ref, user: userOnRef, durRatio: U.dur / R.dur, dist: al.dist, ratio };
  }
  function drawCompare(canvas, res) {
    const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const g = canvas.getContext('2d'); g.scale(dpr, dpr); g.clearRect(0, 0, w, h);
    const css = getComputedStyle(document.documentElement);
    g.strokeStyle = css.getPropertyValue('--line'); g.lineWidth = 1; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    const n = res.ref.length, y = v => h / 2 - Math.max(-7, Math.min(7, v)) * (h / 16), x = i => 8 + (i / Math.max(1, n - 1)) * (w - 16);
    const line = (arr, color, width) => { g.lineWidth = width; g.lineCap = 'round'; g.strokeStyle = color; g.beginPath(); let pen = false; arr.forEach((v, i) => { if (v == null) { pen = false; return; } if (!pen) { g.moveTo(x(i), y(v)); pen = true; } else g.lineTo(x(i), y(v)); }); g.stroke(); };
    line(res.ref, 'rgba(242,183,5,.75)', 8);
    line(res.user, css.getPropertyValue('--accent').trim() || '#0B6E4F', 3);
  }

  /** Zielkontur (Halbtöne relativ) für Silbenfolge, n Punkte. */
  function targetContour(text, n) {
    const syl = analyze(text).flat();
    if (!syl.length || !n) return [];
    const out = [];
    for (let i = 0; i < n; i++) {
      const pos = (i / n) * syl.length, k = Math.min(syl.length - 1, Math.floor(pos)), f = pos - k;
      const t = syl[k].tone;
      out.push(t === 'H' ? 2 : t === 'L' ? -2 : t === 'R' ? -2 + 4 * f : 2 - 4 * f);
    }
    return out;
  }

  function analyzeAttempt(track, text) {
    const st = track.f0.map(f => (f ? 12 * Math.log2(f) : null));
    const voiced = st.filter(v => v != null);
    if (voiced.length < 5) return { ok: false, msg: 'Keine Stimme erkannt – sprich lauter oder näher am Mikrofon.' };
    const sorted = [...voiced].sort((a, b) => a - b), med = sorted[Math.floor(sorted.length / 2)];
    let first = st.findIndex(v => v != null), last = st.length - 1; while (st[last] == null) last--;
    const seg = st.slice(first, last + 1).map(v => (v == null ? null : v - med));
    const tgt = targetContour(text, seg.length);
    const xs = [], ys = [];
    seg.forEach((v, i) => { if (v != null) { xs.push(v); ys.push(tgt[i]); } });
    const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
    const mx = mean(xs), my = mean(ys);
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < xs.length; i++) { num += (xs[i] - mx) * (ys[i] - my); dx += (xs[i] - mx) ** 2; dy += (ys[i] - my) ** 2; }
    let score = null;
    if (dy > 1e-6 && dx > 1e-6) score = Math.round(Math.max(0, num / Math.sqrt(dx * dy)) * 100);
    else if (dy <= 1e-6) {
      // nur ein Ton: Gleichmäßigkeit bewerten
      const range = Math.sqrt(dx / xs.length);
      score = Math.round(Math.max(0, 100 - range * 25));
    }
    return { ok: true, seg, tgt, score };
  }

  function drawContour(canvas, res) {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const g = canvas.getContext('2d'); g.scale(dpr, dpr);
    g.clearRect(0, 0, w, h);
    const css = getComputedStyle(document.documentElement);
    g.strokeStyle = css.getPropertyValue('--line'); g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    if (!res || !res.ok) return;
    const n = res.seg.length, y = v => h / 2 - Math.max(-6, Math.min(6, v)) * (h / 14);
    const x = i => 8 + (i / Math.max(1, n - 1)) * (w - 16);
    g.lineWidth = 10; g.lineCap = 'round'; g.strokeStyle = 'rgba(242,183,5,.55)';
    g.beginPath(); res.tgt.forEach((v, i) => (i ? g.lineTo(x(i), y(v)) : g.moveTo(x(i), y(v)))); g.stroke();
    g.lineWidth = 3; g.strokeStyle = css.getPropertyValue('--accent').trim() || '#0B6E4F';
    g.beginPath(); let pen = false;
    res.seg.forEach((v, i) => { if (v == null) { pen = false; return; } if (!pen) { g.moveTo(x(i), y(v)); pen = true; } else g.lineTo(x(i), y(v)); });
    g.stroke();
  }

  window.EweAudio = { stopAudio, encodeWav, splitBySilence, OPT, compareToRef, drawCompare, keyOf, features, analyze, toneChips, toneSvg, stripTones, stripAll, hum, say, getRef, putRef, delRef, allRefKeys, exportRefs, importRefs, playBlob, startRec, stopRec, isRecording, pitchTrack, analyzeAttempt, drawContour, ac, TONE_NAMES };
})();
