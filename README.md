# ReelHaus - Premium Club Events Portal

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-blue?style=for-the-badge)](https://razorpay.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, mobile-first events platform built with Next.js 15, featuring secure payments, instant QR codes, and comprehensive admin management.

## 🎯 Overview

ReelHaus is a premium club events portal that provides a seamless experience for event discovery, registration, and management. Built with the latest web technologies, it features a stunning **Lightning Red** theme, fast navigation, and production-ready architecture.

## ✨ Key Features

### 🎨 **Design & UX**
- **Lightning Red Theme**: Beautiful red color scheme with gradient effects
- **Mobile-First Design**: Fully responsive across all devices
- **Glass Morphism**: Modern glass effects and animations
- **Fast Navigation**: Quick access navigation bar with smooth scrolling
- **Loading States**: Professional skeleton loaders and progress indicators

### 🎪 **Event Management**
- **Event Discovery**: Browse and filter events by category
- **Event Details**: Comprehensive event information with lineup and reviews
- **Registration System**: Multi-step registration with dynamic attendee collection
- **Seat Management**: Real-time seat availability tracking
- **Event Categories**: Organized by music genres and event types

### 💳 **Payment Integration**
- **Razorpay Integration**: Secure payment processing
- **Multiple Payment Methods**: Credit cards, debit cards, UPI, net banking
- **Payment Security**: SSL encryption and PCI compliance
- **Instant Confirmation**: Real-time payment verification
- **Receipt Generation**: Automated payment receipts

### 🔐 **Admin Dashboard**
- **Secure Authentication**: ENV-based admin login with JWT tokens
- **Event Management**: CRUD operations for events
- **Registration Management**: View and manage event registrations
- **Analytics Dashboard**: Statistics and insights
- **Export Functionality**: Excel export for registrations
- **Audit Logging**: Complete admin action tracking

### ⚡ **Background Workers**
- **QR Code Generation**: Automated QR codes with HMAC signatures
- **Email Automation**: Professional email templates with SendGrid
- **Excel Export**: Automated report generation
- **Queue Management**: Redis-based job processing with BullMQ
- **Error Handling**: Comprehensive error handling and retry logic

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons

### **Backend**
- **Supabase**: Database, storage, and authentication
- **Razorpay**: Payment processing
- **Redis + BullMQ**: Background job processing
- **SendGrid**: Email delivery service
- **JWT**: Secure authentication tokens

### **Database**
- **PostgreSQL**: Primary database via Supabase
- **Row Level Security**: Secure data access
- **Real-time Subscriptions**: Live data updates
- **Storage**: File storage for images and documents

## 📁 Project Structure

```
reelhaus/
├── app/                    # Next.js App Router
│   ├── about/             # About Us page
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── events/            # Event pages
│   ├── team/              # Team page
│   ├── join/              # Join Us page
│   └── blog/              # Blog pages
├── components/            # Reusable components
│   ├── ui/                # UI components
│   ├── site-header.tsx    # Navigation header
│   ├── hero.tsx           # Hero section
│   ├── pricing.tsx        # Events showcase
│   └── quick-navigation.tsx # Fast navigation
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Database client
│   ├── admin-auth.ts     # Admin authentication
│   └── workers.ts        # Background workers
├── supabase/             # Database migrations
│   └── migrations/       # SQL migration files
└── public/              # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Razorpay account
- Redis instance
- SendGrid account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/reelhaus.git
cd reelhaus
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# QR Code Security
QR_HMAC_SECRET=your_qr_hmac_secret_here

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Environment
NODE_ENV=development
```

### 4. Database Setup
Run the SQL migrations in your Supabase project:

```sql
-- Run the contents of supabase/migrations/001_initial_schema.sql
-- This will create all necessary tables, indexes, and RLS policies
```

### 5. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🎨 Theme Customization

The application uses a **Lightning Red** theme with the following color palette:

- **Primary Red**: `#DC2626`
- **Red Gradients**: `from-red-500 to-red-600`
- **Accent Colors**: Various red shades for different UI elements
- **Background**: Black with subtle gradients

To customize colors, update the CSS variables in `app/globals.css`.

## 📱 Pages & Features

### **Public Pages**
- **Home**: Event showcase with hero section
- **About Us**: Company mission, values, and story
- **Team**: Team member profiles and culture
- **Join Us**: Membership application and careers
- **Blog**: Articles and updates
- **Events**: Event listing with filtering
- **Event Details**: Comprehensive event information
- **Registration**: Multi-step registration form
- **Payment**: Secure payment processing
- **Payment Success**: Confirmation with QR codes

### **Admin Pages**
- **Admin Login**: Secure authentication
- **Admin Dashboard**: Statistics and management
- **Event Management**: CRUD operations
- **Registration Management**: View and export data

## 🔧 API Endpoints

### **Public APIs**
- `GET /api/events` - List active events
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Create registration

### **Admin APIs**
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `GET /api/admin/events/:id/registrations` - Get registrations

### **Webhook APIs**
- `POST /api/webhooks/razorpay` - Payment webhook

## 🚀 Deployment

### **Vercel Deployment**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Environment Variables for Production**
Ensure all environment variables are set in your deployment platform:
- Supabase credentials
- Razorpay keys
- Admin credentials
- JWT secret
- Redis URL
- SendGrid API key

### **Database Migration**
Run the SQL migrations in your production Supabase instance.

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📊 Performance Features

- **Image Optimization**: Lazy loading and WebP support
- **Caching**: Strategic caching for static assets and API responses
- **Fast Navigation**: Quick access navigation components
- **Loading States**: Skeleton loaders and progress indicators
- **Middleware**: Performance headers and optimization

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure admin authentication
- **HMAC Signatures**: Secure QR code generation
- **Input Validation**: Zod schema validation
- **CORS Protection**: Proper CORS configuration
- **Rate Limiting**: API rate limiting (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@reelhaus.com or create an issue in this repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Razorpay](https://razorpay.com/) for payment processing
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

**Built with ❤️ for the ReelHaus community**