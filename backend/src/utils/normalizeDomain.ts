// Function to normalize Domain by removing 'www.' (if present)
export function normalizeDomain(domain: string): string {
    return domain ? domain.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "") : '';
}