import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Headphones,
  Heart,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Users,
  BookOpen,
  Smile,
  Calendar,
  Trophy,
  Star,
  Zap,
  Target,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Therapy Chat',
    description: 'Talk to our empathetic AI companion anytime. Get instant support, coping strategies, and a safe space to express yourself.',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
  },
  {
    icon: Smile,
    title: 'Mood Tracking',
    description: 'Log your emotions daily and discover patterns. Beautiful visualizations help you understand your mental wellness journey.',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)'
  },
  {
    icon: Users,
    title: 'Support Circle',
    description: 'Connect with friends who care. Share your journey, send encouragement, and build a supportive community.',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
  },
  {
    icon: Calendar,
    title: 'Book Counselors',
    description: 'Schedule sessions with professional counselors. Get expert guidance when you need human support.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
  },
  {
    icon: Trophy,
    title: 'Achievements & XP',
    description: 'Stay motivated with gamified wellness. Earn badges, track streaks, and celebrate your mental health wins.',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },
  {
    icon: BookOpen,
    title: 'Self-Help Resources',
    description: 'Access guided exercises, breathing techniques, and educational content curated by mental health experts.',
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)'
  }
];

const testimonials = [
  {
    quote: "MindCure helped me through my toughest semester. The AI chat feels like talking to a friend who truly understands.",
    author: "Priya S.",
    role: "Engineering Student",
    avatar: "🎓"
  },
  {
    quote: "I love tracking my mood daily. Seeing my progress over weeks gave me hope and motivation to keep going.",
    author: "Rahul M.",
    role: "Medical Student",
    avatar: "💪"
  },
  {
    quote: "The crisis resources are a lifesaver. Knowing help is just one tap away gives me so much peace of mind.",
    author: "Ananya K.",
    role: "Arts Student",
    avatar: "🌟"
  }
];

const chatScenarios = [
  {
    user: "I've been feeling overwhelmed with exams lately...",
    ai: "I hear you. Exam stress is really tough. Let's take a moment together. Would you like to try a quick breathing exercise?"
  },
  {
    user: "I just feel so anxious all the time.",
    ai: "It takes courage to share that. Anxiety can be heavy. I'm here to listen. What does that anxiety feel like for you right now?"
  },
  {
    user: "I'm having trouble sleeping.",
    ai: "Sleep is so important for your mind. We have some calming sleep stories and meditation guides. Shall we explore them?"
  }
];

