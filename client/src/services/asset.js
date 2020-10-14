const isDev = process.env.NODE_ENV !== 'production';

const BASE_URL = isDev ? 'http://localhost:3001' : '';

export const fetchAssets = async () => fetch(`${BASE_URL}/assets`).then(res => res.json());

export const fetchSuggestions = async (id) => fetch(`${BASE_URL}/assets/recommend/${id}`).then(res => res.json());
