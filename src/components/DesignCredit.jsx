/** Credit link — portfolio (opens in new tab). */
export default function DesignCredit({ className = '' }) {
  return (
    <a
      href="https://devmichelbranche.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[10px] uppercase tracking-[0.22em] underline underline-offset-[5px] decoration-1 transition-colors ${className}`}
    >
      Design by Michel Branche
    </a>
  );
}
