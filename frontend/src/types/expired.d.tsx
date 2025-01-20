// Define the Filters type (same as before)
export interface Filters {
    Domain: string;
    minTF: string;
    maxTF: string;
    minCF: string;
    maxCF: string;
    minRD: string;
    maxRD: string;
    minRefIps : string;
    maxRefIps : string;
    minRefEdu: string;
    maxRefEdu: string;
    minRefGov: string;
    maxRefGov: string;
    TTF: string;
    Language: string;
}

// Define the props for the Filters component
export interface FiltersProps {
    filters: Filters;
    updateFilters: (name: keyof Filters, value: string) => void;
    onFilter: () => void;
}