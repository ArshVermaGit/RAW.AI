# RAW.AI 🚀

![License](https://img.shields.io/github/license/ArshVermaGit/RAW-AI?style=flat-square)
![Build Status](https://img.shields.io/github/actions/workflow/status/ArshVermaGit/RAW-AI/main.yml?style=flat-square)
![Version](https://img.shields.io/github/package-json/v/ArshVermaGit/RAW-AI?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

> **Bypass AI detection with human-grade rewriting.**  
> Transform your AI-generated content into authentic, undetectable, and engaging text.

---

## 🌟 Introduction

**RAW.AI** is a state-of-the-art platform designed to humanize AI-generated text. Leveraging advanced models (including our proprietary "Ultra Logic" engine), we rewrite content to bypass even the most sophisticated AI detectors while maintaining the original meaning and enhancing readability.

Whether you're a student, professional, or content creator, RAW.AI ensures your voice remains yours—authentic, unique, and undetectable.

## ✨ Key Features

- **🤖 Advanced Humanization**: Convert AI text to human-like quality with a 99.9% detection bypass rate.
- **🛡️ Integrated AI Detector**: Analyze your text against top detectors (GPTZero, Turnitin, etc.) in real-time.
- **✍️ Multiple Writing Modes**:
  - **Standard**: Balanced humanization.
  - **Academic**: Formal and structured for research.
  - **Creative**: Expressive and varied for storytelling.
  - **Business**: Professional and concise.
- **💳 Secure Payments**: Seamless global transactions powered by **Razorpay**.
- **🔒 Enterprise Security**: End-to-end encryption and secure data handling via **Supabase**.
- **📱 Responsive Design**: A pixel-perfect "Hyper-Premium" UI that works on all devices.

## 🛠️ Tech Stack

This project is built with the latest modern web technologies:

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Payments**: [Razorpay](https://razorpay.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ArshVermaGit/RAW-AI.git
    cd RAW-AI
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root directory and add your keys (see `.env.example`):

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in terminal) to view it in the browser.

## 📂 Project Structure

```bash
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
│   ├── common/     # Generic components (Modals, Loaders)
│   ├── layout/     # Header, Footer, Layout wrappers
│   ├── ui/         # Shadcn UI primitives
│   └── ...
├── config/         # Site-wide configuration (site.ts)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── pages/          # Page components (routed)
├── sections/       # Section-specific components (Home, Pricing, etc.)
├── styles/         # Global styles
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```

## 🤝 Contributing

We love contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## 📜 Changelog

See what's new in our [CHANGELOG.md](CHANGELOG.md) or visit the [Changelog Page](/changelog) on the website.

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## ❤️ Acknowledgements

- [Lucide React](https://lucide.dev/) for icons.
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives.
- [Vite](https://vitejs.dev/) for the fast build tool.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/ArshVermaGit">Arsh Verma</a>
</p>
