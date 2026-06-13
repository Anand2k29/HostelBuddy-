# 🏨 HostelBuddy — Gamified Campus Management OS

> **Winner Submission for WebForge - A smart Campus Webathon**  
> **Team Name:** Kernel  
> **Members:**  
> 1. 🎓 **Arpita Matta**
> 2. 🎓 **Jyotasana** 
> 3. 🎓 **Anand Minejes**  

---

## 🎯 Problem Statement (PS)

Traditional hostel management is plagued by friction, delay, and opacity. The core pain points include:
1. **Chaotic Communication:** Complaints are scattered across informal WhatsApp groups or written in paper registers, leading to lost tickets and lack of audit trails.
2. **Student Disengagement:** Administrative tasks feel like chores, leading to delayed reports of critical maintenance issues.
3. **Safety Concerns:** Anti-ragging reporting lacks true anonymity. Students fear administrative retaliation, leaving harassment unreported.
4. **Wasted Warden Hours:** Outpasses are issued via paper slips that must be signed manually. Checking room occupancies, laundry statuses, and menu changes takes endless phone calls.

---

## 💡 The Solution: HostelBuddy

**HostelBuddy** is a comprehensive, gamified Campus OS designed to streamline student-to-administration communications. By translating boring complaints into **Advancement Quests** and tracking student activity via a **Server Leaderboard**, we drive engagement and speed up maintenance resolution loops. 

HostelBuddy digitizes the entire lifecycle of hostel life—from outpasses and meal logs to roommate matching and anonymous safety reporting—under a single unified console.

---

## 🌟 Why HostelBuddy is Unique (USP)

- **🕹️ Gamified RPG System:** Reports are styled as "Quests", rewarding XP and Emeralds upon resolution. A public leaderboard motivates students to be cooperative, civic-minded citizens.
- **🔒 True Anonymous Anti-Ragging Cell:** Reports filed through this channel completely sanitize student identity metadata from the database records and Warden view, preventing administrative retaliation.
- **🎟️ E-GatePass QR System:** Outpasses automatically generate a unique QR code upon Warden approval, which can be scanned at the security gates.
- **🤖 Librarian Scribe AI Chatbot:** Features a mock/live AI system compatible with **OpenRouter's free models** and Google Gemini, utilizing custom Minecraft-themed lore to answer questions about menus, rules, and report status.

---

## 🚀 Innovation

1. **Self-Auditing Civic Incentives:** Students climb leaderboard ranks not by complaining, but by *helping* the hostel community (reporting issues, validating dining quality, keeping clean logs).
2. **Smart Category Auto-Detection:** The integrated AI service analyzes complaint descriptions to automatically categorize them (WIFI, PLUMBING, ELECTRICAL, etc.) and tag priority (LOW to CRITICAL).
3. **OpenRouter Integration:** The app supports standard OpenAI-compatible OpenRouter endpoints out of the box, allowing developers to plug in freemium models (`google/gemma-2-9b-it:free` or `meta-llama/llama-3.1-8b-instruct:free`) easily.

---

## 🛠️ Technical Feasibility

- **Scalable State Architecture:** Frontend is built using React 19, Vite, and tailwindcss v4, ensuring sub-second load times and modular UI cards.
- **Cross-Platform Compatibility:** The responsive grid adapts to mobile viewports, enabling security guards to scan QR outpasses directly on low-end smartphones.
- **Secure Anonymous Layer:** Employs an identity-hashing design for Anti-Ragging reports, detaching `reporterId` and applying isolated database nodes to guarantee anonymity.
- **API Adaptability:** Built-in dual-mode support for AI (Google Gemini SDK and OpenRouter fetch APIs) enables developers to swap API keys without changing component code.

---

## ✨ Features Walkthrough

### 🎓 Student Console (The Explorer HUD)
- **Advancement Quests:** Live-updating quest board to claim XP and Emeralds for completed actions.
- **Server Leaderboard:** Compete for high scores. Click rows to inspect player stats, streaks, and achievements.
- **Active Quest Log Timelines:** View a 4-step progress tracker (`Reported` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`) under active issue logs.
- **Gate Pass Panel:** Draft outpass requests and view approved secure QR credentials.
- **Mess Kitchen Cauldron & Buff HUD:** Live weekly menus featuring real-time "Now Serving" alerts. Mix raw ingredients (*Nether Pepper*, *Mana Mushroom*, *Aegis Herb*, *Dragon Egg*, *Glistering Honey*) in Chef Golem's alchemical cauldron to cook custom dishes for XP, Emeralds, and status buffs. Active status effects (like *Strength*, *Speed*, *Regeneration*) are displayed in a ticking Active Buff HUD with real-time countdown timers. Voting and reviewing menu items drops random ingredient loot into your pantry.
- **Roommate Finder:** Complete personality surveys to calculate compatibility percentages.
- **Lost & Found Vault:** Browse and report misplaced items in a grid.

### 🛡️ Warden Control Center (The God Console)
- **Real-time KPI Slots:** Live stats on High Alerts, Active Reports, and Completed Actions.
- **Global Log Stream:** Review and merge duplicate issue tickets into single parent logs to prevent redundant maintenance dispatch.
- **Gate Pass Registry:** Approve or reject student outpass requests with one click.
- **Broadcast System:** Issue urgent bulletins on the digital notice board.

---

## 💻 Tech Stack

- **Frontend Core:** React.js, TypeScript, Vite
- **Styling:** Vanilla CSS, TailwindCSS v4, Framer Motion (Animations)
- **Icons:** Lucide React
- **AI Engine:** OpenRouter APIs (`google/gemma-2-9b-it:free`), Google Gemini API, `@google/genai`
- **Charts:** Recharts

---

## 🔧 Getting Started & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anand2k29/HostelBuddy-.git
   cd HostelBuddy-
   cd HostelBuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Set your API Key (supports OpenRouter starting with sk-or- or sk-, or Gemini starting with AIza)
   VITE_API_KEY=your_api_key_here
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## ⚖️ License & Acknowledgements

Created by **Team Kernel** for the College Hackathon. Special thanks to the hostel residents and administration for testing the early mock prototypes.
