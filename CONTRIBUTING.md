# Contributing to RAW.AI 🚀

First off, thank you for considering contributing to RAW.AI! It's people like you that make RAW.AI such a powerful tool for the creative community. We welcome contributions from everyone, whether you're a seasoned developer or just starting out.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Branching Strategy](#-branching-strategy)
- [Commit Convention](#-commit-convention)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Community & Support](#-community--support)

## 📝 Code of Conduct

By participating in this project, you agree to abide by the same professional and respectful standards we hold for our core team. Please read our full [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**

### Installation

1.  **Fork the Repository**: Click the "Fork" button at the top right of this page.
2.  **Clone your Fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/RAW-AI.git
    cd RAW-AI
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Environment Setup**:
    Create a `.env` file in the root directory. You can copy the example if provided, or use the following template:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:5173`.

## 🔄 Development Workflow

We use a standard fork-and-pull workflow.

1.  **Sync**: Always keep your `main` branch in sync with the upstream repository.
2.  **Branch**: Create a new branch for your feature or fix (see [Branching Strategy](#-branching-strategy)).
3.  **Code**: Implement your changes.
4.  **Verify**: Run linting and build commands to ensure quality.

## 🌳 Branching Strategy

We enforce a strict naming convention to keep our history clean.

- `feat/`: A new feature (e.g., `feat/add-dark-mode`, `feat/auth-integration`)
- `fix/`: A bug fix (e.g., `fix/login-error`, `fix/mobile-nav-alignment`)
- `docs/`: Documentation only changes (e.g., `docs/update-readme`)
- `style/`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor/`: A code change that neither fixes a bug nor adds a feature
- `chore/`: Build process or auxiliary tool changes, dependency updates
- `test/`: Adding missing tests or correcting existing tests

## 💬 Commit Convention

We encourage the use of [Conventional Commits](https://www.conventionalcommits.org/).

- `feat: add user profile page`
- `fix: resolve crash on mobile menu`
- `docs: update installation guide`
- `style: format code with prettier`

## 🏗️ Pull Request Process

1.  **Self-Review**: Look through your code once more before submitting.
2.  **Update Documentation**: If your change affects how users interact with the project (API, UI, etc.), update the relevant docs.
3.  **Open PR**: Submit a Pull Request against the `main` branch of the `ArshVermaGit/RAW-AI` repository.
4.  **Template**: Fill out the PR template completely. Do not skip sections.
5.  **Screenshots**: If it's a UI change, **screenshots or videos are required**.
6.  **Response**: Be responsive to comments and reviews.

## 🎨 Coding Standards

To maintain a "Hyper-Premium" quality codebase:

- **TypeScript**: Strict mode is on. **NO `any` types**. Define interfaces for all props and data structures.
- **Components**: Use functional components. Keep them small and focused. Extract logic to custom hooks where possible.
- **Tailwind**: Use utility classes. Avoid `style={{}}` prop unless for dynamic values. Use the `cn()` utility for conditional classes.
- **Imports**: Group imports: React/Third-party -> Local Components -> Hooks/Utils -> Types/Styles.

### Linting & Formatting

Run these commands before pushing:

```bash
npm run lint   # Check for code quality issues
npm run build  # Ensure the project builds successfully
```

## ❓ Community & Support

- **Issues**: Use the [Issue Tracker](https://github.com/ArshVermaGit/RAW-AI/issues) for bugs and feature requests.
- **Discussions**: Join GitHub Discussions for general questions.
- **Contact**: For sensitive inquiries, email [arshverma.dev@gmail.com](mailto:arshverma.dev@gmail.com).

Thank you for contributing to the future of authentic AI writing! 🌟
