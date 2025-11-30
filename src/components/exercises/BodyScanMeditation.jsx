import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  Heart,
  Info,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const BodyScanMeditation = ({ session, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentArea, setCurrentArea] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedAreas, setCompletedAreas] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(15); // minutes

  const sessionDetails = {
    title: session?.title || 'Body Scan Meditation',
    description: session?.description || 'Mindful awareness of physical sensations',
    focus: session?.focus || 'Whole-body presence',
    videoUrl: session?.videoUrl,
    source: session?.source
  };

  const bodyAreas = [
    {
      name: 'Crown of Head',
      description: 'Top of your head and scalp',
      instruction: 'Notice any sensations at the very top of your head. Feel the crown of your head, perhaps noticing warmth, tingling, or simply the awareness of this area.',
      duration: 45, // seconds
      position: 'head'
    },
    {
      name: 'Forehead and Eyes',
      description: 'Forehead, temples, and around the eyes',
      instruction: 'Bring your attention to your forehead. Notice if there\'s any tension between your eyebrows. Feel around your eyes, your temples. Allow any tension to soften.',
      duration: 60,
      position: 'head'
    },
    {
      name: 'Jaw and Mouth',
      description: 'Jaw muscles, mouth, and tongue',
      instruction: 'Notice your jaw. Is it clenched or relaxed? Feel your lips, your tongue resting in your mouth. Let your jaw soften and release any held tension.',
      duration: 45,
      position: 'head'
    },
    {
      name: 'Neck and Throat',
      description: 'All around the neck area',
      instruction: 'Move your attention to your neck. Feel the front of your throat, the sides of your neck, the back of your neck. Notice any sensations here.',
      duration: 45,
      position: 'neck'
    },
    {
      name: 'Left Shoulder and Arm',
      description: 'From shoulder to fingertips',
      instruction: 'Focus on your left shoulder. Feel down your left arm - upper arm, elbow, forearm, wrist, and all the way to your fingertips. What do you notice?',
      duration: 75,
      position: 'arms'
    },
    {
      name: 'Right Shoulder and Arm',
      description: 'From shoulder to fingertips',
      instruction: 'Now shift to your right shoulder. Feel down your right arm - upper arm, elbow, forearm, wrist, and to your fingertips. Notice any differences between your arms.',
      duration: 75,
      position: 'arms'
    },
    {
      name: 'Chest and Heart',
      description: 'Chest area and heart region',
      instruction: 'Bring attention to your chest. Feel your heartbeat if you can. Notice the rise and fall of your chest with each breath. Feel the space around your heart.',
      duration: 60,
      position: 'torso'
    },
    {
      name: 'Upper Back',
      description: 'Shoulder blades and upper spine',
      instruction: 'Focus on your upper back, between your shoulder blades. Feel your upper spine. Notice if there\'s any tension or tightness you can release.',
      duration: 45,
      position: 'torso'
    },
    {
      name: 'Abdomen',
      description: 'Belly and lower ribs',
      instruction: 'Move your attention to your belly. Feel it expanding and contracting with your breath. Notice the area around your lower ribs and diaphragm.',
      duration: 60,
      position: 'torso'
    },
    {
      name: 'Lower Back',
      description: 'Lower spine and back muscles',
      instruction: 'Feel your lower back, where it touches the surface you\'re on. Notice your lower spine, any tension in the muscles along your back.',
      duration: 45,
      position: 'torso'
    },
    {
      name: 'Hips and Pelvis',
      description: 'Hip bones and pelvic area',
      instruction: 'Bring awareness to your hips and pelvis. Feel the connection to the surface beneath you. Notice this stable, grounding area of your body.',
      duration: 45,
      position: 'hips'
    },
    {
      name: 'Left Leg',
      description: 'From hip to toes',
      instruction: 'Focus on your left leg. Feel your left thigh, knee, shin, calf. Move down to your left ankle, the top of your foot, sole of your foot, and each toe.',
      duration: 75,
      position: 'legs'
    },
    {
      name: 'Right Leg',
      description: 'From hip to toes',
      instruction: 'Now your right leg. Feel your right thigh, knee, shin, calf. Notice your right ankle, foot, and toes. Compare the sensations with your left leg.',
      duration: 75,
      position: 'legs'
    },
    {
      name: 'Whole Body',
      description: 'Complete body awareness',
      instruction: 'Finally, expand your awareness to include your entire body. Feel yourself as one complete, whole being. Notice the overall sense of relaxation and presence.',
      duration: 90,
      position: 'whole'
    }
  ];

  const totalDuration = bodyAreas.reduce((total, area) => total + area.duration, 0) + 120; // Add 2 minutes for intro/outro

  const videoSrc = sessionDetails.videoUrl
    ? `${sessionDetails.videoUrl}${sessionDetails.videoUrl.includes('?') ? '&' : '?'}rel=0`
    : null;

  useEffect(() => {
    // Reset state when a new session configuration is supplied
    setIsActive(false);
    setCurrentArea(0);
    setTimeRemaining(0);
    setCompletedAreas([]);
  }, [sessionDetails.title]);

  const playCue = () => {
    if (!isAudioOn) return;
    if (typeof window === 'undefined' || !window.AudioContext) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = 360;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.4);
  };

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      handleAreaComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (!isActive || !isAudioOn) return;
    playCue();
  }, [currentArea, isActive, isAudioOn]);

  const handleAreaComplete = () => {
    setCompletedAreas(prev => [...prev, currentArea]);
    
    if (currentArea < bodyAreas.length - 1) {
      setCurrentArea(currentArea + 1);
      setTimeRemaining(bodyAreas[currentArea + 1].duration);
    } else {
      // Meditation complete
      setIsActive(false);
    }
  };

  const startMeditation = () => {
    setIsActive(true);
    setCurrentArea(0);
    setTimeRemaining(bodyAreas[0].duration);
    setCompletedAreas([]);
  };

  const pauseMeditation = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setCurrentArea(0);
    setTimeRemaining(0);
    setCompletedAreas([]);
  };

  const skipToArea = (areaIndex) => {
    if (!isActive) {
      setCurrentArea(areaIndex);
      setTimeRemaining(bodyAreas[areaIndex].duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalAreas = bodyAreas.length;
    const progress = (completedAreas.length / totalAreas) * 100;
    return Math.min(progress, 100);
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'head': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'neck': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'arms': return 'bg-green-100 border-green-300 text-green-800';
      case 'torso': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'hips': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'legs': return 'bg-red-100 border-red-300 text-red-800';
      case 'whole': return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Check if meditation is complete
  const isComplete = completedAreas.length === bodyAreas.length && !isActive;

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Meditation Complete
          </h2>
          
          <p className="text-gray-600 mb-6">
            You've completed the full body scan meditation. Take a moment to notice 
            how your body feels now compared to when you started.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              Regular body scan practice can help increase body awareness, reduce stress, 
              and improve your ability to notice and release physical tension.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={resetMeditation}
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
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{sessionDetails.title}</h2>
              <p className="text-gray-600">{sessionDetails.description}</p>
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
              <span>{completedAreas.length} of {bodyAreas.length} areas</span>
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
            <h3 className="font-semibold text-blue-900 mb-3">How to Practice Body Scan Meditation</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Find a comfortable position, lying down or sitting upright</p>
              <p>• Close your eyes or soften your gaze</p>
              <p>• Simply notice whatever sensations are present in each body area</p>
              <p>• There's no need to change anything - just observe with curiosity</p>
              <p>• If you don't feel anything in an area, that's perfectly normal</p>
              <p>• When your mind wanders, gently return attention to the current body area</p>
              <p>• Practice acceptance of whatever you notice without judgment</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          {videoSrc && (
            <div className="mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={videoSrc}
                  title={sessionDetails.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pair this timer with the companion video/audio for additional guidance if helpful.
              </p>
            </div>
          )}

          {/* Current Area Display */}
          <div className="text-center mb-8">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              getPositionColor(bodyAreas[currentArea]?.position)
            }`}>
              {bodyAreas[currentArea]?.position.charAt(0).toUpperCase() + bodyAreas[currentArea]?.position.slice(1)}
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {bodyAreas[currentArea]?.name}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {bodyAreas[currentArea]?.description}
            </p>

            {sessionDetails.focus && (
              <p className="text-sm text-gray-500">
                Focus: {sessionDetails.focus}
              </p>
            )}

            {/* Timer Display */}
            {isActive && timeRemaining > 0 && (
              <div className="text-3xl font-bold text-primary-600 mb-4">
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {/* Current Instruction */}
          {bodyAreas[currentArea] && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Target className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Current Focus</h4>
                  <p className="text-green-800 leading-relaxed">
                    {bodyAreas[currentArea].instruction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {!isActive && completedAreas.length === 0 && (
              <button
                onClick={startMeditation}
                className="flex items-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Meditation
              </button>
            )}

            {isActive && (
              <button
                onClick={pauseMeditation}
                className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </button>
            )}

            <button
              onClick={resetMeditation}
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

          {/* Body Areas List */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Body Areas ({completedAreas.length}/{bodyAreas.length})
            </h4>
            
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {bodyAreas.map((area, index) => (
                <button
                  key={index}
                  onClick={() => skipToArea(index)}
                  disabled={isActive}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                    index === currentArea 
                      ? `border-2 ${getPositionColor(area.position).replace('bg-', 'border-').replace('-100', '-500')} ${getPositionColor(area.position)}` 
                      : completedAreas.includes(index)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${isActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      completedAreas.includes(index)
                        ? 'border-green-500 bg-green-500'
                        : index === currentArea
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {completedAreas.includes(index) ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : index === currentArea ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <span className="text-xs text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{area.name}</div>
                      <div className="text-sm text-gray-600">{area.description} • {formatTime(area.duration)}</div>
                    </div>
                  </div>

                  {index === currentArea && isActive && (
                    <div className="text-primary-600">
                      <Target className="h-5 w-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Meditation Tips */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Meditation Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Notice without trying to change anything</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>It's okay if you don't feel sensations in some areas</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Gently return attention when mind wanders</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span>Practice curiosity and non-judgment</span>
              </div>
            </div>
          </div>

          {sessionDetails.source && (
            <div className="mt-6 text-xs text-gray-500">
              Reference: <a href={sessionDetails.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">
                {sessionDetails.source.label}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyScanMeditation;