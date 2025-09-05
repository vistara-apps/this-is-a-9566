# MiraID - Your Instant Know-Your-Rights Guide

MiraID provides instant, state-specific legal guidance and documentation tools for individuals engaging with law enforcement, making legal rights accessible to everyone.

## 🚀 Features

### Core Features
- **State-Specific Rights & Scripts**: Tailored legal guidance based on location and situation
- **Real-time Incident Recording**: One-tap audio/video recording with automatic timestamping
- **Bilingual Content**: Full English and Spanish support
- **Shareable Incident Summaries**: AI-generated summaries for legal counsel

### Premium Features ($5/month)
- Advanced AI-powered scripting
- Unlimited incident storage
- Priority support
- Enhanced sharing capabilities

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI GPT-3.5-turbo
- **Payments**: Stripe
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd miraid
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL in `database-schema.sql` in your Supabase SQL editor
3. This will create all necessary tables, policies, and sample data

### 4. Storage Setup

In your Supabase dashboard:
1. Go to Storage
2. The `recordings` bucket should be created automatically by the schema
3. Verify the bucket policies are in place

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── InfoCard.jsx    # Legal information display
│   ├── LanguageSwitcher.jsx
│   ├── NavBar.jsx
│   ├── RecordButton.jsx
│   └── ShareButton.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   └── LocationContext.jsx
├── lib/               # Core services
│   ├── supabase.js    # Supabase client & auth
│   ├── openai.js      # AI script generation
│   ├── stripe.js      # Payment processing
│   └── database.js    # Database operations
├── pages/             # Route components
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx
│   ├── GuidesPage.jsx
│   ├── RecordingPage.jsx
│   ├── IncidentsPage.jsx
│   └── ProfilePage.jsx
└── index.css          # Global styles
```

## 🗄 Database Schema

### Tables
- **users**: User profiles and subscription status
- **incidents**: Recorded incidents with metadata
- **legal_guides**: State-specific legal content

### Storage
- **recordings**: Audio/video files from incidents

## 🔧 Configuration

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Run the database schema
4. Configure storage policies

### OpenAI Setup
1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to environment variables
3. Monitor usage and set limits

### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get publishable key
3. Set up webhook endpoints for production
4. Configure subscription products

## 🚀 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t miraid .

# Run the container
docker run -p 3000:3000 miraid
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- Use production Supabase URL and keys
- Use production Stripe keys
- Set `VITE_APP_ENV=production`
- Set correct `VITE_APP_URL`

## 🔒 Security Considerations

- All API keys should be kept secure
- Supabase RLS policies protect user data
- File uploads are restricted to authenticated users
- Recording storage is private by default

## 🌐 Internationalization

The app supports English and Spanish:
- Legal content is stored in both languages
- AI-generated scripts respect language preference
- UI components adapt to selected language

## 📱 Progressive Web App

MiraID is designed as a PWA for:
- Offline access to basic rights information
- Quick access during emergencies
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support:
- Check the documentation
- Open an issue on GitHub
- Contact support@miraid.app

## 🔄 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Integration with legal aid organizations
- [ ] Multi-language expansion
- [ ] Offline mode improvements

---

**Important**: This app provides general legal information and should not replace professional legal advice. Always consult with a qualified attorney for specific legal matters.
