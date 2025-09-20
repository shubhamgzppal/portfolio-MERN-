import { connectDB } from '../../lib/db';
import Resume from '../../modele/Resume';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    if (method === 'GET') {
      const resumes = await Resume.find().sort({ createdAt: -1 });
      return res.status(200).json({ data: resumes });
    }

    if (method === 'POST') {
      const { title, resumeUrl } = req.body;
      if (!title || !resumeUrl) return res.status(400).json({ error: 'Missing required fields' });

      const resume = await Resume.create({ title, resumeUrl });
      return res.status(201).json({ data: resume });
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });

      await Resume.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
