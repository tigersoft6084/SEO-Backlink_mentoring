import { CollectionConfig } from 'payload';


export const DomainsForBackgroundProcess: CollectionConfig = {

    slug: 'domainsForBackgroundProcess',

    admin: {
        useAsTitle: 'Domain',                                                   // Use the domain field as the title in the admin panel
    },

    access: {
        read: () => true,
        create: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
        update: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
        delete: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
    },

    fields: [

        {
            name: 'Domain',
            type: 'text',                                                       //Domain Name
            index: true,
            required: true,
        },

        {
            name: 'RD',
            type: 'number',                                                     // Referring Domains
        },

        {
            name: 'TF',
            type: 'number',                                                     // Trust Flow
        },

        {
            name: 'CF',
            type: 'number',                                                     // Citation Flow
        },

        {
            name: 'TTF',
            type: 'text',                                                       // Topical Trust Flow
        },

        {
            name: 'Title',
            type: 'text',                                                       // Title for Domain
        },

        {
            name: 'Backlinks',
            type: 'text',                                                       // Number of backlinks for Domain
        },

        {
            name: 'Ref_Ips',
            type: 'text',                                                       // Referring Ips
        },

        {
            name: 'Ref_Edu',
            type: 'text',                                                       // Referring Edu
        },

        {
            name: 'Ref_Gov',
            type: 'text',                                                       // Referring Government
        },

        {
            name: 'Language',
            type: 'text',                                                       // Lanugage
        },

        {
            name: 'Ref_Lang',
            type: 'text',                                                       // Referring Languages
        },

        {
            name: 'Expiry_Date',
            type: "date"                                                        // Expiration Date
        },

        {
            name: 'Date_Fetched',
            type: 'date',                                                       // Date Fetched
            required: true,
        },

    ],

};