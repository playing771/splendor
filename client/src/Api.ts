import axios from "axios";

// const SERVER_URL = 'localhost:8080';
const SERVER_URL = '178.250.157.172:8080';

export const Api = axios.create({
  // baseURL: 'http://localhost:8080',
  // baseURL: 'https://6b1e-94-25-174-75.eu.ngrok.io',
  baseURL: `http://${SERVER_URL}`,
  withCredentials:true
})

export const WEBSOCKETS_URL = `ws://${SERVER_URL}`;