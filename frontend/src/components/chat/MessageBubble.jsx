import { Sparkles, User, FileText, Volume2, Square } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './MessageBubble.module.css'

export default function MessageBubble({ role, content, time, sources, _streaming }) {
  const isUser = role === 'user'

  // Sources are objects from backend: { category, question, relevance_score, ... }
  const sourceLabels = Array.isArray(sources)
    ? sources.map(s => typeof s === 'string' ? s : s?.category || s?.question || '')
    : []

  const [isPlaying, setIsPlaying] = useState(false)

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Stop any ongoing speech first
    window.speechSynthesis.cancel()

    // Strip basic markdown symbols for cleaner reading
    const cleanText = content.replace(/[#*_`~]/g, '').trim()
    
    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className={`${styles.row} ${isUser ? styles['row--user'] : styles['row--ai']}`}>

      {/* Avatar */}
      <div className={`${styles.avatar} ${isUser ? styles['avatar--user'] : styles['avatar--ai']}`}>
        {isUser
          ? <User size={14} strokeWidth={2.5} />
          : <Sparkles size={14} strokeWidth={2.5} />
        }
      </div>

      {/* Bubble */}
      <div className={styles.content}>
        <div className={`${styles.bubble} ${isUser ? styles['bubble--user'] : styles['bubble--ai']}`}>
          {isUser
            ? <p className={styles.bubble__text}>{content}</p>
            : (
              <div className={styles.bubble__markdown}>
                {content
                  ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              className="md-code-block"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  )
                  : <span className={styles.bubble__empty}>…</span>
                }
                {/* Blinking cursor while streaming */}
                {_streaming && <span className={styles.cursor} aria-hidden="true" />}
              </div>
            )
          }
        </div>

        {/* Sources */}
        {!isUser && sourceLabels.length > 0 && (
          <div className={styles.sources}>
            <span className={styles.sources__label}><FileText size={11} /> Sources:</span>
            {sourceLabels.filter(Boolean).map((s, i) => (
              <span key={i} className={styles.source_tag}>{s}</span>
            ))}
          </div>
        )}

        <div className={styles.meta_row}>
          <span className={styles.time}>{time}</span>
          {!isUser && !_streaming && (
            <button 
              className={styles.speak_button} 
              onClick={handleSpeak}
              title={isPlaying ? "Stop reading" : "Read aloud"}
              aria-label="Read aloud"
            >
              {isPlaying ? <Square size={14} /> : <Volume2 size={14} />}
              {isPlaying ? "Stop" : "Listen"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}