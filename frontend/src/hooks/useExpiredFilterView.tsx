import { useState } from "react";
import { Filters } from "../types/expired.d";
import { useExpiredDomains } from "../context/ExpiredDomainsContext";


export default function useExpiredFilterView() {
    const { setTotalExpiredDomains } = useExpiredDomains(); // Use Context
    const [filters, setFilters] = useState<Filters>({
        Domain: "",
        minTF: "",
        maxTF: "",
        minCF: "",
        maxCF: "",
        minRD: "",
        maxRD: "",
        minRefIps : "",
        maxRefIps : "",
        minRefEdu: "",
        maxRefEdu: "",
        minRefGov: "",
        maxRefGov: "",
        TTF: "Select",
        Language: "All",
    });

    const [expiredDomainsData, setExpiredDomainsData] = useState([]);
    // const [totalExpiredDomains, setTotalExpiredDomains] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  // Type the error state as string | null

    // Type the 'name' parameter to match the keys of the filters object
    const updateFilters = (name: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Helper function to build query parameters from the filters
    const buildQueryParams = () => {
        const params = new URLSearchParams();

        // Add each filter to the query params if it has a value
        for (const [key, value] of Object.entries(filters)) {
            if (value && value !== "Select" && value !== "All") {
                params.append(key, value);
            }
        }

        return params.toString();
    };

    const fetchDomains = async () => {
        setLoading(true);
        setError(null); // Reset the error state to null before starting the fetch


        const queryParams = buildQueryParams();
        const url = `http://localhost:2024/api/expired?${queryParams}`;

        console.log(url);
        try {
            const response = await fetch(url, {
                method: "GET",  // Changed to GET
            });
            if (!response.ok) {
                throw new Error("Failed to fetch domains");
            }
            const data = await response.json();
            setExpiredDomainsData(data.expiredDomains);
            setTotalExpiredDomains(data.totalExpiredDomains);
        } catch (err: unknown) {
            // Handle the unknown error
            if (err instanceof Error) {
                setError(err.message);  // Now setError can accept a string
            } else {
                setError("An unexpected error occurred"); // Default error message if it's not an instance of Error
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch domains when Expired Domains tab is clicked
    const fetchDomainsOnMount = () => {
        if (expiredDomainsData.length === 0) {
            fetchDomains();
        }
    };


    return {
        filters,
        expiredDomainsData,
        loading,
        error,
        updateFilters,
        fetchDomains,
        fetchDomainsOnMount,
    };
}
