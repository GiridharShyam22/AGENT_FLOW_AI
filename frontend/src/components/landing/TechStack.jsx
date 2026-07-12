import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Atom, Zap, Cpu, Network, Target, ShieldCheck, Terminal, Dna } from 'lucide-react'
import SectionTitle from '../common/SectionTitle'
import styles from './TechStack.module.css'

const TECHS = [
  {
    name: 'React',
    icon: Atom,
    desc: 'Modern component architecture',
    color: '#61DAFB',
    animation: { rotate: 360 },
    transition: { repeat: Infinity, duration: 4, ease: "linear" }
  },
  {
    name: 'FastAPI',
    icon: Zap,
    desc: 'High-performance Python backend',
    color: '#009688',
    animation: { rotate: [0, -20, 20, -20, 0], scale: [1, 1.3, 1] },
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
  },
  {
    name: 'Ollama',
    icon: Cpu,
    desc: 'Local LLM inference engine',
    color: '#A0A0A0',
    animation: { y: [-4, 4, -4], rotate: [0, 5, -5, 0] },
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
  },
  {
    name: 'RAG Pipeline',
    icon: Network,
    desc: 'Retrieval-Augmented Generation',
    color: '#FFFFFF',
    animation: { rotate: 360, scale: [1, 1.1, 1] },
    transition: { repeat: Infinity, duration: 6, ease: "linear" }
  },
  {
    name: 'Vector Search',
    icon: Target,
    desc: 'Semantic similarity retrieval',
    color: '#888888',
    animation: { scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] },
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
  },
  {
    name: 'Offline AI',
    icon: ShieldCheck,
    desc: 'Air-gapped private deployment',
    color: '#FFFFFF',
    animation: { rotateY: [0, 360] },
    transition: { repeat: Infinity, duration: 3, ease: "linear" }
  },
  {
    name: 'Python',
    icon: Terminal,
    desc: 'Core AI/ML ecosystem',
    color: '#FFD43B',
    animation: { y: [-3, 3, -3], rotate: [-5, 5, -5] },
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
  },
  {
    name: 'Embeddings',
    icon: Dna,
    desc: 'Dense vector representations',
    color: '#FF6B6B',
    animation: { rotateY: [0, 360], rotate: 360 },
    transition: { repeat: Infinity, duration: 4, ease: "linear" }
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
              <motion.span 
                className={styles.tech_icon} 
                role="img" 
                aria-label={tech.name}
                animate={tech.animation}
                transition={tech.transition}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <tech.icon size={24} color={tech.color} />
              </motion.span>
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
