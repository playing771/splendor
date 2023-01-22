// const DEV_MODE = true;
const DEV_MODE = false;

export const SERVER_URL_LOCAL = 'localhost';
export const SERVER_URL_PROD = '178.250.157.172';
export const SERVER_PORT = '8080';
export const CLIENT_PORT = '5173'

export const SERVER_URL = DEV_MODE ? SERVER_URL_LOCAL : SERVER_URL_PROD;


export const ORIGIN = DEV_MODE ? `http://${SERVER_URL}:${CLIENT_PORT}` : `http://${SERVER_URL}`;