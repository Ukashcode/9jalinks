import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import VerifiedSeal from '../components/VerifiedSeal.jsx';

const BENEFITS = [
  {
    title: 'Verified identity',
    body: 'Every badge means a real seller behind a real business stood behind their name.',
  },
  {
    title: 'Buy with confidence',
    body: 'Check a seller before you send money — not after something goes wrong.',
  },
  {
    title: 'Built for social selling',
    body: 'Works alongside WhatsApp, Instagram, and TikTok, not instead of them.',
  },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-16 pt-20 text-center">
        <VerifiedSeal className="h-16 w-16" />
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-primary-900 md:text-5xl">
          Know who you're really buying from.
        </h1>
        <p className="max-w-xl font-body text-lg text-primary-500">
          9jaLinks verifies Nigerian sellers so buyers can shop on social media with one less
          thing to worry about.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link to="/signup">
            <Button variant="primary">Get verified</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline">How it works</Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-2xl font-bold">
            Why verification matters
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-primary-100 p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-lg font-bold text-primary-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 font-body text-primary-500">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-primary-700 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-2xl font-bold">Ready to build buyer trust?</h2>
          <p className="mt-3 font-body text-primary-100">
            Create your seller profile in minutes and start the road to your verification badge.
          </p>
          <div className="mt-6">
            <Link to="/signup">
              <Button variant="accent">Create your profile</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;