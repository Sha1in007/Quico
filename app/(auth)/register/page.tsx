'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

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
      toast.success('Account created. Welcome!');
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0c] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        {/* Logo + heading */}
        <div className="mb-8">
          <p className="text-[22px] font-semibold text-[#e8e8e4] tracking-tight mb-1">
            Quico
          </p>
          <p className="text-[14px] text-[#5a5a54] font-[450]">Create your account</p>
        </div>

        {/* Form card */}
        <div className="bg-[#141412] border border-[#242422] rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a38]" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg pl-9 pr-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a38]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg pl-9 pr-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a38]" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg pl-9 pr-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e8e8e4] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-[#0e0e0c] rounded-lg py-2.5 text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-150 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-[13px] text-[#4a4a48] mt-5 font-[450]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#a8a8a0] hover:text-[#e0e0dc] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
