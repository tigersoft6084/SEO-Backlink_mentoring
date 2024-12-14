import type { CollectionConfig } from 'payload'
import { getTrackingInfo } from '@/utils/getTrackingInfo'

// a collection of 'orders' with an additional route for tracking details, reachable at /api/orders/:id/tracking
export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    /* ... */
  ],
  endpoints: [
    {
      path: '/:id/tracking',
      method: 'get',
      handler: async (req) => {
        if (!req.routeParams) {
          return Response.json({ error: 'Route parameters not found' }, { status: 400 });
        }
    
        const tracking = await getTrackingInfo(req.routeParams.id as string);
    
        if (!tracking) {
          return Response.json({ error: 'Not found' }, { status: 404 });
        }
    
        return Response.json({
          message: `Hello ${req.routeParams.carrier as string} @ ${req.routeParams.group as string}`,
        });
      },
    },    
    {
      path: '/:id/tracking',
      method: 'post',
      handler: async (req) => {
        if (!req.json) {
          return Response.json({ error: 'Request body parsing is unavailable' }, { status: 400 });
        }
    
        const data = await req.json();
    
        await req.payload.update({
          collection: 'tracking',
          data: {
            // Use `data` for updates
          },
        });
    
        return Response.json({
          message: 'Successfully updated tracking info',
        });
      },
    },
    {
      path: '/:id/forbidden',
      method: 'post',
      handler: async (req) => {
        // this is an example of an authenticated endpoint
        if (!req.user) {
          return Response.json({ error: 'forbidden' }, { status: 403 })
        }

        // do something

        return Response.json({
          message: 'successfully updated tracking info'
        })
      }
    }
  ],
}

export const Tracking: CollectionConfig = {
  slug: 'tracking',
  fields: [
    {
      name: 'status',
      type: 'text',
    },
    {
      name: 'carrier',
      type: 'text',
    },
    {
      name: 'trackingNumber',
      type: 'text',
    },
  ],
};