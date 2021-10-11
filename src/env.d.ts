declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    APP_STAGE: string;
    PORT: string;
    DB_DIALECT: string;
    DB_NAME: string;
    DB_PORT: string | number;
    DB_USER: string;
    DB_PASSWORD: string;
  }
}
