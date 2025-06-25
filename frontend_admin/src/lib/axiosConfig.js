import axios from "axios";

const API_ADDRESS = import.meta.env.VITE_API_ADDRESS
console.log(API_ADDRESS)
export const apiClient = axios.create({
    baseURL: API_ADDRESS,
    timeout: 5000,
})