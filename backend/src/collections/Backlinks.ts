import { CollectionConfig } from 'payload';


export const Backlinks: CollectionConfig = {

  slug: 'backlinks',

  admin: {
    useAsTitle: 'domain',                                                 // Use the domain field as the title in the admin panel
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
    update: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
    delete: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
  },

  fields: [

    {
      name: 'domain',
      type: 'text',                                                       //Domain Name
      index: true,
      required: true,
    },

    {
      name: 'marketplaces',
      type: 'array',                                                      // Use an array to allow multiple marketplace-price pairs
      required: true,
      fields: [

        {
          name: 'marketplace_source',                                     // Marketplace for domain
          type: 'text',
          required: true,
        },

        {
          name: 'price',                                                  // Marketplace's price for domain
          type: 'number',
          required: true,
        },

      ],

    },

    {
      name: 'rd',
      type: 'number',                                                       // Referring Domains
    },

    {
      name: 'tf',
      type: 'number',                                                       // Trust Flow
    },

    {
      name: 'cf',
      type: 'number',                                                       // Citation Flow
    },

    {
      name: 'ttf',
      type: 'text',                                                         // Topical Trust Flow
    },

    {
      name: 'title',
      type: 'text',                                                         // Title for Domain
    },

    {
      name: 'backlinks',
    type: 'number',                                                         // Number of backlinks for Domain
    },

    {
      name: 'ref_ips',
    type: 'number',                                                         // Referring Ips
    },

    {
      name: 'ref_edu',
    type: 'number',                                                         // Referring Edu
    },

    {
      name: 'ref_gov',
    type: 'number',                                                         // Referring Government
    },

    {
      name: 'language',
      type: 'text',                                                         // Lanugage
    },

    {
      name: 'ref_lang',
      type: 'text',                                                         // Referring Languages
    },

    {
      name: 'expiry_date',
      type: "date"                                                          // Expiration Date
    },

    {
      name: 'date_fetched',
      type: 'date',                                                         // Date Fetched
      required: true,
      defaultValue: () => new Date().toISOString(),
    },

  ],

};
