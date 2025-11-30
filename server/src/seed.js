// Seed script to initialize forum categories and demo users
// Run with: node src/seed.js

import './config/loadEnv.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database.js';
import { User } from './models/User.js';
import { ForumCategory } from './models/ForumCategory.js';
import { Resource } from './models/Resource.js';

const seedData = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database');

    // Seed Forum Categories
    const categories = [
      { name: 'Anxiety', description: 'Discuss anxiety-related experiences and coping strategies', icon: '😰', color: '#f59e0b', order: 1 },
      { name: 'Depression', description: 'Support for those dealing with depression', icon: '🌧️', color: '#6366f1', order: 2 },
      { name: 'Stress Management', description: 'Tips and discussions about managing stress', icon: '💆', color: '#10b981', order: 3 },
      { name: 'Relationships', description: 'Talk about relationship challenges and advice', icon: '💕', color: '#ec4899', order: 4 },
      { name: 'Academic Pressure', description: 'Support for academic stress and burnout', icon: '📚', color: '#8b5cf6', order: 5 },
      { name: 'Self-Care', description: 'Share self-care routines and wellness tips', icon: '🧘', color: '#14b8a6', order: 6 },
      { name: 'General Support', description: 'General mental health discussions', icon: '🤗', color: '#06b6d4', order: 7 }
    ];

    for (const cat of categories) {
      const existing = await ForumCategory.findOne({ name: cat.name });
      if (!existing) {
        await ForumCategory.create(cat);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`⏭️ Category already exists: ${cat.name}`);
      }
    }

    // Seed Demo Users (Admin and Counselors) FIRST
    const demoUsers = [
      {
        email: 'admin@mindcure.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        email: 'counselor@mindcure.com',
        password: 'Counselor123!',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: 'counselor',
        bio: 'Licensed mental health counselor with 10 years of experience specializing in anxiety and depression.',
        specializations: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
        isAvailable: true
      },
      {
        email: 'counselor2@mindcure.com',
        password: 'Counselor123!',
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        role: 'counselor',
        bio: 'Specializing in student mental health and academic stress counseling.',
        specializations: ['Academic Stress', 'Time Management', 'Self-Esteem', 'Mindfulness'],
        isAvailable: true
      },
      {
        email: 'student@mindcure.com',
        password: 'Student123!',
        firstName: 'Test',
        lastName: 'Student',
        role: 'student'
      }
    ];

    let counselorId = null;

    for (const userData of demoUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        const { password, ...rest } = userData;
        const passwordHash = await bcrypt.hash(password, 12);
        user = await User.create({ ...rest, passwordHash });
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`⏭️ User already exists: ${userData.email}`);
      }
      
      // Save the first counselor ID for resources
      if (userData.role === 'counselor' && !counselorId) {
        counselorId = user._id;
      }
    }

    // Seed Resources (requires a counselor ID for createdBy)
    if (counselorId) {
      const resources = [
        // Breathing Exercises with interactive patterns
        {
          title: '4-7-8 Breathing Technique',
          description: 'Guided breath pattern for easing anxious moments and supporting sleep.',
          content: 'The 4-7-8 breathing technique is a powerful relaxation method developed by Dr. Andrew Weil. It acts as a natural tranquilizer for the nervous system. Breathe in through your nose for 4 seconds, hold for 7 seconds, then exhale through your mouth for 8 seconds. Repeat 3-6 times.',
          type: 'breathing',
          category: 'breathing',
          duration: '3 min',
          icon: '🫁',
          difficulty: 'Beginner',
          breathingPattern: { inhale: 4, hold: 7, exhale: 8, cycles: 6 },
          videoUrl: 'https://www.youtube.com/watch?v=Uxbdx-SeOOo',
          source: { label: 'Cleveland Clinic', url: 'https://health.clevelandclinic.org/4-7-8-breathing' },
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['breathing', 'anxiety', 'sleep', 'relaxation']
        },
        {
          title: 'Box Breathing (4x4)',
          description: 'Equal 4-second phases used by clinicians and athletes to regain focus.',
          content: 'Box breathing, also known as square breathing, is a technique used by Navy SEALs and first responders to manage stress. Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. This creates a "box" pattern that promotes calm and focus.',
          type: 'breathing',
          category: 'breathing',
          duration: '4 min',
          icon: '📦',
          difficulty: 'Beginner',
          breathingPattern: { inhale: 4, hold: 4, exhale: 4, cycles: 7 },
          videoUrl: 'https://www.youtube.com/watch?v=KrCvxA7BzF4',
          source: { label: 'University of Michigan', url: 'https://www.uofmhealth.org/health-library/uz2255' },
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['breathing', 'focus', 'stress', 'grounding']
        },
        {
          title: 'Stress Reset Breathing',
          description: 'Even-paced breathing with brief holds to activate your parasympathetic nervous system.',
          content: 'This technique focuses on longer exhales to trigger your relaxation response. Inhale for 5 seconds, hold briefly for 2 seconds, exhale slowly for 6 seconds, then pause for 1 second. The extended exhale activates your vagus nerve.',
          type: 'breathing',
          category: 'breathing',
          duration: '5 min',
          icon: '🌬️',
          difficulty: 'Beginner',
          breathingPattern: { inhale: 5, hold: 2, exhale: 6, cycles: 8 },
          videoUrl: 'https://www.youtube.com/watch?v=zCzT9bYGh8E',
          source: { label: 'UCLA Health', url: 'https://www.uclahealth.org/news/breathwork' },
          isPublished: true,
          createdBy: counselorId,
          tags: ['breathing', 'stress relief', 'parasympathetic']
        },
        // Meditation resources with videos
        {
          title: 'Mindfulness Meditation for Beginners',
          description: 'A gentle introduction to observing thoughts, breath, and body sensations.',
          content: 'Mindfulness meditation is about paying attention to the present moment without judgment. Start by focusing on your breath. Notice when your mind wanders, and gently bring it back. There is no wrong way to do this - the practice is in the returning.',
          type: 'meditation',
          category: 'meditation',
          duration: '10 min',
          icon: '🧘',
          difficulty: 'Beginner',
          videoUrl: 'https://www.youtube.com/watch?v=U9YKY7fdwyg',
          source: { label: 'Mindful.org', url: 'https://www.mindful.org/meditation/mindfulness-getting-started/' },
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['meditation', 'mindfulness', 'beginner', 'awareness']
        },
        {
          title: 'Loving-Kindness Meditation',
          description: 'Cultivate compassion for yourself and others with metta practice.',
          content: 'Loving-kindness meditation (metta) involves silently repeating phrases of goodwill toward yourself and others. Start with: "May I be happy. May I be healthy. May I be safe. May I live with ease." Then extend these wishes to loved ones, neutral people, and eventually all beings.',
          type: 'meditation',
          category: 'meditation',
          duration: '15 min',
          icon: '💕',
          difficulty: 'Intermediate',
          videoUrl: 'https://www.youtube.com/watch?v=smXwNaoXRa8',
          source: { label: 'Greater Good Berkeley', url: 'https://ggia.berkeley.edu/practice/loving_kindness_meditation' },
          isPublished: true,
          createdBy: counselorId,
          tags: ['meditation', 'compassion', 'self-love', 'metta']
        },
        // Video Resources
        {
          title: 'Understanding Anxiety',
          description: 'Learn about the different types of anxiety disorders and evidence-based coping strategies.',
          content: 'Anxiety disorders are among the most common mental health conditions. They include generalized anxiety disorder (GAD), social anxiety, panic disorder, and specific phobias. This video explains the science behind anxiety and practical tools for managing symptoms.',
          type: 'video',
          category: 'anxiety',
          duration: '8 min',
          icon: '🧠',
          difficulty: 'Beginner',
          videoUrl: 'https://www.youtube.com/watch?v=WWloIAQpMcQ',
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['anxiety', 'mental health', 'education']
        },
        {
          title: 'Sleep Meditation - Deep Rest',
          description: 'A calming guided meditation designed to help you fall asleep naturally.',
          content: 'This sleep meditation uses progressive relaxation and visualization to help quiet your mind and prepare your body for restful sleep. Find a comfortable position in bed and let the gentle guidance lead you into peaceful slumber.',
          type: 'meditation',
          category: 'sleep',
          duration: '20 min',
          icon: '🌙',
          difficulty: 'Beginner',
          videoUrl: 'https://www.youtube.com/watch?v=aEqlQvczMJQ',
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['sleep', 'meditation', 'relaxation', 'insomnia']
        },
        // Article Resources
        {
          title: 'Sleep Hygiene Tips',
          description: 'Improve your sleep quality with these evidence-based tips and techniques.',
          content: 'Good sleep is essential for mental health. Here are key tips:\n\n1) Stick to a consistent sleep schedule - go to bed and wake up at the same time daily\n2) Create a relaxing bedtime routine - dim lights, avoid screens 1 hour before bed\n3) Make your bedroom sleep-friendly - cool, dark, and quiet\n4) Limit caffeine after 2 PM and avoid alcohol near bedtime\n5) Exercise regularly but finish at least 3 hours before bed\n6) If you cant sleep after 20 minutes, get up and do something calming',
          type: 'article',
          category: 'sleep',
          duration: '5 min read',
          icon: '😴',
          difficulty: 'Beginner',
          isFeatured: true,
          isPublished: true,
          createdBy: counselorId,
          tags: ['sleep', 'self-care', 'wellness', 'habits']
        },
        {
          title: 'Managing Academic Stress',
          description: 'Strategies for students to cope with academic pressure and maintain mental health.',
          content: 'Academic stress is common among students. Key strategies include:\n\n1) Break large tasks into smaller, manageable chunks\n2) Use a planner to manage time and deadlines\n3) Take regular breaks using the Pomodoro technique (25 min work, 5 min break)\n4) Practice self-compassion - progress over perfection\n5) Connect with classmates for study groups and support\n6) Reach out for help early - professors, tutors, counselors are there for you',
          type: 'guide',
          category: 'stress',
          duration: '7 min read',
          icon: '📚',
          difficulty: 'Beginner',
          isPublished: true,
          createdBy: counselorId,
          tags: ['academic', 'stress', 'students', 'time management']
        },
        {
          title: 'Building Healthy Relationships',
          description: 'Tips for maintaining healthy relationships and setting boundaries.',
          content: 'Healthy relationships are built on trust, communication, and mutual respect. Key elements include:\n\n1) Clear and honest communication - express needs and listen actively\n2) Setting and respecting boundaries - know your limits and honor others\n3) Supporting each others growth - celebrate achievements, offer comfort in struggles\n4) Managing conflicts constructively - focus on the issue, not personal attacks\n5) Maintaining individuality - healthy relationships allow space for personal interests',
          type: 'article',
          category: 'relationships',
          duration: '6 min read',
          icon: '🤝',
          difficulty: 'Beginner',
          isPublished: true,
          createdBy: counselorId,
          tags: ['relationships', 'communication', 'boundaries']
        },
        {
          title: 'Progressive Muscle Relaxation',
          description: 'Release physical tension through systematic muscle relaxation.',
          content: 'Progressive Muscle Relaxation (PMR) is a technique where you tense and then release different muscle groups. This helps identify and release physical tension you might not realize you are holding. Work through each muscle group: feet, calves, thighs, abdomen, chest, hands, arms, shoulders, neck, and face.',
          type: 'exercise',
          category: 'stress',
          duration: '15 min',
          icon: '💪',
          difficulty: 'Beginner',
          videoUrl: 'https://www.youtube.com/watch?v=KkPsYobwS98',
          source: { label: 'Therapist Aid', url: 'https://www.therapistaid.com/' },
          isPublished: true,
          createdBy: counselorId,
          tags: ['relaxation', 'body', 'tension', 'PMR']
        },
        {
          title: 'Body Scan Meditation',
          description: 'Move attention from head to toes to notice and release tension.',
          content: 'Body scan meditation involves systematically focusing attention on different parts of your body. Starting from the top of your head, slowly move your awareness down through your body, noticing any sensations without trying to change them. This practice builds body awareness and promotes relaxation.',
          type: 'meditation',
          category: 'meditation',
          duration: '20 min',
          icon: '🎯',
          difficulty: 'Beginner',
          videoUrl: 'https://www.youtube.com/watch?v=3nwwKbM_vJc',
          source: { label: 'UC San Diego Center for Mindfulness', url: 'https://cih.ucsd.edu/' },
          isPublished: true,
          createdBy: counselorId,
          tags: ['meditation', 'body scan', 'awareness', 'relaxation']
        }
      ];

      for (const res of resources) {
        const existing = await Resource.findOne({ title: res.title });
        if (!existing) {
          await Resource.create(res);
          console.log(`✅ Created resource: ${res.title}`);
        } else {
          console.log(`⏭️ Resource already exists: ${res.title}`);
        }
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   Admin:     admin@mindcure.com / Admin123!');
    console.log('   Counselor: counselor@mindcure.com / Counselor123!');
    console.log('   Counselor: counselor2@mindcure.com / Counselor123!');
    console.log('   Student:   student@mindcure.com / Student123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
