import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw,
  Timer,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Info,
  Target
} from 'lucide-react';

const ProgressiveMuscleRelaxation = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState('prepare'); // prepare, tense, relax, transition
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const muscleGroups = [
    {
      name: 'Hands and Forearms',
      instruction: 'Make tight fists with both hands',
      relaxInstruction: 'Let your hands open and rest naturally',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Feel the contrast between tension and relaxation in your hands'
    },
    {
      name: 'Upper Arms',
      instruction: 'Bend your elbows and tense your biceps',
      relaxInstruction: 'Let your arms drop to your sides completely',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Notice how heavy and relaxed your arms feel'
    },
    {
      name: 'Shoulders',
      instruction: 'Lift your shoulders up toward your ears',
      relaxInstruction: 'Let your shoulders drop down naturally',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Feel the release of tension in your neck and shoulders'
    },
    {
      name: 'Face and Scalp',
      instruction: 'Squeeze your eyes shut and clench your jaw',
      relaxInstruction: 'Let your face muscles go completely slack',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Allow your jaw to drop slightly and your forehead to smooth'
    },
    {
      name: 'Neck',
      instruction: 'Gently press your head back against the surface',
      relaxInstruction: 'Let your neck return to a comfortable position',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Be gentle with your neck - only light pressure'
    },
    {
      name: 'Chest and Upper Back',
      instruction: 'Arch your back slightly and puff out your chest',
      relaxInstruction: 'Let your chest and back settle into relaxation',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Feel your breathing become easier and more natural'
    },
    {
      name: 'Abdomen',
      instruction: 'Tighten your stomach muscles as if preparing for impact',
      relaxInstruction: 'Let your belly soften and expand naturally',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Notice how your breathing deepens as your abdomen relaxes'
    },
    {
      name: 'Upper Legs (Thighs)',
      instruction: 'Tighten your thigh muscles by pressing your legs together',
      relaxInstruction: 'Let your thighs become heavy and relaxed',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Feel the weight of your legs sinking into the surface'
    },
    {
      name: 'Lower Legs (Calves)',
      instruction: 'Point your toes away from you to tense your calves',
      relaxInstruction: 'Let your feet return to a natural position',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Feel the relief as tension flows out of your legs'
    },
    {
      name: 'Feet',
      instruction: 'Curl your toes and tighten the muscles in your feet',
      relaxInstruction: 'Let your feet go completely limp',
      tenseTime: 5,
      relaxTime: 10,
      tips: 'Notice the feeling of complete relaxation in your feet'
    }
  ];

  const totalDuration = muscleGroups.reduce((total, group) => 
    total + group.tenseTime + group.relaxTime + 3, 0
  ) + 60; // Add 60 seconds for intro and conclusion

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      handlePhaseComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const handlePhaseComplete = () => {
    switch (phase) {
      case 'prepare':
        setPhase('tense');
        setTimeRemaining(muscleGroups[currentStep].tenseTime);
        break;
      case 'tense':
        setPhase('relax');
        setTimeRemaining(muscleGroups[currentStep].relaxTime);
        break;
      case 'relax':
        setCompletedSteps(prev => [...prev, currentStep]);
        if (currentStep < muscleGroups.length - 1) {
          setPhase('transition');
          setTimeRemaining(3);
        } else {
          // Exercise complete
          setPhase('complete');
          setIsActive(false);
        }
        break;
      case 'transition':
        setCurrentStep(currentStep + 1);
        setPhase('prepare');
        setTimeRemaining(2);
        break;
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setPhase('prepare');
    setTimeRemaining(5); // 5 seconds to get ready
    setCompletedSteps([]);
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setPhase('prepare');
    setTimeRemaining(0);
    setCompletedSteps([]);
  };

  const skipToStep = (stepIndex) => {
    if (!isActive) {
      setCurrentStep(stepIndex);
      setPhase('prepare');
      setTimeRemaining(0);
    }
  };

  const getPhaseInstruction = () => {
    const currentGroup = muscleGroups[currentStep];
    
    switch (phase) {
      case 'prepare':
        return `Get ready to work on: ${currentGroup.name}`;
      case 'tense':
        return currentGroup.instruction;
      case 'relax':
        return currentGroup.relaxInstruction;
      case 'transition':
        return `Great! Moving to the next muscle group...`;
      case 'complete':
        return 'Excellent work! Take a moment to notice the overall relaxation in your body.';
      default:
        return 'Prepare for progressive muscle relaxation';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'prepare':
        return 'bg-blue-100 text-blue-800';
      case 'tense':
        return 'bg-red-100 text-red-800';
      case 'relax':
        return 'bg-green-100 text-green-800';
      case 'transition':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSteps = muscleGroups.length;
    const progress = (completedSteps.length / totalSteps) * 100;
    return Math.min(progress, 100);
  };

  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Complete!
          </h2>
          
          <p className="text-gray-600 mb-6">
            You've successfully completed the progressive muscle relaxation exercise. 
            Take a moment to notice how relaxed your body feels.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetExercise}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Practice Again
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
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
            <div>
              <h2 className="text-xl font-bold text-gray-900">Progressive Muscle Relaxation</h2>
              <p className="text-gray-600">Systematic tension and release for deep relaxation</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Instructions"
              >
                <Info className="h-5 w-5 text-gray-600" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{completedSteps.length} of {muscleGroups.length} muscle groups</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="p-6 bg-blue-50 border-b border-gray-200">
            <h3 className="font-semibold text-blue-900 mb-3">How Progressive Muscle Relaxation Works</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Find a comfortable position, either sitting or lying down</p>
              <p>• Follow along as we guide you through different muscle groups</p>
              <p>• Tense each muscle group for 5 seconds when instructed</p>
              <p>• Then completely relax for 10 seconds, noticing the contrast</p>
              <p>• Focus on the feeling of tension leaving your muscles</p>
              <p>• This technique helps reduce overall stress and anxiety</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          {/* Current Step Display */}
          <div className="text-center mb-8">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getPhaseColor()}`}>
              {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStep < muscleGroups.length ? muscleGroups[currentStep].name : 'Complete'}
            </h3>
            
            <p className="text-gray-600 text-lg mb-4">
              {getPhaseInstruction()}
            </p>

            {/* Timer Display */}
            {isActive && timeRemaining > 0 && (
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-primary-600">
                <Timer className="h-6 w-6" />
                <span>{timeRemaining}</span>
              </div>
            )}
          </div>

          {/* Tips */}
          {currentStep < muscleGroups.length && phase === 'relax' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Focus Point</h4>
                  <p className="text-green-800 text-sm">{muscleGroups[currentStep].tips}</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            {!isActive && completedSteps.length === 0 && (
              <button
                onClick={startExercise}
                className="flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Exercise
              </button>
            )}

            {isActive && (
              <button
                onClick={pauseExercise}
                className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </button>
            )}

            <button
              onClick={resetExercise}
              className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </button>

            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-lg font-medium transition-colors ${
                isAudioOn 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={isAudioOn ? 'Audio On' : 'Audio Off'}
            >
              {isAudioOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          {/* Muscle Groups List */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Muscle Groups</h4>
            
            <div className="grid gap-2">
              {muscleGroups.map((group, index) => (
                <button
                  key={index}
                  onClick={() => skipToStep(index)}
                  disabled={isActive}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                    index === currentStep 
                      ? 'border-primary-500 bg-primary-50' 
                      : completedSteps.includes(index)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${isActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      completedSteps.includes(index)
                        ? 'border-green-500 bg-green-500'
                        : index === currentStep
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {completedSteps.includes(index) ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : index === currentStep ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <span className="text-xs text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600">{group.tenseTime + group.relaxTime}s</div>
                    </div>
                  </div>

                  {index === currentStep && isActive && (
                    <div className="text-primary-600">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveMuscleRelaxation;