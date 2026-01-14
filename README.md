# 🏋️ GymLine - Fitness & Nutrition Tracker

A modern, full-stack fitness tracking application built with Next.js 16, TypeScript, and PostgreSQL. Track your workouts, monitor nutrition, analyze progress, and achieve your fitness goals with data-driven insights.

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard
- Real-time statistics overview
- Current weight tracking with weekly trends
- Weekly adherence metrics (protein, water, steps, sleep)
- Interactive charts for progress visualization
- Today's workout plan at a glance

### 💪 Workout Tracking
- **6-Day Training Split** optimized for strength and hypertrophy
  - Monday: Upper Strength (Chest/Back)
  - Tuesday: Lower Strength + Core
  - Wednesday: Active Recovery
  - Thursday: Push Hypertrophy (Chest Priority)
  - Friday: Pull Hypertrophy
  - Saturday: Arms + Conditioning
  - Sunday: Full Rest
- Exercise logging with sets, reps, and weight
- Progressive overload tracking
- Exercise history and personal records

### 🥗 Diet & Nutrition
- Daily nutrition tracking:
  - Protein intake (target: 140g+)
  - Water consumption (2.5-4L)
  - Steps counter (6k-10k)
  - Sleep hours (7.5+ hrs)
- Food quality checklist:
  - Daily protein sources (eggs/chicken)
  - Fruits (1-2 servings/day)
  - Vegetables (1 serving/day)
  - Soft drink limits (max 1/week)
  - Junk food control (max 1 meal/week)

### 📈 Progress Analytics
- Weight trend charts (weekly grouping)
- Strength progression tracking
- Body composition analysis
- Weekly check-in summaries
- Goal achievement metrics

### 📅 Weekly Tracker
- Week-by-week habit tracking
- Daily checkbox system for all metrics
- Weekly average calculations
- Progress consistency monitoring

### ⚙️ Settings
- User profile management
- Personal information updates
- Goal customization
- Preferences configuration

### 🖨️ Printable Tracker
- Print-friendly workout and diet tracker
- Weekly template generation
- PDF-ready format for offline tracking

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.10 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts)

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (App Router)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Direct SQL with `@neondatabase/serverless`
- **Type Safety**: TypeScript interfaces

### Database Schema
```sql
- users                  # User profiles and settings
- workout_plans          # Workout plan templates
- exercises              # Exercise library
- workout_logs           # Workout session records
- exercise_set_logs      # Individual set tracking
- daily_habit_logs       # Daily nutrition & habits
- food_quality_checklist # Food quality tracking
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended) or npm
- PostgreSQL database (Neon account recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gymline
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@host-pooler.region.aws.neon.tech/database?sslmode=require"
   ```
   
   > **Note**: For Neon databases, use the pooler connection string (with `-pooler` suffix) for optimal performance.

4. **Initialize the database**
   ```bash
   # Run the schema initialization
   pnpm tsx scripts/init-db.ts
   
   # Seed the database with initial data
   pnpm tsx scripts/seed-db.ts
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gymline/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── user/            # User profile endpoints
│   │   ├── daily-habits/    # Habits tracking
│   │   ├── food-quality/    # Food quality checklist
│   │   ├── workout-logs/    # Workout sessions
│   │   ├── exercise-logs/   # Exercise sets
│   │   ├── workout-plans/   # Workout templates
│   │   ├── exercises/       # Exercise library
│   │   └── stats/           # Statistics aggregation
│   ├── dashboard/           # Main dashboard page
│   ├── workouts/            # Workout tracking
│   ├── diet/                # Nutrition tracking
│   ├── progress/            # Progress analytics
│   ├── weekly-tracker/      # Weekly habit tracker
│   ├── settings/            # User settings
│   ├── printer/             # Printable tracker
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── sidebar.tsx          # Navigation sidebar
│   └── theme-provider.tsx   # Theme configuration
├── lib/                     # Utilities and configs
│   ├── db.ts               # Database connection
│   ├── types.ts            # TypeScript types
│   ├── utils.ts            # Helper functions
│   └── seed-workouts.ts    # Workout plan data
├── scripts/                 # Database scripts
│   ├── 01-init-schema.sql  # Database schema
│   ├── init-db.ts          # Schema initialization
│   ├── seed-db.ts          # Data seeding
│   └── test-db.ts          # Connection testing
└── public/                  # Static assets
```

## 🎯 Training Plan Details

### **Goal**: Athletic + Lean Strength + Chest/Arms Focus

#### **Training Rules**
- Progressive overload: Add reps or weight weekly
- Stop sets with 1-2 reps in reserve (maintain form)
- Track your top weight + reps for each exercise

#### **Weekly Split**

