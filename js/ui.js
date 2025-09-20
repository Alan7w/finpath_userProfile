// ui.js
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  function render(){
    const state = State.load();
    renderProfile(state);
    renderGoals(state);
    renderBadges(state);
    renderStreak(state);
    renderActivity(state);
    renderSettings(state);
  }

  function renderProfile(state){
    const initials = state.user.name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
    $('#avatar').textContent = initials;
    $('#userName').textContent = state.user.name;
    $('#userEmail').textContent = State.maskEmail(state.user.email);
    $('#joinedDate').textContent = new Date(state.user.joined).toLocaleDateString();
    const total = state.goals.reduce((sum,g)=> sum + g.current, 0);
    $('#currentBalance').textContent = `$${total.toFixed(0)}`;
    const month = new Date().toISOString().slice(0,7); // YYYY-MM
    const monthSaved = state.activity.filter(a => a.type==='save' && a.date.startsWith(month)).reduce((s,a)=>s+(a.amount||0),0);
    $('#monthSaved').textContent = `$${monthSaved.toFixed(0)}`;
    $('#streakDays').textContent = state.streak.days;
  }

  function renderGoals(state){
    const container = $('#goalsContainer');
    container.innerHTML = '';
    const select = $('#goalSelect');
    select.innerHTML = '';

    state.goals.forEach(g => {
      // card
      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML = `
        <div class="goal-head">
          <h3>${g.name}</h3>
          <span class="muted">Due: ${new Date(g.due).toLocaleDateString()}</span>
        </div>
        <div class="progress" aria-label="Progress toward ${g.name}" role="progressbar"
             aria-valuemin="0" aria-valuemax="${g.target}" aria-valuenow="${g.current}">
          <div style="width:${Math.min(100, (g.current/g.target)*100)}%"></div>
        </div>
        <p><strong>$${g.current.toFixed(0)}</strong> / $${g.target.toFixed(0)}</p>
      `;
      container.appendChild(card);

      // select option
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      select.appendChild(opt);
    });
  }

  function renderBadges(state){
    const grid = $('#badgesGrid');
    grid.innerHTML = '';
    const all = [
      {id:'first-save', name:'First Save', emoji:'🌱'},
      {id:'week-streak', name:'7-Day Saver', emoji:'🔥'},
      {id:'buffer-hero', name:'Buffer Hero', emoji:'🛡️'}
    ];
    const earned = new Set(state.badges.map(b=>b.id));
    all.forEach(b => {
      const div = document.createElement('div');
      div.className = 'badge ' + (earned.has(b.id) ? '' : 'locked');
      const meta = state.badges.find(x => x.id===b.id);
      div.innerHTML = `
        <div class="big" aria-hidden="true">${b.emoji}</div>
        <div><strong>${b.name}</strong></div>
        <div class="muted">${meta?('Earned: '+ new Date(meta.earnedAt).toLocaleDateString()):'Locked'}</div>
      `;
      grid.appendChild(div);
    });
  }

  function computeNextCheckIn(state){
    const [h,m] = (state.preferences.notifyHour||'20:00').split(':').map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(h, m||0, 0, 0);
    if(next <= now){
      next.setDate(next.getDate()+1);
    }
    return next;
  }

  function renderStreak(state){
    $('#streakCount').textContent = state.streak.days;
    const next = computeNextCheckIn(state);
    $('#nextCheckInText').textContent = next.toLocaleString();
    updateCountdown(next);
  }

  let countdownTimer;
  function updateCountdown(next){
    if(countdownTimer) clearInterval(countdownTimer);
    function tick(){
      const now = new Date();
      let diff = Math.max(0, next - now);
      const hrs = Math.floor(diff/3_600_000);
      diff -= hrs*3_600_000;
      const mins = Math.floor(diff/60_000);
      const secs = Math.floor((diff - mins*60_000)/1000);
      document.getElementById('countdown').textContent = `${hrs}h ${mins}m ${secs}s`;
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function renderActivity(state){
    const list = $('#activityList');
    list.innerHTML = '';
    state.activity.slice().reverse().forEach(a => {
      const li = document.createElement('li');
      if(a.type==='save'){
        li.innerHTML = `<strong>Saved $${a.amount}</strong> — <span class="muted">${new Date(a.date).toLocaleString()}</span> · ${a.note||''}`;
      } else if(a.type==='goal_update'){
        li.innerHTML = `<strong>Goal Update</strong> — <span class="muted">${new Date(a.date).toLocaleString()}</span> · ${a.detail||''}`;
      } else if(a.type==='checkin'){
        li.innerHTML = `<strong>Daily Check‑In</strong> — <span class="muted">${new Date(a.date).toLocaleString()}</span>`;
      }
      list.appendChild(li);
    });
  }

  function renderSettings(state){
    const c = document.getElementById('contrastToggle');
    const f = document.getElementById('fontScale');
    const n = document.getElementById('notifyHour');
    c.checked = !!state.preferences.highContrast;
    document.body.classList.toggle('high-contrast', c.checked);
    f.value = state.preferences.fontScale || 1.0;
    document.documentElement.style.fontSize = (state.preferences.fontScale||1.0) + 'rem';
    n.value = state.preferences.notifyHour || '20:00';
  }

  window.UI = { render, computeNextCheckIn };
})();
