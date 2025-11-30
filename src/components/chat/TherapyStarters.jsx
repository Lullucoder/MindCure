import React from 'react';
import { Brain, Heart, Shield, Lightbulb, Clock, Users } from 'lucide-react';

const starters = [
  {
    category: 'Anxiety & Stress',
    icon: Brain,
    tone: 'calm',
    prompts: [
      "I've been feeling anxious lately and don't know how to manage it",
      "My stress levels are through the roof and I need coping strategies",
      "I'm having panic attacks and feel overwhelmed",
      "Constant worry is affecting my daily life"
    ]
  },
  {
    category: 'Depression & Mood',
    icon: Heart,
    tone: 'uplift',
    prompts: [
      "I've been feeling down and hopeless for weeks",
      "I'm struggling to find motivation for anything",
      "Everything feels overwhelming and I don't know where to start",
      "I feel empty and disconnected from life"
    ]
  },
  {
    category: 'Relationships',
    icon: Users,
    tone: 'connection',
    prompts: [
      "I'm having relationship problems and need perspective",
      "I feel lonely and isolated from others",
      "Family conflicts are causing me stress",
      "I struggle with setting healthy boundaries"
    ]
  },
  {
    category: 'Self-Care & Coping',
    icon: Shield,
    tone: 'shield',
    prompts: [
      "I need help developing healthy coping strategies",
      "How can I practice better self-care?",
      "I want to build resilience and emotional strength",
      "Help me create a daily wellness routine"
    ]
  },
  {
    category: 'Life Transitions',
    icon: Lightbulb,
    tone: 'growth',
    prompts: [
      "I'm going through major life changes and feeling lost",
      "Starting college/work is overwhelming me",
      "I'm struggling with identity and purpose questions",
      "How do I navigate uncertainty about my future?"
    ]
  },
  {
    category: 'Crisis Support',
    icon: Clock,
    tone: 'urgent',
    prompts: [
      "I'm in crisis and need immediate support",
      "I'm having thoughts of self-harm",
      "I feel like I can't go on anymore",
      "I need emergency coping strategies right now"
    ]
  }
];

const TherapyStarters = ({ onStarterClick }) => (
  <section className="chat-starters">
    <header className="chat-starters__intro">
      <h3>Where would you like to begin?</h3>
      <p>Pick a prompt or type freely—this space adjusts to what you need.</p>
    </header>

    <div className="chat-starters__grid">
      {starters.map((starter) => {
        const Icon = starter.icon;
        return (
          <article key={starter.category} className="chat-starter-card" data-tone={starter.tone}>
            <div className="chat-starter-card__title">
              <span className="chat-starter-card__icon">
                <Icon className="chat-starter-card__icon-symbol" />
              </span>
              <span>{starter.category}</span>
            </div>
            <div className="chat-starter-card__prompts">
              {starter.prompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  className="chat-starter-chip"
                  onClick={() => onStarterClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </article>
        );
      })}
    </div>

    <footer className="chat-starters__safety">
      <Shield className="chat-starters__safety-icon" />
      <div>
        <strong>This space is confidential.</strong>
        <p>
          Share at your own pace. If you are in immediate danger, call <strong>14416 (Tele-MANAS)</strong> or{' '}
          <strong>112</strong> right away.
        </p>
      </div>
    </footer>
  </section>
);

export default TherapyStarters;