const LandingPage = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(true);

  // Chat animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setShowAiResponse(false);
      
      setTimeout(() => {
        setActiveScenario((prev) => (prev + 1) % chatScenarios.length);
        setIsTyping(false);
        setTimeout(() => setShowAiResponse(true), 300);
      }, 1500);
      
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
          <div className="hero-gradient-3"></div>
          <div className="hero-gradient-4"></div>
        </div>
        
        <div className="layout-container">
          <div className="hero-content reveal-on-scroll">
            <div className="hero-badge">
              <Sparkles className="h-4 w-4" />
              <span>Your Mental Wellness Companion</span>
            </div>
            
            <h1 className="hero-title">
              Take care of your
              <span className="hero-title-gradient"> mind</span>,
              <br />
              one day at a time
            </h1>
            
            <p className="hero-subtitle">
              MindCure provides 24/7 AI-powered mental health support, mood tracking, 
              and connection with peers who understand. You're never alone.
            </p>
            
            <div className="hero-actions">
              <Link to="/register" className="hero-btn hero-btn--primary">
                <Sparkles className="h-5 w-5" />
                <span>Start Free Today</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/chat" className="hero-btn hero-btn--secondary">
                <MessageCircle className="h-5 w-5" />
                <span>Try AI Chat</span>
              </Link>
            </div>
            
            <div className="hero-trust">
              <div className="hero-trust-avatars">
                <span>😊</span>
                <span>🎓</span>
                <span>💪</span>
                <span>🌟</span>
              </div>
              <p>Trusted by <strong>10,000+</strong> students worldwide</p>
            </div>
          </div>
          
          <div className="hero-visual reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="hero-card hero-card--main">
              <div className="hero-card-header">
                <div className="hero-card-avatar">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <strong>MindCure AI</strong>
                  <span>Online • Ready to help</span>
                </div>
              </div>
              
              <div className="hero-chat-container">
                <div key={`user-${activeScenario}`} className="hero-chat-bubble hero-chat-bubble--user animate-pop-in">
                  {chatScenarios[activeScenario].user}
                </div>
                
                {isTyping && (
                  <div className="hero-card-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                
                {!isTyping && showAiResponse && (
                  <div key={`ai-${activeScenario}`} className="hero-chat-bubble hero-chat-bubble--ai animate-pop-in">
                    {chatScenarios[activeScenario].ai}
                  </div>
                )}
              </div>
            </div>
            
            <div className="hero-card hero-card--mood animate-float-delayed">
              <div className="hero-card-mood-header">
                <Smile className="h-5 w-5" />
                <span>Today's Mood</span>
              </div>
              <div className="hero-mood-emoji">😊</div>
              <div className="hero-mood-label">Feeling Good</div>
              <div className="hero-mood-streak">
                <Zap className="h-4 w-4" />
                <span>7 day streak!</span>
              </div>
            </div>
            
            <div className="hero-card hero-card--achievement animate-float">
              <Trophy className="h-5 w-5" />
              <span>+50 XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="layout-container">
          <div className="section-header reveal-on-scroll">
            <span className="section-badge">
              <Star className="h-4 w-4" />
              Features
            </span>
            <h2 className="section-title">
              Everything you need for
              <span> mental wellness</span>
            </h2>
            <p className="section-subtitle">
              Comprehensive tools designed with care to support every aspect of your mental health journey
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="feature-card reveal-on-scroll"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="feature-icon" style={{ background: feature.gradient }}>
                    <FeatureIcon className="h-6 w-6" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-link">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="layout-container">
          <div className="section-header reveal-on-scroll">
            <span className="section-badge section-badge--alt">
              <Target className="h-4 w-4" />
              How It Works
            </span>
            <h2 className="section-title">
              Start feeling better in
              <span> 3 simple steps</span>
            </h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card reveal-on-scroll" style={{ transitionDelay: '0s' }}>
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Space</h3>
                <p>Sign up in seconds and personalize your wellness dashboard. Set your goals and preferences.</p>
              </div>
              <div className="step-visual">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            
            <div className="step-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Connect & Explore</h3>
                <p>Chat with AI, track your mood, join support circles, and access self-help resources anytime.</p>
              </div>
              <div className="step-visual">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            
            <div className="step-card reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Grow Every Day</h3>
                <p>Build healthy habits, earn achievements, and watch your mental wellness improve over time.</p>
              </div>
              <div className="step-visual">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="layout-container">
          <div className="section-header reveal-on-scroll">
            <span className="section-badge">
              <Heart className="h-4 w-4" />
              Stories
            </span>
            <h2 className="section-title">
              Loved by students
              <span> everywhere</span>
            </h2>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card reveal-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <div className="testimonial-quote">"{testimonial.quote}"</div>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{testimonial.avatar}</span>
                  <div>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-bg">
          <div className="cta-gradient-1"></div>
          <div className="cta-gradient-2"></div>
          <div className="cta-gradient-3"></div>
        </div>
        
        <div className="layout-container">
          <div className="cta-content">
            <h2>Ready to prioritize your mental health?</h2>
            <p>Join thousands of students who are taking care of their minds with MindCure. It's free, private, and always here for you.</p>
            
            <div className="cta-actions">
              <Link to="/register" className="cta-btn cta-btn--primary">
                <Sparkles className="h-5 w-5" />
                <span>Get Started Free</span>
              </Link>
              <Link to="/crisis" className="cta-btn cta-btn--secondary">
                <Phone className="h-5 w-5" />
                <span>Crisis Support</span>
              </Link>
            </div>
            
            <div className="cta-crisis-info">
              <Phone className="h-4 w-4" />
              <span>Need immediate help? Call <strong>14416</strong> (Tele-MANAS) or <strong>112</strong> (Emergency)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
