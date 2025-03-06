import { createPlanForUpdateValues } from '@/services/paypal/plan/CreatePlan.ts';
import { deactivePlan } from '@/services/paypal/plan/DeactivePlan.ts';
import { listActivePlans } from '@/services/paypal/plan/ListPlan.ts';
import { Plan } from '@/types/paypal.ts';
import { CollectionConfig } from 'payload';

interface ActivePlan extends Plan {
    interval_unit: "MONTH" | "YEAR";
}

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
            admin: { readOnly: true }
        },
        {
            name: 'plans',
            type: 'array',
            fields: [
                { name: 'plan_name', type: 'text' },
                { name: 'plan_id', type: 'text', unique: true, admin: { readOnly: true } },
                { name: 'description', type: 'text' },
                { name: 'price', type: 'number' },
                {
                    name: 'interval_unit',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Month', value: 'MONTH' },
                        { label: 'Year', value: 'YEAR' },
                    ],
                },
                {
                    name: 'currency',
                    type: 'select',
                    options: [
                        { label: 'USD', value: 'USD' },
                        { label: 'EUR', value: 'EUR' }
                    ]
                },
                {
                    name: 'features',
                    type: 'json',
                    admin: { position: 'sidebar' }
                }
            ],
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, originalDoc, req }) => {
                // ✅ Ensure this runs only when an admin manually updates the plans
                if (!req?.user) {
                    console.log("Skipping PayPal plan update: Not an admin request.");
                    return data;
                }

                if (!originalDoc || !originalDoc.plans) return data;

                const updatedPlans = data.plans;
                const oldPlans = originalDoc.plans;
                const productID = originalDoc.product_id;

                const INTERVAL_PRICE_MULTIPLIERS: Record<string, number> = {
                    MONTH: 1,
                    YEAR: 10,
                };

                for (const updatedPlan of updatedPlans) {
                    const existingPlan = oldPlans.find((plan: { plan_id: string }) => plan.plan_id === updatedPlan.plan_id);

                    if (!existingPlan) {
                        console.log(`New plan manually added by admin: ${updatedPlan.plan_name}. Creating on PayPal...`);

                        try {
                            const adjustedPlan = {
                                ...updatedPlan,
                                price: updatedPlan.price * (INTERVAL_PRICE_MULTIPLIERS[updatedPlan.interval_unit] || 1),
                            };

                            await createPlanForUpdateValues(adjustedPlan, productID);
                            const activePayPalPlans = await listActivePlans();

                            const newPlan = activePayPalPlans.find((plan) =>
                                plan.plan_name === updatedPlan.plan_name &&
                                plan.description === updatedPlan.description &&
                                parseFloat(plan.price as unknown as string) === adjustedPlan.price &&
                                plan.currency === updatedPlan.currency &&
                                plan.interval_unit === updatedPlan.interval_unit
                            );

                            if (newPlan?.plan_id) {
                                updatedPlan.plan_id = newPlan.plan_id;
                            } else {
                                throw new Error('Failed to find the newly created PayPal plan.');
                            }
                        } catch (error) {
                            console.error(`Error creating new PayPal plan:`, error);
                            throw new Error('PayPal plan creation failed. Rolling back.');
                        }

                    } else {
                        if (
                            updatedPlan.plan_name !== existingPlan.plan_name ||
                            updatedPlan.description !== existingPlan.description ||
                            updatedPlan.price !== existingPlan.price ||
                            updatedPlan.currency !== existingPlan.currency ||
                            updatedPlan.interval_unit !== existingPlan.interval_unit
                        ) {
                            console.log(`Plan ${existingPlan.plan_id} has changed. Deactivating and creating a new one.`);

                            try {
                                await deactivePlan(existingPlan.plan_id);

                                const adjustedPlan = {
                                    ...updatedPlan,
                                    price: updatedPlan.price * (INTERVAL_PRICE_MULTIPLIERS[updatedPlan.interval_unit] || 1),
                                };

                                await createPlanForUpdateValues(updatedPlan, productID);
                                const activePayPalPlans = await listActivePlans();

                                const newPlan = activePayPalPlans.find((plan) =>
                                    plan.plan_name === updatedPlan.plan_name &&
                                    plan.description === updatedPlan.description &&
                                    parseFloat(plan.price as unknown as string) === adjustedPlan.price &&
                                    plan.currency === updatedPlan.currency &&
                                    plan.interval_unit === updatedPlan.interval_unit
                                );

                                if (newPlan?.plan_id) {
                                    updatedPlan.plan_id = newPlan.plan_id;
                                } else {
                                    throw new Error('Failed to find the newly created PayPal plan.');
                                }
                            } catch (error) {
                                console.error(`Error updating PayPal plans:`, error);
                                throw new Error('PayPal plan update failed. Rolling back.');
                            }
                        }
                    }
                }

                return data;
            },
        ],
    }
};

export default PayPalPlans;
