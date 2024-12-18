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
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(ivHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
};
