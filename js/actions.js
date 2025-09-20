// actions.js
(function(){
  function init(){
    UI.render();
    bind();
  }

  function bind(){
    document.getElementById('addToGoalForm').addEventListener('submit', onAddToGoal);
    document.getElementById('logTodayBtn').addEventListener('click', onLogToday);
    document.getElementById('exportBtn').addEventListener('click', State.exportJson);
    document.getElementById('importFile').addEventListener('change', onImport);
    document.getElementById('menuButton').addEventListener('click', toggleMenu);
  }

  function onAddToGoal(e){
    e.preventDefault();
    const state = State.load();
    const id = document.getElementById('goalSelect').value;
    const amtStr = document.getElementById('addAmount').value.trim();
    const amt = Math.max(0, parseInt(amtStr, 10));
    if(!amt){ return; }
    const goal = state.goals.find(g => g.id===id);
    if(goal){
      goal.current += amt;
      state.activity.push({type:'save', amount: amt, date: today(), note: 'Manual add'});
      state.activity.push({type:'goal_update', date: today(), detail: `${goal.name} +$${amt}`});
      Badges.evaluateBadges(state);
      State.save(state);
      UI.render();
      announce(`Added $${amt} to ${goal.name}`);
    }
    e.target.reset();
  }

  function onLogToday(){
    const state = State.load();
    const last = new Date(state.streak.lastCheckIn);
    const now = new Date();
    const lastDay = last.toDateString();
    const todayStr = now.toDateString();
    if(lastDay !== todayStr){
      state.streak.days += 1;
      state.streak.lastCheckIn = now.toISOString().slice(0,10);
      state.activity.push({type:'checkin', date: now.toISOString()});
      Badges.evaluateBadges(state);
      State.save(state);
      UI.render();
      announce('Daily check‑in logged. Streak increased!');
    }else{
      announce('You already checked in today.');
    }
  }

  function onImport(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(){
      try{
        const data = JSON.parse(reader.result);
        State.save(data);
        UI.render();
        announce('Import successful.');
      }catch(err){
        announce('Import failed. Invalid file.');
      }
    };
    reader.readAsText(file);
  }

  function toggleMenu(){
    const btn = document.getElementById('menuButton');
    const nav = document.getElementById('mainNav');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'block';
  }

  function announce(msg){
    const live = document.getElementById('liveRegion');
    if(live){ live.textContent = msg; }
  }

  function today(){ return new Date().toISOString().slice(0,10); }

  document.addEventListener('DOMContentLoaded', init);
})();
