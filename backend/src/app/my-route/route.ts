import configPromise from '@/config/payload.config'
import { getPayload } from 'payload'
import express from 'express';

const router = express.Router();

router.get('/custom-route', (req , res) => {
  res.status(200).json({ message : "Hello from custom route!"});
});

export default router;

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}


