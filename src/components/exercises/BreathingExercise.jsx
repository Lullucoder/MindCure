import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

const BreathingExercise = ({ exercise, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Default 4-7-8 breathing pattern
  const breathingPattern = exercise?.pattern || {
    inhale: 4,
    holdAfterInhale: 7,
    exhale: 8,
    holdAfterExhale: 0,
    totalCycles: 4
  };

  const phaseTimings = {
    inhale: breathingPattern.inhale,
    hold: breathingPattern.holdAfterInhale,
    exhale: breathingPattern.exhale,
    pause: breathingPattern.holdAfterExhale
  };

  const phaseInstructions = {
    inhale: 'Breathe in slowly through your nose',
    hold: 'Hold your breath gently',
    exhale: 'Exhale slowly through your mouth',
    pause: 'Rest and prepare for the next breath'
  };

  const phaseColors = {
    inhale: 'from-blue-400 to-blue-600',
    hold: 'from-purple-400 to-purple-600',
    exhale: 'from-green-400 to-green-600',
    pause: 'from-gray-400 to-gray-600'
  };

  useEffect(() => {
    let interval = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 0.1);
      }, 100);
    } else if (isActive && timeRemaining <= 0) {
      // Move to next phase
      const phases = ['inhale', 'hold', 'exhale', 'pause'].filter(p => phaseTimings[p] > 0);
      const currentIndex = phases.indexOf(phase);
      const nextIndex = (currentIndex + 1) % phases.length;
      
      if (nextIndex === 0) {
        // Completed a full cycle
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        
        if (newCycleCount >= breathingPattern.totalCycles) {
          setIsActive(false);
          setIsCompleted(true);
          return;
        }
      }
      
      const nextPhase = phases[nextIndex];
      setPhase(nextPhase);
      setTimeRemaining(phaseTimings[nextPhase]);

      // Play sound cue (if enabled)
      if (isSoundOn && (nextPhase === 'inhale' || nextPhase === 'exhale')) {
        playBreathingSound(nextPhase);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, phase, cycleCount, breathingPattern.totalCycles, phaseTimings, isSoundOn]);

  const playBreathingSound = (phase) => {
    // In a real app, you would play actual audio files
    // For now, we'll just use the Web Audio API for simple tones
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.frequency.value = phase === 'inhale' ? 220 : 180; // Different tones for inhale/exhale
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeRemaining(phaseTimings.inhale);
    setCycleCount(0);
    setIsCompleted(false);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeRemaining(0);
    setCycleCount(0);
    setIsCompleted(false);
  };

  const getCircleSize = () => {
    const maxSize = 200;
    const minSize = 120;
    const progress = 1 - (timeRemaining / phaseTimings[phase]);
    
    if (phase === 'inhale') {
      return minSize + (maxSize - minSize) * progress;
    } else if (phase === 'exhale') {
      return maxSize - (maxSize - minSize) * progress;
    } else {
      return phase === 'hold' ? maxSize : minSize;
    }
  };

  const getProgress = () => {
    const totalTime = Object.values(phaseTimings).reduce((sum, time) => sum + time, 0);
    const currentPhaseProgress = 1 - (timeRemaining / phaseTimings[phase]);
    
    const phaseOrder = ['inhale', 'hold', 'exhale', 'pause'].filter(p => phaseTimings[p] > 0);
    const currentPhaseIndex = phaseOrder.indexOf(phase);
    
    let totalProgress = 0;
    for (let i = 0; i < currentPhaseIndex; i++) {
      totalProgress += phaseTimings[phaseOrder[i]];
    }
    totalProgress += phaseTimings[phase] * currentPhaseProgress;
    
    return (totalProgress / totalTime) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {exercise?.title || '4-7-8 Breathing Exercise'}
              </h2>
              <p className="text-gray-600 text-sm">
                {exercise?.description || 'Reduce anxiety and promote relaxation'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={`p-2 rounded-lg transition-colors ${
              isSoundOn ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

        {/* Exercise Area */}
        <div className="p-8">
          {!isCompleted ? (
            <>
              {/* Breathing Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div
                    className={`rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-100 ease-in-out flex items-center justify-center`}
                    style={{
                      width: `${getCircleSize()}px`,
                      height: `${getCircleSize()}px`
                    }}
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold mb-1">
                        {Math.ceil(timeRemaining)}
                      </div>
                      <div className="text-sm opacity-90">
                        {phase.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Ring */}
                  <svg
                    className="absolute inset-0 -rotate-90"
                    width={getCircleSize() + 20}
                    height={getCircleSize() + 20}
                    style={{
                      left: '-10px',
                      top: '-10px'
                    }}
                  >
                    <circle
                      cx={(getCircleSize() + 20) / 2}
                      cy={(getCircleSize() + 20) / 2}
                      r={(getCircleSize() + 10) / 2}
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx={(getCircleSize() + 20) / 2}
                      cy={(getCircleSize() + 20) / 2}
                      r={(getCircleSize() + 10) / 2}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * ((getCircleSize() + 10) / 2)}`}
                      strokeDashoffset={`${2 * Math.PI * ((getCircleSize() + 10) / 2) * (1 - getProgress() / 100)}`}
                      className="text-primary-600"
                    />
                  </svg>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phaseInstructions[phase]}
                </h3>
                <p className="text-gray-600">
                  Cycle {cycleCount + 1} of {breathingPattern.totalCycles}
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={startExercise}
                    className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {cycleCount > 0 ? 'Resume' : 'Start'}
                  </button>
                ) : (
                  <button
                    onClick={pauseExercise}
                    className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={resetExercise}
                  className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </button>
              </div>
            </>
          ) : (
            /* Completion Screen */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Exercise Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                You've completed {breathingPattern.totalCycles} breathing cycles. 
                Take a moment to notice how you feel.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetExercise}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Practice Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Exercise Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">About this Exercise</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-medium text-blue-900">Inhale</div>
                <div className="text-blue-700">{breathingPattern.inhale} seconds</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="font-medium text-purple-900">Hold</div>
                <div className="text-purple-700">{breathingPattern.holdAfterInhale} seconds</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-medium text-green-900">Exhale</div>
                <div className="text-green-700">{breathingPattern.exhale} seconds</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Benefits:</strong> This 4-7-8 breathing technique helps activate your body's relaxation response, 
                reduce anxiety, and improve sleep quality. Regular practice can help manage stress and promote overall well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;