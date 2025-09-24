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
  Activity
} from 'lucide-react';

const WellnessAssessment = ({ assessment, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Sample PHQ-9 Depression Assessment
  const assessmentData = assessment || {
    id: 'phq9',
    title: 'Depression Assessment (PHQ-9)',
    description: 'A brief questionnaire to help assess symptoms of depression',
    disclaimer: 'This assessment is for educational purposes only and should not replace professional medical advice.',
    estimatedTime: '3-5 minutes',
    questions: [
      {
        id: 1,
        text: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 2,
        text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 3,
        text: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 4,
        text: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 5,
        text: 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 6,
        text: 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 7,
        text: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 8,
        text: 'Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: 9,
        text: 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead or of hurting yourself in some way?',
        type: 'scale',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
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
    
    // PHQ-9 scoring
    if (totalScore <= 4) {
      severity = 'Minimal';
      description = 'You are experiencing minimal symptoms of depression.';
      recommendations = [
        'Continue with healthy lifestyle habits',
        'Stay connected with friends and family',
        'Regular exercise and good sleep hygiene'
      ];
    } else if (totalScore <= 9) {
      severity = 'Mild';
      description = 'You may be experiencing mild symptoms of depression.';
      recommendations = [
        'Consider talking to a counselor or therapist',
        'Practice stress management techniques',
        'Maintain regular exercise and social activities'
      ];
    } else if (totalScore <= 14) {
      severity = 'Moderate';
      description = 'You may be experiencing moderate symptoms of depression.';
      recommendations = [
        'Consider seeking professional help',
        'Talk to your healthcare provider',
        'Engage in therapy or counseling'
      ];
    } else if (totalScore <= 19) {
      severity = 'Moderately Severe';
      description = 'You may be experiencing moderately severe symptoms of depression.';
      recommendations = [
        'Seek professional help as soon as possible',
        'Consider medication and therapy options',
        'Reach out to trusted friends or family for support'
      ];
    } else {
      severity = 'Severe';
      description = 'You may be experiencing severe symptoms of depression.';
      recommendations = [
        'Seek immediate professional help',
        'Contact a mental health crisis line if needed',
        'Consider inpatient or intensive outpatient treatment'
      ];
    }

    const assessmentResults = {
      score: totalScore,
      severity,
      description,
      recommendations,
      needsAttention: totalScore >= 10,
      crisis: answers[9] > 0 // Question 9 about self-harm thoughts
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
              <h2 className="text-xl font-bold text-gray-900">Assessment Results</h2>
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
            {/* Crisis Warning */}
            {results.crisis && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-red-900">Immediate Support Needed</h3>
                    <p className="text-red-800 text-sm mt-1">
                      You indicated thoughts of self-harm. Please reach out for immediate support.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Call Crisis Helpline: 14416
                  </button>
                  <button className="w-full bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg font-medium transition-colors">
                    Find Local Emergency Resources
                  </button>
                </div>
              </div>
            )}

            {/* Score Display */}
            <div className="text-center mb-8">
              <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${
                results.severity === 'Minimal' ? 'bg-green-100' :
                results.severity === 'Mild' ? 'bg-yellow-100' :
                results.severity === 'Moderate' ? 'bg-orange-100' :
                'bg-red-100'
              }`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    results.severity === 'Minimal' ? 'text-green-600' :
                    results.severity === 'Mild' ? 'text-yellow-600' :
                    results.severity === 'Moderate' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {results.score}
                  </div>
                  <div className="text-sm text-gray-600">/ 27</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {results.severity} Symptoms
              </h3>
              <p className="text-gray-600">
                {results.description}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary-600" />
                Recommended Next Steps
              </h4>
              
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-3 bg-primary-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Additional Resources</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Brain className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Find a Therapist</div>
                    <div className="text-sm text-gray-600">Professional support</div>
                  </div>
                </button>
                
                <button className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Activity className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Self-Help Tools</div>
                    <div className="text-sm text-gray-600">Guided exercises</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> This assessment is for educational purposes only and is not a 
                  substitute for professional medical advice, diagnosis, or treatment. If you're experiencing 
                  a mental health crisis, please seek immediate professional help.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
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
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[getCurrentQuestion().id] === option.value
                        ? 'border-primary-500 bg-primary-500'
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
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
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

export default WellnessAssessment;