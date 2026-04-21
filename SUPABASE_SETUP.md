# Supabase Setup Guide

## Database Setup

### Step 1: Run SQL Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `cqrdcbfbypdytfkwahwe`
3. Navigate to **SQL Editor** in the left sidebar
4. Open the `database-schema.sql` file from this project
5. Copy and paste the entire SQL code into the SQL Editor
6. Click **Run** to execute the schema

This will create:
- `profiles` table (user profiles with admin/user roles)
- `support_tickets` table (customer support tickets)
- `mining_stats` table (user mining statistics)
- Row Level Security (RLS) policies
- Automatic triggers for profile creation and timestamps

### Step 2: Create Admin User

The admin user will be automatically created when you sign up with:
- **Email**: `warrenokumu98@gmail.com`
- **Password**: `Twenty37`

The database trigger will automatically assign the `admin` role to this email address.

### Step 3: Verify Setup

1. Make sure all tables are created in the **Table Editor**
2. Check that RLS policies are enabled (they should show as green)
3. Test the authentication by running the app

## Features Implemented

### Authentication
- ✅ User registration (Signup)
- ✅ User login
- ✅ Protected routes
- ✅ Role-based access (admin/user)
- ✅ Automatic profile creation on signup

### User Dashboard (`/dashboard`)
- View mining statistics (hash rate, total mined, daily earnings)
- Create and view support tickets
- View account information
- Sign out functionality

### Admin Dashboard (`/admin`)
- View all users
- View and manage all support tickets
- Respond to tickets and update status
- View platform-wide statistics
- Access restricted to admin role only

### Support System
- Users can create support tickets
- Admins can view, respond, and update ticket status
- Ticket statuses: open, in_progress, resolved, closed
- Priority levels: low, medium, high, urgent

## Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin dashboard (admin only)
- `*` - 404 page

## Environment

The Supabase configuration is already set up in `src/lib/supabase.ts`:
- **URL**: `https://cqrdcbfbypdytfkwahwe.supabase.co`
- **API Key**: `sb_publishable_ll0h0EBUjPqeKAB1bgwz7Q_3kMpN64Z`

## Testing

1. **Test User Registration**:
   - Go to `/signup`
   - Create a new account
   - Check Supabase dashboard to verify profile was created

2. **Test Admin Login**:
   - Go to `/login`
   - Login with `warrenokumu98@gmail.com` / `Twenty37`
   - Should redirect to `/admin` dashboard

3. **Test Normal User**:
   - Create a regular user account
   - Should redirect to `/dashboard` (not admin)

4. **Test Support Tickets**:
   - As a user, create a support ticket
   - As admin, view and respond to the ticket

## Notes

- The admin email (`warrenokumu98@gmail.com`) is hardcoded in the database trigger
- All other emails will be assigned the `user` role
- RLS policies ensure users can only see their own data
- Admins can see all data through special policies

