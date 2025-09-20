// state.js
(function(){
  const key = 'finpath_state_v1';

  const defaultState = {
    user: { name: 'Alex Martinez', email: 'alex@email.edu', joined: '2025-02-10' },
    preferences: { highContrast: false, fontScale: 1.0, notifyHour: '20:00' },
    goals: [
      { id: 'emergency-400', name: '$400 Emergency Buffer', target: 400, current: 265, due: '2025-11-15' }
    ],
    streak: { days: 7, lastCheckIn: '2025-09-18' },
    badges: [
      { id: 'first-save', name: 'First Save', earnedAt: '2025-09-05' },
      { id: 'week-streak', name: '7-Day Saver', earnedAt: '2025-09-18' }
    ],
    activity: [
      { type: 'save', amount: 15, date: '2025-09-18', note: 'Skipped coffee' },
      { type: 'goal_update', date: '2025-09-15', detail: 'Emergency fund +$25' }
    ]
  };

  function load(){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : structuredClone(defaultState);
    }catch(e){
      return structuredClone(defaultState);
    }
  }

  function save(state){
    localStorage.setItem(key, JSON.stringify(state));
  }

  function exportJson(){
    const data = JSON.stringify(load(), null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finpath_profile_export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function maskEmail(email){
    const [name, domain] = email.split('@');
    return name[0] + '***@' + domain;
  }

  window.State = { load, save, exportJson, maskEmail };
})();
