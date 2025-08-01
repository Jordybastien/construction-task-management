/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONSTRUCTION_BACKEND_API_URL: string;
  readonly VITE_OFFLINE_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}