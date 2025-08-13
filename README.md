# Medication Management System

A comprehensive React-based application for managing patient medications, schedules, and administration records. Built with TypeScript, Vite, and TanStack Query for optimal performance and developer experience.

## Features

- **Patient Management**: View and manage patient information
- **Medication Tracking**: Create and manage patient medications
- **Schedule Management**: Set up medication schedules with day/time preferences
- **Calendar View**: Visual calendar showing upcoming medication doses
- **Administration Records**: Track when medications are actually taken
- **Real-time Updates**: Optimistic updates with automatic cache invalidation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: Styled Components
- **Routing**: React Router
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd med-management
```

2. Install dependencies:

```bash
npm install
```

### Environment Setup

**⚠️ IMPORTANT: Never commit your actual `.env` file to version control!**

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual credentials:

```bash
# API Configuration
VITE_API_KEY=your_actual_api_key_here
VITE_API_BASE_URL=https://rbn1g3hpv0.execute-api.us-east-1.amazonaws.com/Prod
NODE_ENV=development
```

3. **Get your API key securely** from the project maintainer via:
   - Secure messaging (Signal, Telegram)
   - Password manager sharing (1Password, LastPass)
   - Encrypted email (ProtonMail)

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
