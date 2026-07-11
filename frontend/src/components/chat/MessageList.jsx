import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function MessageList({ messages, isTyping }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  return (
    <>
      {messages.map((message, index) => (
        <MessageBubble key={index} {...message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </>
  )
}