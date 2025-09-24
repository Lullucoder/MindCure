import React from 'react';
import { Brain, Heart, Shield, Lightbulb, Clock, Users } from 'lucide-react';

const TherapyStarters = ({ onStarterClick }) => {
  const starters = [
    {
      category: 'Anxiety & Stress',
      icon: <Brain className="h-5 w-5" />,
      color: 'blue',
      prompts: [
        "I've been feeling anxious lately and don't know how to manage it",
        "My stress levels are through the roof and I need coping strategies",
        "I'm having panic attacks and feel overwhelmed",
        "Constant worry is affecting my daily life"
      ]
    },
    {
      category: 'Depression & Mood',
      icon: <Heart className="h-5 w-5" />,
      color: 'purple',
      prompts: [
        "I've been feeling down and hopeless for weeks",
        "I'm struggling to find motivation for anything",
        "Everything feels overwhelming and I don't know where to start",
        "I feel empty and disconnected from life"
      ]
    },
    {
      category: 'Relationships',
      icon: <Users className="h-5 w-5" />,
      color: 'green',
      prompts: [
        "I'm having relationship problems and need perspective",
        "I feel lonely and isolated from others",
        "Family conflicts are causing me stress",
        "I struggle with setting healthy boundaries"
      ]
    },
    {
      category: 'Self-Care & Coping',
      icon: <Shield className="h-5 w-5" />,
      color: 'indigo',
      prompts: [
        "I need help developing healthy coping strategies",
        "How can I practice better self-care?",
        "I want to build resilience and emotional strength",
        "Help me create a daily wellness routine"
      ]
    },
    {
      category: 'Life Transitions',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'orange',
      prompts: [
        "I'm going through major life changes and feeling lost",
        "Starting college/work is overwhelming me",
        "I'm struggling with identity and purpose questions",
        "How do I navigate uncertainty about my future?"
      ]
    },
    {
      category: 'Crisis Support',
      icon: <Clock className="h-5 w-5" />,
      color: 'red',
      prompts: [
        "I'm in crisis and need immediate support",
        "I'm having thoughts of self-harm",
        "I feel like I can't go on anymore",
        "I need emergency coping strategies right now"
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I support you today?</h3>
        <p className="text-gray-600 text-sm">Choose a topic to get started, or share whatever is on your mind.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {starters.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                {category.icon}
              </div>
              <h4 className="font-medium text-gray-900">{category.category}</h4>
            </div>
            
            <div className="space-y-2">
              {category.prompts.map((prompt, promptIndex) => (
                <button
                  key={promptIndex}
                  onClick={() => onStarterClick(prompt)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors text-sm ${getColorClasses(category.color)}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Remember</h4>
            <p className="text-sm text-yellow-700">
              This is a safe, confidential space. Share as much or as little as you're comfortable with. 
              If you're in immediate danger, please call 14416 (Tele-MANAS) or 112 (Emergency) right away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyStarters;