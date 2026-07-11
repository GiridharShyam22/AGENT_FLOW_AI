import { useEffect, useRef, useState } from 'react'
import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceHeader from './WorkspaceHeader'
import ChatWindow from '../components/chat/ChatWindow'
import styles from './WorkspaceLayout.module.css'

export default function MainLayout() {
  const chatRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("agentflow_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem("agentflow_active_session") || null;
  });

  useEffect(() => {
    localStorage.setItem("agentflow_sessions", JSON.stringify(sessions));
    if (activeSessionId) {
      localStorage.setItem("agentflow_active_session", activeSessionId);
    } else {
      localStorage.removeItem("agentflow_active_session");
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const initialMessages = activeSession ? activeSession.messages : null;

  const handleNewChat = () => {
    chatRef.current?.resetChat?.()
    setActiveSessionId(null);
  }

  const handleDeleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      chatRef.current?.resetChat?.();
    }
  }

  const handleMessagesChange = (newMessages) => {
    if (activeSessionId) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: newMessages } : s
      ));
    } else {
      if (newMessages.length > 1) {
        const userMsg = newMessages.find(m => m.role === 'user');
        const title = userMsg ? userMsg.content.substring(0, 30) + "..." : "New Chat";
        const newSession = {
          id: Date.now().toString(),
          title: title,
          date: new Date().toLocaleDateString(),
          messages: newMessages
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      }
    }
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.workspace__bg}   aria-hidden="true" />
      <div className={styles.workspace__grid} aria-hidden="true" />

      <WorkspaceSidebar 
        onNewChat={handleNewChat} 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
      />

      <div className={styles.workspace__main}>
        <WorkspaceHeader />
        <main className={styles.workspace__content}>
          <ChatWindow 
            onReady={(api) => { chatRef.current = api }} 
            activeSessionId={activeSessionId}
            initialMessages={initialMessages}
            onMessagesChange={handleMessagesChange}
          />
        </main>
      </div>
    </div>
  )
}