<div align="center">
  <img src="https://rawai-arshvermagit.vercel.app/logo.png" alt="RAW.AI Logo" width="120" height="120" />
  
  # ⚡ RAW.AI — The Ultimate Text Humanizer
  
  **Transform AI-generated content into natural, human-written prose that bypasses all major AI detectors.**
  
  [![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://rawai-arshvermagit.vercel.app)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](#)
  
  [**Explore the App**](https://rawai-arshvermagit.vercel.app) • [**Report Bug**](https://github.com/ArshVermaGit/RAW-AI/issues) • [**Request Feature**](https://github.com/ArshVermaGit/RAW-AI/issues)
</div>

---

## ✨ Features

RAW.AI is designed for creators, students, and professionals who need to ensure their AI-generated drafts feel authentic and relatable.

-   **🧠 Advanced Humanization**: Choose between `Lite`, `Pro`, and `Ultra` levels to transform your text.
-   **🛡️ Undetectable AI**: Engineered to bypass GPTZero, Originality.ai, Turnitin, and more.
-   **💳 Integrated Payments**: Secure subscription management powered by **Razorpay**.
-   **🔐 Secure Auth**: Seamless login with Email/Password or **Google OAuth**.
-   **📊 Usage Tracking**: Real-time monitoring of your word limits and subscription status.
-   **🚀 Modern Stack**: Built with React, Vite, Framer Motion, and Supabase Edge Functions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS / Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Client**: Supabase SDK

### Backend
- **Database**: PostgreSQL (Supabase)
- **Functions**: Deno (Supabase Edge Functions)
- **Auth**: Supabase GoTrue (Google OAuth)
- **Storage**: Supabase Storage (Avatar Buckets)

### Third-Party
- **AI Engine**: OpenAI (GPT-4o / GPT-4o-mini)
- **Payments**: Razorpay API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- NPM or PNPM
- Supabase Account

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ArshVermaGit/RAW-AI.git
   cd RAW-AI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (based on `.env.example` if available):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Deployment

-   **Secrets Management**: All sensitive keys (OpenAI, Razorpay) are stored securely in Supabase Secrets using `npx supabase secrets set`.
-   **Environment Safety**: The `.env` file is untracked by Git to protect your credentials.
-   **Production URL**: The app is optimized for deployment on **Vercel**.

---

## 👨‍💻 Connect With Me

I'm **Arsh Verma**, a passionate developer focused on building AI-driven solutions and high-performance web applications.

<div align="left">
  <a href="mailto:ARSHVERMA.DEV@GMAIL.COM">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://github.com/ArshVermaGit">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/arshverma">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://twitter.com/arshverma">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
  </a>
</div>

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/ArshVermaGit">Arsh Verma</a>
</div>
