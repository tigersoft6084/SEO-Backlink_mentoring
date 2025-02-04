import { useCallback, useState } from "react";  
import { Filters } from "../types/expired.d";
import { useExpiredDomains } from "../context/ExpiredDomainsContext";

export default function useExpiredFilterView() {
    const { setTotalExpiredDomains } = useExpiredDomains();
    const [filters, setFilters] = useState<Filters>({
        Domain: "",
        minTF: "",
        maxTF: "",
        minCF: "",
        maxCF: "",
        minRD: "",
        maxRD: "",
        minRefIps: "",
        maxRefIps: "",
        minRefEdu: "",
        maxRefEdu: "",
        minRefGov: "",
        maxRefGov: "",
        TTF: "Select",
        Language: "All",
    });

    const [expiredDomainsData, setExpiredDomainsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);  // ✅ Prevent multiple fetches

    const fetchDomains = useCallback(async () => {
        if (loading) return; // ✅ Prevent duplicate fetches while loading

        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value && value !== "Select" && value !== "All") {
                queryParams.append(key, value);
            }
        }
        const url = `http://localhost:2024/api/expired?${queryParams.toString()}`;

        console.log(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch domains");
            }
            const data = await response.json();

            setExpiredDomainsData(data.expiredDomains);
            setTotalExpiredDomains(data.totalExpiredDomains);
            setHasFetched(true);  // ✅ Mark as fetched to prevent duplicate calls
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [filters, loading, setTotalExpiredDomains]);

    const fetchDomainsOnMount = useCallback(() => {
        if (!hasFetched && expiredDomainsData.length === 0) {  // ✅ Prevent re-fetching
            fetchDomains();
        }
    }, [hasFetched, expiredDomainsData.length, fetchDomains]);

    return {
        filters,
        expiredDomainsData,
        loading,
        error,
        updateFilters: (name: keyof Filters, value: string) => setFilters((prev) => ({ ...prev, [name]: value })),
        fetchDomains,
        fetchDomainsOnMount,
    };
}
