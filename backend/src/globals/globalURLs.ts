import { BASE_URL } from "@/config/apiConfig.ts";


// URL for DataForSeo
export const BULK_KEYWORD_SEARCH_URL = 'https://data.dataforseo.com/api/explorer/serp/google/organic/live/advanced';

export const COMPETITIVE_ANALYSIS_SEARCH_URL = 'https://data.dataforseo.com/api/explorer/datalabs/google/competitors_domain';

//URL for Majestic
export const MAJESTIC_URL = "https://developer.majestic.com/api/json";

// URL for Paypal
export const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

//URLs for fetch local Database
export const FETCH_DATABASE = `${BASE_URL}/backlinks`;

// URLs for Login API
export const LINK_BUILDERS_API_URL = 'https://app.link.builders/api/auth/login';

export const PRENSALINK_API_URL = 'https://shop.prensalink.com/api/v1/login';

export const PaperClub_API_URL = 'https://app.paper.club/api/authenticate';

export const Seojungle_API_URL = 'https://api.seo-jungle.com/auth/signin';

export const Ereferer_API_URL = 'https://en.ereferer.com/login_check';

export const Mistergoodlink_API_URL = 'https://app.mistergoodlink.com/sign-in';

export const BOOSTERLINK_API_URL = 'https://pro.boosterlink.fr/';

export const LINKAVISTA_API_URL = 'https://linkavista.com/login';

export const LINKATOMIC_API_URL = 'https://app.linkatomic.com/login';

export const PUBLISUITES_API_URL = 'https://www.publisuites.com/es/login/';
export const PUBLISUITES_API_URL_POST = 'https://www.publisuites.com/advertisers/';

export const GETALINK_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyABCAfw4_higazYHOSlYNGpRi5MSP-I07M';

export const DEVELINK_API_URL = 'https://app.develink.com/login';

export const UNANCOR_API_URL = 'https://app.unancor.com/login';
export const UNANCOR_API_URL_POST = 'https://app.unancor.com/livewire/update';
export const UNANCOR_API_URL_FOR_FINAL_COOKIE = 'https://app.unancor.com/marketplace';

export const BACKLINKED_API_URL_GET = "https://app.backlinked.com/login";
export const BAKCLINKED_API_URL_POST = "https://app.backlinked.com/api/login";

export const SOUMETTRE_API_URL = "https://soumettre.fr/login";

export const MEDIA123_API_URL = "https://123.media/login";

export const MYNILINKS_API_URL = "https://app.mynilinks.fr/login";

export const GROWWER_API_URL = "https://tool.growwer.com/login";


// URLs for Backlinks
export const GET_BACKLINK_FROM_BACKLINKED_URL = "https://app.backlinked.com/api/contentlinks";

export const GET_BACKLINK_FROM_LINKBUILDERS_URLS = "https://app.link.builders/api/link_market";

