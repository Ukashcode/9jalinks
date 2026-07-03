import { useState } from 'react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

const FAQS = [
  {
    q: 'How long does verification take?',
    a: 'Once identity verification is live, most checks complete within 24–48 hours.',
  },
  {
    q: 'Do you store my BVN or NIN?',
    a: 'No. Verification runs through authorized providers — we only keep your verification status.',
  },
  {
    q: 'Is 9jaLinks free for sellers?',
    a: 'Sprint 1 focuses on account creation and profiles. Pricing details will come with the verification launch.',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No contact endpoint exists yet in Sprint 1 — this just confirms
    // receipt in the UI. Wire this to a real /api/contact route later.
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-3xl font-extrabold text-primary-900">Get in touch</h1>
      <p className="mt-2 font-body text-primary-500">
        Questions, feedback, or partnership ideas — we'd like to hear from you.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          {submitted ? (
            <div className="rounded-xl border border-success-500 bg-success-100 p-5 font-body text-success-700">
              Thanks — your message has been received. We'll get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="name"
                name="name"
                label="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-body text-sm font-medium text-primary-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-primary-100 px-3.5 py-2.5 font-body text-ink outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <Button type="submit" variant="primary" className="self-start">
                Send message
              </Button>
            </form>
          )}

          <div className="mt-8 font-body text-sm text-primary-500">
            <p>Email: support@9jalinks.com</p>
            <p className="mt-1">
              Social:{' '}
              <a href="#" className="text-primary-700 underline">
                Twitter/X
              </a>{' '}
              ·{' '}
              <a href="#" className="text-primary-700 underline">
                Instagram
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-primary-700">FAQ</h2>
          <div className="mt-4 flex flex-col gap-4">
            {FAQS.map((item) => (
              <div key={item.q} className="rounded-xl border border-primary-100 p-4">
                <p className="font-body font-semibold text-primary-900">{item.q}</p>
                <p className="mt-1 font-body text-sm text-primary-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;