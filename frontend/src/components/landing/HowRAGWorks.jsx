import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MessageSquare, Search, Database, Cpu, CheckCircle2, ArrowDown
} from 'lucide-react'
import SectionTitle from '../common/SectionTitle'
import styles from './HowRAGWorks.module.css'

const STEPS = [
  {
    id:    1,
    icon:  <MessageSquare size={22} />,
    title: 'User Query',
    desc:  'A natural language question is submitted to the AgentFlow AI platform',
    color: '#FFFFFF',
    tag:   'Input',
  },
  {
    id:    2,
    icon:  <Search size={22} />,
    title: 'Semantic Retriever',
    desc:  'The query is embedded into a vector and matched against your knowledge corpus using cosine similarity',
    color: '#A0A0A0',
    tag:   'Retrieval',
  },
  {
    id:    3,
    icon:  <Database size={22} />,
    title: 'Knowledge Base',
    desc:  'The top-k most relevant document chunks are fetched from your private, air-gapped vector store',
    color: '#888888',
    tag:   'Context',
  },
  {
    id:    4,
    icon:  <Cpu size={22} />,
    title: 'Local LLM (Ollama)',
    desc:  'The retrieved context is injected into a prompt template and sent to your on-premise language model',
    color: '#FACC15',
    tag:   'Generation',
  },
  {
    id:    5,
    icon:  <CheckCircle2 size={22} />,
    title: 'Verified Answer',
    desc:  'A grounded, citation-backed response is returned — no hallucinations, no internet, no data leaks',
    color: '#FFFFFF',
    tag:   'Output',
  },
]

export default function HowRAGWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={`${styles.section} section`} id="how-it-works">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionTitle
            badge="How it Works"
            title="The Agentic Pipeline Explained"
            subtitle="Understand how an autonomous agent processes a query, retrieves external knowledge, and formulates a plan."
          />
        </motion.div>

        {/* Flow diagram */}
        <div ref={ref} className={styles.flow}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              className={styles.step_wrap}
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.step} style={{ '--step-color': step.color }}>
                {/* Step number */}
                <div className={styles.step__num}>{String(step.id).padStart(2, '0')}</div>

                {/* Left: icon circle */}
                <div className={styles.step__icon}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className={styles.step__content}>
                  <div className={styles.step__tag}>{step.tag}</div>
                  <h3 className={styles.step__title}>{step.title}</h3>
                  <p className={styles.step__desc}>{step.desc}</p>
                </div>

                {/* Glow bar */}
                <div className={styles.step__glow} aria-hidden="true" />
              </div>

              {/* Connector arrow (not after last) */}
              {i < STEPS.length - 1 && (
                <div className={styles.connector}>
                  <div className={styles.connector__line} />
                  <ArrowDown size={16} className={styles.connector__arrow} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
