export interface BackLinkData {
    domain: string;
    tf: string | number;
    cf: string | number;
    rd: string | number;
    price: string | number;
}

export interface FormattedPaperclubData {
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

export interface FormattedPrensalinkData {
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

export interface FormattedSeojungleData {
  url?: string;
  trustFlow?: number;
  citationFlow?: number;
  referringDomains?: number;
  products? : Array<{
    margedPrice?: number;
  }>
}

export interface WhoisResult {
  domain: string;
  expiry_date?: string; // Optional if expiry_date might be absent
  [key: string]: any;  // To account for other potential fields from WHOIS
}

export interface DomainRecord {
  domain: string;
  expiry_date: string;
}

export interface Marketplace {
  Marketplace_Source: string;
  Price: number;
}
