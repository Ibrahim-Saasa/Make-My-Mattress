# Admin Login Flow - Implementation Guide

## Overview

The application now has a **separate admin login flow** that allows administrators to sign in directly and access the admin dashboard (`/admin-capitol`) without going through the user identity selection screen.

## Architecture

### Key Components

1. **AdminLoginScreen** (`components/AdminLoginScreen.tsx`)
   - Dedicated login page for admin users
   - Email/password authentication
   - Automatic role verification (checks for SUPER_ADMIN role)
   - Direct redirect to admin dashboard on successful auth
   - Beautiful dark theme UI matching executive access portal aesthetic

2. **ProtectedAdminRoute** (`components/ProtectedAdminRoute.tsx`)
   - HOC (Higher-Order Component) that wraps admin routes
   - Verifies user has SUPER_ADMIN role before rendering
   - Automatically redirects unauthorized users to `/admin-login`
   - Handles loading states during verification

3. **Updated App.tsx**
   - Added `/admin-login` route pointing to AdminLoginScreen
   - Wrapped `/admin-capitol` route with ProtectedAdminRoute
   - Added `/admin-login` to initial entry paths (skips role redirects)

4. **Updated LoginScreen**
   - Added "Access Capitol" link directing to `/admin-login`
   - Allows easy switching between user and admin login flows

## User Flows

### For End Users (Current)

```
User → Sign in with phone/email → Choose role (Identity Screen) → Dashboard
```

### For Admins (New)

```
Admin → /admin-login → Email + Password → Role verification (automatic) → /admin-capitol
```

## Setup & Usage

### 1. Create Admin Accounts in Supabase

#### Option A: Via Supabase Dashboard

1. Go to **Authentication → Users**
2. Create a new user with:
   - Email: `admin@hindustan-mattress.com`
   - Password: (set secure password)
   - Note: Admin emails should be internal company emails

3. Then go to **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'SUPER_ADMIN'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@hindustan-mattress.com')
```

#### Option B: Via Application (Programmatic)

If you want to create admin accounts via a management interface, do this in a protected admin panel:

```typescript
// Create user
const { data, error } = await supabase.auth.admin.createUser({
  email: "admin@example.com",
  password: "securePassword123!",
  email_confirm: true,
});

// Set admin role
await supabase
  .from("profiles")
  .update({ role: "SUPER_ADMIN" })
  .eq("id", data.user.id);
```

### 2. Admin Login Flow

1. Navigate to `http://localhost:3001/admin-login`
2. Enter admin email and password
3. If credentials are correct AND user has SUPER_ADMIN role:
   - Automatically redirected to `/admin-capitol`
   - Admin dashboard loads with full access
4. If credentials are wrong OR user is not admin:
   - Error message: "Access denied. Admin credentials required."
   - User remains on login page

### 3. Accessing Admin from User Login

1. Regular users can see "Access Capitol" link on the main login page
2. Clicking it redirects to `/admin-login` page
3. If they try to log in with non-admin credentials:
   - They get error: "Access denied. Admin credentials required."
   - Session is automatically terminated

## Security Features

✅ **Role Verification**: Every admin route checks the SUPER_ADMIN role  
✅ **Automatic Session Termination**: Non-admin accounts are signed out immediately  
✅ **Protected Routes**: Admin dashboard is inaccessible without SUPER_ADMIN role  
✅ **Separate Login Page**: Isolates admin login UI and flow  
✅ **Error Messages**: Generic errors prevent information leakage  
✅ **Loading States**: Prevents race conditions during role verification

## Current Admin Accounts (Development)

To test the admin login, you'll need to create test accounts in your Supabase project:

**Example Admin Account:**

- Email: `admin@himalayamattress.com`
- Password: (set in Supabase)
- Role: `SUPER_ADMIN` (set in profiles table)

**To create:**

1. Sign up via regular login
2. Update the role in Supabase:
   ```sql
   UPDATE profiles SET role = 'SUPER_ADMIN' WHERE email = 'admin@himalayamattress.com'
   ```

## File Structure

```
components/
  ├── AdminLoginScreen.tsx          [NEW] Admin login UI
  ├── ProtectedAdminRoute.tsx       [NEW] Route protection HOC
  ├── LoginScreen.tsx               [UPDATED] Added Capitol link
  └── ...

App.tsx                             [UPDATED] Added routes + protection
```

## Routing

| Route            | Component        | Protection          | Purpose                     |
| ---------------- | ---------------- | ------------------- | --------------------------- |
| `/login`         | LoginScreen      | None                | User login                  |
| `/admin-login`   | AdminLoginScreen | None                | Admin login                 |
| `/admin-capitol` | AdminCapitol     | ProtectedAdminRoute | Admin dashboard             |
| `/identity`      | IdentityScreen   | None                | Role selection (users only) |

## Comparison: Old vs New Flow

### Old Flow (Removed)

```
1. Any user signs in
2. Forced to choose role on Identity Screen
3. Gets locked into that role
4. Can't switch back without contacting admin
```

### New Flow (Current)

```
Users:
1. Sign in → Choose role → Dashboard
2. Can re-authenticate to change role (via profile page)

Admins:
1. Go to /admin-login
2. Enter credentials
3. Automatic role verification
4. Direct access to admin dashboard
5. No role selection screen
```

## Future Enhancements

1. **Multi-factor Authentication (MFA)**
   - SMS or authenticator app verification for admins
2. **Audit Logging**
   - Log all admin login attempts and actions
3. **Role Hierarchy**
   - Support for different admin levels (SUPER_ADMIN, ADMIN, MODERATOR)
4. **Session Management**
   - Auto-logout after inactivity
   - Limited session duration for admins

5. **Admin Management Panel**
   - UI to create/revoke admin accounts
   - Prevent direct database manipulation

## Troubleshooting

### "Access denied. Admin credentials required."

**Cause**: User doesn't have SUPER_ADMIN role  
**Solution**: Update their role in Supabase profiles table

### Redirect loop at `/admin-login`

**Cause**: Session exists but user isn't admin  
**Solution**: Clear browser cache, sign out completely, then try again

### Can't see admin dashboard after login

**Cause**: ProtectedAdminRoute detected non-admin role  
**Solution**: Verify user's role in Supabase profiles table

### "Could not verify admin status"

**Cause**: Database connection issue or missing profiles record  
**Solution**: Check Supabase connectivity, ensure user profile exists

## API Contract

### AdminLoginScreen Props

None - Uses context

### ProtectedAdminRoute Props

```typescript
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole; // Default: UserRole.SUPER_ADMIN
}
```

## Testing Checklist

- [ ] Admin can log in via `/admin-login` with valid credentials
- [ ] Non-admin cannot log in to `/admin-login`
- [ ] Admin is redirected to `/admin-capitol` after successful login
- [ ] Non-admin is logged out immediately if they try admin login
- [ ] Accessing `/admin-capitol` without auth redirects to `/admin-login`
- [ ] Error messages display correctly for failed attempts
- [ ] Loading states appear during authentication
- [ ] "Access Capitol" link appears on user login page
- [ ] Switching between user and admin login works smoothly

## Database Schema Notes

The existing `profiles` table supports this with the `role` column:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role UserRole NOT NULL DEFAULT 'END_USER',
  first_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

No schema changes needed! The system uses existing `role` field.
