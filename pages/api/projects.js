// pages/api/projects.js
import { connectDB } from '../../lib/db';
import Project from '../../modele/Project';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const projects = await Project.find();
        return res.status(200).json({ success: true, data: projects });

      case 'POST':
        const newProject = await Project.create(req.body);
        return res.status(201).json({ success: true, data: newProject });

      case 'PUT':
        const { _id, ...updateData } = req.body;
        const updatedProject = await Project.findByIdAndUpdate(_id, updateData, { new: true });
        return res.status(200).json({ success: true, data: updatedProject });

      case 'DELETE':
        const { id } = req.query;
        await Project.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Project deleted' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