**Monday - Upper Strength (Chest/Back)**
- Bench Press: 5×5
- Pullups/Lat Pulldown: 4 sets
- Incline DB Press: 4 sets
- Barbell Row: 4 sets
- Cable Fly: 3 sets
- Rope Pushdown: 3 sets

**Tuesday - Lower Strength + Core**
- Squat: 5×5
- Romanian Deadlift: 4 sets
- Leg Press: 3 sets
- Walking Lunges: 2 sets
- Calf Raises: 4 sets
- Hanging Leg Raise: 3 sets
- Cable Crunch: 3 sets
- Cardio: 10 minutes

**Wednesday - Active Recovery**
- Walking/Light cardio
- Mobility work
- Stretching

**Thursday - Push Hypertrophy (Chest Priority)**
- Incline Bench: 4 sets
- Flat DB Press: 4 sets
- Dips: 3 sets
- Lateral Raises: 5 sets
- Rear Delt Fly: 3 sets
- OH Tricep Extension: 3 sets
- Rope Pushdown: 2 sets
- Cardio: 10 minutes

**Friday - Pull Hypertrophy**
- Deadlift: 4×4
- Seated Cable Row: 4 sets
- Wide Lat Pulldown: 4 sets
- Face Pulls: 3 sets
- EZ Bar Curl: 3 sets
- Hammer Curl: 3 sets

**Saturday - Arms + Conditioning**
- Close-Grip Bench: 4 sets
- Incline DB Curl: 4 sets
- Cable Pushdown: 3 sets
- Preacher/Machine Curl: 3 sets
- Cable Fly: 3 sets
- Lateral Raise: 3 sets
- Conditioning: 12 minutes

**Sunday - Full Rest**
- Complete recovery
- Stretching/Mobility work

## 🥗 Nutrition Guidelines

### Daily Targets
- **Protein**: 140g+ (prioritize eggs, chicken, lean meats)
- **Water**: 2.5-4L
- **Steps**: 6,000-10,000
- **Sleep**: 7.5+ hours

### Weekly Limits
- **Soft Drinks**: Maximum 1 per week
- **Junk Food**: Maximum 1 meal per week

### Food Quality Checklist
- ✅ Protein source (eggs/chicken) daily
- ✅ Fruits: 1-2 servings per day
- ✅ Vegetables: 1+ serving per day
- ✅ Limit processed foods
- ✅ Stay hydrated consistently

### Weight Management
- **Gaining too fast** (+0.7kg/week): Reduce 1 carb portion at dinner
- **Not gaining** (+0kg/week): Add 1 carb portion daily
- **Belly fat increasing**: Add 10 min cardio 2x per week

## 📊 API Endpoints

### User Management
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `DELETE /api/user` - Delete user

### Workout Tracking
- `GET /api/workout-logs` - Get workout logs
- `POST /api/workout-logs` - Create workout log
- `DELETE /api/workout-logs` - Delete workout log

### Exercise Logging
- `GET /api/exercise-logs` - Get exercise sets
- `POST /api/exercise-logs` - Log exercise set
- `DELETE /api/exercise-logs` - Delete exercise set

### Nutrition & Habits
- `GET /api/daily-habits` - Get daily habits
- `POST /api/daily-habits` - Create habit entry
- `PUT /api/daily-habits` - Update habit entry
- `DELETE /api/daily-habits` - Delete habit entry

### Food Quality
- `GET /api/food-quality` - Get food checklist
- `POST /api/food-quality` - Create checklist entry
- `PUT /api/food-quality` - Update checklist
- `DELETE /api/food-quality` - Delete entry

### Statistics
- `GET /api/stats` - Get aggregated statistics

## 🎨 Design System

### Color Palette (Google Material Design)
- **Primary Blue**: `#4267D2` - Actions, links, primary buttons
- **Success Green**: `#34A853` - Positive metrics, completed tasks
- **Warning Yellow**: `#FBBC04` - Warnings, attention items
- **Error Red**: `#EA4335` - Errors, critical alerts
- **Neutral Gray**: Various shades for backgrounds and text

### Typography
- **Font Family**: Outfit (Google Fonts)
- **Weights**: 300-700
- **Responsive scaling**: Tailwind typography utilities

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint

# Database
pnpm tsx scripts/init-db.ts    # Initialize database schema
pnpm tsx scripts/seed-db.ts    # Seed database with data
pnpm tsx scripts/test-db.ts    # Test database connection
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms
- Ensure Node.js 18+ runtime
- Set `DATABASE_URL` environment variable
- Run `pnpm build` then `pnpm start`

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal project. For major changes, please open an issue first.

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Built with ❤️ for fitness enthusiasts who love tracking data**
