import { CollectionConfig } from 'payload';

export const Backlinks: CollectionConfig = {

  slug: 'backlinks',

  admin: {
    useAsTitle: 'Domain',                                                 // Use the email field as the title in the admin panel
  },

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
    update: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
    delete: ({ req }) => req.user?.role === 'admin',                      // Allow only admins to update
  },

  fields: [

    {
      name: 'Domain',
      type: 'text',                                                       //Domain Name
      index: true,
      required: true,
    },

    {
      name: 'Marketplaces',
      type: 'array',                                                      // Use an array to allow multiple marketplace-price pairs
      required: true,
      fields: [

        {
          name: 'Marketplace_Source',                                     // Marketplace for domain
          type: 'text',
          required: true,
        },

        {
          name: 'Price',                                                  // Marketplace's price for domain
          type: 'number',
          required: true,
        },

      ],

    },

    {
        name: 'RD',
        type: 'number',                                                     // Referring Domains
    },

    {
      name: 'TF',
      type: 'number',                                                       // Trust Flow
    },

    {
      name: 'CF',
      type: 'number',                                                       // Citation Flow
    },

    {
      name: 'TTF',
      type: 'text',                                                         // Topical Trust Flow
    },

    {
      name: 'Title',
      type: 'text',                                                         // Title for Domain
    },

    {
      name: 'Backlinks',
      type: 'text',                                                         // Number of backlinks for Domain
    },

    {
      name: 'Ref_Ips',
      type: 'text',                                                         // Referring Ips
    },

    {
      name: 'Ref_Edu',
      type: 'text',                                                         // Referring Edu
    },

    {
      name: 'Ref_Gov',
      type: 'text',                                                         // Referring Government
    },

    {
      name: 'Language',
      type: 'text',                                                         // Lanugage
    },

    {
      name: 'Ref_Lang',
      type: 'text',                                                         // Referring Languages
    },

    {
      name: 'Expiry_Date',
      type: "text"                                                            // Expiration Date
    },

    {
      name: 'Date_Fetched',
      type: 'date',                                                           // Date Fetched
      required: true,
    },

  ],

};
