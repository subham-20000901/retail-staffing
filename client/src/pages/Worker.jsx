import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import api, { useGet, errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';

import {
  Badge,
  Button,
  Card,
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
   JOB CARD
========================================================= */

const JobCard = ({ j }) => (
  <Card
    className="
      group
      overflow-hidden
      p-0
      transition-all
      duration-200
      hover:-translate-y-0.5
      hover:shadow-md
    "
  >
    <div className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Job information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/worker/jobs/${j._id}`}
              className="
                text-base
                font-bold
                text-slate-900
                transition-colors
                hover:text-teal-700
              "
            >
              {j.title}
            </Link>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Open
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>{j.storeName}</span>

            <span className="text-slate-300">
              •
            </span>

            <span>{j.location}</span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                📅
              </span>

              <span>
                <span className="block text-xs text-slate-400">
                  Date
                </span>

                <span className="font-medium text-slate-700">
                  {fmtDate(j.date)}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                🕐
              </span>

              <span>
                <span className="block text-xs text-slate-400">
                  Shift
                </span>

                <span className="font-medium text-slate-700">
                  {j.startTime} – {j.endTime}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                👤
              </span>

              <span>
                <span className="block text-xs text-slate-400">
                  Role
                </span>

                <span className="font-medium text-slate-700">
                  {STAFF[j.staffType]}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                ₹
              </span>

              <span>
                <span className="block text-xs text-slate-400">
                  Pay
                </span>

                <span className="font-bold text-teal-700">
                  {money(j.payRate)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0">
          <Link to={`/worker/jobs/${j._id}`}>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              View & apply →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Card>
);

/* =========================================================
   WORKER DASHBOARD
========================================================= */

export function Dashboard() {
  const { user } = useAuth();

  const s = useGet('/stats');
  const a = useGet('/applications/my');

  const d = s.data || {};

  const tip = !d.appliedJobs
    ? 'Open "Find jobs", choose a shift you like and apply.'
    : d.upcomingJobs
    ? 'You have confirmed shifts coming up. Check "My upcoming jobs" for the details.'
    : 'Your applications are being reviewed. You will see the result under "My applications".';

  return (
    <div>
      <PageHeader
        title={`Hi, ${user.name}`}
        help="Find temporary retail shifts, apply to suitable jobs and track your applications."
        action={
          <Link to="/worker/jobs">
            <Button className="shadow-lg shadow-teal-600/10">
              Find jobs →
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <State q={s}>
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Jobs available"
            value={d.availableJobs}
            description="Open shifts you can apply for"
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
            label="Jobs applied"
            value={d.appliedJobs}
            description="Applications you've submitted"
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.268-.197-2.489-.562-3.624z"
                />
              </svg>
            }
          />

          <StatCard
            label="Upcoming shifts"
            value={d.upcomingJobs}
            description="Confirmed work assignments"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <StatCard
            label="Completed"
            value={d.completedJobs}
            description="Shifts successfully completed"
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
        </div>
      </State>

      {!s.loading && <Hint>{tip}</Hint>}

      {/* Applications */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recent applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track the latest jobs you've applied for.
          </p>
        </div>

        {a.data?.length > 0 && (
          <Link
            to="/worker/applications"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            View all →
          </Link>
        )}
      </div>

      <State q={a}>
        {a.data?.length ? (
          <AppList items={a.data.slice(0, 5)} />
        ) : (
          <EmptyState
            title="No applications yet"
            text="Find a suitable retail job and apply. Your applications will appear here."
            action={
              <Link to="/worker/jobs">
                <Button>Find jobs</Button>
              </Link>
            }
          />
        )}
      </State>
    </div>
  );
}

/* =========================================================
   BROWSE JOBS
========================================================= */

export function Browse() {
  const q = useGet('/jobs');

  const [s, setS] = useState('');
  const [t, setT] = useState('');

  const rows = (q.data || []).filter(
    (j) =>
      (!t || j.staffType === t) &&
      (!s ||
        (
          j.title +
          ' ' +
          j.storeName +
          ' ' +
          j.location
        )
          .toLowerCase()
          .includes(s.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Find jobs"
        help="Browse currently available retail shifts and choose the ones that match your skills and schedule."
      />

      {/* Search */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="font-bold text-slate-900">
            Search available jobs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search by job title, store or location.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Search"
            placeholder="e.g. Sales Assistant, Mall, Noida"
            value={s}
            onChange={(e) =>
              setS(e.target.value)
            }
          />

          <Field
            as="select"
            label="Staff type"
            value={t}
            onChange={(e) =>
              setT(e.target.value)
            }
          >
            <option value="">
              All staff types
            </option>

            <option value="sales_assistant">
              Sales Assistant
            </option>

            <option value="cashier">
              Cashier
            </option>
          </Field>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            {rows.length}{' '}
            {rows.length === 1
              ? 'job'
              : 'jobs'}{' '}
            available
          </p>

          {(s || t) && (
            <button
              type="button"
              onClick={() => {
                setS('');
                setT('');
              }}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Jobs */}
      <State q={q}>
        {rows.length ? (
          <div className="space-y-4">
            {rows.map((j) => (
              <JobCard
                key={j._id}
                j={j}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            text="Try a different search or staff type. New opportunities may appear soon."
            action={
              <Link to="/worker/jobs">
                <Button variant="outline">
                  Clear search
                </Button>
              </Link>
            }
          />
        )}
      </State>
    </div>
  );
}

/* =========================================================
   JOB DETAIL
========================================================= */

export function JobDetail() {
  const { id } = useParams();

  const q = useGet('/jobs/' + id);
  const toast = useToast();

  const [busy, setBusy] = useState(false);

  const apply = async () => {
    setBusy(true);

    try {
      await api.post(`/jobs/${id}/apply`);

      toast('Application sent successfully');
      q.reload();
    } catch (e) {
      toast(errMsg(e), 'err');
    }

    setBusy(false);
  };

  const j = q.data?.job;
  const mine = q.data?.myApplication;

  return (
    <State q={q}>
      {j && (
        <div>
          <PageHeader
            title={j.title}
            help={`${j.storeName}, ${j.location}`}
            action={
              <Badge
                status={j.status}
              />
            }
          />

          {/* Hero job card */}
          <Card className="mb-6 overflow-hidden p-0">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                    {STAFF[j.staffType]}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {j.title}
                  </h2>

                  <p className="mt-2 text-sm text-teal-50">
                    {j.storeName} · {j.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <p className="text-xs text-teal-100">
                    Pay per shift
                  </p>

                  <p className="text-xl font-bold">
                    {money(j.payRate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
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
                label="Role"
                value={STAFF[j.staffType]}
              />

              <InfoItem
                label="Posted by"
                value={j.businessId?.name || 'Business'}
              />

              <InfoItem
                label="People needed"
                value={j.workersRequired}
              />

              <InfoItem
                label="Status"
                value={
                  <Badge
                    status={j.status}
                  />
                }
              />
            </div>
          </Card>

          {/* Requirements */}
          <Card className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                ✓
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Job requirements
                </h2>

                <p className="text-xs text-slate-500">
                  What the business is looking for
                </p>
              </div>
            </div>

            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {j.requirements ||
                'No specific requirements listed. General retail skills and professional behaviour are expected.'}
            </p>
          </Card>

          {/* Application action */}
          <Card className="sticky bottom-4 z-10 border-teal-100 bg-white/95 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {mine ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      Your application
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-slate-500">
                        Current status:
                      </span>

                      <Badge
                        status={mine.status}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-900">
                      Interested in this job?
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Apply now and the business can review your profile.
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {!mine &&
                  j.status === 'open' && (
                    <Button
                      loading={busy}
                      onClick={apply}
                    >
                      Apply for this job
                    </Button>
                  )}

                {mine && (
                  <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    Application submitted
                  </div>
                )}

                {j.status !== 'open' &&
                  !mine && (
                    <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                      This job is no longer open
                    </div>
                  )}

                <Link to="/worker/jobs">
                  <Button variant="outline">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </State>
  );
}

/* =========================================================
   APPLICATION LIST
========================================================= */

const AppList = ({ items }) => (
  <div className="space-y-3">
    {items.map((a) => (
      <Card
        key={a._id}
        className="group p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-bold text-teal-700">
              {a.jobId?.title
                ?.charAt(0)
                ?.toUpperCase() || 'J'}
            </div>

            <div>
              <Link
                to={`/worker/jobs/${a.jobId._id}`}
                className="font-bold text-slate-900 transition-colors hover:text-teal-700"
              >
                {a.jobId.title}
              </Link>

              <p className="mt-1 text-sm text-slate-500">
                {a.jobId.storeName} ·{' '}
                {fmtDate(a.jobId.date)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Applied {fmtDate(a.appliedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Badge status={a.status} />

            <Link
              to={`/worker/jobs/${a.jobId._id}`}
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View →
            </Link>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

/* =========================================================
   APPLICATIONS
========================================================= */

export function Applications() {
  const q = useGet('/applications/my');

  return (
    <div>
      <PageHeader
        title="My applications"
        help="Track the jobs you've applied for and see whether the business has made a decision."
        action={
          <Link to="/worker/jobs">
            <Button>
              Find more jobs
            </Button>
          </Link>
        }
      />

      <State q={q}>
        {q.data?.length ? (
          <AppList items={q.data} />
        ) : (
          <EmptyState
            title="No applications yet"
            text="Apply to a job and it will show up here with its current status."
            action={
              <Link to="/worker/jobs">
                <Button>
                  Find jobs
                </Button>
              </Link>
            }
          />
        )}
      </State>
    </div>
  );
}

/* =========================================================
   UPCOMING JOBS
========================================================= */

export function Upcoming() {
  const q = useGet('/assignments/my');

  return (
    <div>
      <PageHeader
        title="My upcoming jobs"
        help="These are shifts that stores have confirmed for you."
      />

      <State q={q}>
        {q.data?.length ? (
          <div className="space-y-4">
            {q.data.map((a) => (
              <Card
                key={a._id}
                className="
                  overflow-hidden
                  p-0
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <div className="border-l-4 border-teal-500 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-bold text-slate-900">
                          {a.jobId.title}
                        </p>

                        <Badge
                          status={a.status}
                        />
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {a.businessId?.name} ·{' '}
                        {a.jobId.storeName},{' '}
                        {a.jobId.location}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                        <InfoItemSmall
                          label="Date"
                          value={fmtDate(
                            a.jobId.date
                          )}
                        />

                        <InfoItemSmall
                          label="Time"
                          value={`${a.jobId.startTime} – ${a.jobId.endTime}`}
                        />

                        <InfoItemSmall
                          label="Pay"
                          value={money(
                            a.jobId.payRate
                          )}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/worker/jobs/${a.jobId._id}`}
                    >
                      <Button variant="outline">
                        View details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No confirmed shifts yet"
            text="When a store approves your application, the shift will appear here."
            action={
              <Link to="/worker/jobs">
                <Button>
                  Find jobs
                </Button>
              </Link>
            }
          />
        )}
      </State>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

