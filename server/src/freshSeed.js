// Fresh Seed Script - Clears ALL data and recreates from scratch
// Run with: node src/freshSeed.js

import './config/loadEnv.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database.js';
import { User } from './models/User.js';
import { ForumCategory } from './models/ForumCategory.js';
import { ForumPost } from './models/ForumPost.js';
import { Resource } from './models/Resource.js';
import { Appointment } from './models/Appointment.js';
import { Activity } from './models/Activity.js';

const freshSeed = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database\n');

    // ========== CLEAR ALL COLLECTIONS ==========
    console.log('🗑️  Clearing all collections...');
    await Promise.all([
      User.deleteMany({}),
      ForumCategory.deleteMany({}),
      ForumPost.deleteMany({}),
      Resource.deleteMany({}),
      Appointment.deleteMany({}),
      Activity.deleteMany({})
    ]);
    console.log('✅ All collections cleared!\n');

    // ========== CREATE USERS ==========
    console.log('👥 Creating users...');
    
    const users = [
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
        bio: 'Licensed mental health counselor with 10 years of experience specializing in anxiety, depression, and stress management. I use evidence-based approaches including CBT and mindfulness techniques.',
        specializations: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
        isAvailable: true
      },
      {
        email: 'counselor2@mindcure.com',
        password: 'Counselor123!',
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        role: 'counselor',
        bio: 'Specializing in student mental health and academic stress counseling. I help students navigate the challenges of college life while maintaining their mental wellness.',
        specializations: ['Academic Stress', 'Time Management', 'Self-Esteem', 'Mindfulness'],
        isAvailable: true
      },
      {
        email: 'student@mindcure.com',
        password: 'Student123!',
        firstName: 'Alex',
        lastName: 'Thompson',
        role: 'student'
      },
      {
        email: 'student2@mindcure.com',
        password: 'Student123!',
        firstName: 'Jamie',
        lastName: 'Wilson',
        role: 'student'
      }
    ];

    const createdUsers = {};
    for (const userData of users) {
      const { password, ...rest } = userData;
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ ...rest, passwordHash });
      createdUsers[userData.email] = user;
      console.log(`   ✅ Created ${userData.role}: ${userData.email}`);
    }

    const counselor1 = createdUsers['counselor@mindcure.com'];
    const counselor2 = createdUsers['counselor2@mindcure.com'];
    const student1 = createdUsers['student@mindcure.com'];
    const student2 = createdUsers['student2@mindcure.com'];

    // ========== CREATE FORUM CATEGORIES ==========
    console.log('\n📂 Creating forum categories...');
    
    const categories = [
      { name: 'Anxiety', description: 'Discuss anxiety-related experiences and coping strategies', icon: '😰', color: '#f59e0b', order: 1 },
      { name: 'Depression', description: 'Support for those dealing with depression', icon: '🌧️', color: '#6366f1', order: 2 },
      { name: 'Stress Management', description: 'Tips and discussions about managing stress', icon: '💆', color: '#10b981', order: 3 },
      { name: 'Relationships', description: 'Talk about relationship challenges and advice', icon: '💕', color: '#ec4899', order: 4 },
      { name: 'Academic Pressure', description: 'Support for academic stress and burnout', icon: '📚', color: '#8b5cf6', order: 5 },
      { name: 'Self-Care', description: 'Share self-care routines and wellness tips', icon: '🧘', color: '#14b8a6', order: 6 },
      { name: 'General Support', description: 'General mental health discussions and peer support', icon: '🤗', color: '#06b6d4', order: 7 }
    ];

    const createdCategories = {};
    for (const cat of categories) {
      const category = await ForumCategory.create(cat);
      createdCategories[cat.name] = category;
      console.log(`   ✅ Created category: ${cat.icon} ${cat.name}`);
    }

    // ========== CREATE RESOURCES ==========
    console.log('\n📚 Creating resources...');
    
    const resources = [
      {
        title: 'Understanding Anxiety: A Complete Guide',
        description: 'Learn about the different types of anxiety disorders and how to manage symptoms effectively.',
        content: `Anxiety is one of the most common mental health conditions, affecting millions of people worldwide. This guide will help you understand what anxiety is, its different forms, and evidence-based strategies for managing it.

**Types of Anxiety Disorders:**
- Generalized Anxiety Disorder (GAD)
- Social Anxiety Disorder
- Panic Disorder
- Specific Phobias

**Common Symptoms:**
- Excessive worry
- Restlessness
- Difficulty concentrating
- Sleep problems
- Physical symptoms (rapid heartbeat, sweating)

**Management Strategies:**
1. Deep breathing exercises
2. Progressive muscle relaxation
3. Cognitive restructuring
4. Regular exercise
5. Adequate sleep
6. Limiting caffeine and alcohol

Remember: Anxiety is treatable, and seeking help is a sign of strength.`,
        type: 'article',
        category: 'anxiety',
        duration: '8 min read',
        isFeatured: true,
        isPublished: true,
        createdBy: counselor1._id,
        tags: ['anxiety', 'mental health', 'coping strategies', 'self-help']
      },
      {
        title: 'Guided Meditation for Stress Relief',
        description: 'A 10-minute guided meditation to help you relax and reduce stress.',
        content: `This guided meditation will help you find calm and reduce stress. Find a comfortable position, close your eyes, and follow along.

**Preparation:**
- Find a quiet space
- Sit or lie down comfortably
- Set aside 10-15 minutes

**The Practice:**
Begin by taking three deep breaths. Inhale through your nose, exhale through your mouth. Allow your body to relax with each exhale.

Focus your attention on your breath. Notice the natural rhythm without trying to change it. When your mind wanders, gently bring it back to your breath.

Scan your body from head to toe, releasing any tension you find. Relax your forehead, jaw, shoulders, and continue down to your toes.

End by slowly bringing your awareness back to the room. Open your eyes when ready.`,
        type: 'audio',
        category: 'stress',
        duration: '10 min',
        url: 'https://example.com/meditation',
        isPublished: true,
        createdBy: counselor1._id,
        tags: ['meditation', 'stress relief', 'relaxation', 'mindfulness']
      },
      {
        title: 'Sleep Hygiene: Better Sleep for Better Mental Health',
        description: 'Improve your sleep quality with these evidence-based tips and techniques.',
        content: `Good sleep is fundamental to mental health. Poor sleep can worsen anxiety, depression, and stress. Here's how to improve your sleep:

**Sleep Hygiene Tips:**

1. **Consistent Schedule**: Go to bed and wake up at the same time every day, even on weekends.

2. **Create a Sleep Environment**: Keep your bedroom dark, cool, and quiet. Consider blackout curtains or a white noise machine.

3. **Limit Screen Time**: Avoid phones, tablets, and computers for at least 1 hour before bed. Blue light disrupts melatonin production.

4. **Watch Your Diet**: Avoid caffeine after 2 PM. Don't eat heavy meals close to bedtime.

5. **Exercise Regularly**: Regular physical activity improves sleep quality, but avoid vigorous exercise within 3 hours of bedtime.

6. **Relaxation Routine**: Develop a calming pre-sleep routine: warm bath, reading, gentle stretching.

7. **Reserve Bed for Sleep**: Train your brain to associate your bed with sleep, not work or scrolling.

**When to Seek Help:**
If sleep problems persist for more than a few weeks, consult a healthcare provider.`,
        type: 'article',
        category: 'self-care',
        duration: '5 min read',
        isFeatured: true,
        isPublished: true,
        createdBy: counselor2._id,
        tags: ['sleep', 'self-care', 'wellness', 'mental health']
      },
      {
        title: '4-7-8 Breathing Technique for Calm',
        description: 'Simple breathing exercises you can do anywhere to reduce anxiety and stress instantly.',
        content: `The 4-7-8 breathing technique is a powerful tool for managing anxiety and stress. It activates your parasympathetic nervous system, promoting relaxation.

**How to Practice:**

1. **Inhale** through your nose for **4 seconds**
2. **Hold** your breath for **7 seconds**
3. **Exhale** through your mouth for **8 seconds**
4. **Repeat** 3-4 times

**Tips:**
- Practice in a comfortable position
- Keep the tip of your tongue behind your upper front teeth
- Exhale completely before starting
- Start with 2-3 cycles and work up to 4

**When to Use:**
- Before stressful situations
- When feeling anxious
- Before sleep
- During panic attacks
- Anytime you need to calm down

This technique is completely natural, requires no equipment, and can be done anywhere.`,
        type: 'exercise',
        category: 'anxiety',
        duration: '5 min',
        isPublished: true,
        createdBy: counselor1._id,
        tags: ['breathing', 'anxiety relief', 'exercise', 'quick tips']
      },
      {
        title: 'Managing Academic Stress: A Student\'s Guide',
        description: 'Strategies for students to cope with academic pressure and maintain mental health.',
        content: `Academic stress is incredibly common among students. Here's how to manage it effectively:

**Understanding Academic Stress:**
- Exams and deadlines
- Grade pressure
- Future career concerns
- Balancing work and study
- Social expectations

**Coping Strategies:**

1. **Break Tasks Down**: Large projects feel overwhelming. Divide them into smaller, manageable tasks.

2. **Time Management**: Use a planner or digital calendar. Schedule study blocks and breaks.

3. **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.

4. **Self-Compassion**: Perfection isn't the goal. Celebrate progress, not just results.

5. **Support Network**: Connect with classmates, friends, or counselors. You're not alone.

6. **Physical Health**: Exercise, sleep, and nutrition directly impact academic performance.

7. **Know Your Limits**: It's okay to say no to extra commitments when overwhelmed.

**Warning Signs:**
- Constant exhaustion
- Loss of interest in activities
- Difficulty concentrating
- Changes in sleep or appetite

If you're struggling, reach out to a counselor. They can help!`,
        type: 'guide',
        category: 'general',
        duration: '7 min read',
        isFeatured: true,
        isPublished: true,
        createdBy: counselor2._id,
        tags: ['academic', 'stress', 'students', 'time management', 'study tips']
      },
      {
        title: 'Building Healthy Relationships',
        description: 'Tips for maintaining healthy relationships and setting boundaries.',
        content: `Healthy relationships are crucial for mental well-being. Here's how to nurture them:

**Key Elements of Healthy Relationships:**

1. **Communication**: Express your needs clearly and listen actively to others.

2. **Boundaries**: Know your limits and communicate them respectfully. It's okay to say no.

3. **Mutual Respect**: Value each other's opinions, feelings, and autonomy.

4. **Trust**: Build trust through consistency, honesty, and reliability.

5. **Support**: Be there for each other during difficult times while maintaining your own well-being.

**Setting Boundaries:**
- Identify what makes you uncomfortable
- Communicate boundaries clearly
- Be consistent in enforcing them
- Accept that some people may not respect your boundaries

**Red Flags:**
- Controlling behavior
- Constant criticism
- Lack of respect for boundaries
- Manipulation or guilt-tripping

**Remember:** Healthy relationships should add to your life, not drain you. It's okay to distance yourself from toxic relationships.`,
        type: 'article',
        category: 'relationships',
        duration: '6 min read',
        isPublished: true,
        createdBy: counselor1._id,
        tags: ['relationships', 'communication', 'boundaries', 'self-care']
      },
      {
        title: 'Understanding Depression',
        description: 'An informative guide about depression, its symptoms, and treatment options.',
        content: `Depression is more than just feeling sad. It's a serious mental health condition that requires understanding and proper treatment.

**What is Depression?**
Depression is a mood disorder characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities.

**Common Symptoms:**
- Persistent sad or empty mood
- Loss of interest in activities
- Changes in appetite and weight
- Sleep disturbances
- Fatigue and low energy
- Difficulty concentrating
- Feelings of worthlessness
- Thoughts of death or suicide

**Treatment Options:**
1. **Therapy**: CBT, interpersonal therapy, and other approaches
2. **Medication**: Antidepressants prescribed by a doctor
3. **Lifestyle Changes**: Exercise, diet, sleep
4. **Support Groups**: Connecting with others who understand
5. **Self-Care**: Activities that bring joy and relaxation

**Getting Help:**
Depression is treatable. If you're experiencing symptoms, please reach out to a mental health professional or your healthcare provider.

**Crisis Resources:**
If you're having thoughts of suicide, please contact a crisis helpline immediately.`,
        type: 'article',
        category: 'depression',
        duration: '10 min read',
        isFeatured: false,
        isPublished: true,
        createdBy: counselor2._id,
        tags: ['depression', 'mental health', 'treatment', 'support']
      }
    ];

    for (const res of resources) {
      await Resource.create(res);
      console.log(`   ✅ Created resource: ${res.title}`);
    }

    // ========== CREATE FORUM POSTS ==========
    console.log('\n💬 Creating forum posts...');

    const posts = [
      {
        title: 'How do you deal with exam anxiety?',
        content: 'I have finals coming up and I\'m really struggling with anxiety. My mind goes blank during exams even though I study hard. Does anyone have tips for managing test anxiety? I\'ve tried deep breathing but it doesn\'t seem to help much.',
        author: student1._id,
        category: createdCategories['Academic Pressure']._id,
        status: 'approved',
        tags: ['exams', 'anxiety', 'study tips']
      },
      {
        title: 'Morning routine for better mental health',
        content: 'I\'ve been working on building a morning routine that helps my mental health. Currently I do: 10 min meditation, journaling, light exercise, and a healthy breakfast. It\'s made a huge difference! What\'s in your morning routine?',
        author: student2._id,
        category: createdCategories['Self-Care']._id,
        status: 'approved',
        isPinned: true,
        tags: ['routine', 'self-care', 'morning']
      },
      {
        title: 'Feeling overwhelmed with everything',
        content: 'Between classes, work, and trying to have a social life, I feel like I\'m drowning. I barely have time to sleep. How do you all manage to balance everything without burning out?',
        author: student1._id,
        category: createdCategories['Stress Management']._id,
        status: 'approved',
        isAnonymous: true,
        tags: ['stress', 'balance', 'overwhelmed']
      }
    ];

    for (const post of posts) {
      const createdPost = await ForumPost.create(post);
      // Update category post count
      await ForumCategory.findByIdAndUpdate(post.category, { $inc: { postCount: 1 } });
      console.log(`   ✅ Created post: ${post.title}`);
    }

    // ========== CREATE APPOINTMENTS ==========
    console.log('\n📅 Creating sample appointments...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointments = [
      {
        student: student1._id,
        counselor: counselor1._id,
        date: tomorrow,
        timeSlot: '10:00-11:00',
        type: 'video',
        reason: 'Struggling with anxiety and would like to discuss coping strategies',
        status: 'confirmed',
        meetingLink: 'https://meet.mindcure.com/session-123'
      },
      {
        student: student2._id,
        counselor: counselor2._id,
        date: nextWeek,
        timeSlot: '14:00-15:00',
        type: 'video',
        reason: 'Academic stress and time management issues',
        status: 'pending'
      }
    ];

    for (const apt of appointments) {
      await Appointment.create(apt);
      console.log(`   ✅ Created appointment: ${apt.status} - ${apt.timeSlot}`);
    }

    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(50));
    console.log('🎉 FRESH SEED COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    
    console.log('\n📊 Database Statistics:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   📂 Forum Categories: ${await ForumCategory.countDocuments()}`);
    console.log(`   💬 Forum Posts: ${await ForumPost.countDocuments()}`);
    console.log(`   📚 Resources: ${await Resource.countDocuments()}`);
    console.log(`   📅 Appointments: ${await Appointment.countDocuments()}`);

    console.log('\n📋 Demo Accounts:');
    console.log('   ┌─────────────┬──────────────────────────┬───────────────┐');
    console.log('   │ Role        │ Email                    │ Password      │');
    console.log('   ├─────────────┼──────────────────────────┼───────────────┤');
    console.log('   │ 🛡️  Admin    │ admin@mindcure.com       │ Admin123!     │');
    console.log('   │ 🩺 Counselor │ counselor@mindcure.com   │ Counselor123! │');
    console.log('   │ 🩺 Counselor │ counselor2@mindcure.com  │ Counselor123! │');
    console.log('   │ 👨‍🎓 Student  │ student@mindcure.com     │ Student123!   │');
    console.log('   │ 👨‍🎓 Student  │ student2@mindcure.com    │ Student123!   │');
    console.log('   └─────────────┴──────────────────────────┴───────────────┘');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fresh seed failed:', error);
    process.exit(1);
  }
};

freshSeed();
