import { getPayload } from 'payload'
import configPromise from '../../config/payload.config.ts';

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}


