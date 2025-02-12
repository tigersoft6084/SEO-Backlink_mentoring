"use client";

import { useEffect, useState } from "react";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";
import { useUser } from "../../../context/UserContext";

interface InputViewProps {
    onSearch: (data: any) => void;
    setLoading: (loading: boolean) => void;
}

const locations = [
    { name: "United States", code: "2840"},
    { name: "United Kingdom", code: "2826"},
    { name: "Canada", code: "2124"},
    { name: "Spain", code: "2724"},
    { name: "France", code: "2250"},
    { name: "Germany", code: "2276" },
    { name: "Brazil", code: "2076"},
    { name: "Portugal", code: "2620"},
    { name: "Italy", code: "2380"},
    { name: "Belgium", code: "2056"},
    { name: "Switzerland", code: "2756" },
];

export default function InputView({ onSearch, setLoading }: InputViewProps) {
    const [keyword, setKeyword] = useState("");
    const {user, location} = useUser();

    const locationFromDB = locations.find(loc => loc.name === user?.location)?.code || "2840"; // Default to "United States" if not found

    const [locationCode, setLocationCode] = useState(locationFromDB);

    // Update locationCode whenever location changes
    useEffect(() => {
        const locationMatch = locations.find((loc) => loc.name === location);
        if (locationMatch) {
            setLocationCode(locationMatch.code);
        }
    }, [location]);

    const handleSearch = async () => {

        const maxDisplayKeywords = user?.features?.resultsPerSearch || 50;

        setLoading(true);

        try {

            const response = await fetch("/api/serpScanner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    keyword: keyword,
                    locationCode: parseInt(locationCode), // Example location code
                    languageCode: "en", // Example language code
                    displayDepth : maxDisplayKeywords
                }),
            });
            console.log(JSON.stringify({
                keyword: keyword,
                locationCode: parseInt(locationCode), // Example location code
                languageCode: "en", // Example language code
                displayDepth : maxDisplayKeywords
            }))

            if (response) {
                const responseJSON = await response.json();
                onSearch(responseJSON);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while processing the request.");
        }
    };

    return (
        <div className="flex flex-col items-center lg:flex-row flex-1 p-8 border rounded-xl shadow-lg bg-white dark:bg-slate-900 dark:border-gray-600 dark:text-gray-200">
            {/* Location header */}
            <div className="-mb-5">
                <LocationHeader location={locationCode} setLocation={setLocationCode} />
            </div>

            {/* Search input section */}
            <div className="flex flex-col lg:flex-row items-center w-full mt-4 lg:mt-0">
                {/* Input field */}
                <input
                    type="text"
                    className="flex-1 mx-4 px-6 py-3 text-lg border border-gray-300 rounded-lg dark:bg-slate-800 dark:border-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-300 transition-all"
                    placeholder="Enter a keyword to scan the backlinks of the top 10 search results"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    aria-label="Enter keywords to search"
                />

                <div className="mt-4 mb-4 lg:mt-0 flex items-center transition-all">
                {/* Search button */}
                <SearchButton disabled={!keyword} onClick={handleSearch} />
                </div>

            </div>
        </div>
    );
}
