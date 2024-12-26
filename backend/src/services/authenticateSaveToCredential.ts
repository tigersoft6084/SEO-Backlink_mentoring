import { Payload } from 'payload';
import { authenticateAndSave } from '../utils/authenticate';

export async function authenticateAdmin(email: string, password: string, urls: string[]) {
  try {
    const updatedData = await authenticateAndSave(email, password, urls);
    return updatedData;
  } catch (error) {
    console.error('Error in authenticationService:', error);
    throw error;
  }
}
