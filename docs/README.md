# FinPath – Profile Prototype (Vanilla HTML/CSS/JS)

This is a lightweight, accessible **User Profile** (“User Portfolio”) prototype for a gamified savings app. No frameworks, no build tools.

## Features
- Semantic HTML with accessible landmarks and labels
- **Progression**: progress bars, streaks, recent activity
- **Ownership**: badges & milestones stored locally
- **Appointment Dynamic**: daily check‑in time + countdown
- **Cascading Information**: simple flows, no giant forms
- **Accessibility**: high-contrast mode, adjustable text size, keyboard-friendly
- **Offline-friendly**: uses LocalStorage, no external calls
- Import/Export of your local data as JSON

## Run Locally (for you and end users)
1. **Option A: Open directly**  
   - Just double‑click `index.html` to open in your browser.  
   - Works out of the box (no server required).

2. **Option B: Simple local server (recommended for testing)**  
   - Python 3: `python -m http.server 8080`  
   - Then visit `http://localhost:8080/profile_app/index.html`

## Deploy (public link anyone can open)
- **GitHub Pages** (no backend required):
  1. Create a new repo, e.g., `finpath-profile`.
  2. Copy the `profile_app/` contents to the repo root.
  3. Commit & push.
  4. In repo **Settings → Pages**, set Source to **Deploy from a branch**, Branch **main**, Folder **/** (root).
  5. Wait 1–2 minutes; your app will be live at `https://<your-username>.github.io/finpath-profile/`

- **Netlify / Vercel**: drag‑and‑drop the folder; they’ll host it free.

## File Structure
```
profile_app/
  index.html
  css/
    base.css
    layout.css
    components.css
  js/
    state.js
    ui.js
    actions.js
    badges.js
    accessibility.js
  img/
    avatars/   (placeholder)
  README.md
```

## Notes
- This prototype stores demo data in **LocalStorage**. No real banking connections.
- To reset, clear your browser site data for the page.
- You can expand this by adding more goals, categories, or reflections.
