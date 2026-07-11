import clsx from 'clsx'
import styles from './SectionTitle.module.css'

/**
 * SectionTitle — consistent section heading pattern
 * badge → title → subtitle
 */
export default function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) {
  return (
    <div className={clsx(styles.wrap, styles[`wrap--${align}`], className)}>
      {badge && (
        <span className={styles.badge}>{badge}</span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
    </div>
  )
}
