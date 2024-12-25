import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// Generate a unique 256-bit key
export const generateKey = () => crypto.randomBytes(32).toString('hex');

// Encrypt text
export const encrypt = (text: string, key: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Decrypt text
export const decrypt = (encryptedText: string, key: string) => {

  const [ivHex, encryptedData] = encryptedText.split(':');
  if (!ivHex || !encryptedData) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(ivHex, 'hex'); // IV is a buffer from hex
  const encryptedBuffer = Buffer.from(encryptedData, 'hex'); // Encrypted data is a buffer from hex

  // Ensure key is 32 bytes (256 bits)
  const keyBuffer = Buffer.from(key, 'hex');
  if (keyBuffer.length !== 32) {
    throw new Error('Secret key must be 32 bytes for aes-256-cbc.');
  }

  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);

  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString('utf8');
};
