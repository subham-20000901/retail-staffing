import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import api, { useGet, errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';

import {
  Badge,
  Button,
  Card,
  Confirm,
  EmptyState,
  Field,
  Hint,
  PageHeader,
  State,
  StatCard,
  STAFF,
  fmtDate,
  money,
  useToast,
} from '../components/ui';

/* =========================================================
   BUSINESS DASHBOARD
========================================================= */

export function Dashboard() {
  const { user } = useAuth();
  const s = useGet('/stats');
  const j = useGet('/jobs/my');

  const d = s.data || {};

  const tip = !j.data?.length
    ? 'Post your first job. Tell us the date, shift time and how many people you need.'
    : d.pendingApplications
    ? `You have ${d.pendingApplications} worker(s) waiting for your decision. Open "My jobs & applicants" and approve or reject them.`
    : 'Waiting for applications. Workers can see your open jobs now.';

  return (
    <div className="space-y-1">
      <PageHeader
        title={`Welcome, ${user.name}`}
        help="Manage your staffing requirements, review applications and keep track of your active jobs."
        action={
          <Link to="/business/jobs/create">
            <Button className="shadow-lg shadow-teal-600/10">
              + Post a new job
            </Button>
          </Link>
        }
      />

      {/* Dashboard stats */}
      <State q={s}>
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Open jobs"
            value={d.activeJobs}
            description="Currently accepting applications"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <StatCard
            label="Applications"
            value={d.totalApplications}
            description="Total worker applications"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-5a4 4 0 11-8 0 4 4 0 018 0zm4 0a3 3 0 10-6 0"
                />
              </svg>
            }
          />

          <StatCard
            label="Workers hired"
            value={d.assignedWorkers}
            description="Successfully assigned"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />

          <StatCard
            label="Waiting for you"
            value={d.pendingApplications}
            description="Applications needing review"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </State>

      {!j.loading && <Hint>{tip}</Hint>}

      {/* Recent jobs */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recent jobs
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Your latest staffing requirements
          </p>
        </div>

        {j.data?.length > 0 && (
          <Link
            to="/business/jobs"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View all →
          </Link>
        )}
      </div>

      <State q={j}>
        {j.data?.length ? (
          <div className="space-y-3">
            {j.data
              .slice(0, 5)
              .map((x) => (
                <JobRow
                  key={x._id}
                  job={x}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs yet"
            text="Create your first staffing requirement and workers will be able to apply."
            action={
              <Link to="/business/jobs/create">
                <Button>+ Post your first job</Button>
              </Link>
            }
          />
        )}
      </State>
    </div>
  );
}

/* =========================================================
   JOB ROW
========================================================= */

const JobRow = ({ job, children }) => (
  <Card
    hover
    className="group p-4 sm:p-5"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/business/jobs/${job._id}`}
            className="
              truncate
              text-base
              font-bold
              text-slate-900
              transition-colors
              hover:text-teal-700
            "
          >
            {job.title}
          </Link>

          <Badge status={job.status} />
        </div>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>{job.storeName}</span>
          <span className="text-slate-300">•</span>
          <span>{job.location}</span>
          <span className="text-slate-300">•</span>
          <span>{fmtDate(job.date)}</span>
        </div>

        <div className="mt-1 text-sm text-slate-500">
          {STAFF[job.staffType]} · {money(job.payRate)} / shift
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {job.approvedCount ?? 0} of {job.workersRequired} hired
          </span>

          {job.pendingCount ? (
            <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {job.pendingCount} new applicant
              {job.pendingCount > 1 ? 's' : ''}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {children}
      </div>
    </div>
  </Card>
);

/* =========================================================
   JOBS
========================================================= */

export function Jobs() {
  const q = useGet('/jobs/my');

  const [f, setF] = useState('');
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const toast = useToast();
  const nav = useNavigate();

  const cancel = async () => {
    setBusy(true);

    try {
      await api.delete('/jobs/' + del);

      toast('Job cancelled');
      setDel(null);
      q.reload();
    } catch (e) {
      toast(errMsg(e), 'err');
    }

    setBusy(false);
  };

  const rows = (q.data || []).filter(
    (j) => !f || j.status === f
  );

  return (
    <div>
      <PageHeader
        title="My jobs & applicants"
        help="View your posted jobs and review workers who have applied."
        action={
          <Link to="/business/jobs/create">
            <Button>+ Post a new job</Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <Field
              as="select"
              label="Filter jobs"
              value={f}
              onChange={(e) =>
                setF(e.target.value)
              }
            >
              <option value="">All jobs</option>

              {[
                'open',
                'filled',
                'completed',
                'cancelled',
              ].map((s) => (
                <option
                  key={s}
                  value={s}
                >
                  {s.charAt(0).toUpperCase() +
                    s.slice(1)}
                </option>
              ))}
            </Field>
          </div>

          <div className="pb-0.5 text-xs text-slate-500">
            Showing {rows.length}{' '}
            {rows.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>
      </Card>

      <State q={q}>
        {rows.length ? (
          <div className="space-y-3">
            {rows.map((j) => (
              <JobRow
                key={j._id}
                job={j}
              >
                <Button
                  variant="outline"
                  onClick={() =>
                    nav(
                      `/business/jobs/${j._id}`
                    )
                  }
                >
                  View
                </Button>

                {['open', 'filled'].includes(
                  j.status
                ) && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        nav(
                          `/business/jobs/${j._id}/edit`
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDel(j._id)
                      }
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </JobRow>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            text="Post a job and workers will be able to discover and apply for it."
            action={
              <Link to="/business/jobs/create">
                <Button>+ Post a job</Button>
              </Link>
            }
          />
        )}
      </State>

      {del && (
        <Confirm
          title="Cancel this job?"
          text="Pending applications will be rejected and hired workers will be told the job is cancelled."
          onYes={cancel}
          onClose={() => setDel(null)}
          loading={busy}
        />
      )}
    </div>
  );
}

/* =========================================================
   JOB FORM
========================================================= */

const EMPTY = {
  title: '',
  storeName: '',
  location: '',
  staffType: 'sales_assistant',
  workersRequired: 1,
  date: '',
  startTime: '09:00',
  endTime: '18:00',
  payRate: '',
  requirements: '',
};

export function JobForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();

  const [f, setF] = useState(EMPTY);
  const [e, setE] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .get('/jobs/' + id)
        .then((r) => {
          const j = r.data.job;

          setF({
            ...EMPTY,
            ...j,
            date: j.date.slice(0, 10),
          });
        });
    }
  }, [id]);

  const set = (k) => (ev) =>
    setF({
      ...f,
      [k]: ev.target.value,
    });

  const submit = async (ev) => {
    ev.preventDefault();

    const x = {};

    [
      'title',
      'storeName',
      'location',
      'date',
    ].forEach((k) => {
      if (!String(f[k]).trim()) {
        x[k] = 'This is required';
      }
    });

    if (
      !Number.isInteger(+f.workersRequired) ||
      +f.workersRequired < 1
    ) {
      x.workersRequired =
        'Enter a whole number of 1 or more';
    }

    if (!(+f.payRate > 0)) {
      x.payRate =
        'Enter the pay in rupees';
    }

    if (f.endTime <= f.startTime) {
      x.endTime =
        'End time must be after start time';
    }

    setE(x);

    if (Object.keys(x).length) {
      return;
    }

    setBusy(true);

    try {
      const body = {
        ...f,
        workersRequired: +f.workersRequired,
        payRate: +f.payRate,
      };

      if (id) {
        await api.put('/jobs/' + id, body);
      } else {
        await api.post('/jobs', body);
      }

      toast(
        id ? 'Job updated' : 'Job posted'
      );

      nav('/business/jobs');
    } catch (z) {
      toast(errMsg(z), 'err');
    }

    setBusy(false);
  };

  return (
    <div>
      <PageHeader
        title={id ? 'Edit job' : 'Post a new job'}
        help={
          id
            ? 'Update the details of your staffing requirement.'
            : 'Create a clear job posting so workers know exactly what is required.'
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <Card className="p-5 sm:p-7">
          <form
            onSubmit={submit}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <div className="border-b border-slate-100 pb-4 sm:col-span-2">
              <h2 className="font-bold text-slate-900">
                Job details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tell workers about the role and where they will work.
              </p>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Job title"
                placeholder="Diwali Sales Assistant"
                value={f.title}
                onChange={set('title')}
                error={e.title}
              />
            </div>

            <Field
              label="Store or mall name"
              placeholder="e.g. Phoenix Mall"
              value={f.storeName}
              onChange={set('storeName')}
              error={e.storeName}
            />

            <Field
              label="Location"
              placeholder="e.g. Noida Sector 18"
              hint="City and area"
              value={f.location}
              onChange={set('location')}
              error={e.location}
            />

            <Field
              as="select"
              label="Type of staff"
              value={f.staffType}
              onChange={set('staffType')}
            >
              <option value="sales_assistant">
                Sales Assistant
              </option>

              <option value="cashier">
                Cashier
              </option>
            </Field>

            <Field
              label="How many workers?"
              type="number"
              min="1"
              value={f.workersRequired}
              onChange={set('workersRequired')}
              error={e.workersRequired}
            />

            <Field
              label="Date"
              type="date"
              value={f.date}
              onChange={set('date')}
              error={e.date}
            />

            <Field
              label="Pay per shift"
              type="number"
              min="0"
              placeholder="e.g. 800"
              hint="Amount in Indian Rupees"
              value={f.payRate}
              onChange={set('payRate')}
              error={e.payRate}
            />

            <div className="border-b border-slate-100 pb-1 sm:col-span-2">
              <h2 className="font-bold text-slate-900">
                Shift timing
              </h2>
            </div>

            <Field
              label="Shift starts"
              type="time"
              value={f.startTime}
              onChange={set('startTime')}
            />

            <Field
              label="Shift ends"
              type="time"
              value={f.endTime}
              onChange={set('endTime')}
              error={e.endTime}
            />

            <div className="sm:col-span-2">
              <Field
                as="textarea"
                rows="4"
                label="Requirements"
                hint="Optional — mention useful skills, experience or expectations."
                placeholder="Customer service experience, basic communication skills..."
                value={f.requirements}
                onChange={set('requirements')}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row">
              <Button
                type="submit"
                loading={busy}
              >
                {id
                  ? 'Save changes'
                  : 'Post job'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => nav(-1)}
              >
                Back
              </Button>
            </div>
          </form>
        </Card>

        {/* Helpful preview/info */}
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                Job posting
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Make it clear
              </h3>

              <p className="mt-2 text-sm leading-6 text-teal-50">
                Workers should be able to understand the role, timing and pay before applying.
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Include
                </p>

                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  <li>✓ Store and location</li>
                  <li>✓ Shift date and timing</li>
                  <li>✓ Number of workers</li>
                  <li>✓ Pay per shift</li>
                  <li>✓ Basic requirements</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   JOB DETAIL
========================================================= */

export function JobDetail() {
  const { id } = useParams();

  const job = useGet('/jobs/' + id);
  const apps = useGet(
    '/applications/job/' + id
  );

  const toast = useToast();

  const [busy, setBusy] = useState('');

  const act = async (a, what) => {
    setBusy(a._id);

    try {
      await api.patch(
        `/applications/${a._id}/${what}`
      );

      toast(
        what === 'approve'
          ? 'Worker approved'
          : 'Worker rejected'
      );

      apps.reload();
      job.reload();
    } catch (e) {
      toast(errMsg(e), 'err');
    }

    setBusy('');
  };

  const j = job.data?.job;

  return (
    <State q={job}>
      {j && (
        <div>
          {/* Header */}
          <PageHeader
            title={j.title}
            help={`${j.storeName}, ${j.location}`}
            action={
              <Badge status={j.status} />
            }
          />

          {/* Job overview */}
          <Card className="mb-7 overflow-hidden p-0">
            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">
              <h2 className="font-bold text-slate-900">
                Job overview
              </h2>
            </div>

            <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Date"
                value={fmtDate(j.date)}
              />

              <InfoItem
                label="Shift"
                value={`${j.startTime} – ${j.endTime}`}
              />

              <InfoItem
                label="Pay"
                value={`${money(j.payRate)} per shift`}
              />

              <InfoItem
                label="Staff type"
                value={STAFF[j.staffType]}
              />

              <InfoItem
                label="Workers needed"
                value={j.workersRequired}
              />

              <InfoItem
                label="Requirements"
                value={j.requirements || 'None'}
              />
            </div>
          </Card>

          {/* Applicants header */}
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Applicants
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review workers and decide who to hire.
              </p>
            </div>

            {apps.data?.length > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {apps.data.length}{' '}
                {apps.data.length === 1
                  ? 'application'
                  : 'applications'}
              </span>
            )}
          </div>

          <State q={apps}>
            {apps.data?.length ? (
              <div className="space-y-3">
                {apps.data.map((a) => (
                  <Card
                    key={a._id}
                    hover
                    className="p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-teal-50
                            font-bold
                            text-teal-700
                          "
                        >
                          {a.workerId.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-slate-900">
                              {a.workerId.name}
                            </p>

                            <Badge
                              status={a.status}
                            />
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {a.workerId.phone} ·{' '}
                            {a.workerId.email}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {a.workerId.skills
                              ?.length
                              ? 'Skills: ' +
                                a.workerId.skills.join(
                                  ', '
                                )
                              : 'No skills listed'}

                            {a.workerId.experience
                              ? ` · ${a.workerId.experience}`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {a.status ===
                          'pending' &&
                          j.status === 'open' && (
                            <>
                              <Button
                                loading={
                                  busy === a._id
                                }
                                onClick={() =>
                                  act(
                                    a,
                                    'approve'
                                  )
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                variant="outline"
                                disabled={
                                  busy === a._id
                                }
                                onClick={() =>
                                  act(
                                    a,
                                    'reject'
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No applications yet"
                text="Workers will appear here as soon as they apply for this job."
              />
            )}
          </State>
        </div>
      )}
    </State>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  label,
  value,
}) => (
  <div className="bg-white p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
      {value}
    </p>
  </div>
);