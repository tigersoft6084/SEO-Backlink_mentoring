import { axiosInstance } from '@/utils/axiosInstance.ts';
import { ErrorHandler } from '@/handlers/errorHandler.ts';

export const fetchDataFromSoumettre = async (url: string, page : number, validationData: { X_CSRF_TOKEN: string; COOKIE: string }) => {

    const body = {
        "fingerprint": {
            "id": "8dYWpg2MCaEx9W8rq0rl",
            "name": "catalog.partials.spot-results",
            "locale": "fr",
            "path": "user/catalog",
            "method": "GET",
            "v": "acj"
        },
        "serverMemo": {
            "children": {
                "l2425982113-0": {
                    "id": "a0lOgt4olpZQjJ8y3Aso",
                    "tag": "div"
                },
                "l2425982113-1": {
                    "id": "WJdknzkkox74YtkhCeGA",
                    "tag": "div"
                }
            },
            "errors": [],
            "htmlHash": "50675fa8",
            "data": {
                "filters": {
                    "thematique_ids": [],
                    "ttf_topics": [],
                    "domain_search_type": "domain_contains",
                    "domain_search": "",
                    "only_favorites": false,
                    "exclude_bl_from_websites": [],
                    "lang": "fr"
                },
                "count": 10,
                "orderBy": "catalog_added_at",
                "orderDirection": "desc",
                "showDetailsModal": false,
                "showThematiquesModal": false,
                "showConfirmModal": false,
                "detailsWebsite": null,
                "clientSelectedWebsite": null,
                "trustFlow": null,
                "columns": {
                    "spot_domain": {
                        "display": true,
                        "label": "Domaine"
                    },
                    "spot_rd": {
                        "display": true,
                        "label": "RD"
                    },
                    "spot_tf": {
                        "display": true,
                        "label": "TF"
                    },
                    "spot_cf": {
                        "display": true,
                        "label": "CF"
                    },
                    "spot_traf": {
                        "display": true,
                        "label": "Trafic"
                    },
                    "spot_kw": {
                        "display": true,
                        "label": "KW"
                    },
                    "spot_themas": {
                        "display": true,
                        "label": "Thématiques"
                    }
                },
                "page": page-1,
                "paginators": {
                    "page": page-1
                }
            },
            "dataMeta": [],
            "checksum": "140ad8d98a0964e1d4fddc01e44f2a40e781a081145bd3343f6ca6b859538ca3"
        },
        "updates": [
            {
                "type": "callMethod",
                "payload": {
                    "id": "vmu7",
                    "method": "gotoPage",
                    "params": [
                        page,
                        "page"
                    ]
                }
            }
        ]
    }

    try {

        const response = await axiosInstance.post(url, body, {
            headers: {
                Cookie: validationData.COOKIE,
                'X-CSRF-TOKEN' : validationData.X_CSRF_TOKEN,
                'X-Socket-ID' : '208500.800078',
                'Content-Type': 'application/json',
                Accept: 'text/html, application/xhtml+xml',
                Host: 'soumettre.fr',
                "x-livewire": "true",
                "Referer": "https://soumettre.fr/user/catalog",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        });

        // const fomatedData = getFormDataFromSoumettre(response.data);
        return response.data;
    } catch (error) {
        const { errorDetails, status } = ErrorHandler.handle(error, "No Soumettre data received.");
        return new Response(JSON.stringify(errorDetails), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
};
