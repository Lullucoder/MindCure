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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-lavender-50 to-green-50 pt-20 pb-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-800">Mental Health</span>
                <span className="text-xl text-gray-600 font-medium">SUPPORT PLATFORM</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Mental Health Support
                <span className="block text-4xl md:text-5xl text-gray-600">Platform for Students</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                A safe, calming space for students to access mental health resources and find peace of mind
              </p>
              
              <div className="mb-12">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-200 hover:to-blue-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>

              {/* Crisis Banner */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-lg">
                <div className="flex items-center space-x-2 text-red-600">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium text-sm">
                    Crisis Support: Call 988 (Suicide & Crisis Lifeline) for immediate help
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Calming Illustration */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Main illustration container with softer colors */}
                <div className="relative bg-gradient-to-br from-blue-300 to-green-300 rounded-3xl p-8 transform rotate-2 shadow-xl">
                  <div className="bg-white rounded-2xl p-6 transform -rotate-2">
                    {/* Peaceful person illustration */}
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-green-200 rounded-full mx-auto mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-300 opacity-30"></div>
                      {/* Serene face */}
                      <div className="absolute top-8 left-8 w-16 h-16 bg-blue-300 rounded-full"></div>
                      {/* Peaceful expression elements */}
                      <div className="absolute top-12 left-12 w-2 h-1 bg-blue-500 rounded-full"></div>
                      <div className="absolute top-12 right-12 w-2 h-1 bg-blue-500 rounded-full"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    {/* Meditation/laptop hybrid */}
                    <div className="w-24 h-16 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg mx-auto relative">
                      <div className="w-20 h-12 bg-gradient-to-r from-green-300 to-blue-300 rounded-sm mx-auto mt-2"></div>
                      <div className="w-24 h-2 bg-gradient-to-r from-green-200 to-blue-200 rounded-b"></div>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
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
                    <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
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
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-300">
              <Brain className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Insights</h4>
              <p className="text-sm text-gray-600">Smart recommendations for your wellness</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300">
              <Shield className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">Your data is secure and confidential</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300">
              <Clock className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">Help when you need it most</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-md transition-all duration-300">
              <Headphones className="h-10 w-10 text-pink-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Expert Care</h4>
              <p className="text-sm text-gray-600">Licensed professionals oversight</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-teal-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your free account and complete a brief wellness assessment to get personalized recommendations
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                {/* Connecting line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with our AI assistant, track your mood, discover resources, and connect with peer support groups
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
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
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"> Wellness Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who are taking charge of their mental health. 
              Get instant access to professional support, peer communities, and personalized resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                to="/dashboard"
                className="group bg-gradient-to-r from-teal-500 to-teal-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl inline-flex items-center"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;