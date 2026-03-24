import { asyncHandler } from '../utils/asyncHandler.js';
import { readContacts, writeContacts } from '../utils/contactStore.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getContacts = asyncHandler(async (_req, res) => {
  const contacts = await readContacts();
  res.status(200).json(contacts);
});

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const contacts = await readContacts();
  const contact = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  contacts.unshift(contact);
  await writeContacts(contacts);

  return res.status(201).json({
    message: 'Thanks for reaching out. Your message has been saved successfully.',
    id: contact.id,
  });
});
