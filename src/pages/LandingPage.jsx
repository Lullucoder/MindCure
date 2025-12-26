import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
  BookOpen,
  Smile,
  Calendar,
  Trophy,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chat',
    description: 'Talk anytime, get support instantly.',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
  },
  {
    icon: Smile,
    title: 'Mood Tracking',
    description: 'Log feelings, spot patterns.',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)'
  },
  {
    icon: Users,
    title: 'Support Circle',
    description: 'Connect with friends who care.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
  },
  {
    icon: Calendar,
    title: 'Book Counselors',
    description: 'Schedule sessions with real counselors.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Earn XP, track streaks.',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
  },
  {
    icon: BookOpen,
    title: 'Resources',
    description: 'Breathing exercises, guides & more.',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)'
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
    <div className="landing-page min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="hero-bg absolute inset-0 z-0">
          <div className="hero-gradient-1"></div>
          <div className="hero-gradient-2"></div>
          <div className="hero-gradient-3"></div>
          <div className="hero-gradient-4"></div>
        </div>
        
        <div className="layout-container relative z-10">
          <div className="hero-content reveal-on-scroll">
            <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Your Mental Wellness Companion</span>
            </div>
            
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              Breathe, check in, feel better,
              <br />
              <span className="hero-title-gradient text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-500">bit by bit</span>
            </h1>
            
            <p className="hero-subtitle text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
              MindCure gives you simple tools to check in, talk to someone (AI or human), and find support when you need it.
            </p>
            
            <div className="hero-actions flex flex-wrap gap-4">
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
          </div>
          
          <div className="hero-visual reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="hero-card hero-card--main bg-white rounded-2xl shadow-xl border border-slate-100 p-4 max-w-md mx-auto relative z-20">
              <div className="hero-card-header flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="hero-card-avatar w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <strong className="block text-slate-900">MindCure AI</strong>
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Online • Ready to help
                  </span>
                </div>
              </div>
              
              <div className="hero-chat-container space-y-3">
                <div key={`user-${activeScenario}`} className="hero-chat-bubble hero-chat-bubble--user animate-pop-in bg-sky-500 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-sm">
                  {chatScenarios[activeScenario].user}
                </div>
                
                {isTyping && (
                  <div className="hero-card-typing bg-slate-100 p-3 rounded-2xl rounded-tl-none w-fit">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}
                
                {!isTyping && showAiResponse && (
                  <div key={`ai-${activeScenario}`} className="hero-chat-bubble hero-chat-bubble--ai animate-pop-in bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm">
                    {chatScenarios[activeScenario].ai}
                  </div>
                )}
              </div>
            </div>
            
            <div className="hero-card hero-card--mood animate-float-delayed absolute -right-16 lg:-right-24 top-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 hidden md:block z-30">
              <div className="hero-card-mood-header flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                <Smile className="h-4 w-4" />
                <span>Today's Mood</span>
              </div>
              <div className="hero-mood-emoji text-2xl mb-1">😊</div>
              <div className="hero-mood-label text-sm font-bold text-slate-900">Feeling Good</div>
              <div className="hero-mood-streak flex items-center gap-1 text-xs text-orange-500 font-medium mt-1">
                <Zap className="h-3 w-3" />
                <span>7 day streak!</span>
              </div>
            </div>
            
            <div className="hero-card hero-card--achievement animate-float absolute -left-16 lg:-left-24 bottom-16 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 hidden md:flex z-30">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Trophy className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900">+50 XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="layout-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What you get
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple tools to track feelings, chat safely, and find help when you need it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="group flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 transition-all duration-300 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 cursor-default"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ background: feature.gradient }}
                  >
                    <FeatureIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section className="py-24 bg-white">
        <div className="layout-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
            Get started in 3 steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { num: '1', title: 'Sign Up', desc: 'Create your private space' },
              { num: '2', title: 'Explore', desc: 'Chat, track mood, find resources' },
              { num: '3', title: 'Grow', desc: 'Build habits, see progress' }
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                {i !== 2 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-slate-100 -z-10 transform translate-x-1/2"></div>
                )}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-sky-500/20 transform transition-transform hover:scale-110 duration-300">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-24 px-4 bg-gradient-to-br from-sky-500 to-violet-600 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-lg text-sky-100 mb-8">
            Free, private, and here when you need it.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-xl font-bold text-lg hover:bg-sky-50 transition-all shadow-lg shadow-black/10 transform hover:-translate-y-1"
            >
              <Sparkles className="h-5 w-5" />
              Get Started Free
            </Link>
            <Link 
              to="/crisis" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
            >
              <Phone className="h-5 w-5" />
              Crisis Support
            </Link>
          </div>
          <p className="mt-8 text-sm text-sky-100/80">
            Need help now? Call <strong className="text-white">14416</strong> (Tele-MANAS) or <strong className="text-white">112</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
