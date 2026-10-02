import { useState } from 'react'; import api, { useGet, errMsg } from '../services/api';
import { Badge, Button, EmptyState, PageHeader, State, StatCard, Table, STAFF, fmtDate, useToast } from '../components/ui';
const List = ({ title, help, url, cols, empty }) => { const q = useGet(url); return <><PageHeader title={title} help={help} /><State q={q}><Table cols={cols} rows={q.data} empty={<EmptyState title={empty} text="Nothing to show yet." />} /></State></>; };
export function Dashboard() {
  const q = useGet('/stats'), d = q.data || {};
  return <><PageHeader title="Platform overview" help="A quick look at everything happening on FloorCrew." /><State q={q}>
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4"><StatCard label="Businesses" value={d.totalBusinesses} /><StatCard label="Workers" value={d.totalWorkers} /><StatCard label="Open jobs" value={d.openJobs} /><StatCard label="Pending applications" value={d.pendingApplications} /></div>
    <h2 className="mb-3 font-semibold">Latest jobs posted</h2><Table rows={d.recent} empty={<EmptyState title="No activity yet" text="Jobs will appear once businesses post them." />}
      cols={[{ h: 'Job', r: j => j.title }, { h: 'Business', r: j => j.businessId?.name }, { h: 'Date', r: j => fmtDate(j.date) }, { h: 'Status', r: j => <Badge status={j.status} /> }]} /></State></>;
}
export function Users({ role }) {
 const url = role === 'business' ? '/admin/businesses' : '/admin/workers', q = useGet(url), toast = useToast(), [busy, setBusy] = useState('');
  const flip = async u => { setBusy(u._id); try { await api.patch(`/admin/users/${u._id}/status`, { status: u.status === 'blocked' ? 'approved' : 'blocked' }); toast('Updated'); q.reload(); } catch (e) { toast(errMsg(e), 'err'); } setBusy(''); };
  return <><PageHeader title={role === 'business' ? 'Businesses' : 'Workers'} help="Block an account to stop it from logging in. You can unblock it any time." /><State q={q}>
    <Table rows={q.data} empty={<EmptyState title={`No ${role}s yet`} text="They will appear after they register." />} cols={[{ h: 'Name', r: u => u.name }, { h: 'Email', r: u => u.email }, { h: 'Phone', r: u => u.phone },
      ...(role === 'worker' ? [{ h: 'Skills', r: u => u.skills?.join(', ') || '-' }] : []), { h: 'Status', r: u => <Badge status={u.status} /> },
      { h: '', r: u => <Button variant="outline" loading={busy === u._id} onClick={() => flip(u)}>{u.status === 'blocked' ? 'Unblock' : 'Block'}</Button> }]} /></State></>;
}
export const Jobs = () => <List title="All jobs" help="Every job on the platform." url="/admin/jobs" empty="No jobs yet" cols={[{ h: 'Job', r: j => j.title }, { h: 'Business', r: j => j.businessId?.name }, { h: 'Store', r: j => j.storeName }, { h: 'Date', r: j => fmtDate(j.date) }, { h: 'Type', r: j => STAFF[j.staffType] }, { h: 'Status', r: j => <Badge status={j.status} /> }]} />;
export const Applications = () => <List title="All applications" help="Who applied to what." url="/admin/applications" empty="No applications yet" cols={[{ h: 'Worker', r: a => a.workerId?.name }, { h: 'Job', r: a => a.jobId?.title }, { h: 'Store', r: a => a.jobId?.storeName }, { h: 'Applied', r: a => fmtDate(a.appliedAt) }, { h: 'Status', r: a => <Badge status={a.status} /> }]} />;
export const Assignments = () => <List title="Assignments" help="Workers who were approved for a job." url="/admin/assignments" empty="No assignments yet" cols={[{ h: 'Worker', r: a => a.workerId?.name }, { h: 'Job', r: a => a.jobId?.title }, { h: 'Business', r: a => a.businessId?.name }, { h: 'Job date', r: a => fmtDate(a.jobId?.date) }, { h: 'Status', r: a => <Badge status={a.status} /> }]} />;
