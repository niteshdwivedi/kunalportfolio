import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsFile = path.join(__dirname, '..', 'data', 'contacts.json');

export const readContacts = async () => {
  try {
    const raw = await fs.readFile(contactsFile, 'utf8');
    const normalized = raw.replace(/^\uFEFF/, '');
    return JSON.parse(normalized || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(contactsFile, '[]', 'utf8');
      return [];
    }

    throw error;
  }
};

export const writeContacts = async (contacts) => {
  await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
};
