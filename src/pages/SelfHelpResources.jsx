import { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Zap, 
  Moon, 
  Target,
  PlayCircle,
  Download,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';

// Import exercise components
import BreathingExercise from '../components/exercises/BreathingExercise';
import GuidedMeditation from '../components/exercises/GuidedMeditation';
import WellnessAssessment from '../components/exercises/WellnessAssessment';
import AssessmentLibrary from '../components/exercises/AssessmentLibrary';
import ProgressiveMuscleRelaxation from '../components/exercises/ProgressiveMuscleRelaxation';
import BodyScanMeditation from '../components/exercises/BodyScanMeditation';

const SelfHelpResources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showProgressiveMuscleRelaxation, setShowProgressiveMuscleRelaxation] = useState(false);
  const [showBodyScan, setShowBodyScan] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showAssessmentLibrary, setShowAssessmentLibrary] = useState(false);

  const [breathingConfig, setBreathingConfig] = useState(null);
  const [meditationConfig, setMeditationConfig] = useState(null);
  const [progressiveConfig, setProgressiveConfig] = useState(null);
  const [bodyScanConfig, setBodyScanConfig] = useState(null);

  const openBreathingExercise = (config) => {
    setBreathingConfig(config);
    setShowBreathingExercise(true);
  };

  const openMeditation = (config) => {
    setMeditationConfig(config);
    setShowMeditation(true);
  };

  const openProgressiveRelaxation = (config) => {
    setProgressiveConfig(config);
    setShowProgressiveMuscleRelaxation(true);
  };

  const openBodyScan = (config) => {
    setBodyScanConfig(config);
    setShowBodyScan(true);
  };


  const breathingExercises = {
    fourSevenEight: {
      title: '4-7-8 Breathing Technique',
      description: 'Guided breath pattern popularized by Dr. Andrew Weil for easing anxious moments and supporting sleep.',
      pattern: {
        inhale: 4,
        holdAfterInhale: 7,
        exhale: 8,
        holdAfterExhale: 0,
        totalCycles: 6
      },
      focus: 'Rapid calm and sleep preparation',
      videoUrl: 'https://www.youtube.com/embed/Uxbdx-SeOOo',
      source: {
        label: 'Cleveland Clinic — 4-7-8 Breathing',
        url: 'https://health.clevelandclinic.org/4-7-8-breathing'
      }
    },
    stressReset: {
      title: 'Stress Reset Breathing',
      description: 'Even-paced breathing with brief holds to activate your parasympathetic nervous system in two minutes.',
      pattern: {
        inhale: 5,
        holdAfterInhale: 2,
        exhale: 6,
        holdAfterExhale: 1,
        totalCycles: 8
      },
      focus: 'Immediate stress relief',
      videoUrl: 'https://www.youtube.com/embed/zCzT9bYGh8E',
      source: {
        label: 'UCLA Health — Breathwork for Stress Relief',
        url: 'https://www.uclahealth.org/news/breathwork'
      }
    },
    boxBreathing: {
      title: 'Box Breathing (4x4)',
      description: 'Equal 4-second phases used by clinicians and athletes to regain focus under pressure.',
      pattern: {
        inhale: 4,
        holdAfterInhale: 4,
        exhale: 4,
        holdAfterExhale: 4,
        totalCycles: 7
      },
      focus: 'Grounding and focus',
      videoUrl: 'https://www.youtube.com/embed/KrCvxA7BzF4',
      source: {
        label: 'University of Michigan Health — Box Breathing',
        url: 'https://www.uofmhealth.org/health-library/uz2255'
      }
    }
  };

  const meditationSessions = {
    mindfulBasics: {
      id: 'mindful-basics',
      title: 'Mindfulness Meditation for Beginners',
      instructor: 'Sarah Chen',
      duration: '10:00',
      durationSeconds: 600,
      description: 'A gentle introduction to observing thoughts, breath, and body sensations without judgment.',
      difficulty: 'Beginner',
      category: 'Mindfulness',
      focus: 'Breath and body awareness',
      videoUrl: 'https://www.youtube.com/embed/U9YKY7fdwyg?si=zeksuOe6ZQaDArot',
      source: {
        label: 'Mindful.org — Guided Practice',
        url: 'https://www.mindful.org/meditation/mindfulness-getting-started/'
      }
    },
    lovingKindness: {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      instructor: 'Maya Collins',
      duration: '15:00',
      durationSeconds: 900,
      description: 'Cultivate compassion for yourself and others with an uplifting metta practice.',
      difficulty: 'Intermediate',
      category: 'Compassion',
      focus: 'Compassion practice',
      videoUrl: 'https://www.youtube.com/embed/smXwNaoXRa8',
      source: {
        label: 'Greater Good in Action — Loving-Kindness',
        url: 'https://ggia.berkeley.edu/practice/loving_kindness_meditation'
      }
    }
  };

  const progressiveRelaxationSession = {
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups to ease physical tension and calm your nervous system.',
    focus: 'Whole-body release',
    videoUrl: 'https://www.youtube.com/embed/KkPsYobwS98',
    source: {
      label: 'Therapist Aid — Progressive Muscle Relaxation',
      url: 'https://www.therapistaid.com/worksheets/progressive-muscle-relaxation-script.pdf'
    }
  };

  const bodyScanSession = {
    title: 'Body Scan Meditation',
    description: 'Move attention from the crown of your head to your toes to notice and gently release tension.',
    focus: 'Mindful body awareness',
    videoUrl: 'https://www.youtube.com/embed/3nwwKbM_vJc',
    source: {
      label: 'UC San Diego Center for Mindfulness',
      url: 'https://cih.ucsd.edu/index.cfm/public-resources/guided-audio-meditations/'
    }
  };

  const featuredResources = [
    {
      id: 'breath-478',
      title: '4-7-8 Breathing Technique',
      description: breathingExercises.fourSevenEight.description,
      category: 'breathing',
      duration: '≈2 min',
      difficulty: 'Beginner',
      focus: breathingExercises.fourSevenEight.focus,
      type: 'exercise',
      image: '🫁',
      tags: ['anxiety', 'relaxation', 'sleep'],
      source: breathingExercises.fourSevenEight.source,
      videoUrl: breathingExercises.fourSevenEight.videoUrl,
      onClick: () => openBreathingExercise(breathingExercises.fourSevenEight)
    },
    {
      id: 'pmr',
      title: 'Progressive Muscle Relaxation',
      description: progressiveRelaxationSession.description,
      category: 'stress',
      duration: '12-15 min',
      difficulty: 'Beginner',
      focus: progressiveRelaxationSession.focus,
      type: 'guided',
      image: '💆‍♀️',
      tags: ['tension release', 'relaxation', 'body'],
      source: progressiveRelaxationSession.source,
      videoUrl: progressiveRelaxationSession.videoUrl,
      onClick: () => openProgressiveRelaxation(progressiveRelaxationSession)
    },
    {
      id: 'mindfulness-beginner',
      title: 'Mindfulness Meditation for Beginners',
      description: meditationSessions.mindfulBasics.description,
      category: 'meditation',
      duration: '10 min',
      difficulty: 'Beginner',
      focus: 'Breath and body awareness',
      type: 'guided',
      image: '🧘‍♀️',
      tags: ['mindfulness', 'meditation', 'starter'],
      source: meditationSessions.mindfulBasics.source,
      videoUrl: meditationSessions.mindfulBasics.videoUrl,
      onClick: () => openMeditation(meditationSessions.mindfulBasics)
    },
    {
      id: 'body-scan',
      title: 'Body Scan Meditation',
      description: bodyScanSession.description,
      category: 'meditation',
      duration: '20 min',
      difficulty: 'Intermediate',
      focus: bodyScanSession.focus,
      type: 'guided',
      image: '🎯',
      tags: ['body awareness', 'mindfulness', 'relaxation'],
      source: bodyScanSession.source,
      videoUrl: bodyScanSession.videoUrl,
      onClick: () => openBodyScan(bodyScanSession)
    },
    {
      id: 'phq9',
      title: 'Mental Health Assessment (PHQ-9)',
      description: 'Brief, validated questionnaire to help track depressive symptoms over time.',
      category: 'stress',
      duration: '5 min',
      difficulty: 'Beginner',
      focus: 'Self check-in',
      type: 'assessment',
      image: '📊',
      tags: ['assessment', 'mental health', 'screening'],
      source: {
        label: 'PHQ-9 — Kroenke et al., 2001',
        url: 'https://www.phqscreeners.com/'
      },
      onClick: () => {
        setSelectedAssessment({
          id: 'phq9',
          title: 'Depression Assessment (PHQ-9)',
          description: 'A brief questionnaire to help assess symptoms of depression'
        });
        setShowAssessment(true);
      }
    },
    {
      id: 'sleep-prep',
      title: 'Sleep Preparation Routine',
      description: 'Wind-down checklist combining evidence-based sleep hygiene and calming breath work.',
      category: 'sleep',
      duration: '15-20 min',
      difficulty: 'Intermediate',
      focus: 'Restorative sleep',
      type: 'guide',
      image: '🌙',
      tags: ['sleep', 'routine', 'habits'],
      source: {
        label: 'Sleep Foundation — Wind Down Routine',
        url: 'https://www.sleepfoundation.org/sleep-hygiene'
      },
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.open('https://www.sleepfoundation.org/sleep-hygiene', '_blank', 'noopener,noreferrer');
        }
      }
    },
    {
      id: 'anxiety-coping',
      title: 'Anxiety Coping Strategies',
      description: 'Grounding, reframing, and self-compassion tools drawn from CBT and mindfulness-based approaches.',
      category: 'stress',
      duration: '12 min',
      difficulty: 'Beginner',
      focus: 'Everyday anxiety skills',
      type: 'guide',
      image: '🛡️',
      tags: ['anxiety', 'coping', 'strategies'],
      source: {
        label: 'Anxiety Canada — Self-Help Strategies',
        url: 'https://www.anxietycanada.com/articles/'
      },
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.open('https://www.anxietycanada.com/articles/', '_blank', 'noopener,noreferrer');
        }
      }
    },
    {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      description: meditationSessions.lovingKindness.description,
      category: 'meditation',
      duration: '15 min',
      difficulty: 'Intermediate',
      focus: 'Compassion practice',
      type: 'guided',
      image: '💝',
      tags: ['compassion', 'self-love', 'kindness'],
      source: meditationSessions.lovingKindness.source,
      videoUrl: meditationSessions.lovingKindness.videoUrl,
      onClick: () => openMeditation(meditationSessions.lovingKindness)
    },
    {
      id: 'stress-breath',
      title: 'Stress Relief Breathing',
      description: breathingExercises.stressReset.description,
      category: 'breathing',
      duration: '≈2 min',
      difficulty: 'Beginner',
      focus: breathingExercises.stressReset.focus,
      type: 'exercise',
      image: '🌊',
      tags: ['stress', 'quick relief', 'breathing'],
      source: breathingExercises.stressReset.source,
      videoUrl: breathingExercises.stressReset.videoUrl,
      onClick: () => openBreathingExercise(breathingExercises.stressReset)
    },
    {
      id: 'sleep-stories',
      title: 'Sleep Stories for Adults',
      description: 'Guided imagery paired with slow narration to help your nervous system settle before bed.',
      category: 'sleep',
      duration: '25 min',
      difficulty: 'Beginner',
      focus: 'Nighttime wind-down',
      type: 'guided',
      image: '📚',
      tags: ['sleep', 'stories', 'bedtime'],
      source: {
        label: 'Calm — Sleep Stories Tips',
        url: 'https://www.calm.com/blog/sleep-stories'
      },
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.open('https://www.calm.com/blog/sleep-stories', '_blank', 'noopener,noreferrer');
        }
      }
    },
    {
      id: 'mindful-walking',
      title: 'Mindful Walking Guide',
      description: 'Bring awareness to steps, breathing, and surroundings to turn any walk into meditation.',
      category: 'meditation',
      duration: '8 min',
      difficulty: 'Beginner',
      focus: 'Movement mindfulness',
      type: 'guide',
      image: '🚶‍♀️',
      tags: ['walking', 'mindfulness', 'outdoor'],
      source: {
        label: 'Mindful.org — Walking Meditation',
        url: 'https://www.mindful.org/walking-meditation/'
      },
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.open('https://www.mindful.org/walking-meditation/', '_blank', 'noopener,noreferrer');
        }
      }
    },
    {
      id: 'box-breathing',
      title: 'Box Breathing Technique',
      description: breathingExercises.boxBreathing.description,
      category: 'breathing',
      duration: '≈3 min',
      difficulty: 'Intermediate',
      focus: breathingExercises.boxBreathing.focus,
      type: 'exercise',
      image: '📦',
      tags: ['focus', 'calm', 'performance'],
      source: breathingExercises.boxBreathing.source,
      videoUrl: breathingExercises.boxBreathing.videoUrl,
      onClick: () => openBreathingExercise(breathingExercises.boxBreathing)
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: 12 },
    { id: 'breathing', name: 'Breathing', icon: Zap, count: 3 },
    { id: 'meditation', name: 'Meditation', icon: Brain, count: 4 },
    { id: 'sleep', name: 'Sleep', icon: Moon, count: 2 },
    { id: 'stress', name: 'Stress Relief', icon: Heart, count: 3 }
  ];

  const quickActions = [
    {
      title: '2-Minute Breathing',
      description: 'Quick anxiety relief',
      icon: Zap,
      duration: '2 min',
      color: 'bg-blue-400',
      onClick: () => openBreathingExercise(breathingExercises.fourSevenEight)
    },
    {
      title: 'Guided Meditation',
      description: 'Find your center',
      icon: Brain,
      duration: '10 min',
      color: 'bg-green-400',
      onClick: () => openMeditation(meditationSessions.mindfulBasics)
    },
    {
      title: 'Body Scan',
      description: 'Check in with yourself',
      icon: Target,
      duration: '15 min',
      color: 'bg-purple-400',
      onClick: () => openBodyScan(bodyScanSession)
    },
    {
      title: 'Wellness Assessment',
      description: 'Check your mental health',
      icon: CheckCircle,
      duration: '5 min',
      color: 'bg-pink-400',
      onClick: () => setShowAssessmentLibrary(true)
    }
  ];

  const filteredResources = featuredResources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'exercise': return PlayCircle;
      case 'guided': return Heart;
      case 'guide': return BookOpen;
      default: return BookOpen;
    }
  };

  const getResourceCta = (type) => {
    switch (type) {
      case 'exercise':
        return 'Start Exercise';
      case 'guided':
        return 'Launch Session';
      case 'guide':
        return 'View Guide';
      case 'assessment':
        return 'Take Assessment';
      default:
        return 'Open';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <BookOpen className="h-10 w-10 mr-3 text-blue-500" />
            Self-Help Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover guided exercises, meditation sessions, and wellness tools designed to support your mental health journey. 
            Learn new coping strategies and build healthy habits at your own pace.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, techniques, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            {/* Quick Filter Button */}
            <button className="flex items-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
            <Zap className="h-6 w-6 mr-2 text-blue-500" />
            Quick Relief Tools
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border border-gray-100"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {action.duration}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Browse by Category</h2>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-2xl border-2 transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:shadow-md'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  <span className="font-medium">{category.name}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeCategory === 'all' ? 'Featured Resources' : `${categories.find(c => c.id === activeCategory)?.name} Resources`}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div key={resource.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group border border-gray-100">
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-4xl">{resource.image}</div>
                      <TypeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {resource.duration}
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Target className="h-4 w-4 mr-1 text-blue-400" />
                        {resource.focus}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6">
                    <button 
                      onClick={resource.onClick}
                      className="w-full bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group"
                    >
                      <span>{getResourceCta(resource.type)}</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {resource.source && (
                      <div className="flex items-center justify-center mt-3 text-xs text-gray-500 space-x-1">
                        <ExternalLink className="h-3 w-3" />
                        <a
                          href={resource.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted hover:text-gray-700"
                        >
                          {resource.source.label}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                Today's Wellness Recommendations
              </h2>
              <p className="text-blue-700">
                Personalized suggestions based on your mood and activity
              </p>
            </div>
            <div className="text-4xl">🌟</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Morning Focus</h4>
              <p className="text-sm text-blue-700 mb-3">Start your day with intention</p>
              <button 
                onClick={() => openMeditation(meditationSessions.mindfulBasics)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Try 5-minute meditation
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-900 mb-2">Midday Reset</h4>
              <p className="text-sm text-green-700 mb-3">Take a mindful break</p>
              <button 
                onClick={() => openBreathingExercise(breathingExercises.stressReset)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                Practice breathing exercise
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            <div className="bg-white bg-opacity-70 p-6 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-purple-900 mb-2">Evening Wind-down</h4>
              <p className="text-sm text-purple-700 mb-3">Prepare for restful sleep</p>
              <button 
                onClick={() => openBodyScan(bodyScanSession)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                Listen to body scan meditation
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exercise Modals */}
      {showBreathingExercise && (
        <BreathingExercise
          exercise={breathingConfig}
          onClose={() => {
            setShowBreathingExercise(false);
            setBreathingConfig(null);
          }}
        />
      )}
      
      {showMeditation && (
        <GuidedMeditation
          meditation={meditationConfig}
          onClose={() => {
            setShowMeditation(false);
            setMeditationConfig(null);
          }}
        />
      )}
      
      {showProgressiveMuscleRelaxation && (
        <ProgressiveMuscleRelaxation
          session={progressiveConfig}
          onClose={() => {
            setShowProgressiveMuscleRelaxation(false);
            setProgressiveConfig(null);
          }}
        />
      )}
      
      {showBodyScan && (
        <BodyScanMeditation
          session={bodyScanConfig}
          onClose={() => {
            setShowBodyScan(false);
            setBodyScanConfig(null);
          }}
        />
      )}
      
      {showAssessment && selectedAssessment && (
        <WellnessAssessment
          assessment={selectedAssessment}
          onClose={() => {
            setShowAssessment(false);
            setSelectedAssessment(null);
          }}
          onComplete={(results) => {
            // Assessment completed successfully - results could be saved to database
          }}
        />
      )}
      
      {showAssessmentLibrary && (
        <AssessmentLibrary
          onClose={() => setShowAssessmentLibrary(false)}
        />
      )}
    </div>
  );
};

export default SelfHelpResources;