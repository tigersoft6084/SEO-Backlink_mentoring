import { FetchedBackLinkDataFromMarketplace } from "@/types/backlink.ts";
import { getTokenForSeojungle } from "../getTokensOrCookiesFromMarketplaces/seojungle.ts";
import { getAllDataFromSeojungle } from "../getAllDataFromMarketplaces/seojungle.ts";


export const getBacklinksDataFromSeojungle = async (): Promise<FetchedBackLinkDataFromMarketplace[]> => {

    const themeSets = [
        { themes: ["Actu du web", "Actualités - Médias généraliste", "Adultes - Rencontre - Sexe", "Agriculture", "Animaux"], totalPages: 464 },
        { themes: ["Assurance - Mutuelle", "Auto - Moto", "B2B - Entrepreneurs - Marketing - Communication", "Banque - Finance - Economie", "Beauté"], totalPages: 564 },
        { themes: ["Bio","Bons plans - Promo - Shopping -  Concours","Bricolage","BTP - Travaux B2B - Industrie","Bureautique"], totalPages: 86 },
        { themes: ["Business - Entreprise","Buzz","Chasse - Pêche","Cinéma","Communauté - société"], totalPages: 506 },
        { themes: ["Cuisine - Vins - Gastronomie - Boissons - Alimentation","Culture - Art","Décoration","Divers","DIY - Do It Youself"], totalPages: 360 },
        { themes: ["Droit - Gouvernement - Juridique","E-commerce","Ecologie - Environnement","Education - Emploi - Formation - Carrière","Energie"], totalPages: 324 },
        { themes: ["Enfant","Evénementiel","Famille","Féminin","Gaming"], totalPages: 121 },
        { themes: ["Geek","Généraliste","High tech","Hygiène ","Idée cadeau"], totalPages: 667 },
        { themes: ["Immobilier","Informatique - Webmaster","Jardin","Jeux d'argent - Poker","Jeux vidéo"], totalPages: 478 },
        { themes: ["Jouet","Lifestyle","Littérature - Bande dessinée","Local","Loisirs - Sorties - Divertissement"], totalPages: 206 },
        { themes: ["Luxe","Maison","Management","Mariage","Masculin"], totalPages: 460 },
        { themes: ["Mode","Musique","Nautisme","Ouvrages de référence","People"], totalPages: 230 },
        { themes: ["Politique","Presse","Psychologie","Référencement - SEO","Religion"], totalPages: 56 },
        { themes: ["Rencontre","Santé - Bien-être","Sciences - Nature","Sécurité","Sénior"], totalPages: 524 },
        { themes: ["Spiritualité - Voyance - Croyance - Esotérisme","Sport","Transport","Voyage - Tourisme","Webmarketing"], totalPages: 493 },
    ];

    const token = await getTokenForSeojungle();

    if (!token) {
        throw new Error("API token is missing");
    }

    const allResults: FetchedBackLinkDataFromMarketplace[] = [];

    for (const { themes, totalPages } of themeSets) {
        const results = await getAllDataFromSeojungle(token, themes, totalPages);
        allResults.push(...results);
    }

    console.log(`Total results fetched: ${allResults.length}`);

    return allResults;
};
