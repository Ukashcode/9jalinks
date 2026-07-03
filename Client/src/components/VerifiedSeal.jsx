// The seal is 9jaLinks' one recurring visual signature: a scalloped badge
// with a checkmark, standing in for the "verified" stamp the whole
// platform is built around. Reused in the navbar logo and hero section.
const VerifiedSeal = ({ className = 'h-8 w-8' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 2l4.9 3.3 5.9-.6 2.1 5.6 5.2 3-1.4 5.8 1.4 5.8-5.2 3-2.1 5.6-5.9-.6L24 38l-4.9-3.3-5.9.6-2.1-5.6-5.2-3 1.4-5.8L6 15.1l5.2-3 2.1-5.6 5.9.6L24 2z"
      fill="currentColor"
      className="text-accent-500"
    />
    <path
      d="M17 24l4.5 4.5L32 18"
      stroke="#1B2A4A"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default VerifiedSeal;