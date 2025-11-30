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
  BookOpen
} from 'lucide-react';

const heroShortcuts = [
  {
    to: '/chat',
    icon: MessageCircle,
    label: 'AI chat',
    gradient: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500))'
  },
  {
    to: '/mood',
    icon: Heart,
    label: 'Mood log',
    gradient: 'linear-gradient(135deg, var(--color-emerald-400), var(--color-emerald-500))'
  },
  {
    to: '/crisis',
    icon: Phone,
    label: 'Crisis help',
    gradient: 'linear-gradient(135deg, var(--color-coral-400), var(--color-coral-500))'
  }
];

const quickSteps = [
  {
    number: '01',
    title: 'Share your goals',
    description: 'Tell us how you are feeling and what a good day looks like so support feels personal.'
  },
  {
    number: '02',
    title: 'Try supportive tools',
    description: 'Chat with the AI guide, explore calming practices, or reach a counselor in minutes.'
  },
  {
    number: '03',
    title: 'Keep growing daily',
    description: 'Reflect, track your mood, and build restorative habits one gentle step at a time.'
  }
];

const trustStats = [
  { number: '10K+', label: 'Students supported' },
  { number: '24/7', label: 'Responsive care access' },
  { number: '95%', label: 'Feel calmer after check-ins' },
  { number: '500+', label: 'Curated wellness practices' }
];

const featureHighlights = [
  {
    icon: MessageCircle,
    title: 'Virtual counseling & therapy',
    description: 'AI-supported sessions with optional warm handoffs to licensed professionals when you need human care.',
    tone: 'primary',
    to: '/chat'
  },
  {
    icon: Users,
    title: 'Peer circles & moderated spaces',
    description: 'Join safe discussion rooms and journaling prompts that help you feel connected and seen.',
    tone: 'accent',
    to: '/dashboard'
  }
];

const supportPillars = [
  {
    icon: Brain,
    title: 'AI insights you can trust',
    description: 'Context-aware reflections grounded in CBT, DBT, and mindfulness research to help you move forward with clarity.',
    gradient: 'linear-gradient(135deg, var(--color-primary-400), var(--color-emerald-400))'
  },
  {
    icon: Shield,
    title: 'Privacy-first design',
    description: 'Encrypted conversations, transparent consent, and control over what you share at every step.',
    gradient: 'linear-gradient(135deg, var(--color-primary-400), var(--color-coral-400))'
  },
  {
    icon: Clock,
    title: 'Support that never sleeps',
    description: '24/7 responses, crisis escalation, and gentle nudges that respect your pace and boundaries.',
    gradient: 'linear-gradient(135deg, var(--color-emerald-400), var(--color-primary-400))'
  },
  {
    icon: Headphones,
    title: 'Human care network',
    description: 'Counselors, campus partners, and helplines ready for warm transfers whenever you want a human voice.',
    gradient: 'linear-gradient(135deg, var(--color-coral-400), var(--color-primary-400))'
  }
];

const heroGlows = [
  {
    top: '-32%',
    right: '-12%',
    width: '420px',
    height: '420px',
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.28), rgba(59, 130, 246, 0.22))'
  },
  {
    bottom: '-28%',
    left: '-16%',
    width: '360px',
    height: '360px',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22), rgba(59, 130, 246, 0.18))'
  }
];

const statsGlows = [
  {
    top: '-30%',
    left: '-12%',
    width: '320px',
    height: '320px',
    background: 'rgba(255, 255, 255, 0.32)'
  },
  {
    bottom: '-32%',
    right: '-10%',
    width: '360px',
    height: '360px',
    background: 'rgba(255, 255, 255, 0.22)'
  }
];

const ctaGlows = [
  {
    top: '-22%',
    left: '8%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.28), rgba(59, 130, 246, 0.18))'
  },
  {
    bottom: '-26%',
    right: '6%',
    width: '340px',
    height: '340px',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22), rgba(59, 130, 246, 0.16))'
  }
];

