# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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

## Deployment / Production build

Set frontend environment variables (example in `.env` or CI):

- `VITE_API_URL` — base URL for the backend API (no trailing slash), e.g. `https://api.example.com`

Local development:

```bash
# from frontend/
npm install
npm run dev
```

Production build and deploy:

```bash
# set VITE_API_URL in your build environment
export VITE_API_URL=https://api.example.com
npm run build
# deploy the generated `dist/` to your static host / CDN
```

Notes:

- Vite embeds `VITE_` prefixed env variables at build time. For runtime-configurable API URL, consider a small runtime config endpoint or server-provided HTML with injected variables.
- Ensure CORS on the API server allows the frontend origin when hosted in production.

## Runtime configuration (optional)

By default Vite embeds `VITE_` env variables at build time. If you need to change the API URL (or other settings) after the frontend is built, use a runtime configuration approach. Two common approaches:

- Option A — Server injects variables into `index.html` (simple):

  1. During deployment have your server render or modify the `index.html` to include a small script before the app bundle:

     ```html
     <script>
       window.__RUNTIME__ = {
         API_URL: "https://api.example.com"
       };
     </script>
     <!-- then load your bundle as usual -->
     ```

  2. In your client code, fall back to the runtime value when `import.meta.env` is not what you want:

     ```ts
     const API_BASE = (import.meta.env.VITE_API_URL as string) || (window as any).__RUNTIME__?.API_URL || 'http://localhost:5001';
     ```

- Option B — Serve a static `/config.json` (recommended for static hosts):

  1. At deploy time, generate a `config.json` and place it in the built `dist/` (or `public/` for Vite so it's copied):

     ```bash
     # example (deploy script)
     echo '{"API_URL":"https://api.example.com"}' > dist/config.json
     ```

  2. Load it before your app mounts (example in `src/main.tsx`):

     ```ts
     async function init() {
       try {
         const res = await fetch('/config.json');
         if (res.ok) {
           (window as any).__RUNTIME__ = await res.json();
         }
       } catch (e) {
         // ignore, fallback to build-time env
       }
       // now mount your app
       import('./main').then(({ mount }) => mount());
     }
     init();
     ```

  3. Client code uses the same fallback as above:

     ```ts
     const API_BASE = (import.meta.env.VITE_API_URL as string) || (window as any).__RUNTIME__?.API_URL || 'http://localhost:5001';
     ```

Notes:
- Do not put secrets in frontend environment variables — they are visible to anyone with the app. Use backend secrets for protected credentials.
- If you need to change many runtime values, the `/config.json` approach is easiest for static hosting.
