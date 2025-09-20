import { connectDB } from '../../lib/db';
import Certificate from '../../modele/Certificate';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const certificates = await Certificate.find();
        return res.status(200).json({ success: true, data: certificates });

      case 'POST':
        const newCert = await Certificate.create(req.body);
        return res.status(201).json({ success: true, data: newCert });

      case 'PUT':
        const { _id, ...updateData } = req.body;
        const updated = await Certificate.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updated) return res.status(404).json({ success: false, error: 'Certificate not found' });
        return res.status(200).json({ success: true, data: updated });

      case 'DELETE':
        const { id } = req.query;
        await Certificate.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Certificate deleted' });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
