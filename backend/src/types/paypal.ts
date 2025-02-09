// Plan interface with price as a string
export interface Plan {
    plan_id: string;
    plan_name: string;
    description?: string;
    interval_unit? : string;
    price: number; // Changed to string
    currency: "USD" | "EUR" | null | undefined;
}

// ProductFromDB interface
export interface ProductFromDB {
    productID: string;
    plans: Plan[];
}
