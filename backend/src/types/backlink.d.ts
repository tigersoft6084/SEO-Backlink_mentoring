import { ExpiredDomainData } from '@/types/expiredDomain.ts';
export interface FetchedBackLinkDataFromMarketplace {
  domain: string;
  tf: number | 0;
  cf: number | 0;
  rd: number | 0;
  price: number;
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
  Domain : string;
  TF : number | 0;
  CF : number | 0;
  RD : number | 0;
  TTF : string | null;
  Ref_Ips : number | 0;
  Ref_Edu : number | 0;
  Ref_Gov : number | 0;
  Language : string | null;
}

export interface FormattedErefererData{
  url: string;
  metrics: {
    majestic: {
      trustFlow : number | 0;
      citation : number | 0;
      refDomains: number | 0;
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
  Marketplace_Source: string;
  Price: number;
}