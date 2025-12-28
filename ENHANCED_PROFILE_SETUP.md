# Enhanced Profile Page - Setup Guide

## Overview

The enhanced profile page provides a modern, minimalist, and user-friendly experience with:

- **Interactive Profile Header** with image upload for profile picture and banner
- **Animated Stats Cards** using Framer Motion for engaging visual feedback
- **Profile Customization** with theme and color scheme options
- **Responsive Design** that works seamlessly on all devices
- **Performance Optimized** with memoization and lazy loading

## Features

### 1. Profile Header Component
- Upload and preview profile pictures and banner images
- Editable bio with inline editing
- Location and website links
- Smooth hover animations and transitions

### 2. Animated Stats Cards
- Real-time animated counters
- Smooth scroll-based animations
- Interactive hover effects with microinteractions
- Color-coded stats for visual hierarchy

### 3. Profile Customization
- 6 predefined color schemes (Purple Dream, Ocean Blue, Forest Green, etc.)
- 3 layout options (Grid, List, Compact)
- Floating action button for easy access
- Real-time preview of changes

### 4. Performance Optimization
- Lazy loading of components using React.lazy and Suspense
- Memoized components to prevent unnecessary re-renders
- Code-splitting for smaller initial bundle size
- Efficient data fetching with callbacks

## Setup Instructions

### 1. Database Setup

The database schema has already been created with the migration. It includes:

- `user_profiles_extended` table for storing extended profile information
- Auto-trigger to create profiles for new users
- Row Level Security (RLS) policies for data protection

### 2. Storage Bucket Setup (Required for Image Uploads)

You need to create a storage bucket in Supabase for image uploads:

1. Go to your Supabase Dashboard
2. Navigate to Storage
3. Create a new bucket named `user-uploads`
4. Set the bucket to **Public** (so images can be accessed via public URLs)
5. Add the following policies to the bucket:

#### Upload Policy
```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Read Policy
```sql
-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');
```

#### Update Policy
```sql
-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Delete Policy
```sql
-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Access the Enhanced Profile

Navigate to `/profile` in your application to see the enhanced profile page.

## Technology Stack

### Libraries Used

1. **Framer Motion** (already installed)
   - Smooth animations and transitions
   - Scroll-based animations
   - Gesture animations

2. **React Lazy & Suspense** (built-in)
   - Code-splitting for better performance
   - Lazy loading of components
   - Loading states with Suspense

3. **React.memo** (built-in)
   - Memoization of functional components
   - Prevents unnecessary re-renders
   - Optimizes rendering performance

4. **Supabase Storage**
   - Image uploads and management
   - Public URLs for images
   - Secure file storage

5. **Tailwind CSS** (already configured)
   - Responsive design utilities
   - Dark mode support
   - Custom animations

## Component Structure

```
src/
├── components/
│   └── profile/
│       ├── ProfileHeader.tsx          # Profile header with image uploads
│       ├── AnimatedStatsCard.tsx      # Animated statistics cards
│       └── ProfileCustomization.tsx   # Theme and layout customization
└── pages/
    └── EnhancedProfile.tsx            # Main profile page
```

## Usage Examples

### Accessing the Profile

```typescript
// Navigate to the enhanced profile
navigate('/profile');
```

### Customizing Colors

Users can click the floating palette button (bottom-right) to:
- Choose from 6 color schemes
- Select layout preferences
- Save changes in real-time

### Uploading Images

1. Hover over profile picture or banner
2. Click the camera icon that appears
3. Select an image from your device
4. Image is automatically uploaded and displayed

## Performance Metrics

### Bundle Size Optimization
- ProfileHeader: ~6.81 KB (gzipped: 2.33 KB)
- AnimatedStatsCard: ~3.71 KB (gzipped: 1.68 KB)
- ProfileCustomization: ~7.13 KB (gzipped: 2.29 KB)

### Loading Strategy
- Initial page load: Only essential components
- Stats cards: Lazy loaded with Suspense
- Customization panel: Lazy loaded on demand

### Animation Performance
- 60 FPS animations using Framer Motion
- GPU-accelerated transforms
- Optimized re-render cycles

## Mobile Responsiveness

The profile page is fully responsive with breakpoints:
- Mobile: < 640px (1 column layout)
- Tablet: 640px - 1024px (2 column layout)
- Desktop: > 1024px (3-4 column layouts)

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators for all buttons
- Screen reader friendly

## Future Enhancements

Potential additions:
- Social media integrations
- Activity feed with real-time updates
- Badge collection showcase
- Achievement timeline
- Peer comparison analytics

## Troubleshooting

### Images Not Uploading
- Verify the storage bucket exists and is named `user-uploads`
- Check that the bucket is set to public
- Ensure RLS policies are configured correctly

### Animations Not Working
- Verify Framer Motion is installed: `npm list framer-motion`
- Check browser compatibility (modern browsers only)

### Profile Not Loading
- Ensure user is authenticated
- Check Supabase connection
- Verify database migrations have run

## Support

For issues or questions, please refer to:
- Supabase Documentation: https://supabase.com/docs
- Framer Motion Docs: https://www.framer.com/motion/
- React Documentation: https://react.dev
