<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>
  <img src="https://github.com/user-attachments/assets/84caf27e-d9b1-4366-ac5c-c6670f95788c" alt="MindCure" />


<h1 align="center">🧠 MindCure</h1>

<p align="center">
  <strong>A Comprehensive Mental Health & Wellness Platform for Students</strong>
</p>

<p align="center">
  <em>Empowering students with AI-powered therapy, mood tracking, peer support, and professional counseling — all in one place.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-api-documentation">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

### 🤖 AI-Powered Therapy Chat
- **24/7 Support**: Google Gemini-powered mental health chatbot available anytime
- **Crisis Detection**: Intelligent detection of distressing content with immediate resources
- **Empathetic Responses**: Trained to provide compassionate, helpful support
- **Conversation History**: Review past conversations for reflection

### 📊 Mood Tracking & Analytics
- **Daily Check-ins**: Log your mood with a simple, beautiful interface
- **Emotion Tagging**: Track specific emotions and triggers
- **Visual Progress**: Beautiful charts showing mood patterns over time
- **Insights**: AI-generated insights about your mental health journey

### 👥 Support Circle (Social Features)
- **Friend System**: Connect with classmates and peers who care
- **Real-time Messaging**: Private chat with friends in your support circle
- **User Profiles**: View friends' profiles and track their wellness journey
- **Friend Requests**: Send and receive friend requests with notifications

### 🏆 Gamification & Achievements
- **XP System**: Earn experience points for healthy habits
- **Badges**: Unlock achievements like "First Check-in", "Week Streak", "Mood Helper"
- **Progress Tracking**: Visual progress toward next achievements
- **Engagement Rewards**: Stay motivated with gamified wellness activities

### 📅 Counselor Appointments
- **Book Sessions**: Schedule appointments with professional counselors
- **Available Slots**: View counselor availability in real-time
- **Appointment Management**: View, reschedule, or cancel appointments
- **Video Integration**: Seamless video calling for virtual sessions

### 📚 Self-Help Resources
- **Guided Exercises**: Breathing exercises, meditation, and mindfulness
- **Educational Content**: Articles and videos on mental health topics
- **Coping Strategies**: Evidence-based techniques for managing stress
- **Emergency Resources**: Quick access to crisis hotlines

### 🚨 Crisis Intervention
- **Crisis Detection**: AI monitors for emergency situations
- **Immediate Resources**: One-tap access to helplines
- **Safety Planning**: Tools to create personalized safety plans
- **Professional Referrals**: Guidance to seek professional help

### 👨‍💼 Role-Based Dashboards
- **Student Dashboard**: Full access to all wellness features
- **Counselor Dashboard**: Manage appointments, view student progress
- **Admin Dashboard**: User management, analytics, system oversight

### 🔔 Smart Notifications
- **Friend Activity**: Get notified when friends need support
- **Appointment Reminders**: Never miss a counseling session
- **Achievement Alerts**: Celebrate when you unlock new badges
- **Check-in Reminders**: Gentle nudges to log your mood

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool & Dev Server |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) | Navigation |
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?style=flat) | Icons |
| ![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat) | Data Visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Runtime |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | API Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat) | ODM |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Authentication |

### AI & APIs
| Technology | Purpose |
|------------|---------|
| ![Google](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google&logoColor=white) | AI Chat & Analysis |

### Deployment
| Platform | Service |
|----------|---------|
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) | Frontend Hosting |
| ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white) | Backend API |
| ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white) | Cloud Database |

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
Node.js 18+ 
npm or yarn

