// pages/api/incrementViewCount.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.body;

    try {
      const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { views: { increment: 1 } },
      });

      res.status(200).json({ views: updatedPost.views });
    } catch (error) {
      console.error('Failed to increment view count:', error);
      res.status(500).json({ error: 'Failed to increment view count' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}