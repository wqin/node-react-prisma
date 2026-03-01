// Minimal runtime env typing to avoid TS2688 when vite/client types are not resolved
// This declares the parts of `import.meta.env` we use.

declare module "vite/client" {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    // add other `VITE_` variables here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
