import { GlobalConfig } from 'payload';

export const intercomSettings: GlobalConfig = {
    slug: 'intercom-settings', // The slug determines the API endpoint: /api/globals/site-settings
    label: 'Intercom Settings',
    access: {
        read: () => true,  // Adjust this to your needs
        update: () => true,  // Adjust this to your needs
    },
    fields: [
        {
            name: 'intercomID',
            type: 'text',
            label: 'Intercom ID',
            required: true,
        },
        {
            name: 'intercomeSecretKey',
            type: 'text',
            label: 'Intercom Secret Key',
            required: true,
        },
    ],
};
