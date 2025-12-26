import { Link } from 'react-router-dom';
import { Heart, Phone, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const team = [
    { name: 'Prashant Singh', github: 'https://github.com/lullucoder', linkedin: 'https://www.linkedin.com/in/prashant-singh-z/' },
    { name: 'Sahithi Sritha', github: 'https://github.com/Sahithi-Sritha', linkedin: 'https://www.linkedin.com/in/sahithi-sritha-1z/' },
    { name: 'Amit Agarwal', github: 'https://github.com/amanagarwal0602', linkedin: 'https://www.linkedin.com/in/amit-agarwal-7a14a9202/' },
  ];

  return (
    <footer className="footer">
      <div className="layout-container footer__content">
        {/* Team Section - Highlighted */}
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '1.5rem'
        }}>
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            Made with <Heart className="h-5 w-5" style={{ color: '#ef4444', fill: '#ef4444' }} /> by
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '1rem'
          }}>
            {team.map((member, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '2rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{member.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {member.github && (
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        color: 'inherit', 
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                      }} 
                      title="GitHub"
                      onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                      onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: '#0077b5' }} 
                      title="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          opacity: 0.8
        }}>
          <p>© {year} MindCure — A Student Project</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Crisis:</span>
            <a href="tel:14416" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'inherit' }}>
              <Phone className="h-3 w-3" /> 14416
            </a>
            <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'inherit' }}>
              <Phone className="h-3 w-3" /> 112
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;