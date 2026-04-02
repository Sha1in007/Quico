'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Account created! Welcome to Quico 🎉');
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Quico</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Create your account</h1>
          <p className="text-[#6666aa] text-sm">Start using AI tools in seconds</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f1a] border border-[#1e1e30] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[#8888aa] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555570]" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-[#080810] border border-[#252538] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444460] outline-none focus:border-violet-500 transition-colors"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#8888aa] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555570]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#080810] border border-[#252538] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444460] outline-none focus:border-violet-500 transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#8888aa] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555570]" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#080810] border border-[#252538] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444460] outline-none focus:border-violet-500 transition-colors"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-violet-600/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-[#555570] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
