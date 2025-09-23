# MindCare - Mental Health Support Platform

A comprehensive mental health support platform for students that provides virtual therapy sessions, self-help resources, and peer support forums.

## 🌟 Features

### Phase 1 - Foundation (Completed)
- ✅ **Authentication System**: Secure Firebase-based authentication with role-based access
- ✅ **Responsive Design**: Modern UI with TailwindCSS and mobile-first approach
- ✅ **Landing Page**: Professional landing page with feature highlights
- ✅ **Dashboard**: Personalized dashboard with wellness overview
- ✅ **AI Support**: Google Gemini-powered mental health chatbot with crisis detection

### Phase 2 - Core Features (In Progress)
- 🔄 **Mood Tracking**: Visual mood logging and progress monitoring
- 🔄 **Self-Help Resources**: Educational content and guided exercises
- 🔄 **Crisis Intervention**: Emergency contact system and immediate support

### Phase 3 - Advanced Features (Planned)
- 📋 **Virtual Therapy**: Video calling integration for professional sessions
- 👥 **Support Forums**: Peer support groups and community features
- 📊 **Analytics**: Comprehensive mental health progress tracking

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom design system
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: Google Gemini API for mental health support
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts (for mood visualization)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore and Authentication enabled
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_GEMINI_API_KEY=your_gemini_api_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Firebase Setup

### Authentication
1. Enable Email/Password authentication in Firebase Console
2. Configure authorized domains for your deployment

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mood entries are private to each user
    match /moods/{moodId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Chat messages are private to each user
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions and branding
- **Secondary**: Gray tones for secondary elements
- **Success**: Green for positive feedback
- **Warning**: Orange for warnings
- **Danger**: Red for errors and crisis situations

### Typography
- **Font**: Inter (clean, modern, accessible)
- **Sizes**: Responsive typography scale

### Components
- **Cards**: Clean white backgrounds with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clear validation and error states

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data is encrypted in transit and at rest
- **Privacy First**: Minimal data collection, user-controlled privacy settings
- **Crisis Detection**: AI monitors for crisis situations and provides immediate resources
- **HIPAA Considerations**: Designed with healthcare privacy standards in mind

## 🆘 Crisis Support

The application includes multiple crisis intervention features:
- **Crisis Detection**: AI analyzes messages for concerning content
- **Immediate Resources**: Quick access to crisis hotlines (988, 911)
- **Professional Referrals**: Guidance to seek professional help when needed

### Emergency Contacts
- **Crisis Lifeline**: 988 (US)
- **Emergency Services**: 911
- **Crisis Text Line**: Text HOME to 741741

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interface
- **Mobile**: Mobile-first design with touch-friendly controls

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Environment Variables for Production
Make sure to set all required environment variables in your hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This platform provides mental health support but is not a substitute for professional medical care. If you're experiencing a mental health emergency, please contact emergency services immediately.

## 📞 Support

- **Technical Issues**: Create an issue on GitHub
- **Mental Health Crisis**: Call 988 (Suicide & Crisis Lifeline)
- **General Support**: Contact our support team

---

**MindCare** - Supporting student mental health through technology 💙+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
