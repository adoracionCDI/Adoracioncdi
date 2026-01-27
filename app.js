// DATOS DE SUPABASE
const SUPABASE_URL = "https://atmflikzjdhwnssjsxhn.supabase.co";
const SUPABASE_KEY = "sb_publishable_Zzdtdqy9KNl6wqy49JJehg_nxPcGyfF";

// CREAR CLIENTE SUPABASE (UNA SOLA VEZ)
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// PRUEBA
console.log("Supabase conectado:", supabaseClient);
