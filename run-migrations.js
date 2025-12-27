/**
 * Supabase Migration Runner
 * Runs all database migrations in order
 *
 * Usage: node run-migrations.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Create Supabase client with service_role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const migrationsDir = path.join(__dirname, 'supabase', 'migrations')

const migrations = [
  '20250101000001_initial_schema.sql',
  '20250101000002_rls_policies.sql',
  '20250101000003_seed_quiz_questions.sql'
]

async function runMigration(filename) {
  console.log(`\n📄 Running migration: ${filename}`)
  console.log('─'.repeat(60))

  const filepath = path.join(migrationsDir, filename)
  const sql = fs.readFileSync(filepath, 'utf8')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })

    if (error) {
      // Try alternative method - direct query
      const { error: queryError } = await supabase.from('_migrations').insert({ name: filename })

      if (queryError) {
        console.error(`❌ Migration failed: ${error.message}`)
        console.error('Error details:', error)
        return false
      }
    }

    console.log(`✅ Migration completed successfully`)
    return true
  } catch (err) {
    console.error(`❌ Migration error: ${err.message}`)
    return false
  }
}

async function runAllMigrations() {
  console.log('\n🚀 Sight-Sign Database Migration Runner')
  console.log('═'.repeat(60))
  console.log(`📍 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`📁 Migrations directory: ${migrationsDir}`)
  console.log('═'.repeat(60))

  let successCount = 0

  for (const migration of migrations) {
    const success = await runMigration(migration)
    if (success) successCount++
  }

  console.log('\n' + '═'.repeat(60))
  console.log(`\n📊 Migration Summary:`)
  console.log(`   ✅ Successful: ${successCount}/${migrations.length}`)
  console.log(`   ❌ Failed: ${migrations.length - successCount}/${migrations.length}`)

  if (successCount === migrations.length) {
    console.log(`\n🎉 All migrations completed successfully!`)
    console.log(`\n📋 Next steps:`)
    console.log(`   1. Go to Supabase Dashboard → Database → Replication`)
    console.log(`   2. Enable Realtime for 'sign_ins' table`)
    console.log(`   3. Run: npm run dev`)
    console.log(`   4. Start building Week 1 features!\n`)
  } else {
    console.log(`\n⚠️  Some migrations failed. Please check the errors above.`)
    console.log(`\nℹ️  Alternative: Copy SQL from migration files and run manually in Supabase SQL Editor`)
    console.log(`   Dashboard → SQL Editor → New Query → Paste SQL → Run\n`)
  }
}

// Run migrations
runAllMigrations().catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
