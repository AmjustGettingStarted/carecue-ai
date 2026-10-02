# CareCue AI

> **Accessible, Privacy-Centric Medicine Reminder & Caregiver Dashboard**  
> Built with Next.js (App Router, TypeScript), Tailwind CSS, and shadcn/ui.  
> **Hacktoberfest Challenge 1 Compliant**: Powered by Open-Source AI (Llama 3.1 / Gemma 2).

---

## 🌟 Overview & Key Features

CareCue AI bridges the gap between messy medical prescriptions and reliable medication adherence:

1. **Intelligent Ingestion via Open-Source AI**:
   - Parses unstructured doctor notes, discharge summaries, or caregiver instructions.
   - Extracts exact drug names, dosages, 24-hour schedules (`HH:MM`), and dietary constraints.
   - Synthesizes an empathetic, warm, easy-to-read one-sentence reminder prompt (`friendlyCue`) tailored for family members or elderly relatives.
   - Pre-loaded with three quick-sample presets:
     - *Dad's Blood Pressure & Sugar*
     - *Post-Surgery Recovery*
     - *Grandma's Evening Routine*

2. **Zero-Cloud Client Privacy & LocalStorage Persistence**:
   - Stores schedules, dose logs, and timestamps locally in the browser.
   - Zero mandatory database setup — runs instantly on any device.

3. **In-Browser Web Audio API Chime & High-Contrast Alarms**:
   - Synthesized melodic chimes via HTML5 Web Audio API oscillators (no external MP3/WAV dependencies).
   - High-contrast fullscreen visual alert modal with:
     - Large **"Mark as Taken"** button (mutes chime and logs completion)
     - **"Snooze (10 mins)"** button
     - **"Skip this dose"** button

4. **Daily Timeline & Adherence Compliance**:
   - Chronological dose timeline with real-time status badges: *Upcoming*, *Due Now*, *Taken*, *Missed / Delayed*.
   - Compliance history feed tracking intake events, skipped doses, and adherence percentages.

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone https://github.com/AmjustGettingStarted/carecue-ai.git
cd carecue
npm install
```

### 2. Open-Source AI Configuration (Optional but Recommended)

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Configure your open-weight model provider in `.env.local`:

```env
# Groq (Llama 3.1 8B Instant)
AI_API_KEY=your_groq_api_key
AI_BASE_URL=https://api.groq.com/openai/v1/chat/completions
AI_MODEL_NAME=llama-3.1-8b-instant

# Or Hugging Face Inference API
# AI_BASE_URL=https://api-inference.huggingface.co/v1/chat/completions
# AI_MODEL_NAME=meta-llama/Meta-Llama-3.1-8B-Instruct

# Or Local Ollama (100% Private & Offline)
# AI_BASE_URL=http://localhost:11434/v1/chat/completions
# AI_MODEL_NAME=llama3.1
```

> **Note**: If no external API key is provided or the endpoint is unreachable, CareCue AI automatically activates its intelligent offline heuristic extractor so the application remains 100% operational out-of-the-box!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, `@tailwindcss/postcss`, Base UI
- **Icons**: Lucide React
- **Audio Engine**: Native HTML5 Web Audio API (`AudioContext` oscillators)
- **AI Backend Route**: `app/api/parse-prescription/route.ts` with OpenAI/HuggingFace-compatible schema
- **State & Persistence**: React Context (`context/MedicineContext.tsx`) + `localStorage`

---

## 🧪 Verification & Building

Run linting:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```
