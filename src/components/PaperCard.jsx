/**
 * One sheet of paper laid on the desk.
 *
 * The work page used to be two long columns running down a single surface,
 * which read as one document. Splitting it into overlapping offset sheets is
 * what makes it read as a desk: each block is its own piece of paper, tilted a
 * degree or two, casting a shadow on whatever is underneath.
 *
 * Purely presentational — every animation still belongs to the components
 * rendered inside it.
 *
 * @param {object}  props
 * @param {import('react').ReactNode} props.children
 * @param {number}  [props.rotate]   degrees of tilt (default 0)
 * @param {string}  [props.className]
 * @param {boolean} [props.lift]     raise above neighbouring sheets (default false)
 */
export default function PaperCard({ children, rotate = 0, lift = false, className = '' }) {
  return (
    <div
      className={`paper-surface relative ${lift ? 'z-20' : 'z-10'} px-[clamp(1.25rem,2.4vw,3rem)] py-[clamp(1.5rem,2.6vw,3rem)] ${className}`}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        boxShadow: 'var(--shadow-page)',
      }}
    >
      {children}
    </div>
  )
}
