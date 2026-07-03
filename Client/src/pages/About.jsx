const About = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-extrabold text-primary-900">About 9jaLinks</h1>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-primary-700">Why we exist</h2>
        <p className="mt-3 font-body leading-relaxed text-ink">
          Millions of Nigerian businesses sell through WhatsApp, Instagram, TikTok, and Facebook.
          That reach is a strength — but it also makes it easy for a fraudulent account to
          impersonate a real seller, or for a scammer to disappear after taking payment. Buyers
          are often left guessing, with no simple way to check if a seller is who they claim to
          be.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-primary-700">Our mission</h2>
        <p className="mt-3 font-body leading-relaxed text-ink">
          To give every Nigerian buyer a fast, reliable way to check a seller's legitimacy before
          they pay — and to give every honest seller a badge that proves they are who they say
          they are.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-primary-700">Our vision</h2>
        <p className="mt-3 font-body leading-relaxed text-ink">
          A Nigerian e-commerce ecosystem where trust isn't a gamble — where a verification badge
          carries the same weight as walking into a shop you know.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-primary-700">
          How we handle your data
        </h2>
        <p className="mt-3 font-body leading-relaxed text-ink">
          Identity checks are handled through authorized verification providers. We store your
          verification status and the minimum metadata required — never raw identity numbers like
          your BVN or NIN.
        </p>
      </section>
    </div>
  );
};

export default About;