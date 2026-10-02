import { createContext, useContext, useEffect, useState } from 'react'; import api from '../services/api';
const Ctx = createContext(); export const useAuth = () => useContext(Ctx);
export const HOME = { business: '/business/dashboard', worker: '/worker/dashboard', admin: '/admin/dashboard' };
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => { if (localStorage.getItem('token')) api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false)); }, []);
  const start = d => { localStorage.setItem('token', d.token); setUser(d.user); return d.user; };
  const login = async (email, password) => start((await api.post('/auth/login', { email, password })).data);
  const register = async body => start((await api.post('/auth/register', body)).data);
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
