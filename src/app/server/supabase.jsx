// server/supabase.js (ya jahan bhi aapne initialize kiya hai)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Agar build ke waqt ye missing hain to ye crash karega
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase keys are missing!")
}

const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase