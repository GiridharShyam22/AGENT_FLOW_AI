import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import styles from './TechStack.module.css'

const TECHS = [
  {
    name: 'React',
    icon: '⚛️',
    desc: 'Modern component architecture',
    color: '#61DAFB',
  },
  {
    name: 'FastAPI',
    icon: '⚡',
    desc: 'High-performance Python backend',
    color: '#009688',
  },
  {
    name: 'Ollama',
    icon: '🦙',
    desc: 'Local LLM inference engine',
    color: '#A0A0A0',
  },
  {
    name: 'RAG Pipeline',
    icon: '🔗',
    desc: 'Retrieval-Augmented Generation',
    color: '#FFFFFF',
  },
  {
    name: 'Vector Search',
    icon: '🎯',
    desc: 'Semantic similarity retrieval',
    color: '#888888',
  },
  {
    name: 'Offline AI',
    icon: '🛡️',
    desc: 'Air-gapped private deployment',
    color: '#FFFFFF',
  },
  {
    name: 'Python',
    icon: '🐍',
    desc: 'Core AI/ML ecosystem',
    color: '#FFD43B',
  },
  {
    name: 'Embeddings',
    icon: '🧬',
    desc: 'Dense vector representations',
    color: '#FF6B6B',
  },
]

// Duplicate for seamless marquee
const DOUBLED = [...TECHS, ...TECHS]

export default function TechStack() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="tech-stack" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionTitle
            badge="Technology"
            title="Built on proven foundations"
            subtitle="A carefully chosen stack that combines performance, reliability, and cutting-edge AI capabilities — all running locally on your infrastructure."
          />
        </motion.div>
      </div>

      {/* Marquee strip */}
      <div className={styles.marquee_wrap}>
        <div className={styles.marquee_fade_left}  aria-hidden="true" />
        <div className={styles.marquee_fade_right} aria-hidden="true" />

        <div className={styles.marquee_track}>
          {DOUBLED.map((tech, i) => (
            <div
              key={`${tech.name}-${i}`}
              className={styles.tech_card}
              style={{ '--tech-color': tech.color }}
              aria-label={tech.name}
            >
              <span className={styles.tech_icon} role="img" aria-label={tech.name}>
                {tech.icon}
              </span>
              <div>
                <div className={styles.tech_name}>{tech.name}</div>
                <div className={styles.tech_desc}>{tech.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
