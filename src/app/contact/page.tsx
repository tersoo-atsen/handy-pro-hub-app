'use client';

import { useState } from 'react';
import { CheckCircle, Clock, MapPin, Send } from 'lucide-react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Contact us</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Have a question, feedback, or need help with a booking? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-md p-6 space-y-4 shadow-card"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              {submitted && (
                <div
                  className="rounded-md p-3 text-xs font-medium flex items-center gap-2"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Thank you! Your message has been received.
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5">Your name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none resize-none"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white gradient-primary"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-md p-5 space-y-3 shadow-card"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <h2 className="text-sm font-bold">Support Hours</h2>
              <p className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <Clock className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                Mon – Sat, 8:00am – 6:00pm
              </p>
              <p className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                Makurdi, Benue State, Nigeria
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
