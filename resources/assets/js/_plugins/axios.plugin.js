import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: `/api/v1/`
})

axiosInstance.interceptors.request.use((config) => {
  const tokenObject = JSON.parse(localStorage.getItem('coho_token'))
  if (tokenObject) {
    config.headers['Authorization'] = `Bearer ${ tokenObject.token }`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})