# 🚀 Run Database Migrations Now

**Status:** ✅ Connection tested successfully
**Project:** https://iqkldpatrwvnknyzbwej.supabase.co
**Next step:** Run the migrations to create your database tables

---

## Option 1: Run All Migrations at Once (Recommended)

### Step 1: Open Supabase SQL Editor

1. Click this link: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/sql
2. Click **"New query"**

### Step 2: Copy All Migrations

Open this file in your code editor:
```
supabase/all-migrations.sql
```

**Or use this command to view it:**
```bash
cat supabase/all-migrations.sql
```

### Step 3: Paste and Run

1. Copy the **entire contents** of `all-migrations.sql` (455 lines)
2. Paste into Supabase SQL Editor
3. Click **"Run"** or press `Cmd/Ctrl + Enter`
4. Wait for completion (~5-10 seconds)

**Expected output:**
```
NOTICE: Seeded 5 global quiz questions
Success. No rows returned
```

✅ **Done!** All tables, policies, and quiz questions are now created.

---

## Option 2: Run Migrations Individually

If Option 1 doesn't work, run each migration separately:

### Migration 1: Initial Schema

**File:** `supabase/migrations/20250101000001_initial_schema.sql`

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/sql
2. Click "New query"
3. Copy and paste the entire file
4. Click "Run"
5. Wait for "Success" message

### Migration 2: RLS Policies

**File:** `supabase/migrations/20250101000002_rls_policies.sql`

1. Click "New query" again
2. Copy and paste the entire file
3. Click "Run"
4. Wait for "Success" message

### Migration 3: Seed Quiz Questions

**File:** `supabase/migrations/20250101000003_seed_quiz_questions.sql`

1. Click "New query" again
2. Copy and paste the entire file
3. Click "Run"
4. You should see: "NOTICE: Seeded 5 global quiz questions"

---

## Verify Migrations Worked

### Check 1: Tables Created

1. Go to **Table Editor**: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/editor
2. You should see these tables in the sidebar:
   - ✅ workers
   - ✅ sites
   - ✅ site_admins
   - ✅ sign_ins
   - ✅ quiz_questions
   - ✅ quiz_responses

### Check 2: Quiz Questions Seeded

1. Click on **quiz_questions** table
2. You should see **5 rows**
3. First question should be: "What is the minimum height that requires fall protection?"

### Check 3: RLS Enabled

1. Go to **Authentication** → **Policies**: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/auth/policies
2. You should see policies listed for each table

### Check 4: Run Connection Test

Back in your terminal, run:
```bash
node test-connection.js
```

**Expected output:**
```
✅ Connection successful!
✅ Tables found - migrations appear to be run
✅ Found 5 quiz questions
   First question: "What is the minimum height that requires fall protection?"
```

---

## Enable Realtime (Important!)

After migrations are done, enable Realtime for the `sign_ins` table:

1. Go to **Database** → **Replication**: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej/database/replication
2. Find the **supabase_realtime** publication
3. Find **sign_ins** table in the list
4. Check the checkbox next to **sign_ins**
5. Click **"Save"**

**Why?** This enables live dashboard updates when workers sign in.

---

## Troubleshooting

### Error: "relation already exists"
- Tables were already created
- This is OK, skip to next migration or verification

### Error: "permission denied for schema public"
- Make sure you're logged into the correct Supabase project
- Try refreshing the SQL Editor page

### Error: "syntax error near..."
- Make sure you copied the **entire** SQL file
- Check that no extra characters were added

### Still having issues?
Run migrations one at a time (Option 2) and note which specific migration fails.

---

## 🎉 After Migrations are Done

1. **Test connection:**
   ```bash
   node test-connection.js
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

4. **Start building!**
   - Follow NEXT-STEPS.md for Week 1 tasks
   - First task: Worker registration form

---

**Ready to run migrations? Start with Option 1 above!** 🚀
