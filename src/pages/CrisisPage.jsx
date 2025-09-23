import { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Heart, 
  Shield,
  Users,
  Zap,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CrisisPage = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('immediate');
  const [copiedNumber, setCopiedNumber] = useState(null);

  const crisisResources = {
    immediate: [
      {
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 crisis support and suicide prevention. Free, confidential support for people in distress.',
        type: 'call',
        priority: 'critical',
        languages: ['English', 'Spanish'],
        availability: '24/7'
      },
      {
        name: 'Crisis Text Line',
        number: 'Text HOME to 741741',
        description: 'Free 24/7 crisis support via text. Trained crisis counselors available immediately.',
        type: 'text',
        priority: 'critical',
        languages: ['English'],
        availability: '24/7'
      },
      {
        name: 'National Domestic Violence Hotline',
        number: '1-800-799-7233',
        description: 'Support for domestic violence situations. Safe, confidential support 24/7.',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Spanish', '200+ others'],
        availability: '24/7'
      },
      {
        name: 'SAMHSA National Helpline',
        number: '1-800-662-4357',
        description: 'Mental health and substance abuse support. Free, confidential, 24/7 treatment referral.',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Spanish'],
        availability: '24/7'
      },
      {
        name: 'LGBTQ National Hotline',
        number: '1-888-843-4564',
        description: 'Peer-support, education and local resource information for LGBTQ community.',
        type: 'call',
        priority: 'high',
        languages: ['English'],
        availability: '24/7'
      },
      {
        name: 'Veterans Crisis Line',
        number: '1-800-273-8255',
        description: 'Free, confidential support for veterans in crisis and their families.',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Spanish'],
        availability: '24/7'
      }
    ],
    local: [
      {
        name: 'Emergency Services',
        number: '911',
        description: 'Immediate emergency response for life-threatening situations',
        type: 'emergency',
        priority: 'critical'
      },
      {
        name: 'Local Crisis Center',
        number: 'Find Local Center',
        description: 'Community-based crisis intervention and mental health services',
        type: 'location',
        priority: 'high'
      },
      {
        name: 'Hospital Emergency Room',
        number: 'Nearest Hospital',
        description: 'Emergency psychiatric evaluation and immediate medical attention',
        type: 'location',
        priority: 'high'
      },
      {
        name: 'Mobile Crisis Team',
        number: 'Contact Local Services',
        description: 'On-location crisis response and de-escalation services',
        type: 'location',
        priority: 'high'
      }
    ],
    online: [
      {
        name: 'Crisis Chat',
        url: 'https://suicidepreventionlifeline.org/chat/',
        description: 'Online crisis support chat with trained counselors',
        type: 'chat',
        availability: '24/7'
      },
      {
        name: 'NAMI Support',
        url: 'https://nami.org/help',
        description: 'Mental health information, support groups, and resources',
        type: 'website',
        availability: 'Always'
      },
      {
        name: 'Mental Health America',
        url: 'https://www.mhanational.org/finding-help',
        description: 'Mental health resources, screening tools, and support finder',
        type: 'website',
        availability: 'Always'
      },
      {
        name: 'Crisis Text Line',
        url: 'https://www.crisistextline.org/',
        description: 'Text-based crisis support and mental health resources',
        type: 'website',
        availability: 'Always'
      }
    ]
  };

  const copingStrategies = [
    {
      title: 'Grounding Techniques',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-blue-50 border-blue-200',
      techniques: [
        '5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        'Hold an ice cube or splash cold water on your face',
        'Focus on your breathing - slow, deep breaths',
        'Squeeze and release your fists repeatedly',
        'Count backwards from 100 by 7s',
        'Name all the colors you can see around you'
      ]
    },
    {
      title: 'Immediate Safety',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-green-50 border-green-200',
      techniques: [
        'Remove means of self-harm from your environment',
        'Stay with trusted friends or family',
        'Avoid alcohol and drugs',
        'Create a safety plan with specific steps',
        'Call someone you trust immediately',
        'Go to a safe, public place'
      ]
    },
    {
      title: 'Reach Out',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-50 border-purple-200',
      techniques: [
        'Call a trusted friend or family member',
        'Contact your therapist or doctor',
        'Go to a public place where people are around',
        'Use crisis hotlines - they are there to help',
        'Text a crisis support line',
        'Join an online support chat'
      ]
    },
    {
      title: 'Calming Activities',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-pink-50 border-pink-200',
      techniques: [
        'Listen to calming music or nature sounds',
        'Practice progressive muscle relaxation',
        'Take a warm shower or bath',
        'Write in a journal about your feelings',
        'Do gentle stretching or yoga',
        'Pet an animal or hold a soft object'
      ]
    }
  ];

  const warningSignsData = {
    immediate: [
      'Thoughts of suicide or self-harm',
      'Specific plans to hurt yourself or others',
      'Feeling trapped with no way out',
      'Extreme mood swings or agitation',
      'Loss of interest in everything that used to matter',
      'Feeling like a burden to others',
      'Talking about wanting to die or disappear',
      'Giving away prized possessions',
      'Saying goodbye to loved ones unexpectedly'
    ],
    concerning: [
      'Persistent sadness or hopelessness',
      'Significant changes in sleep or appetite',
      'Withdrawal from friends and activities',
      'Increased substance use',
      'Reckless or risky behavior',
      'Difficulty concentrating or making decisions',
      'Feeling worthless or guilty',
      'Physical symptoms without clear cause',
      'Expressing feelings of being trapped or in unbearable pain'
    ],
    physical: [
      'Chronic fatigue or exhaustion',
      'Frequent headaches or body aches',
      'Changes in appetite or weight',
      'Sleep disturbances or insomnia',
      'Digestive issues or stomach problems',
      'Increased illness or infections'
    ]
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNumber(id);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatPhoneNumber = (number) => {
    if (number === '988') return '988';
    if (number.includes('741741')) return number;
    return number;
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'text':
        return <MessageCircle className="h-5 w-5" />;
      case 'location':
        return <MapPin className="h-5 w-5" />;
      case 'emergency':
        return <AlertTriangle className="h-5 w-5" />;
      case 'chat':
        return <MessageCircle className="h-5 w-5" />;
      case 'website':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-red-700 rounded-xl transition-colors mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold">Crisis Support</h1>
                  <p className="text-red-100 text-lg">Immediate help and resources when you need them most</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="mt-8 bg-red-700 rounded-2xl p-6 border border-red-600">
            <div className="flex items-center">
              <Zap className="h-8 w-8 mr-4 text-yellow-300" />
              <div>
                <h3 className="text-xl font-semibold">If you're in immediate danger:</h3>
                <p className="text-red-100 text-lg">Call 911 or go to your nearest emergency room immediately</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'immediate', label: 'Crisis Hotlines', icon: <Phone className="h-4 w-4" /> },
              { id: 'local', label: 'Local Resources', icon: <MapPin className="h-4 w-4" /> },
              { id: 'coping', label: 'Coping Strategies', icon: <Heart className="h-4 w-4" /> },
              { id: 'warning', label: 'Warning Signs', icon: <AlertTriangle className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  currentSection === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Crisis Hotlines */}
          {currentSection === 'immediate' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">24/7 Crisis Hotlines</h2>
                <p className="text-gray-600 mb-6 text-lg max-w-2xl mx-auto">
                  These resources provide immediate support and are available 24 hours a day, 7 days a week. 
                  You are not alone, and help is always available.
                </p>
              </div>

              <div className="grid gap-6">
                {crisisResources.immediate.map((resource, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-2xl p-6 ${getPriorityColor(resource.priority)} hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{resource.name}</h3>
                          <p className="text-gray-600 mb-3">{resource.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {resource.availability}
                            </div>
                            {resource.languages && (
                              <div className="text-gray-600">
                                Languages: {resource.languages.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-xl">{formatPhoneNumber(resource.number)}</div>
                        </div>
                        
                        {resource.type === 'call' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(resource.number, index)}
                              className="p-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                              title="Copy number"
                            >
                              {copiedNumber === index ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <Copy className="h-5 w-5 text-gray-600" />
                              )}
                            </button>
                            <a
                              href={`tel:${resource.number}`}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-lg"
                            >
                              Call Now
                            </a>
                          </div>
                        )}

                        {resource.type === 'text' && (
                          <a
                            href={`sms:741741?body=HOME`}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-lg"
                          >
                            Text Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Online Resources */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Online Support</h3>
                <div className="grid gap-4">
                  {crisisResources.online.map((resource, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{resource.name}</h4>
                            <p className="text-gray-600">{resource.description}</p>
                          </div>
                        </div>
                        
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
                        >
                          Visit Site
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other sections remain the same but with proper spacing for the page layout */}
          {currentSection === 'local' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Emergency Resources</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Find immediate help in your area for crisis situations.
                </p>
              </div>

              <div className="grid gap-6">
                {crisisResources.local.map((resource, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-6 ${getPriorityColor(resource.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{resource.name}</h3>
                          <p className="text-gray-600">{resource.description}</p>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        {resource.type === 'emergency' ? (
                          <a
                            href="tel:911"
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors"
                          >
                            Call 911
                          </a>
                        ) : resource.type === 'location' ? (
                          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center">
                            <Navigation className="h-5 w-5 mr-2" />
                            Find Nearby
                          </button>
                        ) : (
                          <button className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                            Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Plan */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-yellow-600" />
                  Creating Your Emergency Plan
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Identify your nearest hospital with psychiatric services</p>
                  <p>• Know your insurance information and have it readily available</p>
                  <p>• Keep important phone numbers saved in your phone</p>
                  <p>• Have a trusted person who can accompany you if needed</p>
                  <p>• Consider transportation options to emergency services</p>
                </div>
              </div>
            </div>
          )}

          {/* Coping Strategies and Warning Signs sections would follow the same pattern */}
          {currentSection === 'coping' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Immediate Coping Strategies</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  These techniques can help you manage crisis moments and stay safe.
                </p>
              </div>

              <div className="grid gap-8">
                {copingStrategies.map((strategy, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <div className="p-3 bg-primary-100 rounded-lg mr-4">
                        {strategy.icon}
                      </div>
                      {strategy.title}
                    </h3>
                    
                    <div className="space-y-4">
                      {strategy.techniques.map((technique, techIndex) => (
                        <div key={techIndex} className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-700 text-lg">{technique}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === 'warning' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recognizing Warning Signs</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Learn to identify signs that may indicate you or someone you know needs immediate help.
                </p>
              </div>

              <div className="grid gap-8">
                {/* Immediate Warning Signs */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    Immediate Warning Signs - Seek Help Now
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {warningSignsData.immediate.map((sign, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-red-800 text-lg">{sign}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-100 rounded-lg">
                    <p className="text-red-800 font-medium">
                      If you or someone you know shows these signs, seek immediate professional help or call a crisis hotline.
                    </p>
                  </div>
                </div>

                {/* Concerning Warning Signs */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-6 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3" />
                    Concerning Signs - Consider Professional Support
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {warningSignsData.concerning.map((sign, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-yellow-800 text-lg">{sign}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                    <p className="text-yellow-800 font-medium">
                      These signs may indicate developing mental health concerns. Consider speaking with a mental health professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrisisPage;