// accessibility.js
(function(){
  function init(){
    const contrast = document.getElementById('contrastToggle');
    const font = document.getElementById('fontScale');
    const notify = document.getElementById('notifyHour');

    contrast.addEventListener('change', onContrast);
    font.addEventListener('input', onFont);
    notify.addEventListener('change', onNotify);
  }

  function onContrast(e){
    const state = State.load();
    state.preferences.highContrast = !!e.target.checked;
    State.save(state);
    document.body.classList.toggle('high-contrast', state.preferences.highContrast);
  }

  function onFont(e){
    const state = State.load();
    const val = parseFloat(e.target.value);
    state.preferences.fontScale = val;
    State.save(state);
    document.documentElement.style.fontSize = val + 'rem';
  }

  function onNotify(e){
    const state = State.load();
    state.preferences.notifyHour = e.target.value;
    State.save(state);
    // re-render countdown
    const next = UI.computeNextCheckIn(state);
    document.getElementById('nextCheckInText').textContent = next.toLocaleString();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
