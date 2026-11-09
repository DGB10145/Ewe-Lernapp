/* Eʋegbe – Ewe-Lernapp. Reines HTML/JS, offline-fähig, keine Abhängigkeiten. */
(function () {
  'use strict';
  const V = window.EWE_VOCAB, L = window.EWE_LESSONS, A = window.EweAudio;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayNum = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);

  // ---------- Zustand ----------
  const KEY = 'ewe.state.v1';
  const DEF = { srs: {}, lessons: {}, visited: {}, xp: 0, streak: { last: '', count: 0 }, day: { date: '', count: 0, newCount: 0 }, settings: { tones: true, strict: false, goal: 20, newPerDay: 12, voice: 'mid' }, onboard: false };
  let S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); S.settings = Object.assign({}, DEF.settings, S.settings); } catch (e) { S = JSON.parse(JSON.stringify(DEF)); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  function touchDay() {
    const t = today();
    if (S.day.date !== t) S.day = { date: t, count: 0, newCount: 0 };
  }
  function addXp(n) {
    touchDay();
    S.xp += n; S.day.count += 1;
    const t = today();
    if (S.streak.last !== t) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const ys = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
      S.streak.count = S.streak.last === ys ? S.streak.count + 1 : 1;
      S.streak.last = t;
    }
    save(); updateXp();
  }
  function updateXp() { $('#xpBadge').textContent = '🔥 ' + (S.streak.count || 0) + '  ⭐ ' + S.xp; }

  // ---------- Darstellung von Ewe-Text ----------
  const show = s => (S.settings.tones ? s : A.stripTones(s));
  const eweHtml = s => `<span class="ewe">${esc(show(s))}</span>`;

  // ---------- Spaced Repetition (Leitner) ----------
  const INTERVALS = [0, 1, 3, 7, 16, 35, 80, 180];
  const card = id => S.srs[id];
  function grade(id, q) { // q: 0 nochmal, 1 schwer, 2 gut, 3 leicht
    const c = S.srs[id] || { b: 0, due: dayNum(), n: 0 };
    if (q === 0) c.b = 0; else if (q === 1) c.b = Math.max(1, c.b); else c.b = Math.min(INTERVALS.length - 1, c.b + (q === 3 ? 2 : 1));
    c.due = dayNum() + (q === 0 ? 0 : INTERVALS[c.b] || 1);
    c.n = (c.n || 0) + 1; c.last = dayNum();
    S.srs[id] = c; save();
  }
  function dueIds() { const d = dayNum(); return Object.keys(S.srs).filter(id => S.srs[id].due <= d).map(Number); }
  function learnedCount() { return Object.values(S.srs).filter(c => c.b >= 3).length; }
  function activeLessons() { const ks = Object.keys(S.visited).map(Number); return ks.length ? ks : [1]; }
  function newCandidates() {
    const act = new Set(activeLessons());
    return V.filter(v => act.has(v.l) && !S.srs[v.id]).sort((a, b) => a.l - b.l);
  }

  // ---------- UI-Helfer ----------
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2400); }
  function playBtn(text, cls = '') { return `<button class="play ${cls}" data-say="${esc(text)}" aria-label="Anhören">▶</button>`; }
  function micBtn(text, de) { return `<button class="play rec" data-speak="${esc(text)}" data-de="${esc(de || '')}" aria-label="Sprechen üben">🎤</button>`; }
  function exRow(ewe, de) {
    return `<div class="ex">${playBtn(ewe)}<div class="txt">${eweHtml(ewe)}<div class="de">${esc(de)}</div></div>${micBtn(ewe, de)}</div>`;
  }
  function setTitle(t, back) { $('#title').textContent = t; $('#backBtn').hidden = !back; }
  function setTab(t) { $$('#tabbar a').forEach(a => a.classList.toggle('active', a.dataset.tab === t)); }

  // Globale Klicks: Anhören / Sprechen
  document.addEventListener('click', async e => {
    const s = e.target.closest('[data-say]');
    if (s) { e.preventDefault(); s.disabled = true; const r = await A.say(s.dataset.say); s.disabled = false; if (r === 'hum' && !S.hintHum) { S.hintHum = 1; save(); toast('♪ Tonmelodie (hoch/tief). Für echte Aussprache: Aufnahmen importieren (Üben → Sprachcoach).'); } return; }
    const same = e.target.closest('a[href^="#/"]');
    if (same && same.getAttribute('href') === location.hash) { e.preventDefault(); route(); return; }
    const m = e.target.closest('[data-speak]');
    if (m) { e.preventDefault(); openSpeak(m.dataset.speak, m.dataset.de); }
  });

  // ---------- Bottom-Sheet ----------
  function openSheet(html, onClose) {
    $('#sheetBody').innerHTML = html; $('#sheet').hidden = false; document.body.style.overflow = 'hidden';
    sheetClose = onClose;
  }
  let sheetClose = null;
  function closeSheet() {
    $('#sheet').hidden = true; document.body.style.overflow = '';
    if (A.isRecording()) A.stopRec();
    if (sheetClose) { const f = sheetClose; sheetClose = null; f(); }
  }
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet' || e.target.closest('.sheet-close')) closeSheet(); });

  function soundHints(text) {
    const t = text.normalize('NFC');
    const hits = window.EWE_SOUNDS.filter(s => s[4] && !s[0].includes(' ') && t.toLowerCase().includes(s[0]));
    const seen = new Set(); const out = [];
    for (const s of hits.sort((a, b) => b[0].length - a[0].length)) { if ([...seen].some(x => x.includes(s[0]))) continue; seen.add(s[0]); out.push(s); }
    if (/[ãẽĩõũ]|ɔ̃|ɛ̃/.test(t.normalize('NFC'))) out.push(window.EWE_SOUNDS[window.EWE_SOUNDS.length - 1]);
    return out.map(s => `<div class="hint"><b class="ewe">${esc(s[0])}</b> – ${esc(s[1])}</div>`).join('');
  }

  // Alle Texte der App (für Import-Zuordnung und Coach)
  let ALL = null;
  function allTexts() {
    if (ALL) return ALL;
    const m = new Map();
    const add = (e, de, src) => { if (!e) return; e.split(' / ').forEach(x => { const k = A.keyOf(x); if (!m.has(k)) m.set(k, { e: x.normalize('NFC'), de, src }); }); };
    window.EWE_SOUNDS.forEach(s => { if (!s[0].includes(' ')) add(s[0], 'Laut ' + s[0] + ' – ' + s[1], 'Laut'); });
    V.forEach(v => add(v.e, v.de, 'Wort · L' + v.l));
    window.EWE_SOUNDS.forEach(s => add(s[2], s[3], 'Laut ' + s[0]));
    L.forEach(l => { l.sections.forEach(s => (s.ex || []).forEach(x => add(x[0], x[1], 'Beispiel · L' + l.n))); l.sentences.forEach(x => add(x[0], x[1], 'Satz · L' + l.n)); (l.dialog ? l.dialog.lines : []).forEach(x => add(x[1], x[2], 'Dialog · L' + l.n)); (l.song ? l.song.lines : []).forEach(x => add(x[0], x[1], 'Lied · L' + l.n)); });
    window.EWE_PHRASES.forEach(c => c.items.forEach(i => add(i[0], i[1], 'Alltag')));
    window.EWE_TONES.pairs.forEach(p => { add(p[0], p[1], 'Tonpaar'); add(p[2], p[3], 'Tonpaar'); });
    ALL = m; return m;
  }
  const looseKey = s => A.stripAll(A.keyOf(s)).replace(/[.,!?;:“”"„'’…]/g, '').replace(/\s+/g, ' ').trim();
  function textInfo(text) { return allTexts().get(A.keyOf(text)) || { e: text, de: '', src: 'eigener Text' }; }
  function suggest(q, n = 6) {
    const qq = looseKey(q); if (!qq) return [];
    const out = [];
    for (const v of allTexts().values()) {
      const e = looseKey(v.e), d = (v.de || '').toLowerCase();
      const sc = e === qq ? 0 : e.startsWith(qq) ? 1 : e.includes(qq) ? 2 : d.includes(qq) ? 3 : 9;
      if (sc < 9) out.push([sc, e.length, v]);
    }
    return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]).slice(0, n).map(x => x[2]);
  }
  // Coach-Statistik
  function coachStat(text) { S.coach = S.coach || {}; return S.coach[A.keyOf(text)]; }
  function coachSave(text, score) {
    S.coach = S.coach || {}; const k = A.keyOf(text);
    const c = S.coach[k] || { best: 0, n: 0 };
    c.best = Math.max(c.best, score); c.last = score; c.n++; c.at = Date.now();
    S.coach[k] = c; save();
  }

  // Ergebnis-Anzeige für einen Sprechversuch
  async function evaluateAttempt(text, blob, ref, out) {
    out.innerHTML = '<p class="muted small center">Analysiere …</p>';
    try {
      if (ref) {
        const r = await A.compareToRef(blob, ref.blob, A.keyOf(text));
        if (!r.ok) { out.innerHTML = `<p class="muted">${esc(r.msg)}</p>`; return null; }
        const tip = [];
        if (r.tone != null && r.tone < 55) tip.push('Achte auf die <b>Tonhöhe</b>: Vergleiche die gelbe Kurve (Vorbild) mit deiner grünen.');
        if (r.sound < 50) tip.push('Die <b>Laute</b> weichen noch ab – hör dir das Vorbild langsam an (🐢) und sprich Silbe für Silbe.');
        if (r.durRatio > 1.6) tip.push('Du sprichst deutlich <b>langsamer</b> als das Vorbild – das ist am Anfang okay.');
        if (r.durRatio < 0.6) tip.push('Du sprichst <b>schneller</b> als das Vorbild – nimm dir Zeit für jede Silbe.');
        out.innerHTML = `<canvas class="pitch" id="cmpCv"></canvas>
          <div class="legend"><span><i style="background:rgba(242,183,5,.8)"></i>Muttersprachler</span><span><i style="background:var(--accent)"></i>Du</span></div>
          <div class="score">${r.total}%</div>
          <div class="stats"><div class="stat"><b>${r.tone == null ? '–' : r.tone + '%'}</b><span>Töne</span></div><div class="stat"><b>${r.sound}%</b><span>Laute (Richtwert)</span></div><div class="stat"><b>${r.durRatio.toFixed(1)}×</b><span>Dauer</span></div></div>
          <p class="center small">${r.total >= 75 ? 'Sehr gut! 🎉' : r.total >= 55 ? 'Gut – noch ein bisschen feilen.' : 'Weiter üben – hör genau hin.'}</p>
          ${tip.map(t => `<div class="hint">${t}</div>`).join('')}`;
        requestAnimationFrame(() => A.drawCompare($('#cmpCv'), r));
        coachSave(text, r.total); addXp(r.total >= 55 ? 3 : 1);
        return r.total;
      }
      const tr = await A.pitchTrack(blob);
      const res = A.analyzeAttempt(tr, text);
      out.innerHTML = res.ok
        ? `<canvas class="pitch" id="spCv"></canvas><div class="legend"><span><i style="background:rgba(242,183,5,.7)"></i>Ziel (Tonzeichen)</span><span><i style="background:var(--accent)"></i>Du</span></div>
           ${res.score != null ? `<div class="score">${res.score}%</div><p class="center small muted">Ton-Ähnlichkeit ${res.score >= 75 ? '– sehr gut! 🎉' : res.score >= 50 ? '– gut, weiter üben.' : '– achte auf hoch/tief.'}</p>` : ''}
           <p class="small muted center">Ohne Muttersprachler-Aufnahme wird nur die Tonmelodie geprüft.</p>`
        : `<p class="muted">${esc(res.msg)}</p>`;
      if (res.ok) requestAnimationFrame(() => A.drawContour($('#spCv'), res));
      if (res.ok && res.score != null) { coachSave(text, res.score); addXp(res.score >= 50 ? 3 : 1); }
      return res.ok ? res.score : null;
    } catch (err) {
      out.innerHTML = `<p class="muted small">Analyse nicht möglich (${esc(err.message || err)}).</p>`;
      return null;
    }
  }
  // Aufnahme-Knopf: startet/stoppt und ruft onBlob
  function bindRecButton(btn, onBlob, label = '🎤 Nachsprechen') {
    btn.onclick = async () => {
      if (A.isRecording()) { const b = await A.stopRec(); btn.innerHTML = '🎤 Nochmal'; onBlob(b); }
      else {
        try { A.stopAudio && A.stopAudio(); await A.startRec(); btn.innerHTML = '<span class="recdot"></span>Stopp'; }
        catch (err) { toast('Mikrofon nicht verfügbar: ' + (err.message || err)); }
      }
    };
    btn.innerHTML = label;
  }

  // Sprech-Trainer (Bottom-Sheet)
  async function openSpeak(text, de) {
    const ref = await A.getRef(text);
    const st = coachStat(text);
    openSheet(`
      <div class="big-ewe">${esc(show(text))}</div>
      ${de ? `<p class="center muted">${esc(de)}</p>` : ''}
      ${A.toneChips(text)}
      <div class="row mt">${ref ? '<button class="btn gold grow" id="spRef">▶ Vorbild</button><button class="btn secondary" id="spSlow" title="langsam">🐢</button>' : ''}<button class="btn secondary grow" id="spHum">♪ Tonmelodie</button></div>
      ${soundHints(text)}
      <div class="card">
        <p class="small muted">${ref ? 'Hör dir das Vorbild an, sprich nach und vergleiche Töne und Laute.' : 'Sprich nach und vergleiche deine Tonkurve (grün) mit der Zielmelodie (gelb).'}${st ? ` Bisher bestes Ergebnis: <b>${st.best}%</b>.` : ''}</p>
        <button class="btn block red" id="spRec"></button>
        <div id="spOut" class="mt"></div>
        <button class="btn secondary block mt" id="spMine" hidden>▶ Meine Aufnahme</button>
      </div>
      <details><summary>Vorbild-Aufnahme ${ref ? '(vorhanden)' : ''}</summary>
        <p class="small muted">Lass eine/n Ewe-Sprecher/in diesen Text einsprechen oder importiere Audiodateien unter Üben → Sprachcoach. Aufnahmen bleiben nur auf diesem Gerät.</p>
        <button class="btn secondary block" id="spRefRec">🎙️ Vorbild aufnehmen</button>
        ${ref ? '<button class="btn secondary block mt" id="spRefDel">🗑️ Vorbild löschen</button>' : ''}
        <div id="spRefOut" class="small mt"></div>
      </details>`);
    $('#spHum').onclick = () => A.hum(text);
    if (ref) { $('#spRef').onclick = () => A.playBlob(ref.blob); $('#spSlow').onclick = () => A.playBlob(ref.blob, 0.7); }
    let lastBlob = null;
    bindRecButton($('#spRec'), async blob => { lastBlob = blob; $('#spMine').hidden = false; await evaluateAttempt(text, blob, ref, $('#spOut')); });
    $('#spMine').onclick = () => lastBlob && A.playBlob(lastBlob);
    const rr = $('#spRefRec');
    rr.onclick = async () => {
      if (A.isRecording()) {
        const blob = await A.stopRec();
        await A.putRef(text, blob);
        $('#spRefOut').textContent = '✔ Vorbild gespeichert.'; rr.textContent = '🎙️ Neu aufnehmen';
        A.playBlob(blob); refreshRefMarks();
      } else {
        try { await A.startRec(); rr.innerHTML = '<span class="recdot"></span>Stopp & speichern'; } catch (err) { toast('Mikrofon nicht verfügbar.'); }
      }
    };
    if ($('#spRefDel')) $('#spRefDel').onclick = async () => { await A.delRef(text); $('#spRefOut').textContent = 'Gelöscht.'; refreshRefMarks(); };
  }
  let refKeys = new Set();
  async function refreshRefMarks() {
    refKeys = new Set(await A.allRefKeys());
    $$('[data-say]').forEach(b => b.classList.toggle('has-ref', refKeys.has(b.dataset.say.normalize('NFC').trim().toLowerCase())));
  }

  // ---------- Ansichten ----------
  const routes = {};
  function route() {
    const h = location.hash.replace(/^#\/?/, '') || 'home';
    const [name, ...args] = h.split('/');
    const fn = routes[name] || routes.home;
    window.scrollTo(0, 0);
    if (A.isRecording()) A.stopRec();
    fn(...args.map(decodeURIComponent));
    refreshRefMarks();
  }
  window.addEventListener('hashchange', route);
  $('#backBtn').onclick = () => history.back();
  const view = html => { $('#view').innerHTML = html; };

  // Start
  routes.home = () => {
    setTitle('Eʋegbe', false); setTab('home'); touchDay();
    const due = dueIds().length, nc = Math.max(0, Math.min(S.settings.newPerDay - S.day.newCount, newCandidates().length));
    const done = Object.keys(S.lessons).length;
    const next = L.find(l => !S.lessons[l.n]) || L[L.length - 1];
    const goalPct = Math.min(100, Math.round(S.day.count / S.settings.goal * 100));
    view(`
      <div class="card hero">
        <h2 style="margin-top:4px">Woezɔ! 👋</h2>
        <p>Willkommen bei deiner Ewe-Lernapp. Ewe (Eʋegbe) wird in Ghana, Togo und Benin von mehreren Millionen Menschen gesprochen.</p>
        <div class="kente"></div>
      </div>
      <div class="card">
        <div class="row"><b class="grow">Tagesziel</b><span class="muted small">${S.day.count} / ${S.settings.goal}</span></div>
        <div class="progress mt"><i style="width:${goalPct}%"></i></div>
        <div class="stats mt">
          <div class="stat"><b>${S.streak.count || 0}🔥</b><span>Tage in Folge</span></div>
          <div class="stat"><b>${learnedCount()}</b><span>Wörter gefestigt</span></div>
          <div class="stat"><b>${done}/17</b><span>Lektionen</span></div>
        </div>
      </div>
      <a class="btn block" href="#/review">🧠 Wiederholen: ${due} fällig · ${nc} neu</a>
      <div class="sp"></div>
      <a class="card tile" href="#/lesson/${next.n}" style="display:block">
        <span class="tag">Weiter mit Lektion ${next.n}</span>
        <b>${esc(next.title)}</b>
        <span>${esc(next.goal)}</span>
      </a>
      <div class="grid2 wide">
        <a class="tile" href="#/coach"><div class="ic">🎧</div><b>Sprachcoach</b><span>Nachsprechen & vergleichen</span></a>
        <a class="tile" href="#/sound"><div class="ic">🗣️</div><b>Aussprache & Töne</b><span>Laute, Tonhöhen, Sprechtraining</span></a>
        <a class="tile" href="#/phrases"><div class="ic">💬</div><b>Alltagssätze</b><span>Begrüßen, Markt, Essen</span></a>
        <a class="tile" href="#/dict"><div class="ic">🔎</div><b>Wörterbuch</b><span>${V.length} Wörter Ewe ⇄ Deutsch</span></a>
        <a class="tile" href="#/numbers"><div class="ic">🔢</div><b>Zahlen</b><span>Zählen wie die Ewe</span></a>
      </div>
      ${!S.onboard ? `<div class="card"><h3>So lernst du am besten</h3>
        <ol class="small"><li>Arbeite die <b>Lektionen</b> der Reihe nach durch – jede hat Grammatik, Wörter und ein Quiz.</li>
        <li>Wiederhole täglich die <b>fälligen Karten</b> (Spaced Repetition).</li>
        <li>Tippe ▶ für die <b>Tonmelodie</b> und 🎤, um selbst zu sprechen und deine Tonkurve zu sehen.</li>
        <li>Importiere Muttersprachler-Aufnahmen (MP3) für den <b>Sprachcoach</b> – dann hörst du überall echte Aussprache.</li></ol>
        <button class="btn secondary block" id="obOk">Verstanden</button></div>` : ''}
      <p class="small muted center mt">Inhalt nach: S. W. Dzablu-Kumah, „Basic Ewe for Foreign Students“, 2. Aufl., hrsg. von U. Claudi & J. A. Ossey, Köln 2015.</p>`);
    if ($('#obOk')) $('#obOk').onclick = () => { S.onboard = true; save(); route(); };
  };

  // Lektionsliste
  routes.lessons = () => {
    setTitle('Lektionen', false); setTab('lessons');
    view(`<p class="muted small">17 Lektionen nach „Basic Ewe for Foreign Students“. Eine Lektion gilt als geschafft, wenn du das Quiz mit mindestens 80 % bestehst.</p>
      <div class="card"><ul class="list">${L.map(l => {
        const vc = V.filter(v => v.l === l.n).length;
        return `<li><a href="#/lesson/${l.n}"><span class="num ${S.lessons[l.n] ? 'done' : ''}">${S.lessons[l.n] ? '✓' : l.n}</span><span class="grow"><b>${esc(l.title)}</b><br><span class="small muted">${vc} Wörter · ${l.sentences.length} Sätze</span></span><span class="muted">›</span></a></li>`;
      }).join('')}</ul></div>`);
  };

  // Lektion
  routes.lesson = (n, tab = 'grammar') => {
    n = Number(n); const l = L.find(x => x.n === n); if (!l) return routes.lessons();
    if (!S.visited[n]) { S.visited[n] = 1; save(); }
    setTitle('Lektion ' + n, true); setTab('lessons');
    const words = V.filter(v => v.l === n);
    const tabs = [['grammar', 'Grammatik'], ['words', 'Wörter (' + words.length + ')'], ['sentences', 'Sätze'], ['quiz', 'Quiz']];
    let body = '';
    if (tab === 'grammar') {
      body = `<div class="card hero"><b>${esc(l.title)}</b><p class="muted">🎯 ${esc(l.goal)}</p></div>` +
        l.sections.map(s => `<div class="card"><h3>${esc(s.h)}</h3><p>${s.t}</p>${(s.ex || []).map(e => exRow(e[0], e[1])).join('')}</div>`).join('') +
        (l.dialog ? `<div class="card"><h3>💬 ${esc(l.dialog.title)}</h3>${l.dialog.lines.map(d => `<div class="dialog-line"><div class="who">${esc(d[0])}</div>${exRow(d[1], d[2])}</div>`).join('')}</div>` : '') +
        (l.song ? `<div class="card"><h3>🎵 ${esc(l.song.title)}</h3>${l.song.lines.map(d => exRow(d[0], d[1])).join('')}</div>` : '') +
        `<a class="btn block" href="#/lesson/${n}/words">Weiter zu den Wörtern ›</a>`;
    } else if (tab === 'words') {
      body = `<div class="card">${words.map(w => exRow(w.e, w.de)).join('')}</div>
        <a class="btn block" href="#/cards/lesson/${n}">🃏 Diese Wörter als Karteikarten lernen</a>`;
    } else if (tab === 'sentences') {
      body = `<div class="card">${l.sentences.map(s => exRow(s[0], s[1])).join('')}</div>
        <div class="grid2"><a class="btn secondary" href="#/build/${n}">🧩 Satzbau</a><a class="btn secondary" href="#/speakset/${n}">🎤 Nachsprechen</a></div>`;
    } else {
      body = `<div class="card center"><h3>Quiz zu Lektion ${n}</h3><p class="muted">12 gemischte Aufgaben: Wörter, Sätze, Satzbau und Töne.</p>
        ${S.lessons[n] ? `<p>✓ Bestanden mit ${S.lessons[n]} %</p>` : ''}
        <a class="btn block" href="#/quiz/${n}">▶ Quiz starten</a></div>`;
    }
    view(`<div class="seg">${tabs.map(t => `<button class="${t[0] === tab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>${body}
      <div class="row mt">${n > 1 ? `<a class="btn secondary grow" href="#/lesson/${n - 1}">‹ L${n - 1}</a>` : ''}${n < 17 ? `<a class="btn secondary grow" href="#/lesson/${n + 1}">L${n + 1} ›</a>` : ''}</div>`);
    $$('.seg button').forEach(b => (b.onclick = () => location.replace('#/lesson/' + n + '/' + b.dataset.t)));
  };

  // ---------- Quiz-Engine ----------
  function normAns(s, strict) {
    s = s.normalize('NFC').toLowerCase().replace(/[.,!?;:“”"„'’]/g, ' ').replace(/\s+/g, ' ').trim();
    return strict ? s : A.stripAll(s);
  }
  function answersMatch(input, target) {
    return target.split(' / ').some(t => normAns(input, S.settings.strict) === normAns(t, S.settings.strict));
  }
  function distractors(item, pool, key, n = 3) {
    const seen = new Set([item[key]]);
    const out = [];
    for (const p of shuffle(pool)) { if (!seen.has(p[key])) { seen.add(p[key]); out.push(p); } if (out.length >= n) break; }
    return out;
  }
  // Tonvarianten eines Wortes erzeugen (für Ton-Aufgaben)
  function toneVariants(w) {
    const base = A.stripTones(w).normalize('NFD');
    const vowels = []; [...base].forEach((c, i) => { if ('aeɛioɔu'.includes(c)) vowels.push(i); });
    if (!vowels.length) return [];
    const out = new Set([w.normalize('NFC')]);
    let guard = 0;
    while (out.size < 4 && guard++ < 40) {
      const chars = [...base];
      const res = chars.map((c, i) => vowels.includes(i) ? c + (Math.random() < 0.45 ? '́' : Math.random() < 0.12 ? '̌' : '') : c).join('').normalize('NFC');
      out.add(res);
    }
    return [...out];
  }

  function makeQuestions(n) {
    const l = L.find(x => x.n === n);
    const words = V.filter(v => v.l === n && v.e.length < 28);
    const pool = V.filter(v => v.l <= Math.max(n, 3));
    const qs = [];
    pick(words, 4).forEach((w, i) => {
      if (i % 2 === 0) qs.push({ type: 'mc', prompt: 'Was bedeutet …', big: w.e, say: w.e, ans: w.de, opts: shuffle([w.de, ...distractors(w, pool, 'de').map(x => x.de)]) });
      else qs.push({ type: 'mc', prompt: 'Wie sagt man auf Ewe …', bigDe: w.de, ans: w.e, opts: shuffle([w.e, ...distractors(w, pool, 'e').map(x => x.e)]), eweOpts: true });
    });
    const sents = pick(l.sentences, 6);
    sents.slice(0, 2).forEach(s => {
      const others = pick(l.sentences.filter(x => x !== s), 3).map(x => x[0]);
      qs.push({ type: 'mc', prompt: 'Welcher Satz bedeutet …', bigDe: s[1], ans: s[0], opts: shuffle([s[0], ...others]), eweOpts: true });
    });
    sents.slice(2, 4).forEach(s => qs.push({ type: 'build', de: s[1], ans: s[0] }));
    const tw = pick(words.filter(w => /[́̌]/.test(w.e.normalize('NFD')) && !w.e.includes(' ')), 2);
    tw.forEach(w => { const vs = toneVariants(w.e); if (vs.length >= 3) qs.push({ type: 'mc', prompt: 'Welche Tonschreibung ist richtig für „' + w.de + '“?', ans: w.e.normalize('NFC'), opts: shuffle(vs), eweOpts: true, forceTones: true }); });
    const tword = pick(words.filter(w => w.e.length <= 14), 1)[0];
    if (tword) qs.push({ type: 'type', de: tword.de, ans: tword.e });
    return shuffle(qs).slice(0, 12);
  }

  function runQuiz(qs, opts) {
    let i = 0, right = 0;
    const next = () => {
      if (i >= qs.length) return opts.done(right, qs.length);
      const q = qs[i];
      const head = `<div class="progress"><i style="width:${(i / qs.length) * 100}%"></i></div><p class="small muted center mt">Aufgabe ${i + 1} von ${qs.length}</p>`;
      const finish = ok => {
        if (ok) { right++; addXp(2); }
        if (q.id != null) grade(q.id, ok ? 2 : 0);
        const fb = $('#fb');
        fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = (ok ? '✔ Richtig!' : '✘ Richtig ist: ') + (ok ? '' : `<span class="ewe">${esc(q.eweOpts || q.type !== 'mc' ? (q.forceTones ? q.ans : show(q.ans)) : q.ans)}</span>`) +
          `<div class="row mt">${q.type !== 'mc' || q.eweOpts ? playBtn(q.ans) : q.say ? playBtn(q.say) : ''}<button class="btn grow" id="nx">Weiter ›</button></div>`;
        fb.hidden = false;
        $('#nx').onclick = () => { i++; next(); };
      };
      if (q.type === 'mc') {
        view(`${head}<div class="card"><p class="qprompt">${esc(q.prompt)}</p>
          ${q.big ? `<div class="qbig ewe">${esc(show(q.big))}</div><div class="center">${playBtn(q.big)}</div>` : ''}
          ${q.bigDe ? `<div class="qbig">${esc(q.bigDe)}</div>` : ''}
          ${q.listen ? `<div class="center mt"><button class="btn gold" data-say="${esc(q.listen)}">🔊 Nochmal abspielen</button></div>` : ''}
          <div class="opts">${q.opts.map((o, k) => `<button class="opt ${q.eweOpts ? 'ewe' : ''}" data-k="${k}">${esc(q.eweOpts && !q.forceTones ? show(o) : o)}</button>`).join('')}</div>
          <div id="fb" hidden></div></div>`);
        if (q.listen) A.say(q.listen); else if (q.say && S.settings.autoplay) A.say(q.say);
        $$('.opt').forEach(b => (b.onclick = () => {
          if ($('#fb').hidden === false) return;
          const o = q.opts[b.dataset.k], ok = o === q.ans;
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) $$('.opt').forEach(x => q.opts[x.dataset.k] === q.ans && x.classList.add('ok'));
          finish(ok);
        }));
      } else if (q.type === 'build') {
        const toks = q.ans.replace(/([.?!])$/, ' $1').split(/\s+/).filter(t => !/^[.?!]$/.test(t));
        const tiles = shuffle(toks.map((t, k) => ({ t, k })));
        let chosen = [];
        view(`${head}<div class="card"><p class="qprompt">Bilde den Satz auf Ewe:</p><div class="qbig">${esc(q.de)}</div>
          <div class="tiles" id="ans"></div><div class="tiles" id="bank" style="border-style:solid">${tiles.map(x => `<button class="wtile ewe" data-k="${x.k}">${esc(show(x.t))}</button>`).join('')}</div>
          <div class="row"><button class="btn secondary" id="clr">↺</button><button class="btn grow" id="chk">Prüfen</button></div><div id="fb" hidden></div></div>`);
        const render = () => { $('#ans').innerHTML = chosen.map((k, j) => `<button class="wtile ewe" data-j="${j}">${esc(show(toks[k]))}</button>`).join(''); $$('#bank .wtile').forEach(b => b.classList.toggle('used', chosen.includes(+b.dataset.k))); $$('#ans .wtile').forEach(b => (b.onclick = () => { chosen.splice(+b.dataset.j, 1); render(); })); };
        $$('#bank .wtile').forEach(b => (b.onclick = () => { if (!chosen.includes(+b.dataset.k)) { chosen.push(+b.dataset.k); render(); } }));
        $('#clr').onclick = () => { chosen = []; render(); };
        $('#chk').onclick = () => { if (!$('#fb').hidden) return; const s = chosen.map(k => toks[k]).join(' '); finish(normAns(s, true) === normAns(toks.join(' '), true) || normAns(s) === normAns(toks.join(' '))); };
      } else if (q.type === 'type') {
        view(`${head}<div class="card"><p class="qprompt">Schreibe auf Ewe:</p><div class="qbig">${esc(q.de)}</div>
          <input type="text" id="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ewe …" class="ewe">
          ${keyboard()}<button class="btn block mt" id="chk">Prüfen</button>
          <p class="small muted">${S.settings.strict ? 'Tonzeichen werden geprüft.' : 'Tonzeichen sind optional (in den Einstellungen änderbar).'}</p><div id="fb" hidden></div></div>`);
        bindKeyboard($('#inp'));
        const go = () => { if ($('#fb').hidden) finish(answersMatch($('#inp').value, q.ans)); };
        $('#chk').onclick = go; $('#inp').onkeydown = e => { if (e.key === 'Enter') go(); };
      }
    };
    next();
  }

  function keyboard() {
    const ch = ['ɖ', 'ƒ', 'ɣ', 'ŋ', 'ɔ', 'ɛ', 'ʋ', 'x'];
    const tm = [['́', '´ hoch'], ['̌', 'ˇ steig.'], ['̀', '` tief'], ['̃', '~ nasal']];
    return `<div class="kbd">${ch.map(c => `<button type="button" data-ins="${c}">${c}</button>`).join('')}${tm.map(t => `<button type="button" class="tm" data-ins="${t[0]}" title="${t[1]}">◌${t[0]}</button>`).join('')}</div>`;
  }
  function bindKeyboard(inp) {
    $$('.kbd [data-ins]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      const s = inp.selectionStart ?? inp.value.length, en = inp.selectionEnd ?? s;
      inp.value = (inp.value.slice(0, s) + b.dataset.ins + inp.value.slice(en)).normalize('NFC');
      const p = Math.min(inp.value.length, s + 1); inp.focus(); inp.setSelectionRange(p, p);
    }));
  }

  routes.quiz = n => {
    n = Number(n); setTitle('Quiz L' + n, true); setTab('lessons');
    runQuiz(makeQuestions(n), {
      done: (r, t) => {
        const pct = Math.round(r / t * 100);
        if (pct >= 80) { S.lessons[n] = Math.max(S.lessons[n] || 0, pct); addXp(10); }
        save();
        view(`<div class="card center"><div style="font-size:60px">${pct >= 80 ? '🎉' : '💪'}</div><div class="score">${pct}%</div>
          <p>${r} von ${t} richtig. ${pct >= 80 ? 'Lektion geschafft – Akpé kakaka!' : 'Noch nicht ganz – wiederhole die Lektion und versuche es erneut.'}</p>
          <a class="btn block" href="#/quiz/${n}">↺ Nochmal</a><div class="sp"></div>
          ${n < 17 ? `<a class="btn secondary block" href="#/lesson/${n + 1}">Weiter zu Lektion ${n + 1} ›</a>` : ''}
          <div class="sp"></div><a class="btn secondary block" href="#/lesson/${n}">Zurück zur Lektion</a></div>`);
      }
    });
  };

  // Satzbau-Übung (alle Sätze einer Lektion)
  routes.build = n => {
    n = Number(n); setTitle('Satzbau L' + n, true); setTab('lessons');
    const l = L.find(x => x.n === n);
    runQuiz(pick(l.sentences, 8).map(s => ({ type: 'build', de: s[1], ans: s[0] })), { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><p>Satzbau abgeschlossen.</p><a class="btn block" href="#/build/${n}">↺ Nochmal</a><div class="sp"></div><a class="btn secondary block" href="#/lesson/${n}/sentences">Zurück</a></div>`) });
  };

  // Nachsprechen: Satz für Satz
  routes.speakset = n => {
    n = Number(n); setTitle('Nachsprechen L' + n, true); setTab('lessons');
    const l = L.find(x => x.n === n); let i = 0;
    const draw = () => {
      const s = l.sentences[i];
      view(`<p class="small muted center">Satz ${i + 1} von ${l.sentences.length}</p><div class="card center">
        <div class="big-ewe" style="font-size:26px">${esc(show(s[0]))}</div><p class="muted">${esc(s[1])}</p>${A.toneChips(s[0])}
        <div class="row mt">${playBtn(s[0])}<button class="btn grow" data-speak="${esc(s[0])}" data-de="${esc(s[1])}">🎤 Sprechen & vergleichen</button></div></div>
        <div class="row"><button class="btn secondary grow" id="pv" ${i ? '' : 'disabled'}>‹ Zurück</button><button class="btn secondary grow" id="nx">${i < l.sentences.length - 1 ? 'Weiter ›' : 'Fertig ✓'}</button></div>`);
      $('#pv').onclick = () => { i--; draw(); };
      $('#nx').onclick = () => { addXp(1); if (i < l.sentences.length - 1) { i++; draw(); } else location.hash = '#/lesson/' + n + '/sentences'; };
      refreshRefMarks();
    };
    draw();
  };

  // ---------- Üben ----------
  routes.practice = () => {
    setTitle('Üben', false); setTab('practice'); touchDay();
    const due = dueIds().length, nc = Math.max(0, Math.min(S.settings.newPerDay - S.day.newCount, newCandidates().length));
    view(`
      <div class="card"><h3 style="margin-top:0">🧠 Tägliche Wiederholung</h3>
        <p class="muted small">Karten kommen in wachsenden Abständen wieder (1, 3, 7, 16 … Tage). Neue Wörter stammen aus den Lektionen, die du geöffnet hast.</p>
        <a class="btn block" href="#/review">Start: ${due} fällig · ${nc} neu</a></div>
      <a class="card tile" href="#/coach" style="display:block"><div class="row"><div class="ic">🎧</div><div class="grow"><b style="margin:0">Sprachcoach</b><span>Hören, nachsprechen, Töne & Laute mit Muttersprachler-Aufnahmen vergleichen</span></div><span class="muted">›</span></div></a>
      <div class="grid2">
        <a class="tile" href="#/write"><div class="ic">✍️</div><b>Schreiben</b><span>Deutsch → Ewe tippen</span></a>
        <a class="tile" href="#/tonequiz"><div class="ic">🎵</div><b>Tontraining</b><span>Hoch, tief, steigend erkennen</span></a>
        <a class="tile" href="#/mixbuild"><div class="ic">🧩</div><b>Satzbau</b><span>Sätze aus allen Lektionen</span></a>
        <a class="tile" href="#/listen"><div class="ic">👂</div><b>Hören</b><span>Mit deinen Vorbild-Aufnahmen</span></a>
        <a class="tile" href="#/verbs"><div class="ic">🔁</div><b>Verben</b><span>Zeiten & Pronomen</span></a>
        <a class="tile" href="#/numbers"><div class="ic">🔢</div><b>Zahlen</b><span>1 bis 9000</span></a>
      </div>
      <h3>Wortschatz nach Lektion</h3>
      <div class="card"><ul class="list">${L.map(l => {
        const ws = V.filter(v => v.l === l.n), known = ws.filter(v => S.srs[v.id] && S.srs[v.id].b >= 3).length;
        return `<li><a href="#/cards/lesson/${l.n}"><span class="num">${l.n}</span><span class="grow small">${esc(l.title)}<div class="progress mt"><i style="width:${ws.length ? known / ws.length * 100 : 0}%"></i></div></span><span class="small muted">${known}/${ws.length}</span></a></li>`;
      }).join('')}</ul></div>`);
  };

  function flashcards(ids, title, back) {
    let i = 0, flipped = false, dir = 'e2d';
    const draw = () => {
      if (i >= ids.length) {
        view(`<div class="card center"><div style="font-size:56px">✅</div><h3>Geschafft!</h3><p>${ids.length} Karten bearbeitet.</p><a class="btn block" href="${back}">Zurück</a></div>`);
        return;
      }
      const v = V[ids[i]]; const c = card(v.id);
      dir = (c && c.b >= 2 && Math.random() < 0.5) ? 'd2e' : 'e2d';
      flipped = false;
      const front = dir === 'e2d' ? `<div class="big-ewe">${esc(show(v.e))}</div>` : `<div class="qbig">${esc(v.de)}</div><p class="muted small">Wie heißt das auf Ewe?</p>`;
      view(`<p class="small muted center">${title} · ${i + 1}/${ids.length} · L${v.l}${!c ? ' · <span class="tag">neu</span>' : ''}</p>
        <div class="card flash" id="fc">${front}<div id="backside"></div><p class="small muted" id="tap">Tippen zum Aufdecken</p></div>
        <div id="rate"></div>`);
      if (dir === 'e2d') A.say(v.e);
      const flip = () => {
        if (flipped) return; flipped = true;
        $('#tap').remove();
        $('#backside').innerHTML = (dir === 'e2d' ? `<div class="qbig">${esc(v.de)}</div>` : `<div class="big-ewe">${esc(show(v.e))}</div>`) + `<p class="small muted">${esc(v.en)}</p>${A.toneChips(v.e)}<div class="row" style="justify-content:center">${playBtn(v.e)}${micBtn(v.e, v.de)}</div>`;
        if (dir === 'd2e') A.say(v.e);
        $('#rate').innerHTML = `<div class="rate"><button class="btn red" data-q="0">Nochmal<small>&lt;1 Tag</small></button><button class="btn secondary" data-q="1">Schwer<small>1 Tag</small></button><button class="btn" data-q="2">Gut<small>${INTERVALS[Math.min(7, ((c && c.b) || 0) + 1)]} T.</small></button><button class="btn gold" data-q="3">Leicht<small>${INTERVALS[Math.min(7, ((c && c.b) || 0) + 2)]} T.</small></button></div>`;
        $$('#rate [data-q]').forEach(b => (b.onclick = () => {
          const q = +b.dataset.q; if (!c) { touchDay(); S.day.newCount++; }
          grade(v.id, q); addXp(q ? 1 : 0);
          if (q === 0) ids.push(v.id);
          i++; draw();
        }));
        refreshRefMarks();
      };
      $('#fc').onclick = e => { if (!e.target.closest('button')) flip(); };
    };
    draw();
  }
  routes.review = () => {
    setTitle('Wiederholung', true); setTab('practice'); touchDay();
    const due = shuffle(dueIds());
    const nc = Math.max(0, S.settings.newPerDay - S.day.newCount);
    const news = newCandidates().slice(0, nc).map(v => v.id);
    const ids = [...due.slice(0, 80), ...news];
    if (!ids.length) { view(`<div class="card center"><div style="font-size:56px">🌴</div><h3>Alles erledigt!</h3><p>Heute ist nichts mehr fällig. Öffne eine neue Lektion für neue Wörter oder übe frei.</p><a class="btn block" href="#/lessons">Zu den Lektionen</a></div>`); return; }
    flashcards(ids, 'Wiederholung', '#/practice');
  };
  routes.cards = (kind, n) => {
    n = Number(n); setTitle('Karten L' + n, true); setTab('practice');
    S.visited[n] = 1; save();
    flashcards(shuffle(V.filter(v => v.l === n).map(v => v.id)), 'Lektion ' + n, '#/lesson/' + n + '/words');
  };

  routes.write = () => {
    setTitle('Schreiben', true); setTab('practice');
    const act = new Set(activeLessons());
    const pool = V.filter(v => act.has(v.l) && v.e.length <= 18 && !/^[A-ZÁÀ]/.test(v.e));
    runQuiz(pick(pool, 10).map(v => ({ type: 'type', de: v.de, ans: v.e, id: v.id })), { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/write">↺ Neue Runde</a><div class="sp"></div><a class="btn secondary block" href="#/practice">Zurück</a></div>`) });
  };
  routes.tonequiz = () => {
    setTitle('Tontraining', true); setTab('practice');
    const act = new Set([...activeLessons(), 1, 2, 3]);
    const pool = V.filter(v => act.has(v.l) && !v.e.includes(' ') && /[́̌]/.test(v.e.normalize('NFD')) && v.e.length <= 12 && !/^[A-ZÁÀ]/.test(v.e));
    const qs = [];
    // Minimalpaare
    pick(window.EWE_TONES.pairs, 3).forEach(p => qs.push({ type: 'mc', prompt: 'Welches Wort bedeutet „' + (Math.random() < .5 ? p[1] : p[3]) + '“?', _p: p }));
    qs.forEach(q => { const p = q._p; const wantHigh = q.prompt.includes(p[3]); q.ans = wantHigh ? p[2] : p[0]; q.opts = shuffle([p[0], p[2]]); q.eweOpts = true; q.forceTones = true; });
    pick(pool, 7).forEach(w => { const vs = toneVariants(w.e); if (vs.length >= 3) qs.push({ type: 'mc', prompt: 'Richtige Töne für „' + w.de + '“?', ans: w.e.normalize('NFC'), opts: shuffle(vs), eweOpts: true, forceTones: true }); });
    view(`<div class="card"><p class="small">Höre dir die Tonmelodie an (▶ im Ergebnis) und präge dir das Muster ein: <b>´</b> = hoch, ohne Zeichen = tief, <b>ˇ</b> = steigend.</p></div>`);
    setTimeout(() => runQuiz(shuffle(qs), { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/tonequiz">↺ Nochmal</a><div class="sp"></div><a class="btn secondary block" href="#/sound">Zur Ton-Erklärung</a></div>`) }), 0);
  };
  routes.mixbuild = () => {
    setTitle('Satzbau', true); setTab('practice');
    const act = new Set(activeLessons());
    const pool = L.filter(l => act.has(l.n)).flatMap(l => l.sentences);
    runQuiz(pick(pool, 8).map(s => ({ type: 'build', de: s[1], ans: s[0] })), { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/mixbuild">↺ Nochmal</a></div>`) });
  };
  routes.listen = async () => {
    setTitle('Hören', true); setTab('practice');
    const uniq = (await refItems()).filter(x => x.de).map(x => [x.e, x.de]);
    if (uniq.length < 4) {
      view(`<div class="card"><h3>👂 Hörverständnis</h3><p>Für diese Übung brauchst du mindestens 4 <b>Vorbild-Aufnahmen</b> von Muttersprachler/innen (bisher: ${uniq.length}).</p>
        <p class="small muted">Tippe bei einem Wort oder Satz auf 🎤 → „Muttersprachler-Referenz“ → aufnehmen. Ideal: Bitte eine/n Ewe-Sprecher/in, die Alltagssätze und Wörter der ersten Lektionen einzusprechen. Du kannst Aufnahmen auch unter Mehr → Einstellungen importieren.</p>
        <a class="btn block" href="#/import">📥 Aufnahmen importieren</a></div>`);
      return;
    }
    const qs = pick(uniq, Math.min(10, uniq.length)).map(x => ({ type: 'mc', prompt: 'Hör zu – was bedeutet das?', listen: x[0], ans: x[1], opts: shuffle([x[1], ...pick(uniq.filter(y => y !== x), 3).map(y => y[1])]) }));
    runQuiz(qs, { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/practice">Zurück</a></div>`) });
  };

  // ---------- Sprachcoach ----------
  async function refItems() {
    const keys = await A.allRefKeys();
    const out = [];
    for (const k of keys) {
      const r = await A.getRef(k); if (!r) continue;
      const info = textInfo(r.text || k);
      out.push({ e: info.e || r.text, de: info.de, src: info.src, ref: r });
    }
    return out;
  }
  routes.coach = async (mode = 'mix') => {
    setTitle('Sprachcoach', true); setTab('practice');
    view('<p class="muted center">Lade Aufnahmen …</p>');
    const items = await refItems();
    if (!items.length) {
      view(`<div class="card hero"><h2 style="margin-top:4px">🎧 Dein Sprachcoach</h2><p>Der Coach spielt dir echte Ewe-Aussprache vor, du sprichst nach – und er vergleicht <b>Töne</b> und <b>Laute</b> mit dem Vorbild.</p><div class="kente"></div></div>
        <div class="card"><h3 style="margin-top:0">So startest du</h3><ol class="small">
          <li>Lege deine Audiodateien (MP3, M4A, WAV …) in die <b>Dateien</b>-App.</li>
          <li>Benenne jede Datei nach dem Ewe-Wort oder -Satz, z. B. <span class="ewe">atí.mp3</span> oder <span class="ewe">Akpé.mp3</span> (Tonzeichen optional).</li>
          <li>Tippe unten auf <b>Aufnahmen importieren</b>. Lange Aufnahmen mit vielen Wörtern kannst du dort automatisch zerlegen.</li></ol>
          <p class="small muted">Die Aufnahmen werden nur auf diesem Gerät gespeichert und nirgendwo hochgeladen.</p>
          <a class="btn block" href="#/import">📥 Aufnahmen importieren</a></div>`);
      return;
    }
    const score = it => { const c = coachStat(it.e); return c ? c.best : -1; };
    const words = items.filter(i => !i.e.includes(' ') || i.e.split(' ').length <= 2), sents = items.filter(i => i.e.split(' ').length > 2);
    let pool = mode === 'words' ? words : mode === 'sents' ? sents : items;
    if (!pool.length) pool = items;
    // schwächste und neue zuerst, etwas gemischt
    const session = shuffle(pool).sort((a, b) => score(a) - score(b)).slice(0, 8);
    const scores = [];
    let i = 0;
    const step = () => {
      if (i >= session.length) {
        const done = scores.filter(x => x != null), avg = done.length ? Math.round(done.reduce((s, v) => s + v, 0) / done.length) : 0;
        view(`<div class="card center"><div style="font-size:56px">${avg >= 70 ? '🏆' : '💪'}</div><h3>Runde beendet</h3><div class="score">${avg}%</div><p class="muted">Durchschnitt aus ${done.length} Versuchen</p>
          <a class="btn block" href="#/coach/${mode}">↺ Neue Runde</a><div class="sp"></div><a class="btn secondary block" href="#/import">📥 Weitere Aufnahmen</a></div>
          <div class="card">${session.map((it, k) => `<div class="ex">${playBtn(it.e)}<div class="txt">${eweHtml(it.e)}<div class="de">${esc(it.de || '')}</div></div><b>${scores[k] == null ? '–' : scores[k] + '%'}</b></div>`).join('')}</div>`);
        refreshRefMarks(); return;
      }
      const it = session[i], st = coachStat(it.e);
      view(`<div class="seg">${[['mix', 'Gemischt'], ['words', 'Wörter'], ['sents', 'Sätze']].map(t => `<button class="${t[0] === mode ? 'on' : ''}" data-m="${t[0]}">${t[1]}</button>`).join('')}</div>
        <div class="progress"><i style="width:${i / session.length * 100}%"></i></div><p class="small muted center mt">${i + 1} von ${session.length} · ${esc(it.src || '')}${st ? ' · bisher ' + st.best + '%' : ' · neu'}</p>
        <div class="card center"><div class="big-ewe">${esc(show(it.e))}</div>${it.de ? `<p class="muted">${esc(it.de)}</p>` : ''}${A.toneChips(it.e)}
          <div class="row mt"><button class="btn gold grow" id="cRef">▶ Vorbild</button><button class="btn secondary" id="cSlow">🐢 langsam</button></div>
          ${soundHints(it.e)}
          <p class="small muted mt">1. Zuhören · 2. Nachsprechen · 3. Vergleichen</p>
          <button class="btn block red" id="cRec"></button>
          <div id="cOut" class="mt"></div>
          <button class="btn secondary block mt" id="cMine" hidden>▶ Meine Aufnahme</button></div>
        <div class="row"><button class="btn secondary grow" id="cSkip">Überspringen</button><button class="btn grow" id="cNext" disabled>Weiter ›</button></div>`);
      $$('.seg [data-m]').forEach(b => (b.onclick = () => location.replace('#/coach/' + b.dataset.m)));
      $('#cRef').onclick = () => A.playBlob(it.ref.blob);
      $('#cSlow').onclick = () => A.playBlob(it.ref.blob, 0.7);
      setTimeout(() => A.playBlob(it.ref.blob), 250);
      let last = null;
      bindRecButton($('#cRec'), async blob => {
        last = blob; $('#cMine').hidden = false;
        const sc = await evaluateAttempt(it.e, blob, it.ref, $('#cOut'));
        if (sc != null) scores[i] = Math.max(scores[i] || 0, sc);
        $('#cNext').disabled = false;
      });
      $('#cMine').onclick = () => last && A.playBlob(last);
      $('#cSkip').onclick = () => { i++; step(); };
      $('#cNext').onclick = () => { i++; step(); };
    };
    step();
  };

  // ---------- Import ----------
  function cleanName(name) {
    let s = name.replace(/\.[a-z0-9]{2,5}$/i, '');
    try { s = decodeURIComponent(s); } catch (e) {}
    return s.replace(/[_+]+/g, ' ').replace(/^\s*\d+\s*[-.)_:]*\s*/, '').replace(/\s*\(\d+\)\s*$/, '').trim().normalize('NFC');
  }
  function matchName(name) {
    const c = cleanName(name), all = allTexts();
    const exact = all.get(A.keyOf(c)); if (exact) return exact;
    const lk = looseKey(c);
    const hits = [...all.values()].filter(v => looseKey(v.e) === lk);
    return hits.length === 1 ? hits[0] : null;
  }
  const toBlob = async f => new Blob([await f.arrayBuffer()], { type: f.type || (/\.m4a$/i.test(f.name) ? 'audio/mp4' : /\.wav$/i.test(f.name) ? 'audio/wav' : 'audio/mpeg') });

  // Zuordnungs-Zeile für eine nicht erkannte Datei / einen Ausschnitt
  function assignRow(idx, label, hint) {
    return `<div class="card asg" data-i="${idx}"><div class="row"><button class="play" data-play="${idx}">▶</button><div class="grow small"><b>${esc(label)}</b>${hint ? `<div class="muted">${esc(hint)}</div>` : ''}</div></div>
      <input type="text" class="ewe aq" placeholder="Ewe-Text oder deutsches Wort suchen …" autocapitalize="off" spellcheck="false" value="">
      <div class="sugg"></div>
      <div class="row mt"><button class="btn small secondary own">Als eigenen Text speichern</button><button class="btn small secondary skip">Verwerfen</button></div>
      <div class="small done muted"></div></div>`;
  }
  function bindAssign(container, blobs, onSaved) {
    $$('.asg', container).forEach(card => {
      const i = +card.dataset.i, inp = $('.aq', card), sg = $('.sugg', card), msg = $('.done', card);
      const saveAs = async (text, de) => {
        await A.putRef(text, blobs[i]);
        card.innerHTML = `<div class="row"><span class="grow">✔ ${eweHtml(text)} ${de ? `<span class="small muted">– ${esc(de)}</span>` : ''}</span>${playBtn(text)}</div>`;
        onSaved && onSaved(); refreshRefMarks();
      };
      $('[data-play]', card).onclick = () => A.playBlob(blobs[i]);
      inp.oninput = () => {
        const s = suggest(inp.value);
        sg.innerHTML = s.map((v, k) => `<button class="opt ewe" data-k="${k}" style="padding:8px 10px;margin-top:6px;width:100%">${esc(show(v.e))} <span class="small muted">· ${esc(v.de || '')} · ${esc(v.src)}</span></button>`).join('');
        $$('[data-k]', sg).forEach(b => (b.onclick = () => saveAs(s[+b.dataset.k].e, s[+b.dataset.k].de)));
      };
      $('.own', card).onclick = () => { const t = inp.value.trim(); if (!t) { msg.textContent = 'Bitte zuerst den Ewe-Text eintippen.'; return; } saveAs(t.normalize('NFC'), ''); };
      $('.skip', card).onclick = () => card.remove();
    });
  }

  routes.import = async () => {
    setTitle('Aufnahmen importieren', true); setTab('practice');
    const keys = await A.allRefKeys();
    view(`<div class="card"><h3 style="margin-top:0">📥 Audiodateien importieren</h3>
        <p class="small">Wähle eine oder mehrere Dateien aus der <b>Dateien</b>-App (MP3, M4A, WAV …). Heißt eine Datei wie ein Ewe-Wort oder -Satz der App (z. B. <span class="ewe">atí.mp3</span>, <span class="ewe">01_Akpé.mp3</span>), wird sie automatisch zugeordnet. Für alle anderen kannst du den Text suchen und zuweisen.</p>
        <p class="small muted">ZIP-Archive vorher in der Dateien-App antippen, dann werden sie entpackt. Die Aufnahmen bleiben nur auf diesem Gerät.</p>
        <label class="btn block">🎵 Einzelne Dateien wählen<input type="file" id="impF" multiple accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.json" hidden></label></div>
      <div id="impRes"></div>
      <div class="card"><h3 style="margin-top:0">✂️ Lange Aufnahme zerlegen</h3>
        <p class="small">Enthält eine Datei viele Wörter hintereinander (z. B. aus einem Video), zerlegt die App sie an den Sprechpausen. Danach ordnest du jeden Ausschnitt einem Wort zu.</p>
        <label class="switch"><span class="small">Mindestpause zwischen Wörtern</span><select id="gap" style="width:auto"><option value="0.25">kurz (0,25 s)</option><option value="0.35" selected>mittel (0,35 s)</option><option value="0.6">lang (0,6 s)</option><option value="1">sehr lang (1 s)</option></select></label>
        <label class="btn secondary block">✂️ Datei zum Zerlegen wählen<input type="file" id="impS" accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg" hidden></label></div>
      <div id="splitRes"></div>
      <details class="card"><summary>Meine Vorbild-Aufnahmen (${keys.length})</summary><div id="refList" class="mt"><p class="muted small">Lade …</p></div></details>
      ${keys.length ? '<a class="btn block" href="#/coach">🎧 Zum Sprachcoach</a>' : ''}`);

    // Liste vorhandener Aufnahmen
    const det = $('details.card');
    det.addEventListener('toggle', async () => {
      if (!det.open) return;
      const items = await refItems();
      $('#refList').innerHTML = items.length ? items.sort((a, b) => a.e.localeCompare(b.e)).map(it => `<div class="ex">${playBtn(it.e)}<div class="txt">${eweHtml(it.e)}<div class="de">${esc(it.de || it.src || '')}</div></div><button class="play" data-del="${esc(it.e)}" aria-label="Löschen">🗑️</button></div>`).join('') : '<p class="muted small">Noch keine Aufnahmen.</p>';
      $$('[data-del]').forEach(b => (b.onclick = async () => { await A.delRef(b.dataset.del); b.closest('.ex').remove(); }));
      refreshRefMarks();
    });

    $('#impF').onchange = async e => {
      const files = [...e.target.files]; e.target.value = '';
      const res = $('#impRes'); res.innerHTML = '<div class="card"><p class="muted">Importiere …</p></div>';
      let ok = 0; const matched = [], open = [], blobs = [];
      for (const f of files) {
        if (/\.json$/i.test(f.name)) { try { const o = JSON.parse(await f.text()); ok += await A.importRefs(o.items || []); } catch (err) { toast('JSON ungültig: ' + f.name); } continue; }
        const b = await toBlob(f), m = matchName(f.name);
        if (m) { await A.putRef(m.e, b); ok++; matched.push(m); }
        else { blobs.push(b); open.push({ name: f.name, clean: cleanName(f.name) }); }
      }
      res.innerHTML = `<div class="card"><b>✔ ${ok} zugeordnet</b>${open.length ? ` · <b>${open.length} offen</b>` : ''}
        ${matched.length ? `<details><summary class="small">Zugeordnete anzeigen</summary>${matched.map(m => `<div class="ex">${playBtn(m.e)}<div class="txt">${eweHtml(m.e)}<div class="de">${esc(m.de)}</div></div></div>`).join('')}</details>` : ''}</div>
        ${open.length ? '<h3>Nicht erkannt – bitte zuordnen</h3>' + open.map((o, k) => assignRow(k, o.name, 'Suche den passenden Text oder tippe ihn ein.')).join('') : ''}`;
      open.forEach((o, k) => { const card = $(`.asg[data-i="${k}"]`, res); const inp = $('.aq', card); inp.value = o.clean; inp.dispatchEvent(new Event('input')); });
      bindAssign(res, blobs);
      refreshRefMarks();
      if (ok) toast(ok + ' Aufnahmen gespeichert.');
    };

    $('#impS').onchange = async e => {
      const f = e.target.files[0]; e.target.value = ''; if (!f) return;
      const res = $('#splitRes'); res.innerHTML = '<div class="card"><p class="muted">Zerlege … (bei langen Dateien kann das etwas dauern)</p></div>';
      try {
        const segs = await A.splitBySilence(await toBlob(f), +$('#gap').value);
        if (!segs.length) { res.innerHTML = '<div class="card"><p>Keine Sprachabschnitte gefunden.</p></div>'; return; }
        const fmt = t => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
        res.innerHTML = `<div class="card"><b>${segs.length} Ausschnitte gefunden.</b><p class="small muted">Hör jeden Ausschnitt an (▶) und ordne ihn zu. Ausschnitte ohne Ewe (z. B. Erklärungen) einfach verwerfen. Zu viele oder zu wenige Stücke? Andere Mindestpause wählen und neu zerlegen.</p></div>` +
          segs.slice(0, 200).map((s, k) => assignRow(k, `Ausschnitt ${k + 1}`, `${fmt(s.start)}–${fmt(s.end)} · ${(s.end - s.start).toFixed(1)} s`)).join('');
        bindAssign(res, segs.map(s => s.blob));
      } catch (err) { res.innerHTML = `<div class="card"><p>Datei konnte nicht gelesen werden (${esc(err.message || err)}).</p></div>`; }
    };
  };

  // ---------- Aussprache ----------
  routes.sound = (tab = 'sounds') => {
    setTitle('Aussprache', false); setTab('sound');
    const T = window.EWE_TONES;
    const tabs = [['sounds', 'Laute'], ['tones', 'Töne'], ['drill', 'Sprechtraining']];
    let body = '';
    if (tab === 'sounds') {
      body = `<p class="small muted">Das Ewe-Alphabet hat 30 Buchstaben. Besonders wichtig für Deutschsprachige sind die markierten Laute ⭐.</p>
        <div class="card">${window.EWE_SOUNDS.map(s => { const single = !s[0].includes(' '); return `<div class="ex">${single ? playBtn(s[0]) : ''}<div class="txt"><span class="ewe" style="font-size:22px">${esc(s[0])}</span> ${s[4] ? '⭐' : ''}<div class="small">${esc(s[1])}</div><div class="de">z. B. <span class="ewe">${esc(show(s[2]))}</span> – ${esc(s[3])} ${playBtn(s[2])}</div></div>${micBtn(single ? s[0] : s[2], single ? 'Laut ' + s[0] + ': ' + s[1] : s[3])}</div>`; }).join('')}</div>
        <div class="card"><h3>Tipp: kp und gb</h3><p class="small">Die Doppelverschlusslaute sind die größte Hürde. Übung: Sage „k“ und halte die Zunge hinten. Schließe dann zusätzlich die Lippen und löse <i>beides gleichzeitig</i>. Es klingt wie ein kurzes „Klopfen“. Übe mit <span class="ewe">kpé</span> (Stein), <span class="ewe">kpɔ́</span> (sehen), <span class="ewe">gbe</span> (Tag), <span class="ewe">agble</span> (Farm).</p></div>`;
    } else if (tab === 'tones') {
      body = `<div class="card"><p>${T.intro}</p>${T.kinds.map(k => `<div class="ex"><div class="syl">${A.toneSvg(k[0] === 'á' ? 'H' : k[0] === 'a' ? 'L' : k[0] === 'ǎ' ? 'R' : 'F')}</div><div class="txt"><b>${esc(k[0])} – ${esc(k[1])}</b><div class="de">${esc(k[2])}; ${esc(k[3])}</div></div></div>`).join('')}</div>
        <h3>Minimalpaare – gleiche Laute, anderer Ton</h3>
        <div class="card">${T.pairs.map(p => `<div class="ex">${playBtn(p[0])}<div class="txt">${eweHtml(p[0])}<div class="de">${esc(p[1])}</div></div>${playBtn(p[2])}<div class="txt">${eweHtml(p[2])}<div class="de">${esc(p[3])}</div></div></div>`).join('')}</div>
        <div class="card"><h3>Tonverschmelzung</h3><p class="small">Treffen Hoch- und Tiefton zusammen, entstehen steigende/fallende Töne: <span class="ewe">è + mé → mě</span> („du … nicht“), <span class="ewe">ná + è → nɛ̂</span> („für ihn“). Manche Wörter haben von Natur aus einen steigenden Ton: <span class="ewe">ablɔ̌</span> Straße, <span class="ewe">tǎ</span> Kopf.</p><p class="small muted">${esc(T.notes)}</p></div>
        <a class="btn block" href="#/tonequiz">🎵 Tontraining starten</a>`;
    } else {
      body = `<div class="card"><p class="small">Wähle ein Wort oder einen Satz, sprich ihn nach und sieh deine <b>Tonkurve</b> im Vergleich zur Zielmelodie. Die App misst die Tonhöhe deiner Stimme – so trainierst du hoch/tief/steigend gezielt.</p>
        <input type="text" id="free" class="ewe" placeholder="Eigenen Ewe-Text eingeben …" autocapitalize="off" spellcheck="false">${keyboard()}<button class="btn block" id="freeGo">🎤 Diesen Text üben</button></div>
        <h3>Übungswörter (Töne)</h3><div class="card">${T.pairs.flatMap(p => [[p[0], p[1]], [p[2], p[3]]]).map(x => exRow(x[0], x[1])).join('')}</div>
        <h3>Zungenbrecher-Laute</h3><div class="card">${[['kpɔ́','sehen'],['kpé','Stein'],['agble','Farm'],['gbɔ̃̌','Ziege'],['ƒu','Meer'],['ʋɔtrú','Tür'],['ɣletí','Mond'],['ɖeví','Kind'],['ŋútsu','Mann'],['xeví','Vogel'],['atíglínyi','Elefant'],['gbedóxɔ','Kapelle']].map(x => exRow(x[0], x[1])).join('')}</div>`;
    }
    view(`<div class="seg">${tabs.map(t => `<button class="${t[0] === tab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>${body}`);
    $$('.seg button').forEach(b => (b.onclick = () => location.replace('#/sound/' + b.dataset.t)));
    if ($('#free')) { bindKeyboard($('#free')); $('#freeGo').onclick = () => { const t = $('#free').value.trim(); if (t) openSpeak(t.normalize('NFC'), ''); }; }
  };

  // ---------- Mehr ----------
  routes.more = () => {
    setTitle('Mehr', false); setTab('more');
    view(`<div class="grid2 wide">
      <a class="tile" href="#/dict"><div class="ic">🔎</div><b>Wörterbuch</b><span>${V.length} Einträge</span></a>
      <a class="tile" href="#/phrases"><div class="ic">💬</div><b>Alltagssätze</b><span>Begrüßung, Markt …</span></a>
      <a class="tile" href="#/numbers"><div class="ic">🔢</div><b>Zahlen</b><span>Trainer & Tabelle</span></a>
      <a class="tile" href="#/verbs"><div class="ic">🔁</div><b>Verben</b><span>Konjugationstrainer</span></a>
      <a class="tile" href="#/days"><div class="ic">📅</div><b>Wochentage & Namen</b><span>Kofi, Ama, Kɔsi …</span></a>
      <a class="tile" href="#/import"><div class="ic">📥</div><b>Aufnahmen importieren</b><span>MP3s für den Sprachcoach</span></a>
      <a class="tile" href="#/settings"><div class="ic">⚙️</div><b>Einstellungen</b><span>Töne, Backup, Audio</span></a>
      <a class="tile" href="#/about"><div class="ic">ℹ️</div><b>Über Ewe & App</b><span>Installieren, Quellen</span></a>
    </div>`);
  };

  routes.dict = (q = '') => {
    setTitle('Wörterbuch', true); setTab('more');
    view(`<input type="search" id="dq" placeholder="Suche Ewe, Deutsch oder Englisch …" value="${esc(q)}" autocapitalize="off" spellcheck="false">
      <div class="seg" id="dl"><button class="on" data-l="0">Alle</button>${L.map(l => `<button data-l="${l.n}">L${l.n}</button>`).join('')}</div>
      <div class="card" id="dres"></div>`);
    let lf = 0;
    const run = () => {
      const qq = A.stripAll($('#dq').value.trim().toLowerCase());
      let res = V.filter(v => !lf || v.l === lf);
      if (qq) {
        res = res.map(v => {
          const e = A.stripAll(v.e.toLowerCase()), d = v.de.toLowerCase(), en = v.en.toLowerCase();
          const sc = e === qq ? 0 : d.split(/[,;]/).map(x => x.trim()).includes(qq) ? 0.5 : e.startsWith(qq) ? 1 : d.split(/[ ,;()]+/).includes(qq) ? 1.5 : e.includes(qq) ? 2 : d.includes(qq) ? 2.5 : en.includes(qq) ? 3 : 9;
          return [sc, v];
        }).filter(x => x[0] < 9).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      }
      const shown = res.slice(0, 150);
      $('#dres').innerHTML = (shown.length ? shown.map(v => `<div class="dict-item">${playBtn(v.e)}<div class="txt">${eweHtml(v.e)} <span class="tag">L${v.l}</span><div>${esc(v.de)}</div><div class="en">${esc(v.en)}</div></div>${micBtn(v.e, v.de)}</div>`).join('') : '<p class="muted">Nichts gefunden.</p>') + (res.length > 150 ? `<p class="small muted center">… ${res.length - 150} weitere – Suche verfeinern.</p>` : '');
      refreshRefMarks();
    };
    $('#dq').oninput = run;
    $$('#dl button').forEach(b => (b.onclick = () => { lf = +b.dataset.l; $$('#dl button').forEach(x => x.classList.toggle('on', x === b)); run(); }));
    run();
  };

  routes.phrases = () => {
    setTitle('Alltagssätze', true); setTab('more');
    view(`<p class="small muted">✅ = so im Lehrbuch belegt · 💬 = gebräuchliche Alltagssprache (Tonzeichen sinngemäß ergänzt – im Zweifel von Muttersprachlern bestätigen lassen).</p>
      ${window.EWE_PHRASES.map(c => `<h3>${esc(c.cat)}</h3><div class="card">${c.items.map(i => `<div class="ex">${playBtn(i[0])}<div class="txt">${eweHtml(i[0])} <span class="small">${i[2] === 'b' ? '✅' : '💬'}</span><div class="de">${esc(i[1])}</div></div>${micBtn(i[0], i[1])}</div>`).join('')}</div>`).join('')}`);
  };

  routes.days = () => {
    setTitle('Wochentage & Namen', true); setTab('more');
    view(`<div class="card"><p class="small">In Ghana und Togo bekommen Kinder traditionell einen <b>Tagesnamen</b> nach ihrem Geburtstag. Welcher ist deiner?</p>
      <table><tr><th>Tag</th><th>♂</th><th>♀</th></tr>${window.EWE_DAYS.map(d => `<tr><td>${eweHtml(d[0])}<br><span class="small muted">${d[1]}</span></td><td>${eweHtml(d[2])}</td><td>${eweHtml(d[3])}</td></tr>`).join('')}</table>
      <p class="small muted">Samstag (Memlɛ̃ɖá) ist nicht im Lehrbuch belegt.</p></div>
      <div class="card"><h3>Mein Tagesname</h3><input type="date" id="bd" style="font-size:18px;padding:10px;border-radius:12px;border:1px solid var(--line);width:100%;background:var(--card);color:var(--text)"><div id="bdo" class="mt"></div></div>`);
    $('#bd').onchange = e => {
      const d = new Date(e.target.value + 'T12:00:00'); if (isNaN(d)) return;
      const r = window.EWE_DAYS[d.getDay()];
      $('#bdo').innerHTML = `<p>Geboren an einem <b>${r[1]}</b> (${eweHtml(r[0])}): <br>♂ ${eweHtml(r[2])} · ♀ ${eweHtml(r[3])}</p>`;
    };
  };

  // Zahlen
  const UNITS = ['', 'ɖeká', 'eve', 'etɔ̃', 'ene', 'atɔ̃́', 'adé', 'adrẽ́', 'enyí', 'asíéke'];
  const TEENS = ['ewó', 'wúíɖekɛ́', 'wúíeve', 'wúíetɔ̃', 'wúíene', 'wúíatɔ̃́', 'wúíadé', 'wúíadrẽ́', 'wúíenyí', 'wúíasíéke'];
  const TENS = ['', '', 'bláeve', 'bláetɔ̃', 'bláene', 'bláatɔ̃́', 'bláadé', 'bláadrẽ́', 'bláenyí', 'bláasíéke'];
  function eweNum(n) {
    if (n < 10) return UNITS[n];
    if (n < 20) return TEENS[n - 10];
    if (n < 100) { const t = Math.floor(n / 10), u = n % 10; return TENS[t] + (u ? ' vɔ̌ ' + (u === 1 ? 'ɖekɛ́' : UNITS[u]) : ''); }
    if (n < 1000 && n % 100 === 0) return 'alafá ' + UNITS[n / 100];
    if (n % 1000 === 0) return 'akpé ' + UNITS[n / 1000];
    return null;
  }
  const NUMSET = [...Array(99).keys()].map(i => i + 1).concat([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 5000, 9000]);
  routes.numbers = (tab = 'learn') => {
    setTitle('Zahlen', true); setTab('more');
    const tabs = [['learn', 'Tabelle'], ['quiz', 'Trainer']];
    let body;
    if (tab === 'learn') {
      body = `<div class="card"><p class="small">Die Ewe zählen in <b>Zehnerbündeln</b>: <span class="ewe">bláeve</span> = „zwei Bündel“ = 20. Bei 21–99 sagt man „zwanzig, über um eins“: <span class="ewe">bláeve vɔ̌ ɖekɛ́</span>.</p></div>
        <div class="card">${[1,2,3,4,5,6,7,8,9,10,11,12,13,15,19,20,21,25,30,40,50,60,70,80,90,99,100,200,1000,2000].map(n => exRow(eweNum(n), String(n))).join('')}</div>
        <div class="card"><h3>Zahl nachschlagen</h3><input type="text" inputmode="numeric" id="nq" placeholder="z. B. 47"><div id="nr" class="mt"></div></div>`;
    } else {
      body = '<div id="nqz"></div>';
    }
    view(`<div class="seg">${tabs.map(t => `<button class="${t[0] === tab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>${body}`);
    $$('.seg button').forEach(b => (b.onclick = () => location.replace('#/numbers/' + b.dataset.t)));
    if ($('#nq')) $('#nq').oninput = e => { const n = parseInt(e.target.value, 10); const w = n > 0 ? eweNum(n) : null; $('#nr').innerHTML = w ? exRow(w, String(n)) : (e.target.value ? '<p class="small muted">Im Trainer: 1–99, volle Hunderter und Tausender.</p>' : ''); refreshRefMarks(); };
    if (tab === 'quiz') {
      const qs = pick(NUMSET, 10).map((n, i) => {
        const others = pick(NUMSET.filter(x => x !== n && Math.abs(x - n) < 30 || x % 10 === n % 10 && x !== n), 3);
        return i % 2 ? { type: 'mc', prompt: 'Welche Zahl ist das?', big: eweNum(n), say: eweNum(n), ans: String(n), opts: shuffle([n, ...others].map(String)) }
          : { type: 'mc', prompt: 'Wie sagt man auf Ewe …', bigDe: String(n), ans: eweNum(n), opts: shuffle([n, ...others].map(eweNum)), eweOpts: true };
      });
      runQuiz(qs, { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/numbers/quiz">↺ Nochmal</a><div class="sp"></div><a class="btn secondary block" href="#/numbers">Tabelle</a></div>`) });
    }
  };

  // Verben
  function conj(vb, p, tense) {
    const P = window.EWE_PRONOUNS[p];
    const v = vb.v;
    switch (tense) {
      case 'aor': return P[1] + v;
      case 'neg': return P[2] + v + ' o';
      case 'prog': return P[5] + ' ' + vb.prog;
      case 'negprog': return P[2] + 'le ' + vb.prog + ' o';
      case 'ing': return P[5] + ' ' + vb.ing;
      case 'fut': return P[3] + v;
      case 'negfut': return P[4] + v + ' o';
    }
  }
  const TENSES = [['aor', 'Vergangenheit (Aorist)', 'L5–6'], ['neg', 'Verneinung', 'L6'], ['prog', 'Verlaufsform (gerade)', 'L6'], ['negprog', 'Verlaufsform verneint', 'L6'], ['ing', 'Ingressiv (gleich)', 'L8'], ['fut', 'Zukunft', 'L16'], ['negfut', 'Zukunft verneint', 'L16']];
  const DEPRON = ['ich', 'du', 'er/sie', 'wir', 'ihr', 'sie'];
  routes.verbs = (tab = 'table', vi = '0') => {
    setTitle('Verben', true); setTab('more');
    const tabs = [['table', 'Tabellen'], ['quiz', 'Trainer']];
    let body = '';
    vi = Number(vi);
    if (tab === 'table') {
      const vb = window.EWE_VERBS[vi];
      body = `<select id="vsel">${window.EWE_VERBS.map((v, i) => `<option value="${i}" ${i === vi ? 'selected' : ''}>${esc(v.v)} – ${esc(v.de)}</option>`).join('')}</select>
        ${TENSES.map(t => `<div class="card"><h3 style="margin-top:0">${t[1]} <span class="tag">${t[2]}</span></h3>${window.EWE_PRONOUNS.map((p, i) => exRow(conj(vb, i, t[0]), DEPRON[i] + ' – ' + vb.de)).join('')}</div>`).join('')}
        <div class="card"><h3 style="margin-top:0">Befehlsform <span class="tag">L14</span></h3>${exRow(vb.imp + '!', 'Sg.: ' + vb.de + '!')}${exRow('Mì' + vb.v + '!', 'Pl.: ' + vb.de + '!')}${exRow('Mèga' + vb.v + ' o!', 'Nicht ' + vb.de + '! (Sg.)')}${exRow('Mìga' + vb.v + ' o!', 'Nicht ' + vb.de + '! (Pl.)')}</div>
        <p class="small muted">Formen nach den Regeln des Lehrbuchs gebildet. In der Umgangssprache und je nach Dialekt gibt es Varianten (z. B. míé-/mímé-).</p>`;
    } else body = '';
    view(`<div class="seg">${tabs.map(t => `<button class="${t[0] === tab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>${body}`);
    $$('.seg button').forEach(b => (b.onclick = () => location.replace('#/verbs/' + b.dataset.t)));
    if ($('#vsel')) $('#vsel').onchange = e => location.replace('#/verbs/table/' + e.target.value);
    if (tab === 'quiz') {
      const qs = [...Array(10)].map(() => {
        const vb = pick(window.EWE_VERBS, 1)[0], p = Math.floor(Math.random() * 6), t = pick(TENSES, 1)[0];
        const ans = conj(vb, p, t[0]);
        const wrong = new Set();
        let g = 0; while (wrong.size < 3 && g++ < 50) { const p2 = Math.floor(Math.random() * 6), t2 = pick(TENSES, 1)[0][0]; const f = conj(vb, p2, t2); if (f !== ans) wrong.add(f); }
        return { type: 'mc', prompt: `${t[1]} · ${DEPRON[p]}`, bigDe: vb.de, ans, opts: shuffle([ans, ...wrong]), eweOpts: true };
      });
      runQuiz(qs, { done: (r, t) => view(`<div class="card center"><div class="score">${r}/${t}</div><a class="btn block" href="#/verbs/table">Tabellen</a></div>`) });
    }
  };

  // Einstellungen
  routes.settings = () => {
    setTitle('Einstellungen', true); setTab('more');
    const st = S.settings;
    view(`<div class="card">
      <label class="switch"><span>Tonzeichen anzeigen<br><span class="small muted">Im Alltag schreiben Ewe-Sprecher oft ohne Töne.</span></span><input type="checkbox" id="sTones" ${st.tones ? 'checked' : ''}></label>
      <label class="switch"><span>Tonzeichen beim Schreiben prüfen</span><input type="checkbox" id="sStrict" ${st.strict ? 'checked' : ''}></label>
      <label class="switch"><span>Tagesziel (Aufgaben)</span><input type="number" id="sGoal" value="${st.goal}" min="5" max="200" style="width:80px;font-size:17px"></label>
      <label class="switch"><span>Neue Wörter pro Tag</span><input type="number" id="sNew" value="${st.newPerDay}" min="0" max="100" style="width:80px;font-size:17px"></label>
      </div>
      <div class="card"><h3 style="margin-top:0">Sicherung</h3><p class="small muted">Dein Fortschritt liegt nur auf diesem Gerät. Exportiere ihn regelmäßig (z. B. in die Dateien-App).</p>
      <button class="btn secondary block" id="exp">⬇️ Fortschritt exportieren</button><div class="sp"></div>
      <label class="btn secondary block">⬆️ Fortschritt importieren<input type="file" id="imp" accept=".json,application/json" hidden></label><div class="sp"></div>
      <button class="btn secondary block" id="expA">⬇️ Referenzaufnahmen exportieren</button><div class="sp"></div>
      <label class="btn secondary block">⬆️ Referenzaufnahmen importieren<input type="file" id="impA" accept=".json,application/json" hidden></label>
      <p class="small muted" id="refInfo"></p></div>
      <div class="card"><button class="btn red block" id="reset">Fortschritt zurücksetzen</button></div>`);
    $('#sTones').onchange = e => { st.tones = e.target.checked; save(); };
    $('#sStrict').onchange = e => { st.strict = e.target.checked; save(); };
    $('#sGoal').onchange = e => { st.goal = Math.max(5, +e.target.value || 20); save(); };
    $('#sNew').onchange = e => { st.newPerDay = Math.max(0, +e.target.value || 0); save(); };
    const dl = (obj, name) => { const b = new Blob([JSON.stringify(obj)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove(); };
    $('#exp').onclick = () => dl(S, 'ewe-fortschritt-' + today() + '.json');
    $('#imp').onchange = async e => { try { const o = JSON.parse(await e.target.files[0].text()); if (!o.srs) throw 0; S = Object.assign({}, DEF, o); save(); toast('Fortschritt importiert.'); route(); } catch (err) { toast('Datei ungültig.'); } };
    $('#expA').onclick = async () => { const items = await A.exportRefs(); if (!items.length) return toast('Noch keine Referenzaufnahmen.'); dl({ type: 'ewe-refs', items }, 'ewe-aufnahmen-' + today() + '.json'); };
    $('#impA').onchange = async e => { try { const o = JSON.parse(await e.target.files[0].text()); const n = await A.importRefs(o.items || []); toast(n + ' Aufnahmen importiert.'); route(); } catch (err) { toast('Datei ungültig.'); } };
    A.allRefKeys().then(k => ($('#refInfo').textContent = k.length + ' Referenzaufnahmen gespeichert.'));
    $('#reset').onclick = () => { if (confirm('Wirklich den gesamten Lernfortschritt löschen?')) { S = JSON.parse(JSON.stringify(DEF)); save(); route(); } };
  };

  routes.about = () => {
    setTitle('Über', true); setTab('more');
    view(`<div class="card"><h3 style="margin-top:0">Auf den Home-Bildschirm (iPhone/iPad)</h3>
      <ol class="small"><li>Öffne diese Seite in <b>Safari</b>.</li><li>Tippe auf <b>Teilen</b> (□↑).</li><li>Wähle <b>„Zum Home-Bildschirm“</b> → Hinzufügen.</li></ol>
      <p class="small">Danach startet Eʋegbe wie eine eigene App im Vollbild und funktioniert auch <b>offline</b>.</p></div>
      <div class="card"><h3 style="margin-top:0">Über die Ewe-Sprache</h3><p class="small">Ewe (Eʋegbe) ist eine Kwa-Sprache der Niger-Kongo-Familie. Sie wird im Südosten Ghanas (Volta-Region), im Süden Togos und in Teilen Benins gesprochen. Typisch sind <b>Töne</b>, <b>serielle Verben</b> („nehmen-geben“ = geben) und Laute wie ƒ, ʋ, ɖ, kp und gb. Die Schriftsprache beruht vor allem auf dem Aŋlɔ-Küstendialekt.</p></div>
      <div class="card"><h3 style="margin-top:0">Zur Aussprache in dieser App</h3><p class="small">Für Ewe gibt es keine Sprachausgabe auf iPhone/iPad. Deshalb bietet die App: Lautbeschreibungen auf Deutsch, die hörbare <b>Tonmelodie</b> jedes Wortes, eine <b>Tonhöhen-Analyse</b> deiner eigenen Aufnahme und <b>Muttersprachler-Referenzen</b>, die du selbst aufnehmen (lassen) und teilen kannst. Fließend wirst du am schnellsten mit echten Gesprächspartner/innen – nutze die App als Vorbereitung und Begleiter.</p></div>
      <div class="card"><h3 style="margin-top:0">Quelle</h3><p class="small">Lektionen, Beispielsätze und Wortschatz nach: Simon Wellington Dzablu-Kumah, <i>Basic Ewe for Foreign Students</i>, 2. Auflage, überarbeitet von Ulrike Claudi & Johannes Ayao Ossey, Institut für Afrikanistik, Universität zu Köln, 2015. Deutsche Erklärungen und Übersetzungen für diese App erstellt.</p></div>`);
  };

  // ---------- Start ----------
  updateXp();
  route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
