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
  Star,
  Search,
  Filter
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



  const featuredResources = [
    {
      id: 1,
      title: '4-7-8 Breathing Technique',
      description: 'A powerful breathing exercise to reduce anxiety and promote relaxation. Perfect for moments of stress or before sleep.',
      category: 'breathing',
      duration: '5 min',
      difficulty: 'Beginner',
      rating: 4.8,
      completions: 1234,
      type: 'exercise',
      image: '🫁',
      tags: ['anxiety', 'relaxation', 'quick'],
      onClick: () => setShowBreathingExercise(true)
    },
    {
      id: 2,
      title: 'Progressive Muscle Relaxation',
      description: 'Learn to release physical tension and achieve deep relaxation by systematically tensing and relaxing muscle groups.',
      category: 'stress',
      duration: '15 min',
      difficulty: 'Beginner',
      rating: 4.7,
      completions: 892,
      type: 'guided',
      image: '💆‍♀️',
      tags: ['tension', 'relaxation', 'body'],
      onClick: () => setShowProgressiveMuscleRelaxation(true)
    },
    {
      id: 3,
      title: 'Mindfulness Meditation for Beginners',
      description: 'Start your mindfulness journey with this gentle guided meditation that teaches you to observe thoughts without judgment.',
      category: 'meditation',
      duration: '10 min',
      difficulty: 'Beginner',
      rating: 4.9,
      completions: 2156,
      type: 'guided',
      image: '🧘‍♀️',
      tags: ['mindfulness', 'meditation', 'beginner'],
      onClick: () => setShowMeditation(true)
    },
    {
      id: 4,
      title: 'Body Scan Meditation',
      description: 'Develop body awareness and release tension through mindful scanning from head to toe.',
      category: 'meditation',
      duration: '20 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      completions: 743,
      type: 'guided',
      image: '🎯',
      tags: ['body awareness', 'mindfulness', 'relaxation'],
      onClick: () => setShowBodyScan(true)
    },
    {
      id: 5,
      title: 'Mental Health Assessment (PHQ-9)',
      description: 'Quick depression screening to better understand your mental health and track your progress over time.',
      category: 'stress',
      duration: '5 min',
      difficulty: 'Beginner',
      rating: 4.6,
      completions: 3421,
      type: 'assessment',
      image: '📊',
      tags: ['assessment', 'mental health', 'screening'],
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
      id: 6,
      title: 'Sleep Preparation Routine',
      description: 'Establish healthy sleep habits with this comprehensive guide including relaxation techniques and sleep hygiene tips.',
      category: 'sleep',
      duration: '20 min',
      difficulty: 'Intermediate',
      rating: 4.6,
      completions: 567,
      type: 'guide',
      image: '🌙',
      tags: ['sleep', 'routine', 'habits']
    },
    {
      id: 7,
      title: 'Anxiety Coping Strategies',
      description: 'Learn evidence-based techniques to manage anxiety including grounding exercises and cognitive reframing.',
      category: 'stress',
      duration: '12 min',
      difficulty: 'Beginner',
      rating: 4.7,
      completions: 1456,
      type: 'guide',
      image: '🛡️',
      tags: ['anxiety', 'coping', 'strategies']
    },
    {
      id: 8,
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion for yourself and others with this heart-opening meditation practice.',
      category: 'meditation',
      duration: '15 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      completions: 823,
      type: 'guided',
      image: '💝',
      tags: ['compassion', 'self-love', 'kindness'],
      onClick: () => setShowMeditation(true)
    },
    {
      id: 9,
      title: 'Stress Relief Breathing',
      description: 'Quick and effective breathing patterns specifically designed for immediate stress relief.',
      category: 'breathing',
      duration: '3 min',
      difficulty: 'Beginner',
      rating: 4.9,
      completions: 2134,
      type: 'exercise',
      image: '🌊',
      tags: ['stress', 'quick relief', 'breathing'],
      onClick: () => setShowBreathingExercise(true)
    },
    {
      id: 10,
      title: 'Sleep Stories for Adults',
      description: 'Calming bedtime stories designed to help your mind drift peacefully into sleep.',
      category: 'sleep',
      duration: '25 min',
      difficulty: 'Beginner',
      rating: 4.7,
      completions: 1893,
      type: 'guided',
      image: '📚',
      tags: ['sleep', 'stories', 'bedtime']
    },
    {
      id: 11,
      title: 'Mindful Walking Guide',
      description: 'Transform your daily walks into mindfulness practice with guided awareness techniques.',
      category: 'meditation',
      duration: '8 min',
      difficulty: 'Beginner',
      rating: 4.6,
      completions: 657,
      type: 'guide',
      image: '🚶‍♀️',
      tags: ['walking', 'mindfulness', 'outdoor']
    },
    {
      id: 12,
      title: 'Box Breathing Technique',
      description: 'Master this military-grade breathing technique for instant calm and improved focus.',
      category: 'breathing',
      duration: '4 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      completions: 1567,
      type: 'exercise',
      image: '📦',
      tags: ['focus', 'calm', 'technique'],
      onClick: () => setShowBreathingExercise(true)
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
      onClick: () => setShowBreathingExercise(true)
    },
    {
      title: 'Guided Meditation',
      description: 'Find your center',
      icon: Brain,
      duration: '10 min',
      color: 'bg-green-400',
      onClick: () => setShowMeditation(true)
    },
    {
      title: 'Body Scan',
      description: 'Check in with yourself',
      icon: Target,
      duration: '15 min',
      color: 'bg-purple-400',
      onClick: () => setShowBodyScan(true)
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
                        <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                        {resource.rating}
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
                      <span>{resource.type === 'assessment' ? 'Take Assessment' : 'Start Exercise'}</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {resource.completions.toLocaleString()} completions
                    </div>
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
                onClick={() => setShowMeditation(true)}
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
                onClick={() => setShowBreathingExercise(true)}
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
                onClick={() => setShowBodyScan(true)}
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
        <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
      )}
      
      {showMeditation && (
        <GuidedMeditation onClose={() => setShowMeditation(false)} />
      )}
      
      {showProgressiveMuscleRelaxation && (
        <ProgressiveMuscleRelaxation onClose={() => setShowProgressiveMuscleRelaxation(false)} />
      )}
      
      {showBodyScan && (
        <BodyScanMeditation onClose={() => setShowBodyScan(false)} />
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