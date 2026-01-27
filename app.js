// ===============================
// CONEXIÓN A SUPABASE
// ===============================

const SUPABASE_URL = "https://atmflikzjdhwnssjsxhn.supabase.co";
const SUPABASE_KEY = "sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF";

// ⚠️ IMPORTANTE:
// NO usar el nombre "supabase"
const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado OK", db);
