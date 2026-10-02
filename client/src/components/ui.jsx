import { createContext, useContext, useState, useCallback } from 'react';

/* =========================================================
   HELPERS
========================================================= */

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

export const STAFF = {
  sales_assistant: 'Sales Assistant',
  cashier: 'Cashier',
};

export const money = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN');

/* =========================================================
   STATUS BADGE
========================================================= */

const TONE = {
  open: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  assigned: 'bg-emerald-50 text-emerald-700 ring-emerald-200',

  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  blocked: 'bg-rose-50 text-rose-700 ring-rose-200',

  filled: 'bg-sky-50 text-sky-700 ring-sky-200',
  active: 'bg-sky-50 text-sky-700 ring-sky-200',

  completed: 'bg-slate-100 text-slate-700 ring-slate-200',
  cancelled: 'bg-slate-100 text-slate-500 ring-slate-200',
};

export const Badge = ({ status }) => {
  const normalizedStatus = String(status || 'unknown').toLowerCase();

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        px-2.5 py-1
        text-xs font-semibold
        capitalize
        ring-1 ring-inset
        ${TONE[normalizedStatus] || TONE.completed}
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${
            normalizedStatus === 'open' ||
            normalizedStatus === 'approved' ||
            normalizedStatus === 'assigned'
              ? 'bg-emerald-500'
              : normalizedStatus === 'pending'
              ? 'bg-amber-500'
              : normalizedStatus === 'rejected' ||
                normalizedStatus === 'blocked'
              ? 'bg-rose-500'
              : normalizedStatus === 'filled' ||
                normalizedStatus === 'active'
              ? 'bg-sky-500'
              : 'bg-slate-400'
          }
        `}
      />
      {status || 'Unknown'}
    </span>
  );
};

/* =========================================================
   CARD
========================================================= */

export const Card = ({
  className = '',
  children,
  hover = false,
}) => (
  <div
    className={`
      rounded-2xl
      border border-slate-200/80
      bg-white
      p-5
      shadow-[0_2px_10px_rgba(15,23,42,0.04)]
      ${
        hover
          ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_10px_30px_rgba(15,118,110,0.08)]'
          : ''
      }
      ${className}
    `}
  >
    {children}
  </div>
);

/* =========================================================
   BUTTON
========================================================= */

const V = {
  primary:
    'bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:shadow-md active:bg-teal-800',

  outline:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50',

  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:shadow-md active:bg-rose-800',

  ghost:
    'text-teal-700 hover:bg-teal-50 hover:text-teal-800',

  secondary:
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow-md',

  success:
    'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md',
};

export const Button = ({
  variant = 'primary',
  loading,
  disabled,
  className = '',
  children,
  ...p
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      px-4
      py-2.5
      text-sm
      font-semibold
      transition-all
      duration-200
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-teal-500
      focus-visible:ring-offset-2
      disabled:cursor-not-allowed
      disabled:opacity-50
      disabled:shadow-none
      ${V[variant] || V.primary}
      ${className}
    `}
    {...p}
  >
    {loading && (
      <span
        className="
          h-4
          w-4
          animate-spin
          rounded-full
          border-2
          border-current
          border-t-transparent
        "
      />
    )}

    {loading ? 'Please wait...' : children}
  </button>
);

/* =========================================================
   FORM FIELD
========================================================= */

