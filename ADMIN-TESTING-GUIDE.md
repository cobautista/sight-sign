# Admin Dashboard Testing Guide

**Created:** 2025-12-28
**Week 1 - Priority 2:** Admin Dashboard Shell

---

## ✅ What Was Built

### Features Implemented
- ✅ Admin dashboard with site management
- ✅ Site creation form
- ✅ Admin access control via site_admins table
- ✅ Stats overview (sites count, workers on-site, today's sign-ins)
- ✅ Quick actions menu
- ✅ Admin setup helper (development tool)
- ✅ Access denied page with helpful guidance
- ✅ Responsive design for mobile and desktop

### Pages Created
- **/admin/dashboard** - Main admin dashboard
- **/admin/sites/new** - Create new construction site
- **/admin/setup** - Development helper to grant admin access
- **/admin/scan** - Placeholder for Week 2 QR scanning feature

---

## 🧪 Testing Checklist

### Test 1: Admin Setup (First Time)

**Prerequisites:**
- You must have a registered worker account
- Make sure you're logged in

**Steps:**
1. Go to: http://localhost:3000/admin/dashboard
2. You should see "Access Denied" message
3. Click **"Set Up Admin Account"** button
4. On the Admin Setup page, review the information
5. Click **"Set Up Admin Access"**
6. Wait for success message

**Expected Results:**
- ✅ Shows loading spinner
- ✅ Creates a test site: "Test Construction Site"
- ✅ Grants you admin access to the site
- ✅ Shows success message with green checkmark
- ✅ Redirects to admin dashboard after 3 seconds

---

### Test 2: Admin Dashboard View

**Steps:**
1. After setup, you should be on: http://localhost:3000/admin/dashboard
2. Review the dashboard

**Expected Results:**

**Header:**
- ✅ Shows "Admin Dashboard" title
- ✅ Shows your email address
- ✅ "Sign Out" button visible

**Stats Cards:**
- ✅ "Total Sites" shows: 1
- ✅ "Workers On-Site" shows: 0 (with "Real-time updates (Week 2)" note)
- ✅ "Today's Sign-Ins" shows: 0 (with "Sign-in tracking (Week 2)" note)

**Your Sites Section:**
- ✅ Shows "Your Sites" heading
- ✅ "Add New Site" button visible
- ✅ Site card displays:
  - Site name: "Test Construction Site"
  - Address: "123 Test Street, Construction City"
  - Auto sign-out time: "18:00:00"
  - "View Details" button
  - "Scan QR" button

**Quick Actions:**
- ✅ Shows 3 action items (Scan, Workers, Reports)
- ✅ All marked with future week/phase labels

**Getting Started Guide:**
- ✅ Shows 4 numbered steps
- ✅ Step 1 has blue checkmark (sites created)
- ✅ Steps 2-4 have gray checkmarks (future features)

---

### Test 3: Create Additional Site

**Steps:**
1. On admin dashboard, click **"Add New Site"** button
2. Fill in the form:
   - **Site Name:** Downtown Office Building
   - **Address:** 456 Business Blvd, Metro City
   - **Auto Sign-Out Time:** 17:00:00 (5 PM)
3. Click **"Create Site"**

**Expected Results:**
- ✅ Form validates required fields
- ✅ Shows loading state "Creating Site..."
- ✅ Redirects to admin dashboard
- ✅ "Total Sites" now shows: 2
- ✅ New site appears in "Your Sites" list
- ✅ Site shows correct name, address, and sign-out time

---

### Test 4: Cancel Site Creation

**Steps:**
1. Click **"Add New Site"** again
2. Start filling in the form
3. Click **"Cancel"** button

**Expected Results:**
- ✅ Returns to admin dashboard
- ✅ No new site created
- ✅ Site count remains unchanged

---

### Test 5: Form Validation

**Steps:**
1. Go to: http://localhost:3000/admin/sites/new
2. Try submitting empty form
3. Fill in only Site Name, leave others empty
4. Submit form

**Expected Results:**

**Empty Form:**
- ✅ Browser shows "Please fill out this field" for Site Name
- ✅ Form does not submit

**Partial Form:**
- ✅ Form submits successfully (only name is required)
- ✅ Address can be null
- ✅ Auto sign-out defaults to 18:00:00

---

### Test 6: Navigation and Links

**Steps:**
1. On admin dashboard, test all clickable elements:
   - Click "View Details" on a site
   - Click "Scan QR" on a site
   - Click "Scan Worker QR Code"
   - Click "View All Workers"
   - Click "Generate Reports"

**Expected Results:**
- ✅ "View Details" → Shows placeholder (Week 2)
- ✅ "Scan QR" → Shows QR scanner placeholder page
- ✅ All Week 2/Phase 2 links show appropriate "Coming Soon" messages
- ✅ Can navigate back to dashboard from placeholders

---

### Test 7: Database Verification

**Check Supabase Dashboard:**

1. **Sites Table:**
   - Go to: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/editor
   - Click **"sites"** table
   - You should see 2 sites (or however many you created)

**Expected Data:**
- ✅ `id` - UUID
- ✅ `name` - Site names you entered
- ✅ `address` - Addresses you entered (or null)
- ✅ `auto_signout_time` - Times you specified
- ✅ `created_at` - Current timestamps

2. **site_admins Table:**
   - Click **"site_admins"** table
   - You should see entries linking you to your sites

**Expected Data:**
- ✅ `site_id` - Matches site IDs
- ✅ `admin_id` - Your user ID (same for all)
- ✅ `role` - "admin"

---

### Test 8: Access Control

**Test 8a: Logged Out Access**
1. Click "Sign Out" on admin dashboard
2. Try to access: http://localhost:3000/admin/dashboard

**Expected Results:**
- ✅ Redirects to /login
- ✅ Cannot access dashboard without authentication

**Test 8b: Worker Account Access**
1. Register a new worker account (or use existing)
2. Login as worker
3. Try to access: http://localhost:3000/admin/dashboard

**Expected Results:**
- ✅ Shows "Access Denied" message
- ✅ Message says "You do not have admin access"
- ✅ Shows "Set Up Admin Account" button
- ✅ Worker cannot see admin features without permission

---

### Test 9: Mobile Responsiveness

**Steps:**
1. Open Chrome DevTools (F12)
2. Enable device toolbar (Cmd+Shift+M on Mac)
3. Select iPhone 12 Pro
4. Navigate through:
   - Admin Dashboard
   - Create New Site
   - Admin Setup

**Expected Results:**
- ✅ Dashboard cards stack vertically on mobile
- ✅ Site cards are readable and buttons accessible
- ✅ Stats cards show properly
- ✅ Forms are easy to fill on mobile
- ✅ All buttons are touch-friendly (min 44x44px)

---

### Test 10: Multi-Site Admin

**Steps:**
1. Create 3-4 different sites
2. View admin dashboard
3. Check that all sites appear

**Expected Results:**
- ✅ All sites listed in "Your Sites" section
- ✅ Each site has its own card
- ✅ "Total Sites" stat updates correctly
- ✅ Can manage multiple sites from one dashboard

---

## 🐛 Known Limitations (Expected for MVP)

### Week 1 Limitations:
- ⚠️ "Workers On-Site" always shows 0 (Week 2 feature)
- ⚠️ "Today's Sign-Ins" always shows 0 (Week 2 feature)
- ⚠️ "View Details" goes to placeholder page (Week 2)
- ⚠️ "Scan QR" shows coming soon page (Week 2)
- ⚠️ Quick actions show placeholder states (Week 2+)
- ⚠️ Real-time dashboard updates not implemented (Week 2)

### Development-Only Features:
- ⚠️ Admin Setup page is a development helper
- ⚠️ In production, admins would be invited/created properly
- ⚠️ No admin invitation system yet (Phase 2)
- ⚠️ No super admin role distinction (Phase 2)

---

## 🔍 Debugging Common Issues

### Issue: "Access Denied" even after setup

**Fix:**
- Check Supabase → site_admins table
- Verify your user ID is in the table
- Try logging out and back in
- Clear browser cache

### Issue: Sites not appearing on dashboard

**Fix:**
- Check browser console for errors
- Verify RLS policies allow reading sites
- Check that site_admins entry exists
- Refresh the page

### Issue: Can't create new site

**Fix:**
- Check browser console for errors
- Verify you're logged in
- Check Supabase for database errors
- Make sure site name is filled in

### Issue: Redirect loops after login

**Fix:**
- Clear browser cookies
- Check that user exists in either workers or site_admins
- Sign out completely and sign back in

---

## 📊 Success Criteria

**Week 1, Priority 2 is complete when:**

- ✅ Admin can access dashboard after setup
- ✅ Admin can create new construction sites
- ✅ Admin sees list of their sites
- ✅ Stats cards display (even with 0 values)
- ✅ Quick actions menu is visible
- ✅ Navigation works between admin pages
- ✅ Access control prevents non-admins
- ✅ Database properly stores sites and admin links
- ✅ Mobile responsive on all admin pages
- ✅ Admin setup helper works correctly

---

## 🚀 Next Steps (Week 2)

After admin dashboard testing is complete:

**Week 2, Priority 1: Admin QR Scanning**
- [ ] Install html5-qrcode library
- [ ] Create QR scanner component with camera access
- [ ] Implement QR code validation logic
- [ ] Create sign-in API endpoint
- [ ] Test: Admin can scan worker QR and sign them in

**Week 2, Priority 2: Real-Time Dashboard**
- [ ] Set up Supabase Realtime subscriptions
- [ ] Create live worker list component
- [ ] Display active workers (signed in, not out)
- [ ] Update stats in real-time
- [ ] Test: Dashboard updates <2 seconds after scan

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

Test 1: Admin Setup
- Status: [ ] Pass [ ] Fail
- Notes:

Test 2: Admin Dashboard View
- Status: [ ] Pass [ ] Fail
- Notes:

Test 3: Create Additional Site
- Status: [ ] Pass [ ] Fail
- Notes:

Test 4: Cancel Site Creation
- Status: [ ] Pass [ ] Fail
- Notes:

Test 5: Form Validation
- Status: [ ] Pass [ ] Fail
- Notes:

Test 6: Navigation and Links
- Status: [ ] Pass [ ] Fail
- Notes:

Test 7: Database Verification
- Status: [ ] Pass [ ] Fail
- Notes:

Test 8: Access Control
- Status: [ ] Pass [ ] Fail
- Notes:

Test 9: Mobile Responsiveness
- Status: [ ] Pass [ ] Fail
- Notes:

Test 10: Multi-Site Admin
- Status: [ ] Pass [ ] Fail
- Notes:

Overall Status: [ ] All Pass [ ] Has Failures
```

---

## 🎯 Quick Test Flow (5 minutes)

1. **Login as worker** → Go to /admin/dashboard
2. **Click "Set Up Admin Account"** → Verify test site created
3. **View dashboard** → Check stats and site list
4. **Click "Add New Site"** → Create another site
5. **Return to dashboard** → Verify 2 sites showing
6. **Check Supabase** → Verify database entries

---

**Ready to test?** Start with Test 1: Admin Setup above!

**URL:** http://localhost:3000/admin/dashboard
