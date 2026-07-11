import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import WelcomeCard from './WelcomeCard'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import InputArea from './InputArea'
import SuggestionBoard from './SuggestionBoard'
import useChat from '../../hooks/useChat'
import styles from './ChatWindow.module.css'

/**
 * ChatWindow — exported as both default (for standalone use)
 * and named so MainLayout can pass resetChat to sidebar.
 */
export default function ChatWindow({ onReady, activeSessionId, initialMessages, onMessagesChange }) {
  const {
    messages, input, setInput,
    handleSend, sendDirect, resetChat,
    isTyping, error,
  } = useChat({ activeSessionId, initialMessages, onMessagesChange })

  const bottomRef = useRef(null)
  const [showBoard, setShowBoard] = useState(true)

  // Expose resetChat upward
  useEffect(() => {
    onReady?.({ resetChat })
  }, []) // eslint-disable-line

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  const hasConversation = messages.length > 1

  const handleSuggestion = (question) => {
    sendDirect(question)
  }

  return (
    <div className={styles.window}>
      <div className={`${styles.window__layout} ${showBoard ? styles['window__layout--split'] : ''}`}>

        {/* ── Chat column ─────────────────────────────────── */}
        <div className={styles.window__chat}>

          <div className={styles.window__scroll}>
            <div className={styles.window__inner}>

              <AnimatePresence>
                {!hasConversation && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <WelcomeCard onSend={sendDirect} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.window__messages}>
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <MessageBubble {...msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className={styles.window__error}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ⚠ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} style={{ height: 1 }} />
            </div>
          </div>

          {/* Input */}
          <div className={styles.window__input_wrap}>
            <button
              className={`${styles.board_toggle} ${showBoard ? styles['board_toggle--active'] : ''}`}
              onClick={() => setShowBoard(v => !v)}
              title={showBoard ? 'Hide suggestions' : 'Show suggestions'}
              aria-pressed={showBoard}
              id="toggle-suggestion-board"
            >
              <Lightbulb size={13} />
              {showBoard ? 'Hide suggestions' : 'Suggestions'}
            </button>
            <InputArea value={input} onChange={setInput} onSend={handleSend} />
          </div>
        </div>

        {/* ── Suggestion board column ──────────────────────── */}
        <AnimatePresence>
          {showBoard && (
            <motion.div
              className={styles.window__board_col}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SuggestionBoard onSend={handleSuggestion} visible={true} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}