import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Shield, CreditCard, Wrench, Smartphone, Zap, ArrowUpRight, Search, X } from 'lucide-react'
import styles from './SuggestionBoard.module.css'

// ── Real questions directly from faqs.json knowledge base ─────
const CATEGORIES = [
  {
    id: 'agent-basics',
    icon: <motion.div animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}><Zap size={16} /></motion.div>,
    label: 'Agent Basics',
    questions: [
      'What is an autonomous AI agent?',
      'How does an agent differ from a standard chatbot?',
      'What is ReAct prompting?',
      'How do I prevent my agent from getting stuck in an infinite loop?',
    ],
  },
  {
    id: 'tool-calling',
    icon: <motion.div animate={{ rotate: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Wrench size={16} /></motion.div>,
    label: 'Tool Calling',
    questions: [
      'What is tool calling (function calling)?',
      'How do I pass tool execution results back to the LLM?',
      'Can agents write and execute their own code?',
    ],
  },
  {
    id: 'memory-context',
    icon: <motion.div animate={{ x: [-2, 2, -2], rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><Search size={16} /></motion.div>,
    label: 'Memory & Context',
    questions: [
      'How do agents maintain memory over long conversations?',
      'What happens when an agent exceeds the context window?',
      'What is a system prompt?',
      'How do I summarize old memory?',
    ],
  },
  {
    id: 'multi-agent',
    icon: <motion.div animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Shield size={16} /></motion.div>,
    label: 'Multi-Agent Systems',
    questions: [
      'What is a multi-agent system?',
      'What are some popular frameworks for building multi-agent systems?',
      'How do agents communicate with each other?',
      'What is a supervisor agent?',
    ],
  },
  {
    id: 'rag-integration',
    icon: <motion.div animate={{ x: [0, 2, 0], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}><ArrowUpRight size={16} /></motion.div>,
    label: 'RAG Integration',
    questions: [
      'How does RAG improve an AI agent?',
      'Should my agent use dense vector search or keyword search?',
      'What is chunking?',
      'How do I prevent RAG hallucinations?',
      'Can an agent update its own knowledge base?',
    ],
  }
]

const FADE_UP = {
  hidden:  { opacity: 0, y: 10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] } }),
}

function QuestionRow({ text, onSend, index }) {
  const [sent, setSent] = useState(false)

  const handleClick = () => {
    if (sent) return
    setSent(true)
    onSend(text)
    // Reset after 3 seconds so it can be clicked again
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <motion.button
      className={`${styles.qrow} ${sent ? styles['qrow--sent'] : ''}`}
      onClick={handleClick}
      variants={FADE_UP}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      disabled={sent}
      title={text}
    >
      <span className={styles.qrow__text}>{text}</span>
      {sent
        ? <span className={styles.qrow__badge}>Searching…</span>
        : <ArrowUpRight size={13} className={styles.qrow__arrow} />
      }
    </motion.button>
  )
}

export default function SuggestionBoard({ onSend, visible }) {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id)
  const [search, setSearch]       = useState('')
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const activeCat = CATEGORIES.find(c => c.id === activeTab)

  // Filter across all categories when searching
  const searchResults = search.trim()
    ? CATEGORIES.flatMap(c => c.questions).filter(q =>
        q.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.board}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Header ───────────────────────────────────────── */}
          <div className={styles.board__head}>
            <div className={styles.board__head_title}>
              <span className={styles.board__head_dot} />
              Knowledge Base
            </div>
            <button
              className={styles.board__close}
              onClick={() => setDismissed(true)}
              aria-label="Close suggestion panel"
            >
              <X size={14} />
            </button>
          </div>

          {/* ── Search ───────────────────────────────────────── */}
          <div className={styles.board__search}>
            <Search size={13} className={styles.board__search_icon} />
            <input
              className={styles.board__search_input}
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.board__search_clear} onClick={() => setSearch('')}>
                <X size={11} />
              </button>
            )}
          </div>

          {searchResults ? (
            /* ── Search results ────────────────────────────── */
            <div className={styles.board__results}>
              {searchResults.length === 0
                ? <p className={styles.board__empty}>No results for "{search}"</p>
                : searchResults.map((q, i) => (
                    <QuestionRow key={q} text={q} onSend={onSend} index={i} />
                  ))
              }
            </div>
          ) : (
            <>
              {/* ── Tabs ─────────────────────────────────────── */}
              <div className={styles.board__tabs}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`${styles.board__tab} ${activeTab === cat.id ? styles['board__tab--active'] : ''}`}
                    onClick={() => setActiveTab(cat.id)}
                  >
                    <span className={styles.board__tab_icon}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* ── Questions for active tab ─────────────────── */}
              <div className={styles.board__questions}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeCat.questions.map((q, i) => (
                      <QuestionRow key={q} text={q} onSend={onSend} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

          {/* ── Footer ─────────────────────────────────────── */}
          <div className={styles.board__foot}>
            {CATEGORIES.reduce((a, c) => a + c.questions.length, 0)} questions · Powered by RAG
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
