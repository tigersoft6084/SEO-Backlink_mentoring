export interface FetchedBackLinkDataFromMarketplace {
  domain: string;
  tf?: number | 0;
  cf?: number | 0;
  rd?: number | 0;
  ttf?: string | "";
  title? : string | "";
  backlinks? : number | "";
  ref_ips? : number | 0;
  ref_subnets? : number | 0;
  ref_edu ? : number | 0;
  ref_gov ? : number | 0;
  price?: number;
  language? : string | "";
  ref_lang? : string | "";
}

export interface ResultBacklinkDataForSEO{
  Domain : string;
  keyword : string;
  RD : number;
  TF : number;
  CF : number;
  Price : number;
  allSource : { source : string; Price : number}[];
  TTF : string;
  Title : string;
  Backlinks : number;
  Ref_Ips : string;
  Ref_Edu : string;
  Ref_Gov : string;
  Language : string;
  Ref_Lang : string;
}

export interface ExpiredDomainData {
  domain : string;
  tf : number | 0;
  cf : number | 0;
  rd : number | 0;
  ttf : string | null;
  ref_ips : number | 0;
  ref_edu : number | 0;
  ref_gov : number | 0;
  language : string | null;
}

export interface FormattedErefererData{
  url: string;
  language : string;
  metrics: {
    majestic: {
      trustFlow : number | 0;
      citation : number | 0;
      refDomains: number | 0;
      categories : string | "";
    };
  };
  price: number | 0;
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

export interface Marketplace {
  marketplace_source: string;
  price: number;
}