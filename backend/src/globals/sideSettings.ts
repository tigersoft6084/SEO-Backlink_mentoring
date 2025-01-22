import { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings', // The slug determines the API endpoint: /api/globals/site-settings
    label: 'Site Settings',
    fields: [
        {
        name: 'siteTitle',
        type: 'text',
        label: 'Site Title',
        required: true,
        },
        {
        name: 'description',
        type: 'textarea',
        label: 'Site Description',
        required: true,
        },
        {
        name: 'socialLinks',
        type: 'array',
        label: 'Social Links',
        fields: [
            {
            name: 'platform',
            type: 'text',
            label: 'Platform',
            required: true,
            },
            {
            name: 'url',
            type: 'text',
            label: 'URL',
            required: true,
            },
        ],
        },
        {
        name: 'logo',
        type: 'upload',
        relationTo: 'media', // Assuming you have a media collection for uploads
        label: 'Site Logo',
        },
    ],
};
