import axios from "axios";
import { SERVER_PORT, SERVER_URL } from "../../constants";

export const Api = axios.create({
  baseURL: `http://${SERVER_URL}:${SERVER_PORT}`,
  withCredentials: true
})

export const WEBSOCKETS_URL = `ws://${SERVER_URL}:${SERVER_PORT}`;