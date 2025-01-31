import { createContext, useContext, useState } from "react";

interface ExpiredDomainsContextType {
    totalExpiredDomains: number;
    setTotalExpiredDomains: (count: number) => void;
}

// Create context
const ExpiredDomainsContext = createContext<ExpiredDomainsContextType | undefined>(undefined);

// Provider component
export const ExpiredDomainsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [totalExpiredDomains, setTotalExpiredDomains] = useState(0);

    return (
        <ExpiredDomainsContext.Provider value={{ totalExpiredDomains, setTotalExpiredDomains }}>
            {children}
        </ExpiredDomainsContext.Provider>
    );
};

// Hook to use context
export const useExpiredDomains = () => {
    const context = useContext(ExpiredDomainsContext);
    if (!context) {
        throw new Error("useExpiredDomains must be used within ExpiredDomainsProvider");
    }
    return context;
};
