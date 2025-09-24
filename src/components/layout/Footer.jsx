import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">MindCare</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Supporting student mental health through AI-powered conversations, 
              mood tracking, and professional resources. Your mental wellness journey starts here.
            </p>
            <div className="flex space-x-4">
              <a href="tel:14416" className="flex items-center space-x-2 text-danger-400 hover:text-danger-300">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Tele-MANAS 14416</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/chat" className="text-gray-300 hover:text-white transition-colors">
                  AI Support
                </a>
              </li>
              <li>
                <a href="/mood" className="text-gray-300 hover:text-white transition-colors">
                  Mood Tracker
                </a>
              </li>
              <li>
                <a href="/resources" className="text-gray-300 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
              <li>
                <a href="/crisis" className="text-gray-300 hover:text-white transition-colors">
                  Crisis Help
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/accessibility" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="bg-danger-900 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-danger-100 mb-2">
              🚨 Mental Health Emergency
            </h4>
            <p className="text-danger-200 mb-3">
              If you're having thoughts of suicide or self-harm, please reach out immediately:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <a 
                href="tel:14416" 
                className="flex items-center justify-center space-x-2 bg-danger-600 hover:bg-danger-700 px-4 py-2 rounded transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>14416 (Tele-MANAS)</span>
              </a>
              <a 
                href="tel:112" 
                className="flex items-center justify-center space-x-2 bg-danger-600 hover:bg-danger-700 px-4 py-2 rounded transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>112 (Emergency)</span>
              </a>
              <a 
                href="https://suicidepreventionlifeline.org/chat/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-danger-600 hover:bg-danger-700 px-4 py-2 rounded transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Online Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MindCare. All rights reserved. 
            This platform provides mental health support but is not a substitute for professional medical care.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </a>
            <a href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;