// badges.js
(function(){
  function evaluateBadges(state){
    const earned = new Set(state.badges.map(b => b.id));

    // First Save
    const hasSave = state.activity.some(a => a.type === 'save');
    if(hasSave && !earned.has('first-save')){
      state.badges.push({id:'first-save', name:'First Save', earnedAt: today()});
      announce('Badge unlocked: First Save');
    }

    // 7-Day Streak
    if(state.streak.days >= 7 && !earned.has('week-streak')){
      state.badges.push({id:'week-streak', name:'7-Day Saver', earnedAt: today()});
      announce('Badge unlocked: 7-Day Saver');
    }

    // $400 Goal Reached
    const g = state.goals.find(g => g.id === 'emergency-400');
    if(g && g.current >= g.target && !earned.has('buffer-hero')){
      state.badges.push({id:'buffer-hero', name:'Buffer Hero', earnedAt: today()});
      announce('Badge unlocked: Buffer Hero');
    }
  }

  function announce(msg){
    const live = document.getElementById('liveRegion');
    if(live){ live.textContent = msg; }
  }

  function today(){
    return new Date().toISOString().slice(0,10);
  }

  window.Badges = { evaluateBadges };
})();
