# 🔄 Data Reset Guide

## ⚠️ Problem: "Email Already Registered" Error

When you see: **"Failed to create account. Email might already be registered."**

## ✅ Solution: Clear All Data

### Method 1: From Registration Form (Easiest)
1. Go to `/signup` or `/login` 
2. Try to register with an existing email
3. You'll see a **yellow warning box** appear
4. Click **"Clear All Data & Reset"** button
5. Confirm the action
6. ✅ All data cleared! You can now register with any email

### Method 2: From Auth Demo Page
1. Go to `/auth-demo`
2. Scroll to **"Data Management"** section
3. Click **"Clear All Data"** button
4. Confirm the action
5. ✅ All data cleared and redirected to home

### Method 3: Quick Reset Link
1. On any auth form, look for **"Need to reset?"** section
2. Click **"Clear all stored data"** link
3. Confirm the action
4. ✅ All data cleared!

## 🔍 What Gets Cleared

- ✅ All registered users from localStorage
- ✅ Current session cookies
- ✅ User profile data
- ✅ All authentication state

## 📱 Visual Guide

### When Error Occurs:
```
❌ Failed to create account. Email might already be registered.

[Yellow Warning Box Appears]
📧 Email Already Registered
This email is already in use. You can clear all stored data to start fresh.

[Clear All Data & Reset] ← Click this button
```

### After Clearing:
```
✅ All data cleared successfully! You can now register with any email.
```

## 🧪 Testing Steps

1. **Register** a user: `test@example.com` / `password123`
2. **Try to register again** with same email → Error appears
3. **Click clear button** → Data cleared
4. **Register again** with same email → ✅ Success!

## 🚀 Pro Tips

- The **yellow warning box** only appears when email already exists
- You can also use `/auth-demo` page to see all registered users
- Clearing data will **log you out** automatically
- After clearing, you'll be redirected to a fresh state

## 🔐 Security Note

This is a **development feature**. In production:
- Users would be stored in a secure database
- Email verification would be required
- Password reset flows would be implemented
- No direct data clearing would be available

---

**Need help?** Visit `/auth-demo` to see the current system status and manage data easily! 