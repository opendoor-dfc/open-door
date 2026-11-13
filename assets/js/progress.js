// OPEN DOOR pilot: progress, passport, quiz and opportunity filters.
// Everything is saved only in this browser (localStorage). Nothing is sent anywhere.
(function () {
  var KEY = 'od-progress';
  var TOTAL = window.OD_TOTAL_MODULES || 6;

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.modules && s.apps && s.outcomes) return s;
    } catch (e) {}
    return { modules: [], apps: [], outcomes: [] };
  }
  var state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    updateAll();
  }

  function $(id) { return document.getElementById(id); }
  function setText(id, text) { var e = $(id); if (e) e.textContent = text; }

  // ---------- Progress, dashboard and stamps ----------
  function updateAll() {
    var n = state.modules.length;
    var pct = Math.min(100, n / TOTAL * 100);
    ['module-progress', 'dash-progress'].forEach(function (id) { var e = $(id); if (e) e.style.width = pct + '%'; });
    setText('module-count', n + ' of ' + TOTAL + ' modules completed');
    setText('dash-mod-count', n + ' of ' + TOTAL + ' modules');
    setText('dash-app-count', state.apps.length + ' / 5');
    setText('stamp1-status', n >= TOTAL ? 'Earned' : 'In progress');
    setText('stamp2-status', state.apps.length + ' / 5');
    var s1 = $('stamp1'); if (s1) s1.classList.toggle('earned', n >= TOTAL);
    var s2 = $('stamp2'); if (s2) s2.classList.toggle('earned', state.apps.length >= 5);
    document.querySelectorAll('input[data-module]').forEach(function (box) {
      box.checked = state.modules.indexOf(Number(box.dataset.module)) !== -1;
    });
    renderPassport();
  }

  function renderPassport() {
    var log = $('passport-log');
    if (!log) return;
    var items = [];
    if (state.modules.length >= TOTAL) items.push('Foundation Certificate completed. Stamp 1 earned.');
    if (state.apps.length >= 5) items.push('Five applications submitted with evidence. Stamp 2 earned.');
    state.outcomes.forEach(function (o) {
      items.push(o.name + ': ' + (o.type === 'received' ? 'Opportunity received' : 'Opportunity completed') + ' (evidence file: ' + o.proof + ').');
    });
    log.textContent = '';
    if (!items.length) { log.textContent = 'Your milestones will appear here as you complete them.'; return; }
    items.forEach(function (text) { var p = document.createElement('p'); p.textContent = '• ' + text; log.appendChild(p); });
  }

  // Module checkboxes
  document.addEventListener('change', function (e) {
    var box = e.target.closest && e.target.closest('input[data-module]');
    if (!box) return;
    var i = Number(box.dataset.module);
    state.modules = state.modules.filter(function (x) { return x !== i; });
    if (box.checked) state.modules.push(i);
    save();
  });

  // Opportunity buttons
  document.addEventListener('click', function (e) {
    var saveBtn = e.target.closest && e.target.closest('[data-save]');
    if (saveBtn) { alert('Saved in this prototype session. A live site would store this in your account.'); return; }
    var sub = e.target.closest && e.target.closest('[data-submit]');
    if (!sub) return;
    var id = sub.dataset.submit;
    if (state.apps.some(function (a) { return a.id === id; })) { alert('This demo opportunity is already marked submitted.'); return; }
    var proof = prompt('Enter a proof file name (demo only), e.g. confirmation.png');
    if (!proof) return;
    state.apps.push({ id: id, proof: proof, date: new Date().toISOString() });
    save();
    alert('Marked as submitted with a proof-file name. This is not a selection or offer.');
  });

  // Passport outcome form
  var form = $('outcome-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('outcome-name').value.trim(), type = $('outcome-type').value, proof = $('outcome-proof').value.trim();
    if (!name || !proof) { alert('Enter the opportunity name and a proof file name for this demo.'); return; }
    state.outcomes.push({ name: name, type: type, proof: proof, date: new Date().toISOString() });
    save();
    $('outcome-name').value = ''; $('outcome-proof').value = '';
    alert('Outcome added to this browser demo. A production site must securely upload and review the evidence.');
  });

  // ---------- Opportunity search and filters ----------
  var search = $('search'), typeF = $('type-filter'), subjF = $('subject-filter');
  function filterOpps() {
    var q = (search.value || '').toLowerCase(), t = typeF.value, s = subjF.value, shown = 0;
    document.querySelectorAll('.opp').forEach(function (o) {
      var ok = (!q || o.dataset.search.indexOf(q) !== -1) && (!t || o.dataset.type === t) && (!s || o.dataset.subject === s);
      o.hidden = !ok;
      if (ok) shown++;
    });
    var empty = $('opp-empty'); if (empty) empty.hidden = shown > 0;
  }
  if (search && typeF && subjF) {
    search.addEventListener('input', filterOpps);
    typeF.addEventListener('change', filterOpps);
    subjF.addEventListener('change', filterOpps);
  }

  // ---------- Find Your Path quiz (nothing is saved) ----------
  var questions = window.OD_QUIZ, fields = window.OD_QUIZ_FIELDS;
  if (questions && $('quiz-box')) {
    var qi = 0, answers = [];
    var render = function () {
      var q = questions[qi];
      setText('quiz-step-label', 'Question ' + (qi + 1) + ' of ' + questions.length);
      $('quiz-progress').style.width = ((qi + 1) / questions.length * 100) + '%';
      setText('quiz-question', q.question);
      var box = $('quiz-options'); box.textContent = '';
      q.answers.forEach(function (text, i) {
        var label = document.createElement('label'); label.className = 'checkrow';
        var input = document.createElement('input'); input.type = 'radio'; input.name = 'q' + qi; input.value = i;
        if (answers[qi] === i) input.checked = true;
        var span = document.createElement('span'); span.textContent = text;
        label.appendChild(input); label.appendChild(span); box.appendChild(label);
      });
      $('quiz-hint').hidden = true;
    };
    var showOnly = function (id) {
      ['quiz-start', 'quiz-box', 'quiz-result'].forEach(function (x) { $(x).hidden = x !== id; });
    };
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-quiz]');
      if (!b) return;
      var action = b.dataset.quiz;
      if (action === 'start') { qi = 0; answers = []; showOnly('quiz-box'); render(); return; }
      if (action === 'back') { if (qi > 0) { qi--; render(); } else showOnly('quiz-start'); return; }
      if (action === 'next') {
        var v = document.querySelector('input[name="q' + qi + '"]:checked');
        if (!v) { $('quiz-hint').hidden = false; return; }
        answers[qi] = Number(v.value);
        if (qi < questions.length - 1) { qi++; render(); return; }
        var counts = fields.map(function () { return 0; });
        answers.forEach(function (a) { counts[a]++; });
        var best = counts.indexOf(Math.max.apply(null, counts));
        setText('quiz-result-text', 'You may enjoy exploring ' + fields[best] + ' and related areas. Try a Foundation module and browse opportunities tagged to this field.');
        showOnly('quiz-result');
      }
    });
  }

  window.OD = {
    clear: function () {
      if (!confirm('Delete your saved progress on this device?')) return;
      state = { modules: [], apps: [], outcomes: [] };
      try { localStorage.removeItem(KEY); } catch (e) {}
      updateAll();
    }
  };

  updateAll();
})();