const toneGradient = (tone) => {
  if (tone === 'primary') {
    return 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-500))';
  }

  if (tone === 'secondary') {
    return 'linear-gradient(135deg, var(--color-emerald-400), var(--color-emerald-500))';
  }

  return 'linear-gradient(135deg, var(--color-coral-400), var(--color-coral-500))';
};

const LandingPage = () => {
<<<<<<< HEAD
  const features = [
    {
      icon: MessageCircle,
      title: 'Virtual Counseling & Therapy',
      description: 'Book private or group sessions with professional counselors',
      color: 'from-blue-200 to-blue-400'
    },
    {
      icon: BookOpen,
      title: 'Self-Help Library',
      description: 'Access resources on mindfulness, stress, and more',
      color: 'from-green-300 to-green-400'
    },
    {
      icon: Users,
      title: 'Peer Support Groups',
      description: 'Join safe, moderated forums to share and connect.',
      color: 'from-purple-300 to-purple-400'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students Supported' },
    { number: '24/7', label: 'Available Support' },
    { number: '95%', label: 'User Satisfaction' },
    { number: '500+', label: 'Resources Available' }
  ];

=======
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
  return (
    <div>
      <section className="landing-hero">
        <div className="landing-hero__background" aria-hidden="true">
          {heroGlows.map((glow, index) => (
            <span key={`hero-glow-${index}`} className="landing-hero__glow animate-float-soft" style={glow} />
          ))}
        </div>

        <div className="layout-container">
          <div className="landing-hero__grid">
            <div>
              <div className="landing-hero__badge">
                <span className="landing-hero__logo">
                  <Heart className="h-7 w-7" />
                </span>
                <div className="landing-hero__brand">
                  <span>MindCure</span>
                  <small>Therapy platform</small>
                </div>
              </div>

              <h1 className="landing-hero__title">
                Real support for the moments
                <span>you need it most</span>
              </h1>

              <p className="landing-hero__subtitle">
                Access compassionate AI guidance, crisis resources, and restorative practices that meet you exactly where you are.
              </p>
<<<<<<< HEAD
              
              <div className="mb-12">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-200 hover:to-blue-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
=======

              <div className="landing-hero__actions">
                <Link to="/chat" className="btn btn--primary">
                  <Sparkles className="h-5 w-5" />
                  <span>Start a guided session</span>
                </Link>
                <Link to="/mood" className="btn btn--alert">
                  <CheckCircle className="h-5 w-5" />
                  <span>Log a quick check-in</span>
                </Link>
                <Link to="/crisis" className="btn btn--outline-accent">
                  <Phone className="h-5 w-5" />
                  <span>Emergency contacts</span>
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
                </Link>
              </div>

              <div className="landing-shortcuts">
                {heroShortcuts.map((shortcut) => {
                  const ShortcutIcon = shortcut.icon;
                  return (
                    <Link key={shortcut.label} to={shortcut.to} className="landing-shortcut-card">
                      <span className="landing-shortcut-card__icon" style={{ background: shortcut.gradient }}>
                        <ShortcutIcon className="h-4 w-4" />
                      </span>
                      <span className="landing-shortcut-card__label">{shortcut.label}</span>
                    </Link>
                  );
                })}
              </div>

              <Link to="/crisis" className="landing-crisis">
                <span className="landing-crisis__icon">
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  Crisis support (India): Call <strong>14416</strong> (Tele-MANAS) or national emergency number <strong>112</strong> for immediate help.
                </span>
              </Link>
            </div>

            <div className="landing-hero__visual" aria-hidden="true">
              <div className="landing-hero__visual-outer">
                <div className="landing-hero__visual-panel">
                  <span className="landing-hero__visual-avatar">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <span className="landing-hero__bubble landing-hero__bubble--user">
                    “I cannot sleep and my mind keeps racing. I just need something that calms me down right now.”
                  </span>
                  <span className="landing-hero__bubble landing-hero__bubble--ai">
                    <strong>MindCure:</strong> I am with you. Let us slow the rush together with a two-minute breathing reset and a grounding exercise.
                  </span>
                  <div className="landing-hero__visual-meter">
                    <span />
                  </div>
                  <div className="landing-hero__badge">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <strong>Wellness streak</strong>
                      <div>3 gentle check-ins this week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-xl text-grey-100 max-w-2xl mx-auto">
              Join thousands of students who have found support and improved their mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-opacity-30 transition-all duration-500 group-hover:scale-105">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-black font-medium">{stat.label}</div>
                </div>
=======
      <section className="landing-steps">
        <div className="layout-container">
          <div className="landing-section-heading">
            <h2>How it works</h2>
            <p>Three simple steps to feel grounded, supported, and in control of your mental wellness journey.</p>
          </div>
          <div className="landing-steps__grid">
            {quickSteps.map((step) => (
              <div key={step.number} className="landing-step-card">
                <span className="landing-step-card__icon">
                  <span>{step.number}</span>
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-stats">
        <div className="landing-stats__background" aria-hidden="true">
          {statsGlows.map((glow, index) => (
            <span key={`stats-glow-${index}`} className="landing-stats__glow" style={glow} />
          ))}
        </div>
        <div className="layout-container">
          <div className="landing-section-heading landing-section-heading--light">
            <h2>Trusted by students worldwide</h2>
            <p>Join a compassionate community of learners who rely on MindCure for daily support, crisis help, and restorative routines.</p>
          </div>
          <div className="landing-stats__grid">
            {trustStats.map((stat) => (
              <div key={stat.label} className="landing-stat-card">
                <strong>{stat.number}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="layout-container">
          <div className="landing-section-heading">
            <h2>Comprehensive mental health support</h2>
            <p>Tools, people, and practices designed to meet the full spectrum of what you might need on any given day.</p>
          </div>
          <div className="landing-features__grid">
            {featureHighlights.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <article key={feature.title} className="landing-feature-card">
                  <span className="landing-feature-card__icon" style={{ background: toneGradient(feature.tone) }}>
                    <FeatureIcon className="h-7 w-7" />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={feature.to} className="landing-feature-card__cta">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="landing-pillar-grid">
            {supportPillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div key={pillar.title} className="landing-pillar-card">
                  <span className="landing-pillar-card__icon" style={{ background: pillar.gradient }}>
                    <PillarIcon className="h-5 w-5" />
                  </span>
                  <h4>{pillar.title}</h4>
                  <p>{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta__background" aria-hidden="true">
          {ctaGlows.map((glow, index) => (
            <span key={`cta-glow-${index}`} className="landing-cta__glow" style={glow} />
          ))}
        </div>
        <div className="layout-container">
          <div className="landing-cta__content">
            <h2 className="landing-cta__title">
              Ready to start your
              <span> wellness journey?</span>
            </h2>
            <p>
              We are here 24/7 with calm voices, science-backed practices, and crisis support whenever you need extra care.
            </p>
            <div className="landing-cta__actions">
              <Link to="/dashboard" className="btn btn--primary">
                <Sparkles className="h-5 w-5" />
                <span>Enter the app</span>
              </Link>
              <Link to="/crisis" className="btn btn--outline-accent">
                <Phone className="h-5 w-5" />
                <span>Get urgent help</span>
              </Link>
<<<<<<< HEAD
              <a
                href="tel:988"
                className="group border-2 border-white text-white hover:bg-white hover:text-gray-100 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-200 inline-flex items-center"
              >
                <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Need Help Now? Call 988
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-5 w-5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-5 w-5" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-5 w-5" />
                <span>Licensed Professionals</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <CheckCircle className="h-5 w-5" />
                <span>24/7 Crisis Support</span>
              </div>
=======
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;