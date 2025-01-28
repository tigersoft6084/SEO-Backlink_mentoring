import { CollectionConfig } from 'payload';

const PayPalPlans: CollectionConfig = {
    slug: 'paypal-plans', // The endpoint slug for the collection
    labels: {
        singular: 'PayPal Plan',
        plural: 'PayPal Plans',
    },
    access: {
        create: () => true,
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    admin: {
        useAsTitle: 'product_id', // Display the `product_id` in the admin panel
    },
    fields: [
        {
            name: 'product_id',
            type: 'text',
            required: true,
            unique: true, // Ensure each product_id is unique
        },
        {
            name: 'plans',
            type: 'array',

            fields: [
                {
                    name: 'plan_name',
                    type: 'text',

                },
                {
                    name: 'plan_id',
                    type: 'text',
                    unique: true,

                },
                {
                    name : 'description',
                    type : 'text',

                },
                {
                    name: 'price',
                    type: 'number',

                },
                {
                    name: 'currency',
                    type: 'text',

                    defaultValue: 'USD',
                },
            ],
        },
    ],
};

export default PayPalPlans;
