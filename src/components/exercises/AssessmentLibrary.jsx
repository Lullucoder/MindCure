import { useState } from 'react';
import { 
  ClipboardList, 
  ArrowLeft, 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import WellnessAssessment from './WellnessAssessment';
import AnxietyAssessment from './AnxietyAssessment';
import StressAssessment from './StressAssessment';

const AssessmentLibrary = ({ onClose }) => {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);

  const assessments = [
    {
      id: 'phq9',
      title: 'Depression Assessment',
      subtitle: 'PHQ-9',
      description: 'Evaluate symptoms of depression and their severity over the past two weeks.',
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-primary-600',
      borderColor: 'border-primary-200',
      bgColor: 'bg-primary-50',
      duration: '3-5 minutes',
      questions: 9,
      component: WellnessAssessment,
      features: [
        'Clinically validated questionnaire',
        'Severity level assessment',
        'Personalized recommendations',
        'Professional guidance suggestions'
      ]
    },
    {
      id: 'gad7',
      title: 'Anxiety Assessment', 
      subtitle: 'GAD-7',
      description: 'Assess generalized anxiety disorder symptoms and their impact on daily life.',
      icon: <Brain className="h-8 w-8" />,
      color: 'bg-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      duration: '2-3 minutes',
      questions: 7,
      component: AnxietyAssessment,
      features: [
        'Anxiety symptom screening',
        'Impact assessment',
        'Coping strategy recommendations',
        'Resource connections'
      ]
    },
    {
      id: 'pss10',
      title: 'Stress Level Assessment',
      subtitle: 'PSS-10',
      description: 'Measure your perceived stress levels and coping abilities over the past month.',
      icon: <Zap className="h-8 w-8" />,
      color: 'bg-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
      duration: '3-4 minutes',
      questions: 10,
      component: StressAssessment,
      features: [
        'Perceived stress measurement',
        'Coping ability evaluation', 
        'Stress management techniques',
        'Lifestyle recommendations'
      ]
    }
  ];

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (results) => {
    // Handle assessment completion - could integrate with backend storage
    setShowAssessment(false);
    setSelectedAssessment(null);
  };

  const handleCloseAssessment = () => {
    setShowAssessment(false);
    setSelectedAssessment(null);
  };

  if (showAssessment && selectedAssessment) {
    const AssessmentComponent = selectedAssessment.component;
    return (
      <AssessmentComponent
        onClose={handleCloseAssessment}
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wellness Assessment Library</h1>
                <p className="text-gray-600">Choose an assessment to evaluate your mental health and well-being</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <ClipboardList className="h-5 w-5 mr-2" />
              {assessments.length} Assessments Available
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                <p className="text-blue-800 text-sm">
                  These assessments are educational tools and should not replace professional medical advice, 
                  diagnosis, or treatment. If you're experiencing severe symptoms or having thoughts of self-harm, 
                  please seek immediate professional help.
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Grid */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className={`border-2 ${assessment.borderColor} rounded-xl p-6 hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Section - Assessment Info */}
                  <div className="flex items-start space-x-4 mb-4 lg:mb-0 flex-1">
                    <div className={`p-3 ${assessment.bgColor} rounded-lg flex-shrink-0`}>
                      <div className={`text-white ${assessment.color} p-1 rounded`}>
                        {assessment.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {assessment.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {assessment.subtitle}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {assessment.description}
                      </p>

                      {/* Assessment Details */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {assessment.duration}
                        </div>
                        <div className="flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          {assessment.questions} questions
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {assessment.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action Button */}
                  <div className="lg:ml-6 flex-shrink-0">
                    <button
                      onClick={() => handleStartAssessment(assessment)}
                      className={`w-full lg:w-auto px-8 py-4 ${assessment.color} hover:opacity-90 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center group`}
                    >
                      Start Assessment
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">After Your Assessment</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Personalized Results</h4>
                <p className="text-sm text-gray-600">
                  Receive detailed insights about your mental health status with personalized recommendations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Self-Help Resources</h4>
                <p className="text-sm text-gray-600">
                  Access curated exercises, meditations, and tools based on your assessment results.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Professional Support</h4>
                <p className="text-sm text-gray-600">
                  Get guidance on when and how to seek professional mental health support if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Your responses are private and confidential. Assessment data is not stored or shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentLibrary;