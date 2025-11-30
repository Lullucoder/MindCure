import Navbar from './Navbar';
import Footer from './Footer';
import CrisisRibbon from './CrisisRibbon';
import BottomNav from './BottomNav';

const Layout = ({ children, showFooter = true, showCrisisRibbon = true }) => {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app-shell__backdrop" aria-hidden="true" />

      <Navbar />
      {showCrisisRibbon && <CrisisRibbon />}

      <main id="main-content" role="main" className="app-shell__content">
        {children}
      </main>

      {showFooter && <Footer />}
      <BottomNav />
    </div>
  );
};

export default Layout;