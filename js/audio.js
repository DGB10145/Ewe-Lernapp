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
    return new Promise((res, rej) => { const tx = d.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put({ blob, type: blob.type, at: Date.now(), text }, keyOf(text)); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
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
  function playBlob(blob) {
    return new Promise(res => {
      if (currentAudio) { currentAudio.pause(); }
      const url = URL.createObjectURL(blob);
      const au = new Audio(url); currentAudio = au;
      au.onended = () => { URL.revokeObjectURL(url); res(); };
      au.onerror = () => res();
      au.play().catch(() => res());
    });
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

  // ---------- Tonhöhe (Autokorrelation) ----------
  async function pitchTrack(blob) {
    const a = ac();
    const buf = await new Promise((res, rej) => {
      blob.arrayBuffer().then(ab => a.decodeAudioData(ab, res, rej)).catch(rej);
    });
    const sr = buf.sampleRate, data = buf.getChannelData(0);
    const win = Math.round(sr * 0.04), hop = Math.round(sr * 0.01);
    const minLag = Math.floor(sr / 450), maxLag = Math.floor(sr / 70);
    let peak = 0; for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
    const out = [];
    for (let s = 0; s + win + maxLag < data.length; s += hop) {
      let rms = 0; for (let i = 0; i < win; i++) rms += data[s + i] * data[s + i];
      rms = Math.sqrt(rms / win);
      if (rms < peak * 0.06) { out.push(null); continue; }
      let e0 = 0;
      for (let i = 0; i < win; i++) e0 += data[s + i] * data[s + i];
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
    // Medianfilter
    const sm = out.map((v, i) => {
      if (v == null) return null;
      const w = out.slice(Math.max(0, i - 2), i + 3).filter(x => x != null).sort((x, y) => x - y);
      return w[Math.floor(w.length / 2)];
    });
    return { f0: sm, dt: hop / sr, duration: buf.duration };
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

  window.EweAudio = { analyze, toneChips, toneSvg, stripTones, stripAll, hum, say, getRef, putRef, delRef, allRefKeys, exportRefs, importRefs, playBlob, startRec, stopRec, isRecording, pitchTrack, analyzeAttempt, drawContour, ac, TONE_NAMES };
})();