export function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [f, setF] = useState(null);
  const [e, setE] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setF({
      name: user.name,
      phone: user.phone,
      skills: (user.skills || []).join(', '),
      experience: user.experience || '',
      preferredRole:
        user.preferredRole || '',
    });
  }, [user]);

  if (!f) {
    return null;
  }

  const set = (k) => (ev) =>
    setF({
      ...f,
      [k]: ev.target.value,
    });

  const save = async (ev) => {
    ev.preventDefault();

    const x = {};

    if (!f.name.trim()) {
      x.name = 'Enter your name';
    }

    if (!f.phone.trim()) {
      x.phone = 'Enter your phone';
    }

    setE(x);

    if (Object.keys(x).length) {
      return;
    }

    setBusy(true);

    try {
      const response = await api.put(
        '/auth/me',
        f
      );

      setUser(response.data);

      toast('Profile saved successfully');
    } catch (z) {
      toast(errMsg(z), 'err');
    }

    setBusy(false);
  };

  return (
    <div>
      <PageHeader
        title="My profile"
        help="Businesses review your profile before approving applications. Keep your skills and experience up to date."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Profile form */}
        <Card className="p-5 sm:p-7">
          <form
            onSubmit={save}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5 sm:col-span-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-xl font-bold text-white shadow-lg shadow-teal-600/20">
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Worker profile
                </p>
              </div>
            </div>

            <Field
              label="Name"
              value={f.name}
              onChange={set('name')}
              error={e.name}
            />

            <Field
              label="Phone"
              value={f.phone}
              onChange={set('phone')}
              error={e.phone}
            />

            <Field
              label="Email"
              value={user.email}
              disabled
            />

            <Field
              as="select"
              label="Preferred role"
              value={f.preferredRole}
              onChange={set(
                'preferredRole'
              )}
            >
              <option value="">
                No preference
              </option>

              <option>
                Sales Assistant
              </option>

              <option>
                Cashier
              </option>
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Skills"
                hint="Separate skills with commas."
                placeholder="Billing, customer service, POS, communication"
                value={f.skills}
                onChange={set('skills')}
              />
            </div>

            <div className="sm:col-span-2">
              <Field
                as="textarea"
                rows="4"
                label="Experience"
                placeholder="Describe your previous retail or customer service experience..."
                value={f.experience}
                onChange={set(
                  'experience'
                )}
              />
            </div>

            <div className="border-t border-slate-100 pt-5 sm:col-span-2">
              <Button
                type="submit"
                loading={busy}
              >
                Save profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Profile tips */}
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                Profile tips
              </p>

              <h3 className="mt-1 text-lg font-bold">
                Get noticed by businesses
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <Tip
                title="Add relevant skills"
                text="Mention POS, billing, customer service or other useful retail skills."
              />

              <Tip
                title="Describe experience"
                text="Keep your previous work experience short and specific."
              />

              <Tip
                title="Choose a preferred role"
                text="This helps businesses understand which type of work you prefer."
              />
            </div>
          </Card>

          <Card className="bg-slate-50">
            <p className="text-sm font-semibold text-slate-800">
              Profile status
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your profile information is shared with businesses when they review your applications.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoItem = ({
  label,
  value,
}) => (
  <div className="bg-white p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <div className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
      {value}
    </div>
  </div>
);

const InfoItemSmall = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-1 font-semibold text-slate-700">
      {value}
    </p>
  </div>
);

const Tip = ({
  title,
  text,
}) => (
  <div className="flex gap-3">
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700">
      ✓
    </div>

    <div>
      <p className="text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  </div>
);