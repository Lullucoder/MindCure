import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Zap, 
  Moon, 
  Target,
  PlayCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Youtube,
  Wind,
  Star,
  Eye,
  TrendingUp
} from 'lucide-react';

// Import exercise components
import BreathingExercise from '../exercises/BreathingExercise';
import GuidedMeditation from '../exercises/GuidedMeditation';
import WellnessAssessment from '../exercises/WellnessAssessment';
import AssessmentLibrary from '../exercises/AssessmentLibrary';
import ProgressiveMuscleRelaxation from '../exercises/ProgressiveMuscleRelaxation';
import BodyScanMeditation from '../exercises/BodyScanMeditation';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'mental-health-app.auth';

const getAuthHeader = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  } catch {
    return {};
  }
};

const ResourcesSection = ({ showHeader = true, embedded = false }) => {
  const { userProfile } = useAuth();
  const isManager = userProfile?.role === 'counselor' || userProfile?.role === 'admin';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showProgressiveMuscleRelaxation, setShowProgressiveMuscleRelaxation] = useState(false);
  const [showBodyScan, setShowBodyScan] = useState(false);
  const [showAssessmentLibrary, setShowAssessmentLibrary] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const [breathingConfig, setBreathingConfig] = useState(null);
  const [meditationConfig, setMeditationConfig] = useState(null);
  const [progressiveConfig, setProgressiveConfig] = useState(null);
  const [bodyScanConfig, setBodyScanConfig] = useState(null);

  // Resource detail modal
  const [selectedResource, setSelectedResource] = useState(null);

  // Resource management states (for counselor/admin)
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    content: '',
    type: 'article',
    category: 'stress',
    duration: '',
    difficulty: 'Beginner',
    icon: '📚',
    videoUrl: '',
    url: '',
    tags: '',
    isFeatured: false,
    isPublished: true,
    breathingPattern: { inhale: 4, hold: 4, exhale: 4, cycles: 6 },
    source: { label: '', url: '' }
  });

  // Built-in breathing exercises (always available)
  const builtInBreathingExercises = {
    fourSevenEight: {
      title: '4-7-8 Breathing Technique',
      description: 'Guided breath pattern for easing anxious moments and supporting sleep.',
      pattern: { inhale: 4, holdAfterInhale: 7, exhale: 8, holdAfterExhale: 0, totalCycles: 6 },
      focus: 'Rapid calm and sleep preparation',
      videoUrl: 'https://www.youtube.com/embed/Uxbdx-SeOOo',
      source: { label: 'Cleveland Clinic', url: 'https://health.clevelandclinic.org/4-7-8-breathing' }
    },
    stressReset: {
      title: 'Stress Reset Breathing',
      description: 'Even-paced breathing with brief holds to activate your parasympathetic nervous system.',
      pattern: { inhale: 5, holdAfterInhale: 2, exhale: 6, holdAfterExhale: 1, totalCycles: 8 },
      focus: 'Immediate stress relief',
      videoUrl: 'https://www.youtube.com/embed/zCzT9bYGh8E',
      source: { label: 'UCLA Health', url: 'https://www.uclahealth.org/news/breathwork' }
    },
    boxBreathing: {
      title: 'Box Breathing (4x4)',
      description: 'Equal 4-second phases used by clinicians and athletes to regain focus.',
      pattern: { inhale: 4, holdAfterInhale: 4, exhale: 4, holdAfterExhale: 4, totalCycles: 7 },
      focus: 'Grounding and focus',
      videoUrl: 'https://www.youtube.com/embed/KrCvxA7BzF4',
      source: { label: 'University of Michigan', url: 'https://www.uofmhealth.org/health-library/uz2255' }
    }
  };

  const builtInMeditationSessions = {
    mindfulBasics: {
      id: 'mindful-basics',
      title: 'Mindfulness Meditation for Beginners',
      instructor: 'Guided Session',
      duration: '10:00',
      durationSeconds: 600,
      description: 'A gentle introduction to observing thoughts, breath, and body sensations.',
      difficulty: 'Beginner',
      category: 'Mindfulness',
      focus: 'Breath and body awareness',
      videoUrl: 'https://www.youtube.com/embed/U9YKY7fdwyg',
      source: { label: 'Mindful.org', url: 'https://www.mindful.org/meditation/mindfulness-getting-started/' }
    },
    lovingKindness: {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      instructor: 'Guided Session',
      duration: '15:00',
      durationSeconds: 900,
      description: 'Cultivate compassion for yourself and others with metta practice.',
      difficulty: 'Intermediate',
      category: 'Compassion',
      focus: 'Compassion practice',
      videoUrl: 'https://www.youtube.com/embed/smXwNaoXRa8',
      source: { label: 'Greater Good Berkeley', url: 'https://ggia.berkeley.edu/practice/loving_kindness_meditation' }
    }
  };

  const progressiveRelaxationSession = {
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups to ease physical tension.',
    focus: 'Whole-body release',
    videoUrl: 'https://www.youtube.com/embed/KkPsYobwS98',
    source: { label: 'Therapist Aid', url: 'https://www.therapistaid.com/' }
  };

  const bodyScanSession = {
    title: 'Body Scan Meditation',
    description: 'Move attention from head to toes to notice and release tension.',
    focus: 'Mindful body awareness',
    videoUrl: 'https://www.youtube.com/embed/3nwwKbM_vJc',
    source: { label: 'UC San Diego Center for Mindfulness', url: 'https://cih.ucsd.edu/' }
  };

  useEffect(() => {
    loadResources();
  }, [activeCategory, searchTerm]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE}/student/resources?${params}`, {
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResource = async () => {
    try {
      const endpoint = editingResource 
        ? `${API_BASE}/counselor/resources/${editingResource._id}`
        : `${API_BASE}/counselor/resources`;
      
      const method = editingResource ? 'PUT' : 'POST';
      
      const payload = {
        ...resourceForm,
        tags: resourceForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      const response = await fetch(endpoint, {
        method,
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setShowResourceModal(false);
        setEditingResource(null);
        resetForm();
        loadResources();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save resource');
      }
    } catch (err) {
      console.error('Failed to save resource:', err);
      alert('Failed to save resource');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/counselor/resources/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        loadResources();
      }
    } catch (err) {
      console.error('Failed to delete resource:', err);
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title || '',
      description: resource.description || '',
      content: resource.content || '',
      type: resource.type || 'article',
      category: resource.category || 'stress',
      duration: resource.duration || '',
      difficulty: resource.difficulty || 'Beginner',
      icon: resource.icon || '📚',
      videoUrl: resource.videoUrl || '',
      url: resource.url || '',
      tags: (resource.tags || []).join(', '),
      isFeatured: resource.isFeatured || false,
      isPublished: resource.isPublished !== false,
      breathingPattern: resource.breathingPattern || { inhale: 4, hold: 4, exhale: 4, cycles: 6 },
      source: resource.source || { label: '', url: '' }
    });
    setShowResourceModal(true);
  };

  const openCreateModal = () => {
    setEditingResource(null);
    resetForm();
    setShowResourceModal(true);
  };

  const resetForm = () => {
    setResourceForm({
      title: '',
      description: '',
      content: '',
      type: 'article',
      category: 'stress',
      duration: '',
      difficulty: 'Beginner',
      icon: '📚',
      videoUrl: '',
      url: '',
      tags: '',
      isFeatured: false,
      isPublished: true,
      breathingPattern: { inhale: 4, hold: 4, exhale: 4, cycles: 6 },
      source: { label: '', url: '' }
    });
  };

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

  const handleResourceClick = (resource) => {
    // Handle different resource types
    if (resource.type === 'breathing' && resource.breathingPattern) {
      openBreathingExercise({
        title: resource.title,
        description: resource.description,
        pattern: {
          inhale: resource.breathingPattern.inhale,
          holdAfterInhale: resource.breathingPattern.hold,
          exhale: resource.breathingPattern.exhale,
          holdAfterExhale: 0,
          totalCycles: resource.breathingPattern.cycles
        },
        focus: resource.description,
        videoUrl: resource.videoUrl,
        source: resource.source
      });
    } else if (resource.type === 'meditation') {
      openMeditation({
        id: resource._id,
        title: resource.title,
        description: resource.description,
        duration: resource.duration,
        difficulty: resource.difficulty,
        videoUrl: resource.videoUrl,
        source: resource.source
      });
    } else if (resource.url) {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    } else if (resource.videoUrl) {
      // Open video in a simple modal or new tab
      window.open(resource.videoUrl.replace('/embed/', '/watch?v='), '_blank', 'noopener,noreferrer');
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'breathing', name: 'Breathing', icon: Wind },
    { id: 'meditation', name: 'Meditation', icon: Brain },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'stress', name: 'Stress Relief', icon: Heart },
    { id: 'anxiety', name: 'Anxiety', icon: Zap }
  ];

  const quickActions = [
    {
      title: '2-Minute Breathing',
      description: 'Quick anxiety relief',
      icon: Zap,
      duration: '2 min',
      color: 'bg-blue-500',
      onClick: () => openBreathingExercise(builtInBreathingExercises.fourSevenEight)
    },
    {
      title: 'Guided Meditation',
      description: 'Find your center',
      icon: Brain,
      duration: '10 min',
      color: 'bg-green-500',
      onClick: () => openMeditation(builtInMeditationSessions.mindfulBasics)
    },
    {
      title: 'Body Scan',
      description: 'Check in with yourself',
      icon: Target,
      duration: '15 min',
      color: 'bg-purple-500',
      onClick: () => openBodyScan(bodyScanSession)
    },
    {
      title: 'Wellness Check',
      description: 'Assess your mental health',
      icon: CheckCircle,
      duration: '5 min',
      color: 'bg-pink-500',
      onClick: () => setShowAssessmentLibrary(true)
    }
  ];

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
      case 'exercise': case 'breathing': return PlayCircle;
      case 'guided': case 'meditation': return Brain;
      case 'video': return Youtube;
      case 'guide': case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  const getResourceCta = (type) => {
    switch (type) {
      case 'exercise': case 'breathing': return 'Start Exercise';
      case 'guided': case 'meditation': return 'Launch Session';
      case 'video': return 'Watch Video';
      case 'guide': case 'article': return 'Read Article';
      case 'assessment': return 'Take Assessment';
      default: return 'Open';
    }
  };

  const iconOptions = ['📚', '🧘', '🫁', '🧠', '💆', '🌙', '💕', '🎯', '📦', '🌊', '💪', '📊', '🛡️', '🚶', '🌟', '❤️', '🌿', '☀️', '🎵', '✨'];

  const typeOptions = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'breathing', label: 'Breathing Exercise' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'exercise', label: 'Exercise' },
    { value: 'guide', label: 'Guide' },
    { value: 'assessment', label: 'Assessment' }
  ];

  const categoryOptions = [
    { value: 'stress', label: 'Stress Relief' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'breathing', label: 'Breathing' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'self-care', label: 'Self-Care' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'general', label: 'General' }
  ];

  return (
    <div className={embedded ? '' : 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'}>
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <BookOpen className="h-10 w-10 mr-3 text-blue-500" />
              Self-Help Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover guided exercises, meditation sessions, and wellness tools designed to support your mental health journey.
            </p>
          </div>
        )}

        {/* Search, Filter & Add Button */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
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
            
            <button className="flex items-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-gray-700">Filters</span>
            </button>

            {isManager && (
              <button 
                onClick={openCreateModal}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Resource
              </button>
            )}
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
              const count = category.id === 'all' 
                ? resources.length 
                : resources.filter(r => r.category === category.id).length;
              
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeCategory === 'all' ? 'All Resources' : `${categories.find(c => c.id === activeCategory)?.name}`}
            </h2>
            <div className="text-sm text-gray-500">
              {resources.length} resource{resources.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              {isManager && (
                <button
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add First Resource
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <div 
                    key={resource._id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group border border-gray-100"
                  >
                    {/* Content */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-4xl">{resource.icon || '📚'}</div>
                        <div className="flex items-center gap-2">
                          {resource.isFeatured && (
                            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                          )}
                          <TypeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {resource.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {resource.duration && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {resource.duration}
                            </div>
                          )}
                          
                          {resource.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {resource.tags && resource.tags.length > 0 && (
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
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                      <button 
                        onClick={() => setSelectedResource(resource)}
                        className="w-full bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group"
                      >
                        <span>{getResourceCta(resource.type)}</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      {/* Source Link */}
                      {resource.source?.url && (
                        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 space-x-1">
                          <ExternalLink className="h-3 w-3" />
                          <a
                            href={resource.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-dotted hover:text-gray-700"
                          >
                            {resource.source.label || 'Source'}
                          </a>
                        </div>
                      )}

                      {/* Admin Actions */}
                      {isManager && (
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <button
                            onClick={() => openEditModal(resource)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource(resource._id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
                onClick={() => openMeditation(builtInMeditationSessions.mindfulBasics)}
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
                onClick={() => openBreathingExercise(builtInBreathingExercises.stressReset)}
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

      {/* Resource Create/Edit Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingResource ? 'Edit Resource' : 'Create New Resource'}
              </h3>
              <button 
                onClick={() => { setShowResourceModal(false); setEditingResource(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4-7-8 Breathing Technique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={resourceForm.duration}
                    onChange={(e) => setResourceForm({ ...resourceForm, duration: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5 min, 10 min read"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={resourceForm.difficulty}
                    onChange={(e) => setResourceForm({ ...resourceForm, difficulty: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setResourceForm({ ...resourceForm, icon })}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition ${
                          resourceForm.icon === icon 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description of the resource..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={resourceForm.content}
                  onChange={(e) => setResourceForm({ ...resourceForm, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Full content or instructions..."
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="inline h-4 w-4 mr-1" />
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={resourceForm.videoUrl}
                  onChange={(e) => setResourceForm({ ...resourceForm, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {resourceForm.videoUrl && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-gray-900">
                    <iframe
                      src={getYouTubeEmbedUrl(resourceForm.videoUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      title="Preview"
                    />
                  </div>
                )}
              </div>

              {/* Breathing Pattern (for breathing type) */}
              {resourceForm.type === 'breathing' && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-blue-900 mb-3">
                    <Wind className="inline h-4 w-4 mr-1" />
                    Breathing Pattern
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Inhale (sec)</label>
                      <input
                        type="number"
                        value={resourceForm.breathingPattern.inhale}
                        onChange={(e) => setResourceForm({
                          ...resourceForm,
                          breathingPattern: { ...resourceForm.breathingPattern, inhale: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Hold (sec)</label>
                      <input
                        type="number"
                        value={resourceForm.breathingPattern.hold}
                        onChange={(e) => setResourceForm({
                          ...resourceForm,
                          breathingPattern: { ...resourceForm.breathingPattern, hold: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="0"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Exhale (sec)</label>
                      <input
                        type="number"
                        value={resourceForm.breathingPattern.exhale}
                        onChange={(e) => setResourceForm({
                          ...resourceForm,
                          breathingPattern: { ...resourceForm.breathingPattern, exhale: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Cycles</label>
                      <input
                        type="number"
                        value={resourceForm.breathingPattern.cycles}
                        onChange={(e) => setResourceForm({
                          ...resourceForm,
                          breathingPattern: { ...resourceForm.breathingPattern, cycles: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Source */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source Label</label>
                  <input
                    type="text"
                    value={resourceForm.source.label}
                    onChange={(e) => setResourceForm({
                      ...resourceForm,
                      source: { ...resourceForm.source, label: e.target.value }
                    })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Cleveland Clinic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source URL</label>
                  <input
                    type="url"
                    value={resourceForm.source.url}
                    onChange={(e) => setResourceForm({
                      ...resourceForm,
                      source: { ...resourceForm.source, url: e.target.value }
                    })}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={resourceForm.tags}
                  onChange={(e) => setResourceForm({ ...resourceForm, tags: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="anxiety, relaxation, sleep"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resourceForm.isFeatured}
                    onChange={(e) => setResourceForm({ ...resourceForm, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Featured Resource</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resourceForm.isPublished}
                    onChange={(e) => setResourceForm({ ...resourceForm, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-4">
              <button
                onClick={handleSaveResource}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </button>
              <button
                onClick={() => { setShowResourceModal(false); setEditingResource(null); }}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Detail Modal with Video Player */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedResource.type === 'video' ? 'bg-red-100 text-red-600' :
                  selectedResource.type === 'breathing' ? 'bg-blue-100 text-blue-600' :
                  selectedResource.type === 'meditation' ? 'bg-purple-100 text-purple-600' :
                  selectedResource.type === 'article' ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {selectedResource.type === 'video' ? <PlayCircle className="h-5 w-5" /> :
                   selectedResource.type === 'breathing' ? <Wind className="h-5 w-5" /> :
                   selectedResource.type === 'meditation' ? <Brain className="h-5 w-5" /> :
                   <BookOpen className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedResource.title}</h2>
                  <p className="text-sm text-gray-500 capitalize">{selectedResource.type} • {selectedResource.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Video Player */}
              {selectedResource.videoUrl && (
                <div className="mb-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                    <iframe
                      src={getYouTubeEmbedUrl(selectedResource.videoUrl)}
                      title={selectedResource.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About this Resource</h3>
                <p className="text-gray-600 leading-relaxed">{selectedResource.description}</p>
              </div>

              {/* Resource Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedResource.duration && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Clock className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{selectedResource.duration}</span>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                )}
                {selectedResource.difficulty && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <TrendingUp className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700 capitalize">{selectedResource.difficulty}</span>
                    <p className="text-xs text-gray-500">Difficulty</p>
                  </div>
                )}
                {selectedResource.views !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Eye className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{selectedResource.views}</span>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                )}
                {selectedResource.likes !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Heart className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-700">{selectedResource.likes}</span>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Link */}
              {selectedResource.source?.url && (
                <div className="border-t pt-4">
                  <a
                    href={selectedResource.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{selectedResource.source.label || 'View Original Source'}</span>
                  </a>
                </div>
              )}

              {/* Interactive Exercise Button */}
              {(selectedResource.type === 'breathing' || selectedResource.type === 'meditation' || selectedResource.type === 'exercise') && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      handleResourceClick(selectedResource);
                      setSelectedResource(null);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Start Interactive Exercise
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Modals */}
      {showBreathingExercise && breathingConfig && (
        <BreathingExercise
          exercise={breathingConfig}
          onClose={() => { setShowBreathingExercise(false); setBreathingConfig(null); }}
        />
      )}

      {showMeditation && meditationConfig && (
        <GuidedMeditation
          meditation={meditationConfig}
          onClose={() => { setShowMeditation(false); setMeditationConfig(null); }}
        />
      )}

      {showProgressiveMuscleRelaxation && progressiveConfig && (
        <ProgressiveMuscleRelaxation
          session={progressiveConfig}
          onClose={() => { setShowProgressiveMuscleRelaxation(false); setProgressiveConfig(null); }}
        />
      )}

      {showBodyScan && bodyScanConfig && (
        <BodyScanMeditation
          session={bodyScanConfig}
          onClose={() => { setShowBodyScan(false); setBodyScanConfig(null); }}
        />
      )}

      {showAssessment && selectedAssessment && (
        <WellnessAssessment
          assessment={selectedAssessment}
          onClose={() => { setShowAssessment(false); setSelectedAssessment(null); }}
          onComplete={() => {}}
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

export default ResourcesSection;
