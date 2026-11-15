import axios, { AxiosError } from "axios";
import { API_URL } from "./auth-api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSermonsList = async () => {
  try {
    const response = await api.get('/sermons/list/')
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getBlogsList = async () => {
  try {
    const response = await api.get('/blogs/')
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getGalleryList = async () => {
  try {
    const response = await api.get('/gallery/list/')
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getEventList = async () => {
  try {
    const response = await api.get('/event/list/')
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getEachSermon = async ({id}: {id: number}) => {
  try {
    const response = await api.get(`/sermons/${id}/view`)
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}

export const getEachEvent = async ({id}: {id: number}) => {
  try {
    const response = await api.get(`/event/${id}/`)
    return response;
  } catch (error) {
    throw (error as AxiosError)?.response?.data || error;
  }
}