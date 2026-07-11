import { Link } from 'react-router-dom'
import { Code2, Globe, Users } from 'lucide-react'
import logoImage from '../../assets/logo.png'
import styles from './LandingFooter.module.css'

const LINKS = {
  Product: ['Features', 'How it Works', 'Knowledge Base', 'Analytics'],
  Platform: ['FastAPI Backend', 'RAG Pipeline', 'Ollama Integration', 'Vector Search'],
  Company:  ['About', 'Blog', 'Careers', 'Contact'],
}

export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <div className="container">
          <div className={styles.footer__inner}>
            {/* Brand col */}
            <div className={styles.footer__brand}>
              <div className={styles.footer__logo}>
                <img src={logoImage} alt="AgentFlow AI Logo" style={{ height: '60px', width: 'auto', borderRadius: '50%' }} />
              </div>
              <p className={styles.footer__tagline}>
                Enterprise offline AI knowledge platform. Your data stays yours — always.
              </p>
              <div className={styles.footer__socials}>
                <a href="#" className={styles.footer__social} aria-label="GitHub Repository">
                  <Code2 size={18} />
                </a>
                <a href="#" className={styles.footer__social} aria-label="Community">
                  <Users size={18} />
                </a>
                <a href="#" className={styles.footer__social} aria-label="Website">
                  <Globe size={18} />
                </a>
              </div>
            </div>

            {/* Link cols */}
            {Object.entries(LINKS).map(([group, links]) => (
              <div key={group} className={styles.footer__col}>
                <h4 className={styles.footer__col_title}>{group}</h4>
                <ul className={styles.footer__col_list}>
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className={styles.footer__col_link}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer__bottom}>
        <div className="container">
          <div className={styles.footer__bottom_inner}>
            <span className={styles.footer__copy}>
              © {new Date().getFullYear()} AgentFlow AI. Built with FastAPI, Ollama & React.
            </span>
            <div className={styles.footer__legal}>
              <a href="#" className={styles.footer__legal_link}>Privacy Policy</a>
              <a href="#" className={styles.footer__legal_link}>Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
