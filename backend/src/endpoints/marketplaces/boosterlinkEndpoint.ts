import { Endpoint } from 'payload';
import { boosterlinkHandler } from '@/handlers/market-places/boosterlink_handler.ts';
import { withErrorHandling } from '@/middleware/errorMiddleware.ts';

export const fetchBoosterlinkEndpoint: Endpoint = {

  path: '/fetch-boosterlink',

  method: 'get',

  handler : withErrorHandling(boosterlinkHandler)

};
