import axios from 'axios'; import { useState, useEffect, useCallback } from 'react';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c; });
export const errMsg = e => e.response?.data?.message || 'Something went wrong. Please try again.';
export function useGet(url) {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const load = useCallback(() => { setLoading(true); setError(''); api.get(url).then(r => setData(r.data)).catch(e => setError(errMsg(e))).finally(() => setLoading(false)); }, [url]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
export default api;
