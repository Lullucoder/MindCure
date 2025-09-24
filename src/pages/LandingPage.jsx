import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  Shield, 
  Users, 
  Clock, 
  Award,
  ArrowRight,
  CheckCircle,
  Phone,
  Sparkles,
  Brain,
  Headphones
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Virtual Counseling & Therapy',
      description: 'Book private or group sessions with professional counselors',
      color: 'from-purple-300 via-pink-300 to-indigo-300'
    },
    {
      icon: BookOpen,
      title: 'Self-Help Library',
      description: 'Access resources on mindfulness, stress, and more',
      color: 'from-pink-300 via-purple-300 to-indigo-300'
    },
    {
      icon: Users,
      title: 'Peer Support Groups',
      description: 'Join safe, moderated forums to share and connect.',
      color: 'from-indigo-300 via-purple-300 to-pink-300'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students Supported' },
    { number: '24/7', label: 'Available Support' },
    { number: '95%', label: 'User Satisfaction' },
    { number: '500+', label: 'Resources Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Enhanced Soft Lavender Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-200/40 to-purple-200/30 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-lavender-200/20 to-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-bl from-pink-200/30 to-purple-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-32 right-1/4 w-48 h-48 bg-gradient-to-tr from-indigo-200/30 to-lavender-200/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/30">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">MindCure</span>
                <span className="text-xl text-purple-600 font-medium">THERAPY PLATFORM</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Your Journey to 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600">Better Mental Health</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                Access personalized AI therapy, crisis support, and mental wellness tools - all in one secure, compassionate platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-200/50"
                >
                  Start Your Journey
                </Link>
                <Link
                  to="/crisis"
                  className="inline-flex items-center justify-center border-2 border-pink-400 text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-50 hover:border-pink-500 hover:text-pink-700 transition-all duration-300 backdrop-blur-sm bg-white/20"
                >
                  Crisis Support
                </Link>
              </div>

              {/* Crisis Banner */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4 max-w-lg backdrop-blur-sm bg-white/30">
                <div className="flex items-center space-x-2 text-pink-700">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium text-sm">
                    Crisis Support (India): Call 14416 (Tele-MANAS) or 112 for immediate help
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Calming Illustration */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Main illustration container with soft lavender colors */}
                <div className="relative bg-gradient-to-br from-purple-300/80 via-pink-300/70 to-indigo-300/80 rounded-3xl p-8 transform rotate-2 shadow-xl shadow-purple-200/30 backdrop-blur-sm">
                  <div className="glass-card rounded-2xl p-6 transform -rotate-2">
                    {/* Peaceful person illustration */}
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-200/80 via-pink-200/70 to-indigo-200/80 rounded-full mx-auto mb-4 relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-300/40"></div>
                      {/* Serene face */}
                      <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-purple-300/80 to-pink-300/70 rounded-full"></div>
                      {/* Peaceful expression elements */}
                      <div className="absolute top-12 left-12 w-2 h-1 bg-purple-500 rounded-full"></div>
                      <div className="absolute top-12 right-12 w-2 h-1 bg-purple-500 rounded-full"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    {/* Meditation/laptop hybrid */}
                    <div className="w-24 h-16 bg-gradient-to-r from-purple-200/80 via-pink-200/70 to-indigo-200/80 rounded-lg mx-auto relative shadow-sm">
                      <div className="w-20 h-12 bg-gradient-to-r from-purple-300/80 via-pink-300/70 to-indigo-300/80 rounded-sm mx-auto mt-2"></div>
                      <div className="w-24 h-2 bg-gradient-to-r from-purple-200/60 to-indigo-200/60 rounded-b"></div>
                    </div>
                  </div>
                </div>

                {/* Gentle floating elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-200 rounded-full animate-bounce opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-200 rounded-full animate-bounce delay-1000 opacity-60"></div>
                <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-200 rounded-full animate-bounce delay-500 opacity-60"></div>
                
                {/* Additional calming elements */}
                <div className="absolute top-1/4 -left-6 w-4 h-4 bg-lavender-200 rounded-full animate-ping opacity-40"></div>
                <div className="absolute bottom-1/4 right-0 w-5 h-5 bg-sage-200 rounded-full animate-ping delay-700 opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of students who have found support and improved their mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="glass-card rounded-2xl p-6 group-hover:bg-white/30 transition-all duration-500 group-hover:scale-105 hover:shadow-lg hover:shadow-purple-200/30">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-purple-100 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/15 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-purple-200/15 rounded-full blur-xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for your mental wellness journey, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group relative">
                  {/* Card */}
                  <div className="glass-card rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 transform hover:-translate-y-2 border border-purple-100/50">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-200/30`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Learn more link */}
                    <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
                </div>
              );
            })}
          </div>

          {/* Additional features grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/60 rounded-xl hover:shadow-md hover:shadow-purple-200/30 transition-all duration-300 backdrop-blur-sm border border-purple-200/30">
              <Brain className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Insights</h4>
              <p className="text-sm text-gray-600">Smart recommendations for your wellness</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-pink-50/80 to-pink-100/60 rounded-xl hover:shadow-md hover:shadow-pink-200/30 transition-all duration-300 backdrop-blur-sm border border-pink-200/30">
              <Shield className="h-10 w-10 text-pink-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">Your data is secure and confidential</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50/80 to-indigo-100/60 rounded-xl hover:shadow-md hover:shadow-indigo-200/30 transition-all duration-300 backdrop-blur-sm border border-indigo-200/30">
              <Clock className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Help when you need it most</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-indigo-50/80 rounded-xl hover:shadow-md hover:shadow-purple-200/30 transition-all duration-300 backdrop-blur-sm border border-purple-200/30">
              <Headphones className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Expert Care</h4>
              <p className="text-sm text-gray-600">Licensed professionals oversight</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/20 to-pink-200/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-purple-200/10 rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start your mental wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-purple-200/30 group-hover:shadow-2xl group-hover:shadow-purple-300/40 transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your free account and complete a brief wellness assessment to get personalized recommendations
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-pink-200/30 group-hover:shadow-2xl group-hover:shadow-pink-300/40 transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-pink-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with our AI assistant, track your mood, discover resources, and connect with peer support groups
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200/30 group-hover:shadow-2xl group-hover:shadow-indigo-300/40 transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Grow</h3>
              <p className="text-gray-600 leading-relaxed">
                Build healthy habits, access professional counseling, and track your progress on your wellness journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30 relative overflow-hidden">
        {/* Enhanced Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tr from-indigo-500/30 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full filter blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"> Wellness Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who are taking charge of their mental health. 
              Get instant access to professional support, peer communities, and personalized resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/dashboard"
                className="group bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/30 inline-flex items-center"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:14416"
                className="group border-2 border-purple-300/60 text-purple-100 hover:bg-purple-300/10 hover:border-purple-300 hover:text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-200 inline-flex items-center backdrop-blur-sm"
              >
                <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                Need Help Now? Call 14416
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;