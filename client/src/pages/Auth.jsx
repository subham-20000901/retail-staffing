import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth, HOME } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { Button, Card, Field } from '../components/ui';

/* =========================================================
   AUTH SHELL
========================================================= */

const Shell = ({ title, sub, children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
          [background-size:40px_40px]
        "
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-teal-400
                  to-emerald-500
                  text-lg
                  font-black
                  text-white
                  shadow-lg
                  shadow-teal-500/20
                "
              >
                F
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                Floor<span className="text-teal-400">Crew</span>
              </span>
            </Link>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Temporary retail staffing made simple.
            </p>
          </div>

          {/* Main card */}
          <Card
            className="
              border-white/10
              bg-white/[0.97]
              p-6
              shadow-2xl
              shadow-black/20
              sm:p-8
            "
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {sub}
              </p>
            </div>

            {children}
          </Card>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} FloorCrew. Retail staffing platform.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   LOGIN
========================================================= */

export function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    email: '',
    password: '',
  });

  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <Navigate
        to={HOME[user.role]}
        replace
      />
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    if (!f.email || !f.password) {
      return setErr('Enter your email and password');
    }

    setBusy(true);
    setErr('');

    try {
      const loggedInUser = await login(
        f.email,
        f.password
      );

      nav(HOME[loggedInUser.role]);
    } catch (x) {
      setErr(errMsg(x));
    }

    setBusy(false);
  };

  return (
    <Shell
      title="Welcome back"
      sub="Log in to manage your shifts, jobs and staffing."
    >
      <form
        onSubmit={submit}
        className="space-y-5"
        noValidate
      >
        {/* Email */}
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={f.email}
          onChange={(e) =>
            setF({
              ...f,
              email: e.target.value,
            })
          }
        />

        {/* Password */}
        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password: e.target.value,
            })
          }
        />

        {/* Error */}
        {err && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-rose-200
              bg-rose-50
              p-3
              text-sm
              text-rose-700
            "
            role="alert"
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-rose-100
                text-xs
                font-bold
              "
            >
              !
            </span>

            <span>{err}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          loading={busy}
          className="w-full py-3"
        >
          Log in
        </Button>

        {/* Register */}
        <p className="text-center text-sm text-slate-500">
          New to FloorCrew?{' '}
          <Link
            to="/register"
            className="
              font-semibold
              text-teal-700
              transition-colors
              hover:text-teal-800
              hover:underline
              hover:underline-offset-4
            "
          >
            Create an account
          </Link>
        </p>
      </form>
    </Shell>
  );
}

/* =========================================================
   REGISTER
========================================================= */

export function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [f, setF] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    role: 'worker',
  });

  const [e, setE] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (ev) =>
    setF({
      ...f,
      [k]: ev.target.value,
    });

  const submit = async (ev) => {
    ev.preventDefault();

    const x = {};

    if (!f.name.trim()) {
      x.name = 'Enter your name';
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      x.email = 'Enter a valid email';
    }

    if (!/^[0-9+\-\s]{8,15}$/.test(f.phone)) {
      x.phone = 'Enter a valid phone number';
    }

    if (f.password.length < 6) {
      x.password = 'Use at least 6 characters';
    }

    if (f.confirm !== f.password) {
      x.confirm = 'Passwords do not match';
    }

    setE(x);

    if (Object.keys(x).length) {
      return;
    }

    setBusy(true);

    try {
      const registeredUser = await register(f);

      nav(HOME[registeredUser.role]);
    } catch (z) {
      setE({
        form: errMsg(z),
      });
    }

    setBusy(false);
  };

  return (
    <Shell
      title="Create your account"
      sub="Get started with FloorCrew in less than a minute."
    >
      <form
        onSubmit={submit}
        className="space-y-5"
        noValidate
      >
        {/* Role Selection */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            I am joining as
          </p>

          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-label="I am a"
          >
            {[
              [
                'worker',
                'I want work',
                'Find shifts and earn',
                '👷',
              ],
              [
                'business',
                'I need staff',
                'Hire staff for my store',
                '🏪',
              ],
            ].map(([v, t, s, icon]) => {
              const active = f.role === v;

              return (
                <button
                  type="button"
                  key={v}
                  onClick={() =>
                    setF({
                      ...f,
                      role: v,
                    })
                  }
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/10'
                        : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        ${
                          active
                            ? 'bg-teal-100'
                            : 'bg-slate-100'
                        }
                      `}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <span
                        className={`
                          block
                          text-sm
                          font-bold
                          ${
                            active
                              ? 'text-teal-800'
                              : 'text-slate-800'
                          }
                        `}
                      >
                        {t}
                      </span>

                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                        {s}
                      </span>
                    </div>

                    {/* Selected indicator */}
                    <div
                      className={`
                        ml-auto
                        mt-1
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        ${
                          active
                            ? 'border-teal-600 bg-teal-600'
                            : 'border-slate-300'
                        }
                      `}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name */}
        <Field
          label={
            f.role === 'business'
              ? 'Business or store name'
              : 'Full name'
          }
          placeholder={
            f.role === 'business'
              ? 'Enter your store name'
              : 'Enter your full name'
          }
          value={f.name}
          onChange={set('name')}
          error={e.name}
          autoComplete="name"
        />

        {/* Email */}
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={f.email}
          onChange={set('email')}
          error={e.email}
          autoComplete="email"
        />

        {/* Phone */}
        <Field
          label="Phone number"
          type="tel"
          placeholder="+91 98765 43210"
          value={f.phone}
          onChange={set('phone')}
          error={e.phone}
          autoComplete="tel"
        />

        {/* Password */}
        <Field
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={f.password}
          onChange={set('password')}
          error={e.password}
          autoComplete="new-password"
        />

        {/* Confirm Password */}
        <Field
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          value={f.confirm}
          onChange={set('confirm')}
          error={e.confirm}
          autoComplete="new-password"
        />

        {/* Server error */}
        {e.form && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-rose-200
              bg-rose-50
              p-3
              text-sm
              text-rose-700
            "
            role="alert"
          >
            <span
              className="
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-rose-100
                text-xs
                font-bold
              "
            >
              !
            </span>

            <span>{e.form}</span>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          loading={busy}
          className="w-full py-3"
        >
          Create account
        </Button>

        {/* Login */}
        <p className="text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link
            to="/login"
            className="
              font-semibold
              text-teal-700
              transition-colors
              hover:text-teal-800
              hover:underline
              hover:underline-offset-4
            "
          >
            Log in
          </Link>
        </p>
      </form>
    </Shell>
  );
}