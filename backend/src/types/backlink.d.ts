export interface BackLinkData {
    domain: string;
    tf: string | number;
    cf: string | number;
    rd: string | number;
    price: string | number;
}

export interface PaperClubResult {
    name?: string;
    kpi?: {
      trustFlow?: number;
      citationFlow?: number;
      refDomain?: number;
    };
    articles?: {
      price?: number;
    }[];
}

export interface LinkBuildersResult {
    name?: string;
    kpi?: {
      trustFlow?: number;
      citationFlow?: number;
      refDomain?: number;
    };
    articles?: {
      price?: number;
    }[];
}
  
export interface PrensalinkResult {
    price?: number; // Price outside the newspapers array
    newspapers?: Array<{
        url?: string; // URL of the newspaper
        metrics?: {
        tf?: number; // Trust flow
        cf?: number; // Citation flow
        rd?: number; // Referring domains
        };
    }>;
}

export interface SeoJungleResult {
  url?: string;
  trustFlow?: number;
  citationFlow?: number;
  referringDomains?: number;
  products? : Array<{
    margedPrice?: number;
  }>
}