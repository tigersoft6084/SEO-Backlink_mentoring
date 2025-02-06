// Function to normalize Domain by removing 'www.' (if present)
export function normalizeDomain(domain: string): string {
    return domain ? domain.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/+$/, "") : '';
}

const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isValidDomain = (domain: string): boolean => {
    // Check if the domain matches the regex
    if (!validDomainRegex.test(domain)) {
        return false;
    }

    // Extract the TLD (last part of the domain)
    const tld = domain.split('.').pop();

    // If the TLD is undefined or invalid, return false
    if (!tld) {
        console.error(`Invalid domain: ${domain}`);
        return false;
    }

    return true;
};