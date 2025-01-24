// Plan interface with price as a string
export interface Plan {
    plan_id: string;
    plan_name: string;
    description?: string;
    price: number; // Changed to string
    currency: string;
}

// ProductFromDB interface
export interface ProductFromDB {
    productID: string;
    plans: Plan[];
}
