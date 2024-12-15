import { getCredentials } from '../services/credentialService';

const main = async () => {
  try {
    const credentials = await getCredentials();
    console.log('Fetched credentials:', credentials);
  } catch (error) {
    console.error('Error fetching credentials:', error);
  }
};

main();