export const GET_BACKLINK_FROM_PAPERCLUB_URLS = [
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=10&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=14&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=15&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=16&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=17&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=18&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=19&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=4DPZZQt60rXRwkaFls6VLf&to[]=Ozpfdv1YRbB9hURJZD9cx&to[]=20OAfJSmwCFhbVuQlAVvdt&to[]=5IYySaNM9xO7zCFeOjgmnE&to[]=79RlEg1w9S2gtbePAEGOME&p=20&l=500",

    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=14&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=15&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=16&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=17&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=18&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=19&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=25HZcHlC8R87PQJTM9Nn4D&to[]=pMxgwxggfNt0YzE8xq97h&to[]=4drjJp5z0vdheBu6BzqHjr&to[]=a3up9hBkxvLrIKCqZcYr&to[]=DC67FilsNujeYBtAwVl9H&p=20&l=500",


    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=10&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=Ldq4776UG7sUwY3LbITbT&to[]=3kXbOrGnl74aNO716uz1GB&to[]=3TauAx64ZLTuOFWoglrcIS&to[]=1ZQKxyP9VDVQe7qwjtIh4z&to[]=52XKP5ETB8KW39T7PUrgiU&p=14&l=500",

    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=10&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=14&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=15&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=16&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=17&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=18&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=19&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=2Hv1kIZ13WoJJASZGGfFiW&to[]=3pzS9rnnM0YxEVlCRe9HRi&to[]=4MPMIR876Jzo7PZYov4uU2&to[]=73pJ8tMGUvIgv4OWfRHVC6&to[]=11zxtD5oxSNxYnWE5GRevP&p=20&l=500",

    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=10&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=14&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=15&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=16&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=17&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=1QvKJQk3XTGmp6EJv5Euih&to[]=5rmEUA4qdJiBpItcAMBPbC&to[]=pT9xY3z58nqx39RO0bru9&to[]=K8NOuumzOL9mrMj5lqJ04&to[]=2o1JPIVrAINTMTtQHyyDeQ&p=18&l=500",

    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=5sn2Bn22ZGvZPc5LYA3di4&to[]=553UTBorQce1yqRZ9MjVTo&to[]=4eO8FdZGKUr7Rq0PEEeYZ7&to[]=3Pbqm9xPhlaNTgT4UFX9MR&to[]=7BWaUW2K8TgTVD4ZWnkvcx&p=6&l=500",

    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=1&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=2&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=3&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=4&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=5&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=6&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=7&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=8&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=9&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=10&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=11&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=12&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=13&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=14&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=15&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=16&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=17&l=500",
    "https://app.paper.club/api/advanced_search/site?to[]=SEbgrulNTz0en5ccH6beQ&to[]=2ENZZUiWjqBEiKCbDUfZjV&to[]=5hWkhjggTdr3IOlRbQYACp&to[]=3zxjjmSVyvWo0RLW1UphJp&to[]=68Nrsn2k1eloewB5LjUwpB&p=18&l=500",
];

// export const GET_BACKLINK_FROM_PRENSALINK_URLS = [
//     "https://shop.prensalink.com/api/v2/prensalink/products/newspapers_blogs?country=WW&page=1&pageSize=5000&order=default",
//     "https://shop.prensalink.com/api/v2/prensalink/products/newspapers_blogs?country=WW&page=2&pageSize=5000&order=default",
//     "https://shop.prensalink.com/api/v2/prensalink/products/newspapers_blogs?country=WW&page=3&pageSize=5000&order=default",
//     "https://shop.prensalink.com/api/v2/prensalink/products/newspapers_blogs?country=WW&page=4&pageSize=5000&order=default",
// ];

export const GET_BACKLINK_FROM_PRENSALINK_URLS = "https://shop.prensalink.com/api/v2/prensalink/products/newspapers_blogs?country=WW";

export const GET_BACKLINK_FROM_SeoJungle_URL = "https://api.seo-jungle.com/support/search";

export const GET_BACKLINK_FROM_Ereferer_URL = "https://en.ereferer.com/bo/exchange-site-find";

export const GET_BACKLINK_FROM_MISTERGOODLINK_URL = "https://app.mistergoodlink.com/shop";

export const GET_BACKLINK_FROM_BOOSTERLINK_URL = "https://pro.boosterlink.fr/comparateurs.aspx";

export const GET_BACKLINK_FROM_LINKAVISTA_URL = "https://linkavista.com/marketlink";

export const GET_BACKLINK_FROM_GETALINK_URL = "https://api.getalink.com/marketplace";

export const GET_BACKLINK_FROM_DEVELINK_URL = "https://app.develink.com/cataloguevip";

export const GET_BACKLINK_FROM_LINKATOMIC_URL = "https://app.linkatomic.com/dashboard/sites?activeTable=all";

export const GET_BACKLINK_FROM_UNANCOR_URL = "https://app.unancor.com/livewire/update";

export const GET_BACKLINK_FROM_PUBLISUITES_URL = 'https://www.publisuites.com/advertisers/websites/';

export const GET_BACKLINK_FROM_MYNILINKS_URL = 'https://app.mynilinks.fr/netlinkings';

export const GET_BACKLINK_FROM_GROWWER_URL = 'https://tool.growwer.com/user/api/project/0194d7cf-6096-724b-bea6-72656ce32d8d/media-domains/rendered-list';