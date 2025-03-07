import { createPlanForUpdateValues } from '@/services/paypal/plan/CreatePlan.ts';
import { CollectionConfig } from 'payload';

const PayPalPlans: CollectionConfig = {
    slug: 'paypal-plans',
    labels: {
        singular: 'PayPal Plan',
        plural: 'PayPal Plans',
    },
    access: {
        create: () => false,
        read: () => true,
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    admin: {
        useAsTitle: 'product_id',
    },
    fields: [
        {
            name: 'product_id',
            type: 'text',
            required: true,
            unique: true,
            admin: { hidden: true }
        },
        {
            name: 'plans',
            type: 'array',
            fields: [
                { name: 'plan_name', type: 'text' },
                { name: 'month_plan_id', type: 'text', unique: true, admin: { hidden: true } },
                { name: 'year_plan_id', type: 'text', unique: true, admin: { hidden: true } },
                { name: 'description', type: 'text' },
                {
                    name: 'monthly_price',
                    type: 'number',
                    admin: { placeholder: "Enter Monthly Price" }
                },
                {
                    name: 'yearly_price',
                    type: 'number',
                    admin: { placeholder: "Enter Yearly Price (Auto-calculated if empty)" }
                },
                {
                    name: 'interval_unit',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Month', value: 'MONTH' },
                        { label: 'Year', value: 'YEAR' },
                    ],
                    admin: {
                        hidden: true,
                        condition: () => true,
                    }
                },
                {
                    name: 'currency',
                    type: 'select',
                    options: [
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' }
                    ]
                },
                { name: 'results_per_search', type: 'number' },
                { name: 'backlinks_monitored', type: 'number' },
                { name: 'plugin_clicks', type: 'number' },
                { name: 'keyword_searches', type: 'number' },
                { name: 'competitive_analyses', type: 'number' },
                { name: 'simultaneous_bulk_competitive', type: 'number' },
                { name: 'bulk_keywords', type: 'number' },
                { name: 'serp_scanner', type: 'number' },
            ],
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, originalDoc, req }) => {
                if (!req?.user || req?.user?.role !== 'admin') {
                    console.log("Skipping PayPal plan update: Not an admin request.");
                    return data;
                }

                const updatedPlans = data.plans;
                const oldPlans = originalDoc.plans;
                const productID = originalDoc.product_id;

                for (const updatedPlan of updatedPlans) {
                    const existingPlan = oldPlans.find((plan: { plan_name: string }) => plan.plan_name === updatedPlan.plan_name);

                    if (!existingPlan) {
                        console.log(`New plan manually added by admin: ${updatedPlan.plan_name}. Creating on PayPal...`);
                        try {
                            const { success, month_plan_id, year_plan_id } = await createPlanForUpdateValues(updatedPlan, productID, true, true);

                            if (success) {
                                updatedPlan.month_plan_id = month_plan_id;
                                updatedPlan.year_plan_id = year_plan_id;
                            }
                        } catch (error) {
                            console.error(`Error creating new PayPal plan:`, error);
                            throw new Error('PayPal plan creation failed. Rolling back.');
                        }
                        continue;
                    }

                    let shouldDeactivateMonth = false;
                    let shouldDeactivateYear = false;

                    // Detect changes that require deactivation
                    if (updatedPlan.currency !== existingPlan.currency) {
                        shouldDeactivateMonth = true;
                        shouldDeactivateYear = true;
                    } else {
                        if (updatedPlan.monthly_price !== existingPlan.monthly_price) {
                            shouldDeactivateMonth = true;
                        }
                        if (updatedPlan.yearly_price !== existingPlan.yearly_price) {
                            shouldDeactivateYear = true;
                        }
                    }

                    if (shouldDeactivateMonth || shouldDeactivateYear) {
                        console.log(`Plan ${existingPlan.plan_name} has changed. Deactivating and creating a new one.`);
                        try {
                            const { success, month_plan_id, year_plan_id } = await createPlanForUpdateValues(
                                updatedPlan,
                                productID,
                                shouldDeactivateMonth,
                                shouldDeactivateYear
                            );

                            if (success) {
                                if (shouldDeactivateMonth) updatedPlan.month_plan_id = month_plan_id;
                                if (shouldDeactivateYear) updatedPlan.year_plan_id = year_plan_id;
                            } else {
                                throw new Error('Failed to create updated PayPal plan.');
                            }
                        } catch (error) {
                            console.error(`Error updating PayPal plans:`, error);
                            throw new Error('PayPal plan update failed. Rolling back.');
                        }
                    }
                }

                return data;
            },
        ],
    }
};

export default PayPalPlans;
