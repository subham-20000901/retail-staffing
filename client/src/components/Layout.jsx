import { useState } from 'react'; import { NavLink, Outlet } from 'react-router-dom'; import { useAuth } from '../context/AuthContext';
const NAV = {
  business: [['Home', '/business/dashboard'], ['My jobs & applicants', '/business/jobs'], ['Post a job', '/business/jobs/create']],
  worker: [['Home', '/worker/dashboard'], ['Find jobs', '/worker/jobs'], ['My applications', '/worker/applications'], ['My upcoming jobs', '/worker/jobs/upcoming'], ['My profile', '/worker/profile']],
  admin: [['Overview', '/admin/dashboard'], ['Businesses', '/admin/businesses'], ['Workers', '/admin/workers'], ['Jobs', '/admin/jobs'], ['Applications', '/admin/applications'], ['Assignments', '/admin/assignments']],
};
export default function Layout() {
  const { user, logout } = useAuth(), [open, setOpen] = useState(false);
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3"><button className="rounded p-1 text-xl lg:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>☰</button><span className="text-lg font-bold text-teal-700">FloorCrew</span></div>
      <div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-600 sm:inline">{user.name} ({user.role})</span>
        <button onClick={logout} className="rounded-lg border border-slate-300 px-3 py-1 font-medium hover:bg-slate-50">Log out</button></div></header>
    <div className="lg:flex">
      <aside className={`${open ? 'block' : 'hidden'} border-b border-slate-200 bg-white p-3 lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r`}>
        <nav className="space-y-1">{NAV[user.role].map(([l, to]) => <NavLink key={to} to={to} end onClick={() => setOpen(false)}
          className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-100'}`}>{l}</NavLink>)}</nav></aside>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6"><Outlet /></main></div></div>;
}
