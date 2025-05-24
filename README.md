# 🎨 MOCK IDEA - Professional Logo Mockup Generator

[![License](https://img.shields.io/badge/License-Commercial-red.svg)](COMMERCIAL_LICENSE.md)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)
[![Deploy](https://img.shields.io/badge/Deploy-Render-purple.svg)](https://render.com)

**MOCK IDEA** is an enterprise-grade SaaS platform that revolutionizes logo mockup creation. Transform any logo into professional mockups across hundreds of templates in seconds, powered by advanced AI analysis and real-time generation technology.

> 🚀 **Repository**: [https://github.com/NOVUMSOLVO/MOCK-IDEA](https://github.com/NOVUMSOLVO/MOCK-IDEA)
> 🌐 **Live Demo**: Coming Soon
> 📧 **Contact**: [contact@novumsolvo.com](mailto:contact@novumsolvo.com)

---

## ✨ Key Features

### 🎯 **Core Functionality**
- **AI-Powered Logo Analysis** - Advanced style detection, complexity scoring, and smart positioning
- **500+ Premium Templates** - Professional mockups across business cards, apparel, signage, digital assets
- **Real-time Generation** - Lightning-fast mockup creation with live preview
- **Batch Processing** - Generate multiple variations simultaneously
- **Brand Kit Management** - Organize logos, colors, and brand assets

### 🚀 **Advanced Capabilities**
- **Smart Template Recommendations** - AI suggests optimal templates based on logo characteristics
- **Custom Positioning Engine** - Intelligent logo placement with rotation and scaling
- **Background Removal** - Automatic logo background cleanup
- **Color Palette Extraction** - Automatic brand color detection and matching
- **Export Formats** - High-resolution PNG, JPG, PDF, and vector formats

### 💼 **Enterprise Features**
- **Team Collaboration** - Multi-user workspaces with role-based permissions
- **API Access** - RESTful API for integration with existing workflows
- **White-label Solutions** - Custom branding for agencies and enterprises
- **Advanced Analytics** - Usage tracking, performance metrics, and insights
- **Priority Support** - Dedicated support channels for enterprise customers

### 🔒 **Security & Compliance**
- **SOC 2 Type II Compliant** - Enterprise-grade security standards
- **GDPR Compliant** - Full data protection and privacy compliance
- **End-to-end Encryption** - All data encrypted in transit and at rest
- **Regular Security Audits** - Continuous monitoring and vulnerability assessments

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Queue management and caching
- **Socket.io** - Real-time communication
- **Sharp** - Image processing
- **Bull** - Job queue management
- **Stripe** - Payment processing

### Infrastructure
- **AWS S3** - File storage
- **Docker** - Containerization
- **JWT** - Authentication

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- AWS S3 account (for file storage)
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NOVUMSOLVO/MOCK-IDEA.git
cd MOCK-IDEA
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
./setup-dev.sh
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm install
npm run dev
```

### 4. Start the Services

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mock_idea"
JWT_SECRET="your-super-secret-jwt-key"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
S3_BUCKET_NAME="mock-idea-assets"
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with subscription tiers
- **Logo**: Uploaded logo files with AI analysis
- **Template**: Mockup templates with categories
- **Mockup**: Generated mockups with customizations
- **Subscription**: Stripe subscription management

## 🎨 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Logos
- `POST /api/logos/upload` - Upload logo file
- `GET /api/logos` - Get user's logos
- `DELETE /api/logos/:id` - Delete logo

### Templates
- `GET /api/templates` - Get templates with filtering
- `GET /api/templates/:id` - Get specific template

### Mockups
- `POST /api/mockups` - Create new mockup
- `GET /api/mockups` - Get user's mockups
- `GET /api/mockups/:id` - Get specific mockup

## 🔄 Development Workflow

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Run migrations
npx prisma migrate dev

# Seed database
npm run db:seed

# Open Prisma Studio
npx prisma studio
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 Demo Account

For testing purposes, use these credentials:
- **Email**: demo@mockidea.com
- **Password**: demo1234

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under a Commercial License - see the [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md) file for details.

**⚠️ Important**: This is proprietary software. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/NOVUMSOLVO/MOCK-IDEA/issues) page
2. Create a new issue with detailed information
3. Contact support at [contact@novumsolvo.com](mailto:contact@novumsolvo.com)

## 🗺️ Roadmap

- [x] ✅ AI-powered logo analysis and positioning
- [x] ✅ Real-time mockup generation
- [x] ✅ OAuth authentication (Google, Microsoft, GitHub)
- [x] ✅ Stripe payment integration
- [ ] 🚧 Batch mockup generation
- [ ] 🚧 Team collaboration features
- [ ] 🚧 Custom template creation tools
- [ ] 🚧 Mobile app (iOS/Android)
- [ ] 🚧 Public API for third-party integrations
- [ ] 🚧 White-label solutions

## 🏢 About NOVUMSOLVO

**NOVUMSOLVO** is a technology company specializing in innovative SaaS solutions for creative professionals and businesses. We build cutting-edge tools that streamline workflows and enhance productivity.

### Our Mission
To democratize professional design tools and make high-quality mockup creation accessible to everyone.

### Our Values
- **Innovation**: Pushing the boundaries of what's possible
- **Quality**: Delivering exceptional user experiences
- **Security**: Protecting our users' data and privacy
- **Accessibility**: Making powerful tools available to all

---

**© 2024 NOVUMSOLVO. All rights reserved.**

Made with ❤️ by the NOVUMSOLVO team | [Website](https://novumsolvo.com) | [Contact](mailto:contact@novumsolvo.com)
