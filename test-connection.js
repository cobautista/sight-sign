/**
 * Test Supabase Connection
 * Verifies that .env.local is configured correctly
 *
 * Usage: node test-connection.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('\n🔍 Testing Supabase Connection')
console.log('═'.repeat(60))

// Check environment variables
console.log('\n📋 Environment Variables:')
console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ NOT SET'}`)
console.log(`   Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET'}`)
console.log(`   Service Role: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET' : '❌ NOT SET'}`)

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing environment variables!')
  console.error('   Make sure .env.local exists and contains your Supabase credentials')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('\n🔌 Testing Connection...')

  try {
    // Try to query a system table (should work even without custom tables)
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.log('⚠️  Auth check:', error.message)
    } else {
      console.log('✅ Connection successful!')
    }

    // Try to check if tables exist
    console.log('\n📊 Checking if migrations have been run...')

    const { data: tables, error: tableError } = await supabase
      .from('quiz_questions')
      .select('count')
      .limit(1)

    if (tableError) {
      if (tableError.message.includes('relation') || tableError.message.includes('does not exist')) {
        console.log('⚠️  Tables not found - migrations need to be run')
        console.log('\n📋 Next steps:')
        console.log('   1. Open Supabase Dashboard: https://supabase.com/dashboard/project/iqkldpatrwvnknyzbwej')
        console.log('   2. Go to SQL Editor')
        console.log('   3. Follow instructions in run-migrations-manual.md')
      } else {
        console.log('⚠️  Table check error:', tableError.message)
      }
    } else {
      console.log('✅ Tables found - migrations appear to be run')

      // Count quiz questions
      const { data: questions, error: countError } = await supabase
        .from('quiz_questions')
        .select('*')

      if (!countError && questions) {
        console.log(`✅ Found ${questions.length} quiz questions`)
        if (questions.length > 0) {
          console.log(`   First question: "${questions[0].question_text}"`)
        }
      }
    }

    console.log('\n═'.repeat(60))
    console.log('✅ Connection test complete!\n')

  } catch (err) {
    console.error('\n❌ Connection test failed:', err.message)
    console.error('\nPlease check:')
    console.error('   1. Supabase project is running')
    console.error('   2. Environment variables are correct')
    console.error('   3. API keys are valid')
    process.exit(1)
  }
}

testConnection()
