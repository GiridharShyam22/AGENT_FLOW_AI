import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, ShieldCheck, Server } from 'lucide-react'
import AISphere from '../three/AISphere'
import FloatingParticles from '../three/FloatingParticles'
import Button from '../common/Button'
import styles from './Hero.module.css'

const FADE_UP = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const TRUST_ITEMS = [
  { icon: <ShieldCheck size={14} />, label: '100% Offline & Private' },
  { icon: <Server size={14} />,      label: 'Local Deployment' },
]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className={styles.hero} id="hero">
      {/* Background layers */}
      <div className={styles.hero__bg}>
        <FloatingParticles count={90} />
        <div className={styles.hero__glow_top}    aria-hidden="true" />
        <div className={styles.hero__glow_left}   aria-hidden="true" />
        <div className={styles.hero__glow_right}  aria-hidden="true" />
        <div className={styles.hero__grid}        aria-hidden="true" />
      </div>

      <div className={styles.hero__inner}>
        {/* ── Left content ─────────────────────────────────── */}
        <div className={styles.hero__content}>
          {/* Badge */}
          <motion.div
            className={styles.hero__badge}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className={styles.hero__badge_dot} />
            Master Autonomous Agent Development
          </motion.div>

          {/* Heading */}
          <motion.h1
            className={styles.hero__title}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Build, Test, and Deploy
            <br />
            <span className={styles.hero__title_gradient}>Autonomous AI</span>
            <br />
            Agents
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={styles.hero__subtitle}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Your complete guide and playground for building intelligent AI agents. Learn about tool calling, memory management, multi-agent orchestration, and RAG—all powered by local LLMs.
          </motion.p>

          {/* Trust signals */}
          <motion.div
            className={styles.hero__trust}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            {TRUST_ITEMS.map(item => (
              <div key={item.label} className={styles.hero__trust_item}>
                <span className={styles.hero__trust_icon}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className={styles.hero__actions}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              id="hero-get-started"
            >
              Get Started <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              id="hero-watch-demo"
              onClick={() => navigate('/workspace')}
            >
              <Play size={16} style={{ fill: 'currentColor' }} />
              Try it Live
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className={styles.hero__stats}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            {[
              { value: 'Agentic', label: 'Workflows' },
              { value: '100%',    label: 'Open Source' },
              { value: 'RAG',     label: 'Powered engine' },
            ].map(stat => (
              <div key={stat.label} className={styles.hero__stat}>
                <span className={styles.hero__stat_value}>{stat.value}</span>
                <span className={styles.hero__stat_label}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: 3D Sphere ──────────────────────────────── */}
        <motion.div
          className={styles.hero__visual}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          {/* Glow behind sphere */}
          <div className={styles.hero__sphere_glow} aria-hidden="true" />
          <div className={styles.hero__sphere_glow2} aria-hidden="true" />

          <div className={styles.hero__sphere_wrap}>
            <AISphere />
          </div>

          {/* Floating info cards */}
          <motion.div
            className={`${styles.hero__float_card} ${styles['hero__float_card--tl']}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.hero__float_dot} style={{ background: '#FFFFFF' }} />
            <div>
              <div className={styles.hero__float_title}>RAG Pipeline</div>
              <div className={styles.hero__float_sub}>Active · 3 models</div>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.hero__float_card} ${styles['hero__float_card--br']}`}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <span className={styles.hero__float_dot} style={{ background: '#FFFFFF' }} />
            <div>
              <div className={styles.hero__float_title}>Knowledge Base</div>
              <div className={styles.hero__float_sub}>247 documents indexed</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.hero__scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className={styles.hero__scroll_mouse}>
          <div className={styles.hero__scroll_wheel} />
        </div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  )
}
