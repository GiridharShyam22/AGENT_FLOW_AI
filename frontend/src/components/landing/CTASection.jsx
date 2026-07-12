import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Button from '../common/Button'
import styles from './CTASection.module.css'

export default function CTASection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <section className={styles.section} id="cta">
      <div className="container">
        <motion.div
          ref={ref}
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background layers */}
          <div className={styles.card__bg}      aria-hidden="true" />
          <div className={styles.card__glow_l}  aria-hidden="true" />
          <div className={styles.card__glow_r}  aria-hidden="true" />
          <div className={styles.card__grid}    aria-hidden="true" />

          {/* Content */}
          <div className={styles.card__content}>
            <div className={styles.card__badge}>
              <Zap size={13} />
              Ready to deploy
            </div>

            <h2 className={styles.card__title}>
              Your private AI, your rules.
              <br />
              <span className={styles.card__title_accent}>Deploy in minutes.</span>
            </h2>

            <p className={styles.card__subtitle}>
              Stop sending sensitive data to third-party AI services.
              AgentFlow AI runs entirely on your infrastructure — no subscriptions,
              no data leaks, no compromises.
            </p>

            <div className={styles.card__actions}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                id="cta-get-started"
              >
                Launch Platform <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" id="cta-docs">
                View Documentation
              </Button>
            </div>

            <div className={styles.card__perks}>
              {['No API keys needed', 'Completely offline', 'Open source stack'].map(perk => (
                <div key={perk} className={styles.card__perk}>
                  <span className={styles.card__perk_dot} />
                  {perk}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
