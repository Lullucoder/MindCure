import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, AlertTriangle, X } from 'lucide-react';

const CRISIS_RIBBON_DISMISSED_KEY = 'mindcure.crisisRibbon.dismissed';

const CrisisRibbon = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CRISIS_RIBBON_DISMISSED_KEY);
    if (stored === 'true') setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(CRISIS_RIBBON_DISMISSED_KEY, 'true');
  };

  if (dismissed) return null;

  return (
    <div aria-live="polite" className="crisis-banner">
      <div className="hidden md:block">
        <div className="layout-container">
          <div className="crisis-banner__surface">
            <div className="crisis-banner__message">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(249, 115, 22, 0.18)' }}>
                <AlertTriangle className="h-4 w-4" style={{ color: 'var(--color-coral-600)' }} />
              </span>
              <p>
                Need immediate help? Call <a className="text-accent" href="tel:14416">14416</a> (Tele-MANAS) or <a className="text-accent" href="tel:112">112</a>.
              </p>
            </div>
            <div className="crisis-banner__actions">
              <a href="tel:14416" className="hidden sm:inline-flex btn btn--secondary" aria-label="Call Tele-MANAS 14416">
                <Phone className="h-4 w-4" />
                <span>Call 14416</span>
              </a>
              <Link to="/crisis" className="btn btn--alert">
                <span>Get help now</span>
              </Link>
              <button type="button" aria-label="Dismiss crisis message" onClick={handleDismiss} className="navbar__mobile-toggle">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Link to="/crisis" aria-label="Crisis help" className="crisis-fab">
          <Phone className="h-5 w-5" />
          <span className="font-semibold">Crisis</span>
        </Link>
      </div>
    </div>
  );
};

export default CrisisRibbon;
