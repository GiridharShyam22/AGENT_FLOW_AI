import clsx from 'clsx'
import styles from './GlassCard.module.css'

/**
 * GlassCard — reusable glassmorphism card
 * @param {'default' | 'glow' | 'accent'} variant
 */
export default function GlassCard({
  children,
  variant = 'default',
  className,
  hover = true,
  style,
  ...props
}) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[`card--${variant}`],
        hover && styles['card--hover'],
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}