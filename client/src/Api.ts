import axios from "axios";
import { SERVER_PORT, SERVER_URL } from "../../constants";



// const SERVER_URL = 'localhost:8080';
// const SERVER_URL = '178.250.157.172:8080';

export const Api = axios.create({
  baseURL: `http://${SERVER_URL}:${SERVER_PORT}`,
  withCredentials: true
})

export const WEBSOCKETS_URL = `ws://${SERVER_URL}:${SERVER_PORT}`;