// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rinmwxpkoerzwexunhdb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpbm13eHBrb2VyendleHVuaGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODE0NTgsImV4cCI6MjA2NTI1NzQ1OH0.OrxowjpNUch9WWBh889dkpxgNdh8nyi_1Dwj_orbAsk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);