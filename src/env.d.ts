declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_DEV: string;
    APP_STAGE: string;
    PORT: string;
  }
}
