import type { AxiosError } from "axios";
import axios from "axios";
import type { UserRegister } from "../constants/basic-types";

export const API_URL = import.meta.env.VITE_API_URL || 'https://lifelineassemblycms-be.onrender.com/api/'; // 'https://lifelineassemblycms-be.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUpApi = async (data: UserRegister) => {
  try {
    const response = await api.post('/auth/register/', data);
    return response.data;
  } catch (error: unknown) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const adminLogin = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/login/', data);
    return response.data;
  } catch (error: unknown) {
    throw (error as AxiosError)?.response?.data || error;
  }
};


export const requestResetPassword = async (data: {
  email: string;
}) => {
  try {
    const response = await api.post('/auth/password/request-reset', data);
    return response.data;
  } catch (error: unknown) {
    throw (error as AxiosError)?.response?.data || error;
  }
};