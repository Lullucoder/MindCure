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
        name: 'Tele-MANAS (Govt. of India)',
        number: '14416',
        description: '24/7 toll-free mental health support across India (alternate: 1-800-891-4416)',
        type: 'call',
        priority: 'critical',
        languages: ['English', 'Hindi', 'Regional languages'],
        availability: '24/7'
      },
      {
        name: 'KIRAN Mental Health Helpline',
        number: '1800-599-0019',
        description: '24/7 mental health and rehabilitation support (MoSJE/NIMHANS)',
        type: 'call',
        priority: 'critical',
        languages: ['English', 'Hindi', '13+ Indian languages'],
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
        name: 'CHILDLINE',
        number: '1098',
        description: 'Emergency assistance for children and adolescents',
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
        priority: 'high',
        languages: ['English', 'Hindi'],
        availability: 'MonSat, 8am10pm IST'
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
        priority: 'high'
      },
      {
        name: 'Government Hospital Psychiatry Dept.',
        number: 'Nearest Govt. Hospital',
        description: 'Emergency psychiatric evaluation and care',
        type: 'location',
        priority: 'high'
      },
      {
        name: 'Community Health Center',
        number: 'Find local CHC',
        description: 'Primary healthcare centers with mental health support',
        type: 'location',
        priority: 'high'
      }
    ],
    online: [
      {
        name: 'Tele-MANAS Portal',
        url: 'https://telemanas.mohfw.gov.in',
        description: 'Official portal for India national mental health helpline',
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
        name: 'NIMHANS Helpline Resources',
        url: 'https://nimhans.ac.in',
        description: 'National Institute of Mental Health resources and support',
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
        'Contact local mental health services',
        'Join an online support community'
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
      'Extreme mood swings',
      'Loss of interest in everything',
      'Feeling like a burden to others',
      'Giving away possessions',
      'Saying goodbye to loved ones',
      'Sudden calmness after depression',
      'Increased use of alcohol or drugs'
    ],
    concerning: [
      'Persistent sadness or hopelessness',
      'Significant changes in sleep or appetite',
      'Withdrawal from friends and activities',
      'Increased substance use',
      'Reckless behavior',
      'Difficulty concentrating',
      'Feelings of worthlessness or guilt',
      'Physical complaints without clear cause',
      'Irritability or anger',
      'Loss of energy or motivation'
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
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-red-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center">
              <AlertTriangle className="h-10 w-10 mr-4" />
              <div>
                <h1 className="text-4xl font-bold">Crisis Support</h1>
                <p className="text-red-100 text-lg">Immediate help and resources available 24/7</p>
              </div>
            </div>
          </div>

          {/* Emergency Banner */}
          <div className="mt-8 bg-red-700 rounded-lg p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 mr-4 text-yellow-300" />
              <div>
                <h3 className="text-xl font-semibold mb-2">If you are in immediate danger:</h3>
                <p className="text-red-100 text-lg">Call 112 (India Emergency Services) or go to the nearest hospital emergency department</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'immediate', label: 'Crisis Hotlines', icon: <Phone className="h-4 w-4" /> },
              { id: 'local', label: 'Local Resources', icon: <MapPin className="h-4 w-4" /> },
              { id: 'coping', label: 'Coping Strategies', icon: <Heart className="h-4 w-4" /> },
              { id: 'warning', label: 'Warning Signs', icon: <AlertTriangle className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id)}
                className={`flex items-center space-x-2 py-6 border-b-2 font-medium text-sm transition-colors ${
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Crisis Hotlines */}
        {currentSection === 'immediate' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">24/7 Crisis Hotlines in India</h2>
              <p className="text-xl text-gray-600 mb-8">
                These resources provide immediate support and are available 24 hours a day, 7 days a week across India.
              </p>
            </div>

            <div className="grid gap-6">
              {crisisResources.immediate.map((resource, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 ${getPriorityColor(resource.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-white rounded-lg">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.name}</h3>
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
                        <div className="text-2xl font-bold">{formatPhoneNumber(resource.number)}</div>
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
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            Call Now
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Online Resources */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Online Support</h3>
              <div className="grid gap-4">
                {crisisResources.online.map((resource, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{resource.name}</h4>
                          <p className="text-gray-600">{resource.description}</p>
                        </div>
                      </div>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                      >
                        Visit Site
                        <ExternalLink className="h-5 w-5 ml-2" />
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
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Local Emergency Resources</h2>
              <p className="text-xl text-gray-600 mb-8">
                Find immediate help in your area for crisis situations.
              </p>
            </div>

            <div className="grid gap-6">
              {crisisResources.local.map((resource, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 ${getPriorityColor(resource.priority)}`}
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
                          href="tel:112"
                          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors"
                        >
                          Call 112
                        </a>
                      ) : resource.type === 'location' ? (
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center">
                          <Navigation className="h-5 w-5 mr-2" />
                          Find Nearby
                        </button>
                      ) : (
                        <button className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                          Contact
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Plan */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-yellow-600" />
                Creating Your Emergency Plan
              </h3>
              <div className="space-y-3 text-gray-700">
                <p> Identify your nearest hospital with psychiatric services</p>
                <p> Know your insurance information and have it readily available</p>
                <p> Keep important phone numbers saved in your phone</p>
                <p> Have a trusted person who can accompany you if needed</p>
                <p> Consider transportation options to emergency services</p>
                <p> Know the location of your nearest District Mental Health Programme center</p>
              </div>
            </div>
          </div>
        )}

        {/* Coping Strategies */}
        {currentSection === 'coping' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Immediate Coping Strategies</h2>
              <p className="text-xl text-gray-600 mb-8">
                These techniques can help you manage crisis moments and stay safe.
              </p>
            </div>

            <div className="grid gap-8">
              {copingStrategies.map((strategy, index) => (
                <div key={index} className={`rounded-xl p-8 ${strategy.color}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <div className="p-3 bg-white rounded-lg mr-4">
                      {strategy.icon}
                    </div>
                    {strategy.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategy.techniques.map((technique, techIndex) => (
                      <div key={techIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{technique}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Signs */}
        {currentSection === 'warning' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recognizing Warning Signs</h2>
              <p className="text-xl text-gray-600 mb-8">
                Learn to identify signs that may indicate you or someone you know needs immediate help.
              </p>
            </div>

            <div className="grid gap-8">
              {/* Immediate Warning Signs */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Immediate Warning Signs - Seek Help Now
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {warningSignsData.immediate.map((sign, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-red-800">{sign}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-red-100 rounded-lg">
                  <p className="text-red-800 font-semibold">
                    If you or someone you know shows these signs, seek immediate professional help or call a crisis hotline.
                  </p>
                </div>
              </div>

              {/* Concerning Warning Signs */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-yellow-900 mb-6 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Concerning Signs - Consider Professional Support
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {warningSignsData.concerning.map((sign, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-yellow-800">{sign}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 font-semibold">
                    These signs may indicate developing mental health concerns. Consider speaking with a mental health professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              Remember: You are not alone. Help is available 24/7 across India.
            </div>
            
            <div className="flex space-x-4">
              <a
                href="tel:14416"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Call Tele-MANAS 14416
              </a>
              <a
                href="tel:112"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
              >
                Emergency 112
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisPage;
