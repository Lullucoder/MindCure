import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Soft Lavender Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-100/20 to-pink-100/30"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200/15 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-purple-300/10 rounded-full blur-xl animate-float" style={{animationDelay: '0.5s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;