import { Routes, Route, Navigate } from 'react-router-dom'; import { useAuth, HOME } from './context/AuthContext'; import Layout from './components/Layout'; import { Loading } from './components/ui';
import { Login, Register } from './pages/Auth'; import * as B from './pages/Business'; import * as W from './pages/Worker'; import * as A from './pages/Admin';
function Guard({ role }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={HOME[user.role]} replace />;
  return <Layout />;
}
export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/business" element={<Guard role="business" />}>
      <Route path="dashboard" element={<B.Dashboard />} /><Route path="jobs" element={<B.Jobs />} />
      <Route path="jobs/create" element={<B.JobForm />} /><Route path="jobs/:id/edit" element={<B.JobForm />} /><Route path="jobs/:id" element={<B.JobDetail />} /></Route>
    <Route path="/worker" element={<Guard role="worker" />}>
      <Route path="dashboard" element={<W.Dashboard />} /><Route path="jobs" element={<W.Browse />} /><Route path="jobs/upcoming" element={<W.Upcoming />} />
      <Route path="jobs/:id" element={<W.JobDetail />} /><Route path="applications" element={<W.Applications />} /><Route path="profile" element={<W.Profile />} /></Route>
    <Route path="/admin" element={<Guard role="admin" />}>
      <Route path="dashboard" element={<A.Dashboard />} /><Route path="businesses" element={<A.Users role="business" />} /><Route path="workers" element={<A.Users role="worker" />} />
      <Route path="jobs" element={<A.Jobs />} /><Route path="applications" element={<A.Applications />} /><Route path="assignments" element={<A.Assignments />} /></Route>
    <Route path="*" element={<Navigate to={user ? HOME[user.role] : '/login'} replace />} />
  </Routes>;
}
