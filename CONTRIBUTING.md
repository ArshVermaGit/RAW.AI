# Contributing to RAW.AI 🚀

First off, thank you for considering contributing to RAW.AI! It's people like you that make RAW.AI such a powerful tool for the creative community.

When contributing, please follow these guidelines to ensure a smooth and productive process for everyone involved.

## 📝 Code of Conduct

By participating in this project, you agree to abide by the same professional and respectful standards we hold for our core team. Please be kind, constructive, and inclusive.

## 🛠️ Getting Started

1.  **Fork the Repo**: Create your own copy of the project.
2.  **Clone your Fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/RAW-AI.git
    cd RAW-AI
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Set up Environment Variables**:
    Copy the example `.env` (if available) or create one based on the README.
    ```bash
    cp .env.example .env.local
    ```

## 🌳 Branching Strategy

We follow a strict naming convention for branches. Please name your branch based on the type of change:

- `feat/`: A new feature (e.g., `feat/add-dark-mode`)
- `fix/`: A bug fix (e.g., `fix/login-error`)
- `docs/`: Documentation only changes (e.g., `docs/update-readme`)
- `style/`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor/`: A code change that neither fixes a bug nor adds a feature
- `chore/`: Build process or auxiliary tool changes

## 🏗️ Pull Request Process

1.  **Sync Your Fork**: Ensure your fork is up-to-date with the `main` branch.
2.  **Create a Branch**: Use a descriptive name as per the strategy above.
3.  **Commit Changes**: Use descriptive commit messages.
    - Example: `feat: implement user profile page`
    - Example: `fix: resolve crash on mobile menu`
4.  **Verify**: Run the project locally and ensure no errors.
    ```bash
    npm run lint
    npm run build
    ```
5.  **Submit**: Open a Pull Request against the `main` branch.
    - Fill out the PR Template completely.
    - Include screenshots/videos for UI changes.

## 💻 Tech Stack Overview

- **Frontend**: React 18 (Vite) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Edge Functions & PostgreSQL)
- **UI Components**: Shadcn UI (Radix) + Lucide Icons

## 🎨 Coding Standards

- **Functional Components**: Use React functional components with hooks.
- **Type Safety**: **NO `any` types.** Use descriptive interfaces and generated Supabase types.
- **Atomic CSS**: Use Tailwind classes. Avoid arbitrary values (e.g., `w-[123px]`) where possible; use theme tokens.
- **Imports**: Use absolute imports if configured, or keep relative imports clean.

## ❓ Questions?

If you're unsure about anything, feel free to open a discussion or reach out to the lead maintainer:

- **Arsh Verma**: [arshverma.dev@gmail.com](mailto:arshverma.dev@gmail.com)

Happy coding! Let's build the future of authentic AI writing together. 🌟
