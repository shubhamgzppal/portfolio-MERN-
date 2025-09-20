// pages/api/profile.js
import { connectDB } from '../../lib/db';
import Profile from '../../modele/Profile';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try { const profile = await Profile.findOne(); return res.status(200).json({ success: true, data: profile });
      } catch (error) { return res.status(500).json({ success: false, error: 'Server Error' });}

    case 'PUT':
      try { const { description, detailedDescription, quote, skills, imgUrl } = req.body; const profile = await Profile.findOne();
        if (!profile) { return res.status(404).json({ success: false, error: 'Profile not found' });}

        profile.description = description;
        profile.detailedDescription = detailedDescription;
        profile.quote = quote;
        profile.skills = skills;
        profile.imgUrl = imgUrl;

        await profile.save();

        return res.status(200).json({ success: true, data: profile });
      } catch (error) { return res.status(400).json({ success: false, error: error.message });}

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
