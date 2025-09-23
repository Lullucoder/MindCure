import { useState } from 'react';
import { 
  ClipboardList, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Heart,
  Brain,
  Activity,
  Zap,
  Shield
} from 'lucide-react';

const StressAssessment = ({ onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Perceived Stress Scale (PSS-10) - Short Version
  const assessmentData = {
    id: 'pss10',
    title: 'Stress Level Assessment (PSS-10)',
    description: 'A questionnaire to measure your perceived stress levels over the past month',
    disclaimer: 'This assessment is for educational purposes only and should not replace professional medical advice.',
    estimatedTime: '3-4 minutes',
    questions: [
      {
        id: 1,
        text: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      },
      {
        id: 2,
        text: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      },
      {
        id: 3,
        text: 'In the last month, how often have you felt nervous and stressed?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      },
      {
        id: 4,
        text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
        type: 'scale',
        reverse: true, // This is a positive question, so scoring is reversed
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly Often' },
          { value: 0, label: 'Very Often' }
        ]
      },
      {
        id: 5,
        text: 'In the last month, how often have you felt that things were going your way?',
        type: 'scale',
        reverse: true, // This is a positive question, so scoring is reversed
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly Often' },
          { value: 0, label: 'Very Often' }
        ]
      },
      {
        id: 6,
        text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      },
      {
        id: 7,
        text: 'In the last month, how often have you been able to control irritations in your life?',
        type: 'scale',
        reverse: true, // This is a positive question, so scoring is reversed
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly Often' },
          { value: 0, label: 'Very Often' }
        ]
      },
      {
        id: 8,
        text: 'In the last month, how often have you felt that you were on top of things?',
        type: 'scale',
        reverse: true, // This is a positive question, so scoring is reversed
        options: [
          { value: 4, label: 'Never' },
          { value: 3, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 1, label: 'Fairly Often' },
          { value: 0, label: 'Very Often' }
        ]
      },
      {
        id: 9,
        text: 'In the last month, how often have you been angered because of things that were outside of your control?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      },
      {
        id: 10,
        text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
        type: 'scale',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Almost Never' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Fairly Often' },
          { value: 4, label: 'Very Often' }
        ]
      }
    ]
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeAssessment = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    
    let severity, description, recommendations;
    
    // PSS-10 scoring (0-40 scale)
    if (totalScore <= 13) {
      severity = 'Low';
      description = 'You are experiencing low levels of perceived stress.';
      recommendations = [
        'Continue your current stress management practices',
        'Maintain healthy lifestyle habits',
        'Practice preventive stress management techniques'
      ];
    } else if (totalScore <= 26) {
      severity = 'Moderate';
      description = 'You are experiencing moderate levels of perceived stress.';
      recommendations = [
        'Implement regular stress reduction activities',
        'Practice relaxation techniques daily',
        'Consider time management strategies',
        'Ensure adequate sleep and exercise'
      ];
    } else {
      severity = 'High';
      description = 'You are experiencing high levels of perceived stress.';
      recommendations = [
        'Seek professional support for stress management',
        'Consider counseling or therapy',
        'Implement immediate stress reduction strategies',
        'Prioritize self-care and rest'
      ];
    }

    const assessmentResults = {
      score: totalScore,
      severity,
      description,
      recommendations,
      needsAttention: totalScore >= 27,
      type: 'stress'
    };

    setResults(assessmentResults);
    setIsCompleted(true);
    
    if (onComplete) {
      onComplete(assessmentResults);
    }
  };

  const getCurrentQuestion = () => {
    return assessmentData.questions[currentQuestion];
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / assessmentData.questions.length) * 100;
  };

  const isCurrentAnswered = () => {
    return answers[getCurrentQuestion()?.id] !== undefined;
  };

  if (isCompleted && results) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Stress Assessment Results</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${
                results.severity === 'Low' ? 'bg-green-100' :
                results.severity === 'Moderate' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    results.severity === 'Low' ? 'text-green-600' :
                    results.severity === 'Moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {results.score}
                  </div>
                  <div className="text-sm text-gray-600">/ 40</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {results.severity} Stress Level
              </h3>
              <p className="text-gray-600">
                {results.description}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                Stress Management Recommendations
              </h4>
              
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stress-Specific Resources */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Stress Relief Resources</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Activity className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Progressive Muscle Relaxation</div>
                    <div className="text-sm text-gray-600">Release physical tension</div>
                  </div>
                </button>
                
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Brain className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Mindfulness Meditation</div>
                    <div className="text-sm text-gray-600">Stay present and calm</div>
                  </div>
                </button>
                
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Heart className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Deep Breathing</div>
                    <div className="text-sm text-gray-600">Quick stress relief</div>
                  </div>
                </button>
                
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <ClipboardList className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Stress Journal</div>
                    <div className="text-sm text-gray-600">Track stress patterns</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Stress Management Tips */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-orange-600" />
                Quick Stress Relief Tips
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Take 5 deep breaths</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Go for a short walk</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Listen to calming music</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Practice gratitude</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Stretch your body</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Disconnect from devices</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> This assessment measures your perception of stress, not clinical conditions. 
                  If stress is significantly impacting your daily life, relationships, or well-being, consider speaking 
                  with a mental health professional.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                View Dashboard
              </button>
              <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                Save Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {assessmentData.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Question {currentQuestion + 1} of {assessmentData.questions.length}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {assessmentData.estimatedTime}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {getCurrentQuestion()?.text}
            </h3>

            <div className="space-y-3">
              {getCurrentQuestion()?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(getCurrentQuestion().id, option.value)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    answers[getCurrentQuestion().id] === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[getCurrentQuestion().id] === option.value
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[getCurrentQuestion().id] === option.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={!isCurrentAnswered()}
              className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                isCurrentAnswered()
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === assessmentData.questions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              {assessmentData.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressAssessment;