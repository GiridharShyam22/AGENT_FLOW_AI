import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import styles from './InputArea.module.css'

export default function InputArea({ value, onChange, onSend }) {
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  // Auto-resize textarea
  const handleChange = (e) => {
    onChange(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 180) + 'px'
    }
  }

  const canSend = value.trim().length > 0

  return (
    <div className={`${styles.wrap} ${focused ? styles['wrap--focused'] : ''}`}>

      {/* Focus glow line */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className={styles.wrap__glow_line}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Input row */}
      <div className={styles.input_row}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Ask AgentFlow AI anything about your knowledge base..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={1}
          aria-label="Chat message input"
          id="chat-input"
        />

        <motion.button
          className={`${styles.send_btn} ${canSend ? styles['send_btn--active'] : ''}`}
          onClick={onSend}
          disabled={!canSend}
          type="button"
          id="chat-send"
          whileTap={canSend ? { scale: 0.92 } : {}}
          title="Send message (Enter)"
        >
          <Send size={16} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Hint */}
      <div className={styles.hint}>
        <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line
      </div>
    </div>
  )
}