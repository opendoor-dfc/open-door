// Filters for the Opportunity Explorer. Runs only in the browser, sends nothing anywhere.
// Opportunities whose deadline has passed are hidden automatically.
(function () {
  var form = document.getElementById('opp-filters');
  if (!form) return;
  var cards = document.querySelectorAll('.entry');
  var count = document.getElementById('opp-count');
  var today = new Date().toISOString().slice(0, 10);

  function apply() {
    var category = form.category.value;
    var audience = form.audience.value;
    var freeOnly = form.free.checked;
    var shown = 0;
    cards.forEach(function (card) {
      var deadline = card.dataset.deadline;
      var ok =
        (!deadline || deadline >= today) &&
        (!category || card.dataset.category === category) &&
        (!audience || card.dataset.audience.split('|').indexOf(audience) !== -1) &&
        (!freeOnly || card.dataset.free === 'true');
      card.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown === 1 ? '1 opportunity' : shown + ' opportunities';
  }

  form.addEventListener('change', apply);
  apply();
})();
