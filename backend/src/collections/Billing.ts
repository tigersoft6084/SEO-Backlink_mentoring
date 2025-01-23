import { CollectionConfig } from "payload";

export const SubscriptionPlans: CollectionConfig = {
    slug: 'plans',
    labels: { singular: 'Plan', plural: 'Plans' },
    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'currency', type: 'text', defaultValue: 'EUR' },
        { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text' }] },
        { name: 'planType', type: 'select', options: ['monthly', 'yearly'], required: true },
        { name: 'paypalPlanId', type: 'text', required: true }, // Store PayPal Plan IDs
    ],
};