export const Field = ({
  label,
  error,
  hint,
  as = 'input',
  children,
  ...p
}) => {
  const C = as;

  const cls = `
    mt-1.5
    w-full
    rounded-xl
    border
    bg-white
    px-3.5
    py-2.5
    text-sm
    text-slate-900
    shadow-sm
    placeholder:text-slate-400
    transition-all
    duration-200
    focus:outline-none
    focus:ring-4
    focus:ring-teal-500/10
    ${
      error
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
        : 'border-slate-300 focus:border-teal-500'
    }
  `;

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label && (
        <span className="mb-1 block">
          {label}
        </span>
      )}

      <C className={cls} {...p}>
        {children}
      </C>

      {hint && !error && (
        <span className="mt-1.5 block text-xs font-normal text-slate-500">
          {hint}
        </span>
      )}

      {error && (
        <span
          className="mt-1.5 block text-xs font-medium text-rose-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
};

/* =========================================================
   PAGE HEADER
========================================================= */

export const PageHeader = ({
  title,
  help,
  action,
}) => (
  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h1>

      {help && (
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
          {help}
        </p>
      )}
    </div>

    {action && (
      <div className="flex shrink-0 items-center gap-2">
        {action}
      </div>
    )}
  </div>
);

/* =========================================================
   STAT CARD
========================================================= */

export const StatCard = ({
  label,
  value,
  icon,
  description,
}) => (
  <Card
    hover
    className="relative overflow-hidden"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {value ?? 0}
        </p>

        {description && (
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>

      {icon && (
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
            text-teal-600
          "
        >
          {icon}
        </div>
      )}
    </div>

    <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-teal-50/60" />
  </Card>
);

/* =========================================================
   NEXT STEP HINT
========================================================= */

export const Hint = ({ children }) => (
  <div
    className="
      mb-7
      overflow-hidden
      rounded-2xl
      border
      border-teal-100
      bg-gradient-to-r
      from-teal-50
      to-emerald-50
      p-4
      shadow-sm
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white
          text-teal-600
          shadow-sm
        "
      >
        →
      </div>

      <div>
        <p className="text-sm font-bold text-teal-900">
          Next step
        </p>

        <p className="mt-0.5 text-sm leading-6 text-teal-800/80">
          {children}
        </p>
      </div>
    </div>
  </div>
);

/* =========================================================
   EMPTY STATE
========================================================= */

export const EmptyState = ({
  title,
  text,
  action,
}) => (
  <div
    className="
      rounded-2xl
      border
      border-dashed
      border-slate-300
      bg-white
      px-6
      py-14
      text-center
      shadow-sm
    "
  >
    <div
      className="
        mx-auto
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-2xl
        bg-slate-100
        text-xl
        text-slate-500
      "
    >
      —
    </div>

    <p className="mt-4 font-semibold text-slate-900">
      {title}
    </p>

    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
      {text}
    </p>

    {action && (
      <div className="mt-5">
        {action}
      </div>
    )}
  </div>
);

/* =========================================================
   LOADING
========================================================= */

export const Loading = () => (
  <div
    className="
      flex
      min-h-[220px]
      flex-col
      items-center
      justify-center
      gap-3
      text-sm
      text-slate-500
    "
    role="status"
  >
    <span
      className="
        h-8
        w-8
        animate-spin
        rounded-full
        border-[3px]
        border-slate-200
        border-t-teal-600
      "
    />

    <span>Loading...</span>
  </div>
);

/* =========================================================
   API STATE
========================================================= */

export const State = ({
  q,
  children,
}) =>
  q.loading ? (
    <Loading />
  ) : q.error ? (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        border-rose-200
        bg-rose-50
        p-4
        text-sm
        text-rose-700
      "
    >
      <div>
        <p className="font-semibold">
          Something went wrong
        </p>

        <p className="mt-0.5">
          {q.error}
        </p>
      </div>

      <button
        className="
          shrink-0
          rounded-lg
          px-3
          py-2
          font-semibold
          underline
          underline-offset-2
          hover:bg-rose-100
        "
        onClick={q.reload}
      >
        Try again
      </button>
    </div>
  ) : (
    children
  );

/* =========================================================
   TABLE
========================================================= */

export const Table = ({
  cols,
  rows,
  empty,
}) => {
  if (!rows?.length) {
    return empty;
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              {cols.map((c) => (
                <th
                  key={c.h}
                  className="
                    whitespace-nowrap
                    px-5
                    py-3.5
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  {c.h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr
                key={r._id}
                className="
                  transition-colors
                  hover:bg-teal-50/30
                "
              >
                {cols.map((c) => (
                  <td
                    key={c.h}
                    className="
                      px-5
                      py-4
                      align-middle
                      text-slate-700
                    "
                  >
                    {c.r(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================
   CONFIRM MODAL
========================================================= */

export const Confirm = ({
  title,
  text,
  onYes,
  onClose,
  loading,
}) => (
  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-slate-950/50
      p-4
      backdrop-blur-sm
    "
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-md">
      <Card className="p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-rose-50
              text-rose-600
            "
          >
            !
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              {title}
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              {text}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Keep it
          </Button>

          <Button
            variant="danger"
            loading={loading}
            onClick={onYes}
          >
            Yes, cancel job
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

/* =========================================================
   TOAST SYSTEM
========================================================= */

const T = createContext();

export const useToast = () =>
  useContext(T);

export function ToastProvider({
  children,
}) {
  const [list, setList] = useState([]);

  const push = useCallback(
    (msg, type = 'ok') => {
      const id =
        Date.now() + Math.random();

      setList((l) => [
        ...l,
        {
          id,
          msg,
          type,
        },
      ]);

      setTimeout(() => {
        setList((l) =>
          l.filter((x) => x.id !== id)
        );
      }, 3500);
    },
    []
  );

  return (
    <T.Provider value={push}>
      {children}

      <div
        className="
          fixed
          bottom-5
          right-5
          z-[100]
          flex
          max-w-sm
          flex-col
          gap-3
        "
        aria-live="polite"
      >
        {list.map((t) => (
          <div
            key={t.id}
            className={`
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-white
              shadow-xl
              backdrop-blur
              ${
                t.type === 'ok'
                  ? 'bg-slate-900/95'
                  : 'bg-rose-600/95'
              }
            `}
          >
            <span
              className={`
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                text-xs
                font-bold
                ${
                  t.type === 'ok'
                    ? 'bg-emerald-500'
                    : 'bg-white/20'
                }
              `}
            >
              {t.type === 'ok' ? '✓' : '!'}
            </span>

            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </T.Provider>
  );
}