# Optional (for AI features)
Google Gemini API Key
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/MindCure.git
cd MindCure

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Running the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
MindCure/
├── 📂 src/                    # Frontend source code
│   ├── 📂 components/         # Reusable UI components
│   │   ├── 📂 auth/          # Authentication components
│   │   ├── 📂 chat/          # AI Chat interface
│   │   ├── 📂 community/     # Forum & community features
│   │   ├── 📂 layout/        # Layout components (Navbar, Footer)
│   │   ├── 📂 mood/          # Mood tracking components
│   │   ├── 📂 social/        # Friends, Messages, Achievements
│   │   └── 📂 ui/            # Base UI components
│   ├── 📂 context/           # React Context providers
│   ├── 📂 hooks/             # Custom React hooks
│   ├── 📂 pages/             # Page components
│   ├── 📂 services/          # API service functions
│   └── 📂 utils/             # Utility functions
├── 📂 server/                 # Backend source code
│   └── 📂 src/
│       ├── 📂 config/        # Configuration files
│       ├── 📂 controllers/   # Route controllers
│       ├── 📂 middleware/    # Express middleware
│       ├── 📂 models/        # Mongoose models
│       ├── 📂 routes/        # API routes
│       └── 📄 index.js       # Server entry point
├── 📂 public/                 # Static assets
└── 📄 package.json           # Dependencies
```

---

## 📱 Screenshots

<p align="center">
  <em>Screenshots coming soon...</em>
</p>

<!-- 
Add screenshots here:
![Dashboard](./docs/screenshots/dashboard.png)
![Mood Tracker](./docs/screenshots/mood-tracker.png)
![AI Chat](./docs/screenshots/ai-chat.png)
-->

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| 🔵 Primary | `#0ea5e9` | Main actions, links, branding |
| 🟣 Accent | `#8b5cf6` | Highlights, special elements |
| 🟢 Success | `#22c55e` | Positive feedback, completed states |
| 🟡 Warning | `#f59e0b` | Warnings, pending states |
| 🔴 Danger | `#ef4444` | Errors, crisis situations |
| ⚪ Neutral | `#64748b` | Secondary text, borders |

### Typography
- **Headings**: Bold, Modern styling
- **Body**: Clean, Readable fonts
- **Responsive**: Scales beautifully across devices

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Multiple variants (primary, secondary, ghost, danger)
- **Forms**: Accessible inputs with clear validation states
- **Modals**: Smooth animations, backdrop blur

---

## 📱 Responsive Design

MindCure is fully responsive and optimized for all devices:

| Device | Features |
|--------|----------|
| 📱 **Mobile** | Bottom navigation, touch-friendly controls, compact layouts |
| 📱 **Tablet** | Optimized layouts, touch interface |
| 💻 **Desktop** | Full-featured experience with sidebar navigation |

---

## 🔌 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user
```

### Mood Tracking
```
GET    /api/mood              # Get mood entries
POST   /api/mood              # Create mood entry
GET    /api/mood/stats        # Get mood statistics
```

### Friends & Social
```
GET    /api/friends           # Get friends list
POST   /api/friends/request   # Send friend request
PUT    /api/friends/:id       # Accept/reject request
```

### Messages
```
GET    /api/messages/conversations  # Get conversations
POST   /api/messages               # Send message
GET    /api/messages/:conversationId # Get messages
```

### Achievements
```
GET    /api/achievements       # Get user achievements
```

---

## 🔒 Security & Privacy

- 🔐 **JWT Authentication**: Secure token-based auth
- 🔒 **Password Hashing**: bcrypt encryption
- 🛡️ **CORS Protection**: Configured for production domains
- 📝 **Input Validation**: Server-side validation with Zod
- 🚫 **Rate Limiting**: API rate limiting to prevent abuse
- 🔏 **Privacy First**: Minimal data collection

---

## 🆘 Crisis Support

### Emergency Contacts (India)

| Service | Number | Description |
|---------|--------|-------------|
| 📞 **Tele-MANAS** | `14416` | National Mental Health Helpline |
| 🚑 **Emergency** | `112` | Police/Fire/Ambulance |
| 💚 **KIRAN Helpline** | `1800-599-0019` | 24/7 Mental Health Support |
| 👩 **Women Helpline** | `181` | Women in distress |
| 👶 **CHILDLINE** | `1098` | Child protection |

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to `main`

**Live API**: `https://mindcure-api.onrender.com`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Code Style
- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

> **Important**: This platform provides mental health support but is **not a substitute** for professional medical care. If you're experiencing a mental health emergency, please contact:
> - **Tele-MANAS**: 14416
> - **Emergency Services**: 112

---

## 💙 Acknowledgments

- Google Gemini for AI capabilities
- The open-source community for amazing tools
- Mental health professionals who provided guidance
- All contributors and testers

---

<p align="center">
  <strong>Made with 💙 for Student Mental Health</strong>
</p>

<p align="center">
  <a href="#-features">⬆️ Back to Top</a>
</p>
