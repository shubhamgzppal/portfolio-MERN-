import { connectDB } from '../../lib/db'; 
import Education from '../../modele/Education';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const allItems = await Education.find();
        res.status(200).json({ success: true, data: allItems });
        break;

      case 'POST':
        const created = await Education.create(req.body);
        res.status(201).json({ success: true, data: created });
        break;

      case 'PUT':
        const { _id, ...updateData } = req.body;
        const updated = await Education.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updated) {
          return res.status(404).json({ success: false, error: 'Education item not found' });
        }
        res.status(200).json({ success: true, data: updated });
        break;

      case 'DELETE':
        const { id } = req.query;
        const del = await Education.findByIdAndDelete(id);
        if (!del) {
          return res.status(404).json({ success: false, error: 'Education item not found' });
        }
        res.status(200).json({ success: true, message: 'Deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
  } catch (err) {
    console.error('Education API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
