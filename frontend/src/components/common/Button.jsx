import { useRef, useState } from 'react'
import styles from './Button.module.css'
import clsx from 'clsx'

/**
 * Button — reusable premium button component
 * @param {'primary' | 'outline' | 'ghost'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  href,
  disabled = false,
  type = 'button',
  ...props
}) {
  const [ripples, setRipples] = useState([])
  const btnRef = useRef(null)

  const handleClick = (e) => {
    if (disabled) return

    // Ripple effect
    const btn = btnRef.current
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)

    if (onClick) onClick(e)
  }

  const classes = clsx(
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    disabled && styles['btn--disabled'],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button
      ref={btnRef}
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      <span className={styles.btn__content}>{children}</span>
      {ripples.map(r => (
        <span
          key={r.id}
          className={styles.btn__ripple}
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  )
}
