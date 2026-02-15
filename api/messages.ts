import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  messages: ChatMessage[];
  lastUpdate: string;
  status: 'active' | 'closed';
}

const messagesFile = path.join('/tmp', 'conversations.json');

function getConversations(): Conversation[] {
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading conversations:', error);
  }
  return [];
}

function saveConversations(conversations: Conversation[]): void {
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(conversations, null, 2));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const conversations = getConversations();

  // GET: Retrieve conversations
  if (req.method === 'GET') {
    const { password, conversationId } = req.query;
    
    // If admin password provided, return all conversations
    if (password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json(conversations);
    }

    // If only conversationId provided, return that specific conversation (for visitor)
    if (conversationId) {
      const conv = conversations.find(c => c.id === conversationId);
      return conv ? res.status(200).json(conv) : res.status(404).json({ error: 'Not found' });
    }

    return res.status(401).json({ error: 'Unauthorized' });
  }

  // POST: Add new message (visitor or admin)
  if (req.method === 'POST') {
    const { conversationId, visitorName, visitorEmail, visitorPhone, text, sender, password } = req.body;

    let convIndex = conversations.findIndex(c => c.id === conversationId);

    if (convIndex === -1 && sender === 'visitor') {
      // Create new conversation
      const newConv: Conversation = {
        id: conversationId || Date.now().toString(),
        visitorName: visitorName || 'Anonymous',
        visitorEmail: visitorEmail || '',
        visitorPhone: visitorPhone || '',
        messages: [],
        lastUpdate: new Date().toISOString(),
        status: 'active',
      };
      conversations.push(newConv);
      convIndex = conversations.length - 1;
    }

    if (convIndex === -1) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Security check for admin
    if (sender === 'admin' && password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    conversations[convIndex].messages.push(newMessage);
    conversations[convIndex].lastUpdate = new Date().toISOString();
    saveConversations(conversations);

    return res.status(200).json(conversations[convIndex]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
