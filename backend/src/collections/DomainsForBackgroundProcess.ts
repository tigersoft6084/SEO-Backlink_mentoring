import { CollectionConfig } from 'payload';


export const DomainsForBackgroundProcess: CollectionConfig = {

    slug: 'domainsForBackgroundProcess',

    admin: {
        useAsTitle: 'domain',                                                   // Use the domain field as the title in the admin panel
    },

    access: {
        read: () => true,
        create: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
        update: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
        delete: ({ req }) => req.user?.role === 'admin',                        // Allow only admins to update
    },

    fields: [

        {
            name: 'domain',
            type: 'text',                                                       //Domain Name
            index: true,
            required: true,
        },

        {
            name: 'rd',
            type: 'number',                                                     // Referring Domains
        },

        {
            name: 'tf',
            type: 'number',                                                     // Trust Flow
        },

        {
            name: 'cf',
            type: 'number',                                                     // Citation Flow
        },

        {
            name: 'ttf',
            type: 'text',                                                       // Topical Trust Flow
        },

        {
            name: 'title',
            type: 'text',                                                       // Title for Domain
        },

        {
            name: 'backlinks',
            type: 'text',                                                       // Number of backlinks for Domain
        },

        {
            name: 'ref_ips',
            type: 'text',                                                       // Referring Ips
        },

        {
            name: 'ref_edu',
            type: 'text',                                                       // Referring Edu
        },

        {
            name: 'ref_gov',
            type: 'text',                                                       // Referring Government
        },

        {
            name: 'language',
            type: 'text',                                                       // Lanugage
        },

        {
            name: 'ref_lang',
            type: 'text',                                                       // Referring Languages
        },

        {
            name: 'expiry_date',
            type: "date"                                                        // Expiration Date
        },

        {
            name: "status",
            type: "select",
            options: ["pending", "processing", "processed"],
            defaultValue: "pending",
            required: true,
        },

        {
            name: "created_at",
            type: "date",
            required: true,
            defaultValue: () => new Date().toISOString(),
        },

        {
            name: "updated_at",
            type: "date",
            defaultValue: () => new Date().toISOString(),
        },

    ],

};