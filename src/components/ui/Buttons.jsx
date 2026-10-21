import { cx } from '../../lib/cx'

const SIZES = {
  md: 'h-12 min-w-[220px] px-[22px] text-sm tracking-[1.5px]',
  sm: 'h-[38px] min-w-0 px-4 text-[12.5px] tracking-[1.2px]',
  xl: 'h-[68px] min-w-[290px] px-[38px] text-lg tracking-[1.5px] hover:shadow-[0_14px_34px_-14px_rgba(255,176,32,.55)] max-[760px]:w-full max-[760px]:min-w-0',
}
const VARIANTS = {
  outline: ['border-amber bg-linear-to-b from-amber/[.22] to-amber-deep/10 text-amber hover:text-[#1a1206]', 'bg-linear-to-r from-amber-deep to-amber'],
  primary: ['border-amber bg-linear-to-r from-amber-deep to-amber font-semibold text-[#1a1206]', 'bg-linear-to-r from-[#ffc247] to-[#ffd98a]'],
  ghost: ['border-[#4a5661] bg-white/[.03] text-fg hover:text-black', 'bg-white/90'],
}

/** Botón principal (.hero-dl). `as` permite usar <a>, <Link> o <button>. */
export function HeroButton({ as: Tag = 'button', variant = 'outline', size = 'md', icon, loading, children, className, ...rest }) {
  const [look, fill] = VARIANTS[variant]
  return (
    <Tag
      {...(Tag === 'button' && !rest.type ? { type: 'button' } : {})}
      className={cx(
        'group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[7px] border font-display uppercase leading-none no-underline',
        'transition-[transform,box-shadow,color,border-color] duration-200 ease-soft hover:-translate-y-0.5 active:scale-[.97]',
        look, SIZES[size], loading && 'pointer-events-none opacity-80', className,
      )}
      {...rest}
    >
      <i className={cx('absolute inset-y-0 left-0 z-0 w-0 transition-[width] duration-[350ms] ease-soft group-hover:w-full group-focus-visible:w-full', fill)} />
      {icon && <span className="relative z-10 flex group-hover:*:animate-bob">{icon}</span>}
      <span className="relative z-10 block pt-px leading-none">
        {loading && <span className="mr-2 inline-block size-3.5 animate-spin-fast rounded-full border-2 border-[#1a1206] border-t-transparent align-[-2px]" />}
        {children}
      </span>
    </Tag>
  )
}

const ACT = {
  discord: ['border-discord bg-discord/[.12] text-[#8b95ff] hover:text-white', 'bg-discord'],
  soon: ['cursor-not-allowed border-amber/45 bg-linear-to-b from-amber/[.16] to-amber-deep/[.06] text-amber opacity-80', null],
}

/** Botón de acción de tarjeta/modal (.act-btn): Comprar o Próximamente. */
export function ActButton({ state = 'discord', big, icon, onClick, children }) {
  const [look, fill] = ACT[state]
  return (
    <button
      type="button"
      disabled={state === 'soon'}
      onClick={onClick}
      className={cx(
        'group relative inline-flex min-w-0 flex-1 items-center justify-center gap-[7px] overflow-hidden whitespace-nowrap rounded-md border px-3 font-display text-xs uppercase leading-none tracking-[.8px] transition-[border-color,color,transform] duration-150 active:scale-[.97]',
        big ? 'h-12 flex-[1_1_190px] text-[13px]' : 'h-10', look,
      )}
    >
      {fill && <i className={cx('absolute inset-y-0 left-0 z-0 w-0 transition-[width] duration-300 ease-soft group-hover:w-full group-focus-visible:w-full', fill)} />}
      {icon && <span className="relative z-10 flex *:size-[13px]">{icon}</span>}
      <span className="relative z-10 block pt-px">{children}</span>
    </button>
  )
}

export const Chip = ({ pressed, count, children, ...rest }) => (
  <button
    type="button"
    aria-pressed={pressed}
    className="inline-flex min-h-[38px] items-center gap-[7px] whitespace-nowrap rounded-md border border-line bg-panel-2 px-4 font-display text-xs uppercase leading-none tracking-[.8px] text-steel-light transition-all duration-150 hover:border-steel hover:text-fg active:scale-[.96] aria-pressed:border-amber aria-pressed:bg-amber aria-pressed:font-semibold aria-pressed:text-[#1a1206]"
    {...rest}
  >
    <span className="block pt-px">{children}</span>
    {count != null && <small className="font-mono text-[10px] opacity-70">{count}</small>}
  </button>
)
