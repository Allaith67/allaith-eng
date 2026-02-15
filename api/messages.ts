import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

interface Message {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorMessage: string;
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
  status: 'unread' | 'read' | 'replied';
}

const messagesFile = path.join('/tmp', 'messages.json');

function getMessages(): Message[] {
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading messages:', error);
  }
  return [];
}

function saveMessages(messages: Message[]): void {
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // GET: Retrieve all messages (admin only - requires password)
  if (req.method === 'GET') {
    const { password } = req.query;
    
    // Simple password check (should be environment variable in production)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const messages = getMessages();
    return res.status(200).json(messages);
  }

  // POST: Add new message from visitor
  if (req.method === 'POST') {
    const { visitorName, visitorEmail, visitorPhone, visitorMessage } = req.body;

    if (!visitorName || !visitorEmail || !visitorMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messages = getMessages();
    const newMessage: Message = {
      id: Date.now().toString(),
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorMessage,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    messages.push(newMessage);
    saveMessages(messages);

    return res.status(200).json({ success: true, messageId: newMessage.id });
  }

  // PUT: Admin reply to message
  if (req.method === 'PUT') {
    const { password, messageId, adminReply } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!messageId || !adminReply) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messages = getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);

    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messages[messageIndex].adminReply = adminReply;
    messages[messageIndex].repliedAt = new Date().toISOString();
    messages[messageIndex].status = 'replied';

    saveMessages(messages);

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
