// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vgszbdapatsdkxkzefzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnc3piZGFwYXRzZGt4a3plZnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODIzODAsImV4cCI6MjA2MzI1ODM4MH0.HwxplxVHuyCMZrB0QAbRCihrv-5MqMQR7zXSfWS9H04';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
