# Demo Accounts

This document contains demo login credentials you can use to test the platform.

## How to Create Demo Accounts

Since Supabase Auth requires proper authentication, you'll need to create these accounts through the registration page. Here are the recommended demo accounts to create:

### Student Account
- **Email:** `student@demo.com`
- **Password:** `demo123`
- **First Name:** Demo
- **Last Name:** Student
- **Role:** Student (default)

### Instructor Account
- **Email:** `instructor@demo.com`
- **Password:** `demo123`
- **First Name:** Demo
- **Last Name:** Instructor
- **Role:** Instructor (you'll need to apply through "Become Instructor" page after registering)

### Admin Account
- **Email:** `admin@demo.com`
- **Password:** `demo123`
- **First Name:** Admin
- **Last Name:** User
- **Role:** Admin

## Quick Start

1. Go to the registration page: `/auth/register`
2. Create an account using one of the emails above
3. Login with those credentials: `/auth/login`

## What's Working

### Fully Functional Pages:
- ✅ **Home** - Browse courses and instructors from database
- ✅ **Courses** - Full course browsing with filters and pagination
- ✅ **Course Details** - View course info, enroll, add to cart/wishlist
- ✅ **Instructors** - View all instructors
- ✅ **Services** - View platform services from database
- ✅ **Login/Register** - Full authentication with Supabase
- ✅ **FAQ** - Frequently asked questions

### Database Features:
- ✅ 12 courses with various categories
- ✅ Course sections with video lessons
- ✅ Enrollment system
- ✅ Cart and wishlist functionality
- ✅ 6 platform services
- ✅ User profiles with automatic creation on signup
- ✅ Row Level Security on all tables

### Pages Under Construction:
- 🚧 Cart - View and manage cart items
- 🚧 Wishlist - View saved courses
- 🚧 My Learning - Track enrolled courses and progress
- 🚧 Dashboard - User dashboard with stats
- 🚧 Update Profile - Edit user information
- 🚧 Become Instructor - Apply to become an instructor
- 🚧 Add Courses - Create new courses (for instructors)
- 🚧 Instructor Details - View instructor profiles
- 🚧 Course Player - Watch course videos
- 🚧 Search - Search for courses
- 🚧 Support - Contact support

## Database Tables

The following tables are available in the Supabase database:

1. **users** - User profiles extending auth.users
2. **courses** - Course information with instructor data
3. **course_sections** - Video lessons for each course
4. **enrollments** - User course enrollments
5. **cart_items** - Shopping cart items
6. **wishlist** - Saved courses
7. **user_progress** - Track progress through course sections
8. **reviews** - Course reviews and ratings
9. **orders** - Completed purchases
10. **order_items** - Individual items in orders
11. **support_tickets** - User support requests
12. **services** - Platform services/offerings

## Features Implemented

### Authentication
- User registration with automatic profile creation
- Login/logout functionality
- Protected routes
- User session management

### Courses
- Browse 12 courses across different categories
- Filter by category, level, language, rating, duration
- Sort by newest or highest rated
- Pagination (20 courses per page)
- Course details with sections, requirements, and learning outcomes
- Enroll in free courses instantly
- Add paid courses to cart
- Add courses to wishlist

### Database Integration
- All courses fetched from Supabase
- Real-time data updates
- Secure Row Level Security policies
- Automatic user profile creation on signup

### Services Page
- 6 platform services displayed
- Features and pricing information
- Animated entrance effects
- Call-to-action sections

## Test Features

### Test Free Course Enrollment:
1. Login with any account
2. Find a free course (price = $0)
3. Click "Enroll Now"
4. You'll be enrolled and redirected to My Learning

### Test Add to Cart:
1. Login with any account
2. Find a paid course
3. Click "Add to Cart"
4. Item is added to cart in database

### Test Wishlist:
1. Login with any account
2. View any course details
3. Click the heart icon
4. Course is added to your wishlist

## Notes

- Account creation now works properly with automatic user profile creation
- All data is stored securely in Supabase
- RLS policies ensure users can only access their own data
- The build completes successfully
