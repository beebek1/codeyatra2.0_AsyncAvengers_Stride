
# Stride (Async Avengers)

### **The Problem (Why we built this)**

Let’s be real: choosing a career in 2026 is overwhelming. You search "How to become an AI Engineer" and get 50 different roadmaps, 100 YouTube playlists, and a headache. Most people have the ambition, but they get lost in the "vague middle"—they don't know what to do **today** to reach a goal **two years** from now.

We built this to bridge the gap between "I want to be X" and "Here is your Trello board for the week."

### **What it actually does**

1. **Stop the Overwhelm:** You take a quick quiz about what you like (and what you're good at).
2. **Smart Match:** We don't just show a list; we give you a "Fit Score" for different careers.
3. **The Roadmap (The "Trello" Part):** Once you pick a career, our AI generates a step-by-step Kanban board. It breaks the massive journey into:
* **Basics** (The "don't quit yet" phase)
* **Intermediate** (The "getting serious" phase)
* **Advanced** (The "portfolio" phase)
* **Career Launch** (The "get paid" phase)


4. **Forecasting:** It tracks your pace. If you’re slacking, it tells you. If you’re crushing it, it predicts when you'll actually be "job-ready."

### **The Tech Stack**

* **Backend:** Node.js (v22) + Express (Modular structure)
* **Database:** PostgreSQL + Sequelize ORM
* **AI:** Gemini API (for roadmap generation)
* **Frontend:** React + Tailwind CSS

---

### **How to get this running locally**

1. **Clone it:**
```bash
git clone https://github.com/your-username/careerforge-ai.git
cd server

```


2. **Install stuff:**
```bash
npm install

```


3. **Environment Variables (`.env`):**
Create a `.env` file in the root of the `/server` folder. You’ll need:
```env
PORT=5000
DB_NAME=your_db_name
DB_USER=your_postgres_user
DB_PASS=your_password
DB_HOST=localhost
GEMINI_API_KEY=your_key_here

```


4. **Database Sync:**
The models are set to `alter: true`, so just start the server and the tables will create themselves.
5. **Start Dev Mode:**
```bash
npm start

```


*(If it crashes with a `MODULE_NOT_FOUND` error, make sure you aren't trying to run `index.js` when your main file is `server.js`!)*

### **Current Status**

This is a hackathon MVP. The "Fit Score" is basic math right now, and the AI roadmaps are generated on the fly. We're focusing on making the Trello board drag-and-drop experience feel smooth.

---

**Async Avengers Team:** *"Turning 'I don't know' into 'I'm on it'."* 🚀

---

**Should I add a "Contributing" section or a list of the specific API endpoints you've built so far?**