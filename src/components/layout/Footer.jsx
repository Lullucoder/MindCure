import { Link } from 'react-router-dom';
import { Heart, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="layout-container footer__content">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__brand-logo">
              <span className="footer__emblem">
                <Heart className="h-6 w-6" style={{ color: 'var(--color-emerald-400)' }} />
              </span>
              <span>
                MindCure
                <small>Therapy &amp; Wellness</small>
              </span>
            </Link>
            <p className="footer__summary">
              Compassionate mental health support for students and young adults. Discover AI-guided conversations,
              calming exercises, and curated resources to build daily resilience.
            </p>
            <a href="tel:14416" className="footer__link" style={{ color: 'var(--color-coral-200)' }}>
              <Phone className="inline-block h-4 w-4 mr-2 align-text-bottom" />
              Tele-MANAS 14416 (India)
            </a>
          </div>

          <div>
            <h3 className="footer__list-title">Explore</h3>
            <ul className="footer__links">
              <li><Link to="/dashboard" className="footer__link">Dashboard</Link></li>
              <li><Link to="/chat" className="footer__link">AI Support</Link></li>
              <li><Link to="/mood" className="footer__link">Mood Tracker</Link></li>
              <li><Link to="/resources" className="footer__link">Resource Library</Link></li>
              <li><Link to="/crisis" className="footer__link">Crisis Help</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer__list-title">Support</h3>
            <ul className="footer__links">
              <li><Link to="/help" className="footer__link">Help Center</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
              <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer__link">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="footer__link">Accessibility</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer__emergency">
              <h4 className="footer__list-title">In crisis right now?</h4>
              <p>If you or someone close is in immediate danger, please reach out to emergency services:</p>
              <div className="footer__emergency-actions">
                <a href="tel:14416" className="footer__emergency-link">
                  <Phone className="h-4 w-4" />
                  <span>Tele-MANAS 14416</span>
                </a>
                <a href="tel:112" className="footer__emergency-link">
                  <Phone className="h-4 w-4" />
                  <span>Dial 112</span>
                </a>
                <a
                  href="https://suicidepreventionlifeline.org/chat/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer__emergency-link"
                >
                  <Mail className="h-4 w-4" />
                  <span>Chat support</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} MindCure. We provide wellness guidance and resource connections but are not a replacement for
            licensed medical care.
          </p>
          <div className="flex gap-6 justify-center">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;