import axios from "axios";

export const Api = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'https://6b1e-94-25-174-75.eu.ngrok.io',
  // baseURL: 'http://178.250.157.172:8080',
  withCredentials:true
})