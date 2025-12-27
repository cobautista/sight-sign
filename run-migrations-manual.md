# Manual Migration Instructions

If the automated migration runner doesn't work, follow these steps to run migrations manually in the Supabase SQL Editor.

---

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej
2. Click **SQL Editor** in the left sidebar
3. Click **"New query"**

---

## Step 2: Run Migration 1 - Initial Schema

**File:** `supabase/migrations/20250101000001_initial_schema.sql`

1. Open the file in your code editor
2. Copy the **entire contents** (all SQL)
3. Paste into Supabase SQL Editor
4. Click **"Run"** or press `Cmd/Ctrl + Enter`
5. Wait for completion (should see "Success" message)

**What this creates:**
- 6 tables: workers, sites, site_admins, sign_ins, quiz_questions, quiz_responses
- Foreign key constraints
- Performance indexes
- Trigger for updated_at timestamp

---

## Step 3: Run Migration 2 - RLS Policies

**File:** `supabase/migrations/20250101000002_rls_policies.sql`

1. Click **"New query"** in SQL Editor
2. Open the file in your code editor
3. Copy the **entire contents**
4. Paste into SQL Editor
5. Click **"Run"**

**What this creates:**
- Enables Row Level Security on all tables
- Creates 20+ RLS policies
- Workers can only see their own data
- Admins can only see data for their sites

---

## Step 4: Run Migration 3 - Seed Quiz Questions

**File:** `supabase/migrations/20250101000003_seed_quiz_questions.sql`

1. Click **"New query"** in SQL Editor
2. Open the file in your code editor
3. Copy the **entire contents**
4. Paste into SQL Editor
5. Click **"Run"**

**Expected output:**
```
NOTICE: Seeded 5 global quiz questions
```

**What this creates:**
- 5 OSHA-based safety quiz questions
- All questions are global (site_id = NULL)

---

## Step 5: Verify Tables Created

1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - workers
   - sites
   - site_admins
   - sign_ins
   - quiz_questions
   - quiz_responses

3. Click on **quiz_questions** table
4. Verify you see **5 rows** of quiz questions

---

## Step 6: Enable Realtime for sign_ins Table

1. Go to **Database** → **Replication** in left sidebar
2. Find the **supabase_realtime** publication
3. Scroll down to find **sign_ins** table
4. Check the checkbox next to **sign_ins**
5. Click **"Save"**

**Why?** This enables live updates on the admin dashboard when workers sign in.

---

## Step 7: Verify RLS Policies

1. Go to **Authentication** → **Policies** in left sidebar
2. You should see RLS policies for each table
3. Click on **sign_ins** table
4. Verify you see policies like:
   - "Workers can view own sign-ins"
   - "Admins can view site sign-ins"
   - "Admins can create sign-ins"

---

## ✅ Done!

Your database is now set up. Next steps:

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Then proceed with Week 1 development tasks from `NEXT-STEPS.md`.

---

## Troubleshooting

### Error: "relation already exists"
- This means the table was already created
- Skip to the next migration

### Error: "permission denied"
- Make sure you're logged into the correct Supabase project
- Verify you're using the project: iqkldpatrwvnknyzbwej

### Error: "syntax error"
- Make sure you copied the **entire** SQL file
- Check that you didn't accidentally include any markdown or comments

---

**Need help?** Check SUPABASE-SETUP.md for more detailed troubleshooting.
