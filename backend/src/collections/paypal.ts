import { createPlanForUpdateValues } from '@/services/paypal/plan/CreatePlan.ts';
import { deactivePlan } from '@/services/paypal/plan/DeactivePlan.ts';
import { listActivePlans } from '@/services/paypal/plan/ListPlan.ts';
import { Plan } from '@/types/paypal.ts';
import { CollectionConfig } from 'payload';

const PayPalPlans: CollectionConfig = {
    slug: 'paypal-plans', // The endpoint slug for the collection
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
        useAsTitle: 'product_id', // Display the `product_id` in the admin panel
    },
    fields: [
        {
            name: 'product_id',
            type: 'text',
            required: true,
            unique: true, // Ensure each product_id is unique
            admin: { readOnly: true }
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
                    admin: { readOnly: true },

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
                    name : 'interval_unit',
                    type : 'text',
                    admin: { readOnly: true }
                },
                {
                    name: 'currency',
                    type: 'select',
                    options : [
                        {label : 'USD', value : 'USD'},
                        {label : 'EUR', value : 'EUR'}
                    ]
                },
            ],
        },
    ],
    hooks : {
        beforeChange : [
            async({data, originalDoc}) => {

                if (!originalDoc || !originalDoc.plans) return data;

                const updatedPlans = data.plans;
                const oldPlans = originalDoc.plans;
                let newPlansCreated = false;
                const productID = originalDoc.product_id;

                for (const updatedPlan of updatedPlans) {
                    const existingPlan = oldPlans.find((plan: { plan_id: string }) => plan.plan_id === updatedPlan.plan_id);
                    if (!existingPlan) continue; // If it's a new plan, skip.

                    // **Step 1: Check if Values Have Changed**
                    if (
                        updatedPlan.plan_name !== existingPlan.plan_name ||
                        updatedPlan.description !== existingPlan.description ||
                        updatedPlan.price !== existingPlan.price ||
                        updatedPlan.currency !== existingPlan.currency
                    ) {
                        console.log(`Plan ${existingPlan.plan_id} has changed. Deactivating and creating a new one.`);

                        try {
                            // **Step 2: Deactivate the Old Plan**
                            await deactivePlan(existingPlan.plan_id);

                            // **Step 3: Create a New Plan with Updated Values**
                            await createPlanForUpdateValues(updatedPlan, productID);

                            // **Step 4: Find the New Plan**
                            const activePayPalPlans = await listActivePlans();

                            const newPlan = activePayPalPlans.find(
                                (plan: Plan) =>
                                    plan.plan_name === updatedPlan.plan_name &&
                                    plan.description === updatedPlan.description &&
                                    plan.price === updatedPlan.price &&
                                    plan.currency === updatedPlan.currency
                            );

                            if (newPlan?.plan_id) {
                                updatedPlan.plan_id = newPlan.plan_id; // **Update the Plan ID**
                                newPlansCreated = true;
                            } else {
                                throw new Error('Failed to find the newly created PayPal plan.');
                            }
                        } catch (error) {
                            if (error instanceof Error) {
                                console.error(`Error updating PayPal plans: ${error.message}`);
                            } else {
                                console.error('Error updating PayPal plans:', error);
                            }
                            throw new Error(`PayPal plan update failed. Rolling back.`);
                        }
                    }
                }

                if (newPlansCreated) {
                    return data;
                }

                return data;
            },
        ],
    }
};

export default PayPalPlans;
