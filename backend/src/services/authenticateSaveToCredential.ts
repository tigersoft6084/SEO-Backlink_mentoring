import { Payload } from 'payload';
import { authenticateAndSave } from '../utils/authenticate';

export async function authenticateAdmin(payload: Payload, email: string, password: string, urls: string[]) {
  try {
    const updatedData = await authenticateAndSave(payload, email, password, urls);
    return updatedData;
  } catch (error) {
    console.error('Error in authenticationService:', error);
    throw error;
  }
}
