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
  Check
} from 'lucide-react';

const CrisisIntervention = ({ onClose }) => {
  const [currentSection, setCurrentSection] = useState('immediate');
  const [copiedNumber, setCopiedNumber] = useState(null);

  const crisisResources = {
    immediate: [
      {
        name: 'Tele-MANAS (Govt. of India)',
        number: '14416',
        description: '24/7 toll-free mental health support across India (alternate: 1-800-891-4416)',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Hindi', 'Regional languages'],
        availability: '24/7'
      },
      {
        name: 'KIRAN Mental Health Helpline',
        number: '1800-599-0019',
        description: '24/7 mental health and rehabilitation support (MoSJE/NIMHANS)',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Hindi', '13+ Indian languages'],
        availability: '24/7'
      },
      {
        name: 'CHILDLINE',
        number: '1098',
        description: 'Emergency assistance for children and adolescents',
        type: 'call',
        priority: 'high',
        languages: ['Multiple Indian languages'],
        availability: '24/7'
      },
      {
        name: 'Women Helpline',
        number: '181',
        description: 'Support for women in distress, including domestic violence',
        type: 'call',
        priority: 'high',
        languages: ['Multiple Indian languages'],
        availability: '24/7'
      },
      {
        name: 'AASRA',
        number: '9820466726',
        description: 'Suicide prevention and crisis support (NGO)',
        type: 'call',
        priority: 'high',
        languages: ['English', 'Hindi', 'Marathi'],
        availability: '24/7'
      },
      {
        name: 'iCALL (TISS)',
        number: '9152987821',
        description: 'Professional counselling support via phone and online',
        type: 'call',
        priority: 'medium',
        languages: ['English', 'Hindi'],
        availability: 'Mon–Sat, 8am–10pm IST'
      }
    ],
    local: [
      {
        name: 'Emergency Services (Police/Fire/Ambulance)',
        number: '112',
        description: 'Unified emergency response across India',
        type: 'emergency',
        priority: 'critical'
      },
      {
        name: 'District Mental Health Programme (DMHP)',
        number: 'Find local DMHP center',
        description: 'Government mental health services in your district',
        type: 'location',
        priority: 'medium'
      },
      {
        name: 'Government Hospital Psychiatry Dept.',
        number: 'Nearest Govt. Hospital',
        description: 'Emergency psychiatric evaluation and care',
        type: 'location',
        priority: 'high'
      }
    ],
    online: [
      {
        name: 'Tele-MANAS Portal',
        url: 'https://telemanas.mohfw.gov.in',
        description: 'Official portal for India’s national mental health helpline',
        type: 'website',
        availability: '24/7'
      },
      {
        name: 'iCALL Online Counselling',
        url: 'https://icallhelpline.org',
        description: 'Information and access to counselling via phone, email, and chat',
        type: 'website',
        availability: 'Service hours apply'
      },
      {
        name: 'CHILDLINE India',
        url: 'https://childlineindia.org',
        description: 'Support and protection services for children (1098)',
        type: 'website',
        availability: 'Always'
      },
      {
        name: 'UNICEF – Mental Health Resources',
        url: 'https://www.unicef.org/mental-health',
        description: 'Information and resources for young people and caregivers',
        type: 'website',
        availability: 'Always'
      }
    ]
  };

  const copingStrategies = [
    {
      title: 'Grounding Techniques',
      icon: <Shield className="h-5 w-5" />,
      techniques: [
        '5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        'Hold an ice cube or splash cold water on your face',
        'Focus on your breathing - slow, deep breaths',
        'Squeeze and release your fists repeatedly'
      ]
    },
    {
      title: 'Immediate Safety',
      icon: <Heart className="h-5 w-5" />,
      techniques: [
        'Remove means of self-harm from your environment',
        'Stay with trusted friends or family',
        'Avoid alcohol and drugs',
        'Create a safety plan with specific steps'
      ]
    },
    {
      title: 'Reach Out',
      icon: <Users className="h-5 w-5" />,
      techniques: [
        'Call a trusted friend or family member',
        'Contact your therapist or doctor',
        'Go to a public place where people are around',
        'Use crisis hotlines - they are there to help'
      ]
    }
  ];

  const warningSignsData = {
    immediate: [
      'Thoughts of suicide or self-harm',
      'Specific plans to hurt yourself or others',
      'Feeling trapped with no way out',
      'Extreme mood swings',
      'Loss of interest in everything',
      'Feeling like a burden to others'
    ],
    concerning: [
      'Persistent sadness or hopelessness',
      'Significant changes in sleep or appetite',
      'Withdrawal from friends and activities',
      'Increased substance use',
      'Reckless behavior',
      'Difficulty concentrating'
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
    // Keep numbers as provided for India context
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Crisis Support</h1>
                <p className="text-red-100">Immediate help and resources</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-700 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          {/* Emergency Banner */}
          <div className="mt-6 bg-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-300" />
              <div>
                <h3 className="font-semibold">If you're in immediate danger:</h3>
                <p className="text-red-100 text-sm">Call 112 (India Emergency Services) or go to the nearest hospital emergency department</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
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
        <div className="p-6">
          {/* Crisis Hotlines */}
          {currentSection === 'immediate' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">24/7 Crisis Hotlines</h2>
                <p className="text-gray-600 mb-6">
                  These resources provide immediate support and are available 24 hours a day, 7 days a week.
                </p>
              </div>

              <div className="grid gap-4">
                {crisisResources.immediate.map((resource, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${getPriorityColor(resource.priority)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
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

                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPhoneNumber(resource.number)}</div>
                        </div>
                        
                        {resource.type === 'call' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => copyToClipboard(resource.number, index)}
                              className="p-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                              title="Copy number"
                            >
                              {copiedNumber === index ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-600" />
                              )}
                            </button>
                            <a
                              href={`tel:${resource.number}`}
                              className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg font-semibold transition-colors"
                            >
                              Call Now
                            </a>
                          </div>
                        )}

                        {resource.type === 'text' && (
                          <a
<<<<<<< HEAD
                            href={`sms:741741?body=HOME`}
                            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold transition-colors"
=======
                            href={`tel:1800-599-0019`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
                          >
                            Call Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Online Resources */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Support</h3>
                <div className="grid gap-3">
                  {crisisResources.online.map((resource, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{resource.name}</h4>
                            <p className="text-gray-600 text-sm">{resource.description}</p>
                          </div>
                        </div>
                        
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
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

          {/* Local Resources */}
          {currentSection === 'local' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Local Emergency Resources</h2>
                <p className="text-gray-600 mb-6">
                  Find immediate help in your area for crisis situations.
                </p>
              </div>

              <div className="grid gap-4">
                {crisisResources.local.map((resource, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${getPriorityColor(resource.priority)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                          <p className="text-gray-600 text-sm">{resource.description}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {resource.type === 'emergency' ? (
                          <a
<<<<<<< HEAD
                            href="tel:911"
                            className="px-6 py-3 bg-red-800 hover:bg-red-900 text-white rounded-lg font-bold transition-colors"
=======
                            href="tel:112"
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
                          >
                            Call 112
                          </a>
                        ) : resource.type === 'location' ? (
                          <button className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold transition-colors flex items-center">
                            <Navigation className="h-4 w-4 mr-2" />
                            Find Nearby
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                            Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Plan */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Creating Your Emergency Plan
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Identify your nearest hospital with psychiatric services</p>
                  <p>• Know your insurance information and have it readily available</p>
                  <p>• Keep important phone numbers saved in your phone</p>
                  <p>• Have a trusted person who can accompany you if needed</p>
                  <p>• Consider transportation options to emergency services</p>
                </div>
              </div>
            </div>
          )}

          {/* Coping Strategies */}
          {currentSection === 'coping' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Immediate Coping Strategies</h2>
                <p className="text-gray-600 mb-6">
                  These techniques can help you manage Crisis moments and stay safe.
                </p>
              </div>

              <div className="grid gap-6">
                {copingStrategies.map((strategy, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-primary-100 rounded-lg mr-3">
                        {strategy.icon}
                      </div>
                      {strategy.title}
                    </h3>
                    
                    <div className="space-y-3">
                      {strategy.techniques.map((technique, techIndex) => (
                        <div key={techIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-700">{technique}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Safety Planning */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Create a Safety Plan
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Step 1: Recognize Warning Signs</h4>
                    <p className="text-gray-700 text-sm">List thoughts, feelings, or situations that indicate you might be in crisis.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Step 2: Internal Coping Strategies</h4>
                    <p className="text-gray-700 text-sm">Activities you can do alone to distract yourself and feel better.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Step 3: People and Social Settings</h4>
                    <p className="text-gray-700 text-sm">Trusted friends, family, or places that can provide support and distraction.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Step 4: Professional Contacts</h4>
                    <p className="text-gray-700 text-sm">Mental health professionals, doctors, and crisis hotlines.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Step 5: Making the Environment Safe</h4>
                    <p className="text-gray-700 text-sm">Remove or restrict access to means of self-harm.</p>
                  </div>
                </div>
                
                <button className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  Download Safety Plan Template
                </button>
              </div>
            </div>
          )}

          {/* Warning Signs */}
          {currentSection === 'warning' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recognizing Warning Signs</h2>
                <p className="text-gray-600 mb-6">
                  Learn to identify signs that may indicate you or someone you know needs immediate help.
                </p>
              </div>

              <div className="grid gap-6">
                {/* Immediate Warning Signs */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Immediate Warning Signs - Seek Help Now
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {warningSignsData.immediate.map((sign, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-red-800">{sign}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <p className="text-red-800 font-medium text-sm">
                      If you or someone you know shows these signs, seek immediate professional help or call a Crisis hotline.
                    </p>
                  </div>
                </div>

                {/* Concerning Warning Signs */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Concerning Signs - Consider Professional Support
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {warningSignsData.concerning.map((sign, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-yellow-800">{sign}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-yellow-800 font-medium text-sm">
                      These signs may indicate developing mental health concerns. Consider speaking with a mental health professional.
                    </p>
                  </div>
                </div>

                {/* Helping Others */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    How to Help Someone in Crisis
                  </h3>
                  
                  <div className="space-y-3 text-blue-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Listen without judgment and take their concerns seriously</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Stay calm and ask directly about suicide if you're concerned</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Don't leave them alone if you believe they're in immediate danger</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Help them connect with professional support or Crisis resources</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Follow up with them after the Crisis has passed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Remember: You are not alone. Help is available 24/7.
            </div>
            
            <div className="flex space-x-3">
              <a
<<<<<<< HEAD
                href="tel:988"
                className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg font-semibold transition-colors"
=======
                href="tel:14416"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
>>>>>>> 20153298be3676599bf26e94d1eddf7a529ee6dd
              >
                Call 14416
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisIntervention;