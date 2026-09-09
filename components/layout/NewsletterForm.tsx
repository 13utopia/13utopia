'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Something went wrong.');
        return;
      }
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  if (status === 'ok') {
    return <p className="text-xs text-[#C8F31D]">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form className="space-y-2 pt-2" onSubmit={onSubmit}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        onChange={() => undefined}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email *"
        className="w-full bg-[#121212] border border-white/20 rounded-md px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C8F31D] transition-colors"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#292929] hover:bg-[#C8F31D] hover:text-black text-white text-xs font-semibold py-2 rounded-md transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Send'}
      </button>
      {status === 'error' && <p className="text-[11px] text-red-400">{error}</p>}
    </form>
  );
}
