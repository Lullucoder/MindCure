import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Clock,
  User,
  Target
} from 'lucide-react';

const GuidedMeditation = ({ meditation, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Sample meditation data used as fallback and merged with provided configuration
  const defaultMeditation = {
    id: 1,
    title: 'Mindfulness for Beginners',
    instructor: 'Sarah Chen',
    duration: '10:00',
    durationSeconds: 600,
    description: 'A gentle introduction to mindfulness meditation',
    difficulty: 'Beginner',
    category: 'Mindfulness',
    focus: 'Breath and body awareness',
    segments: [
      { time: 0, title: 'Welcome & Settling In', description: 'Find a comfortable position and begin to relax' },
      { time: 60, title: 'Breath Awareness', description: 'Focus on your natural breathing rhythm' },
      { time: 180, title: 'Body Scan', description: 'Gentle awareness of physical sensations' },
      { time: 360, title: 'Mindful Observation', description: 'Notice thoughts without judgment' },
      { time: 480, title: 'Loving Kindness', description: 'Cultivate compassion for yourself and others' },
      { time: 540, title: 'Integration & Closing', description: 'Bring awareness back to the present moment' }
    ]
  };

  const meditationData = {
    ...defaultMeditation,
    ...meditation,
    segments: meditation?.segments || defaultMeditation.segments,
    durationSeconds: meditation?.durationSeconds || defaultMeditation.durationSeconds,
    duration: meditation?.duration || defaultMeditation.duration
  };

  const totalDurationSeconds = meditationData.durationSeconds || 600;
  const videoSrc = meditationData.videoUrl
    ? `${meditationData.videoUrl}${meditationData.videoUrl.includes('?') ? '&' : '?'}rel=0`
    : null;

  useEffect(() => {
    // Simulate audio loading and reset state when data changes
    setIsLoaded(true);
    setDuration(totalDurationSeconds);
    setCurrentTime(0);
    setCurrentSegment(0);
    setIsPlaying(false);
  }, [totalDurationSeconds, meditationData.id]);

  useEffect(() => {
    let interval = null;
    
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(time => {
          const newTime = time + 1;
          
          // Update current segment based on time
          const segment = meditationData.segments.findIndex((seg, index) => {
            const nextSeg = meditationData.segments[index + 1];
            return newTime >= seg.time && (!nextSeg || newTime < nextSeg.time);
          });
          
          if (segment !== -1 && segment !== currentSegment) {
            setCurrentSegment(segment);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (currentTime >= duration) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, currentSegment, meditationData.segments]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.floor(percent * duration);
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(currentTime + 30, duration));
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(currentTime - 10, 0));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  const getCurrentSegment = () => {
    return meditationData.segments[currentSegment] || meditationData.segments[0];
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
                {meditationData.title}
              </h2>
              <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-x-4 gap-y-1">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {meditationData.instructor}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {meditationData.duration}
                </span>
                {meditationData.focus && (
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-1 text-primary-500" />
                    Focus: {meditationData.focus}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            meditationData.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
            meditationData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {meditationData.difficulty}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {videoSrc && (
            <div className="mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={videoSrc}
                  title={meditationData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Optional video companion: keep the timer running here while following the guided session on YouTube.
              </p>
            </div>
          )}

          {/* Current Segment Display */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {getCurrentSegment().title}
              </h3>
              <p className="text-primary-700">
                {getCurrentSegment().description}
              </p>
            </div>

            {/* Meditation Visual */}
            <div className="flex justify-center mb-6">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center ${
                isPlaying ? 'animate-pulse' : ''
              }`}>
                <div className="text-white text-center">
                  <div className="text-4xl mb-1">🧘‍♀️</div>
                  <div className="text-xs opacity-90">
                    {isPlaying ? 'In Session' : 'Ready'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
              >
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-200"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleSkipBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Skip back 10 seconds"
              >
                <SkipBack className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={handlePlayPause}
                className="p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                disabled={!isLoaded}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Skip forward 30 seconds"
              >
                <SkipForward className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center mt-4 space-x-3">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-gray-600" />
                ) : (
                  <Volume2 className="h-4 w-4 text-gray-600" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Segment Timeline */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Session Outline</h4>
            <div className="space-y-2">
              {meditationData.segments.map((segment, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    index === currentSegment
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    index === currentSegment ? 'bg-primary-600' :
                    currentTime >= segment.time ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      index === currentSegment ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {segment.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(segment.time)} • {segment.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips & Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Meditation Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Find a quiet, comfortable space where you won't be disturbed</li>
              <li>• Sit upright with your spine straight but not rigid</li>
              <li>• If your mind wanders, gently bring attention back to the guidance</li>
              <li>• There's no "perfect" way to meditate - be kind to yourself</li>
            </ul>
            {meditationData.source && (
              <p className="mt-3 text-xs text-blue-700">
                Reference: <a href={meditationData.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">
                  {meditationData.source.label}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedMeditation;