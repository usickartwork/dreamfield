/**
 * DREAMFIELD TACTICAL — CMS Client
 * Handles Supabase data fetching for public pages with graceful offline / error fallbacks.
 */

(function () {
    const SUPABASE_URL = 'https://rskxeeahhyzqoxofdfms.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJza3hlZWFoaHl6cW94b2ZkZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNTc4NzMsImV4cCI6MjEwODgzMzg3M30.u9gh-CPu_HRbDj3u4sgF9XGHSHXSArPb0IEPIvE1LjE';

    let supabaseClient = null;

    function getClient() {
        if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true
                }
            });
        }
        return supabaseClient;
    }

    // Direct REST API fallback in case the external CDN library is blocked
    async function directRestFetch(endpoint) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error(`REST fetch failed: ${res.status}`);
        return await res.json();
    }

    const DreamfieldCMS = {
        config: {
            url: SUPABASE_URL,
            anonKey: SUPABASE_ANON_KEY
        },

        getClient: getClient,

        /**
         * Fetch active packages ordered by sort_order
         * @returns {Promise<Array|null>}
         */
        async getActivePackages() {
            try {
                const client = getClient();
                if (client) {
                    const { data, error } = await client
                        .from('site_packages')
                        .select('*')
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true });
                    if (!error && Array.isArray(data)) return data;
                }
                return await directRestFetch('site_packages?is_active=eq.true&order=sort_order.asc');
            } catch (err) {
                console.warn('[DreamfieldCMS] Failed to fetch packages, using static defaults:', err.message);
                return null;
            }
        },

        /**
         * Fetch all site editorial content as nested key-value dictionary
         * @returns {Promise<Object|null>}
         */
        async getSiteContent() {
            try {
                let rows = null;
                const client = getClient();
                if (client) {
                    const { data, error } = await client.from('site_content').select('*');
                    if (!error && Array.isArray(data)) rows = data;
                }
                if (!rows) {
                    rows = await directRestFetch('site_content?select=*');
                }

                const dict = {};
                if (Array.isArray(rows)) {
                    for (const r of rows) {
                        if (!dict[r.section_key]) dict[r.section_key] = {};
                        dict[r.section_key][r.content_key] = r.content_value;
                    }
                }
                return dict;
            } catch (err) {
                console.warn('[DreamfieldCMS] Failed to fetch site content, using static defaults:', err.message);
                return null;
            }
        },

        /**
         * Fetch active media items
         * @returns {Promise<Array|null>}
         */
        async getSiteMedia() {
            try {
                const client = getClient();
                if (client) {
                    const { data, error } = await client
                        .from('site_media')
                        .select('*')
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true });
                    if (!error && Array.isArray(data)) return data;
                }
                return await directRestFetch('site_media?is_active=eq.true&order=sort_order.asc');
            } catch (err) {
                console.warn('[DreamfieldCMS] Failed to fetch media, using static defaults:', err.message);
                return null;
            }
        },

        /**
         * Fetch active FAQs
         * @returns {Promise<Array|null>}
         */
        async getSiteFaqs() {
            try {
                const client = getClient();
                if (client) {
                    const { data, error } = await client
                        .from('site_faqs')
                        .select('*')
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true });
                    if (!error && Array.isArray(data)) return data;
                }
                return await directRestFetch('site_faqs?is_active=eq.true&order=sort_order.asc');
            } catch (err) {
                console.warn('[DreamfieldCMS] Failed to fetch FAQs, using static defaults:', err.message);
                return null;
            }
        }
    };

    window.DreamfieldCMS = DreamfieldCMS;
})();
