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

  const videoSrc = exercise?.videoUrl
    ? `${exercise.videoUrl}${exercise.videoUrl.includes('?') ? '&' : '?'}rel=0`
    : null;

  useEffect(() => {
    // Reset state when a new exercise configuration is loaded
    setIsActive(false);
    setPhase('inhale');
    setTimeRemaining(0);
    setCycleCount(0);
    setIsCompleted(false);
  }, [exercise]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      if (timeRemaining > 0) {
        // Timer is running - count down
        interval = setInterval(() => {
          setTimeRemaining(time => {
            const newTime = time - 0.1;
            if (newTime <= 0) {
              return 0;
            }
            return newTime;
          });
        }, 100);
      } else if (timeRemaining <= 0.05) {
        // Phase complete - move to next phase
        const phases = ['inhale', 'hold', 'exhale', 'pause'].filter(p => phaseTimings[p] > 0);
        const currentIndex = phases.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phases.length;
        console.log(`Phase complete: ${phase} -> ${phases[nextIndex]}`);
        
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
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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

  const startNewSession = () => {
    console.log('Starting exercise with pattern:', breathingPattern);
    console.log('Phase timings:', phaseTimings);
    console.log('Setting timeRemaining to:', phaseTimings.inhale);

    const initialPhase = 'inhale';
    setPhase(initialPhase);
    setCycleCount(0);
    setIsCompleted(false);
    setTimeRemaining(phaseTimings[initialPhase]);
    setIsActive(true);
  };

  const handleStartOrResume = () => {
    if (isCompleted) {
      startNewSession();
      return;
    }

    if (!isActive) {
      if (cycleCount === 0 && timeRemaining <= 0) {
        startNewSession();
      } else {
        setIsActive(true);
      }
    }
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

  const handleCircleClick = () => {
    if (isActive) {
      pauseExercise();
      return;
    }

    handleStartOrResume();
  };

  const getCircleSize = () => {
    const maxSize = 200;
    const minSize = 120;
    const phaseDuration = phaseTimings[phase] || 1;
    const progress = Math.max(0, Math.min(1, 1 - (timeRemaining / phaseDuration)));
    
    if (phase === 'inhale') {
      return minSize + (maxSize - minSize) * progress;
    } else if (phase === 'exhale') {
      return maxSize - (maxSize - minSize) * progress;
    } else {
      return phase === 'hold' ? maxSize : minSize;
    }
  };

  const getProgress = () => {
    if (!phaseTimings[phase]) return 0;
    
    const totalTime = Object.values(phaseTimings).reduce((sum, time) => sum + time, 0);
    if (totalTime === 0) return 0;
    
    const currentPhaseProgress = Math.max(0, Math.min(1, 1 - (timeRemaining / phaseTimings[phase])));
    
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
          {videoSrc && (
            <div className="mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={videoSrc}
                  title={exercise?.title || 'Breathing exercise video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Optional: follow along with the referenced guided video while the timer keeps you on pace.
              </p>
            </div>
          )}

          {!isCompleted ? (
            <>
              {/* Breathing Circle */}
              <div className="flex justify-center mb-8">
                <div
                  className="relative cursor-pointer focus:outline-none"
                  style={{ width: '240px', height: '240px' }}
                  onClick={handleCircleClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCircleClick();
                    }
                  }}
                  aria-label={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
                >
                  {/* Progress Ring Background */}
                  <svg
                    className="absolute inset-0 -rotate-90"
                    width="240"
                    height="240"
                  >
                    {/* Background ring */}
                    <circle
                      cx="120"
                      cy="120"
                      r="110"
                      stroke="rgba(0,0,0,0.08)"
                      strokeWidth="6"
                      fill="none"
                    />
                    {/* Animated progress ring that matches phase color */}
                    <circle
                      cx="120"
                      cy="120"
                      r="110"
                      stroke={
                        phase === 'inhale' ? 'rgb(59, 130, 246)' : // blue-500
                        phase === 'hold' ? 'rgb(168, 85, 247)' :   // purple-500
                        phase === 'exhale' ? 'rgb(34, 197, 94)' :  // green-500
                        'rgb(107, 114, 128)'                       // gray-500
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 110}`}
                      strokeDashoffset={`${2 * Math.PI * 110 * (1 - getProgress() / 100)}`}
                      style={{
                        transition: 'stroke 0.3s ease-in-out, stroke-dashoffset 0.1s linear'
                      }}
                    />
                  </svg>
                  
                  {/* Breathing Circle - Centered */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className={`rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-500 ease-in-out flex items-center justify-center shadow-2xl`}
                      style={{
                        width: `${getCircleSize()}px`,
                        height: `${getCircleSize()}px`,
                        boxShadow: phase === 'inhale' 
                          ? '0 0 40px rgba(59, 130, 246, 0.4)'
                          : phase === 'hold'
                          ? '0 0 40px rgba(168, 85, 247, 0.4)'
                          : phase === 'exhale'
                          ? '0 0 40px rgba(34, 197, 94, 0.4)'
                          : '0 0 40px rgba(107, 114, 128, 0.4)'
                      }}
                    >
                      <div className="text-white text-center">
                        <div className="text-4xl font-bold mb-1">
                          {Math.ceil(timeRemaining)}
                        </div>
                        <div className="text-base font-medium tracking-wider">
                          {phase.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {phaseInstructions[phase]}
                </h3>
                
                {/* Cycle Progress Dots */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {Array.from({ length: breathingPattern.totalCycles }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx < cycleCount
                          ? 'bg-green-500'
                          : idx === cycleCount
                          ? 'bg-primary-500 w-3 h-3'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm">
                  Cycle {cycleCount + 1} of {breathingPattern.totalCycles}
                </p>
                {exercise?.focus && (
                  <p className="mt-2 text-sm text-gray-500">
                    Focus: {exercise.focus}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    onClick={handleStartOrResume}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {cycleCount > 0 && timeRemaining > 0 ? 'Resume' : 'Start'}
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
                <strong>Why it helps:</strong> {exercise?.description || 'Guided breath ratios help regulate your nervous system and create a repeatable rhythm you can rely on in stressful moments.'}
              </p>
              {exercise?.source && (
                <p className="mt-2 text-xs text-gray-500">
                  Reference: <a href={exercise.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">
                    {exercise.source.label}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;