import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';
import { MotionContainer } from '../../components/MotionElements';
import AdminLayout from '../../components/AdminLayout';
import AutoResizingTextarea from '../../components/AutoResizingTextarea';

export default function EditProfile() {
  const [profile, setProfile] = useState({description: '', quote: '', detailedDescription: [''], skills: [''], imgUrl: '', });

  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputFileRef = useRef(null);
  const [filePreviewURL, setFilePreviewURL] = useState('');
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('profile-img');

  const autoResize = (textarea) => { if (textarea) { textarea.style.height = 'auto'; textarea.style.height = `${textarea.scrollHeight}px`;}};

  useEffect(() => {
    const fetchProfile = async () => {
      try { const res = await fetch('/api/profile'); const data = await res.json();
        if (res.ok) { setProfile({description: '', quote: '', detailedDescription: [''], skills: [''], imgUrl: '', 
          ...data.data, detailedDescription: data.data?.detailedDescription?.length ? data.data.detailedDescription : [''], skills: data.data?.skills?.length ? data.data.skills : [''],
          }); setTimeout(() => { document.querySelectorAll('textarea.auto-resize').forEach(autoResize); }, 0);
        } else { toast.error(data.error || 'Failed to fetch profile'); }
      } catch (error) { toast.error('Error loading profile'); }
    };
    fetchProfile();
  }, []);

  useEffect(() => { return () => { if (filePreviewURL) { URL.revokeObjectURL(filePreviewURL); }}; }, [filePreviewURL]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const allowedTypes = ['image/', 'video/', 'application/pdf'];
    const isValid = allowedTypes.some((type) => selected.type.startsWith(type));
    if (!isValid) { toast.error('Only images, videos, or PDFs are allowed.'); return; }
    if (filePreviewURL) { URL.revokeObjectURL(filePreviewURL); }
    setFile(selected);
    if (selected.type.startsWith('image/')) {setFilePreviewURL(URL.createObjectURL(selected)); } else { setFilePreviewURL(''); }
  };

  const handleInputChange = (field, value) => { setProfile((prev) => ({ ...prev, [field]: value })); };

  const detailedDescriptionText = profile.detailedDescription.join(' ').replace(/\.\s*/g, '. ').trim();

  const skillsText = profile.skills.join(', ');

  const handleDetailedDescriptionChange = (e) => {const value = e.target.value;
    const sentences = value.split(/\.\s*|\n+/).map((s) => s.trim()).filter(Boolean).map((s) => (s.endsWith('.') ? s : s + '.')); setProfile((prev) => ({ ...prev, detailedDescription: sentences }));
  };

  const handleSkillsChange = (e) => {const value = e.target.value; const skills = value.split(',').map((s) => s.trim()).filter(Boolean); setProfile((prev) => ({ ...prev, skills }));};

  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/uploadFile');
      xhr.upload.onprogress = (event) => {if (event.lengthComputable) { const percent = Math.round((event.loaded / event.total) * 100); setUploadProgress(percent); }};
      xhr.onload = () => { if (xhr.status === 200) { resolve(JSON.parse(xhr.responseText)); } else { reject(new Error('Upload failed')); }};
      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => { e.preventDefault(); setIsSaving(true); const loadingToast = toast.loading('Saving...');
    let uploadedUrl = profile.imgUrl;
    try {
      if (file) { setUploading(true); const formData = new FormData(); formData.append('file', file); formData.append('title', fileTitle);
        const uploadRes = await uploadWithProgress(formData);
        if (!uploadRes.url) { throw new Error(uploadRes.error || 'File upload failed'); }
        uploadedUrl = uploadRes.url;
        toast.success('File uploaded successfully!');
      }
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...profile, imgUrl: uploadedUrl }), });
      const data = await res.json();
      if (res.ok) { toast.success('Profile updated successfully!'); } 
      else { throw new Error(data.error); }
    } catch (error) { toast.error(error.message || 'Error saving profile'); } 
    finally { setIsSaving(false); setUploading(false); setUploadProgress(0); toast.dismiss(loadingToast); }
  };

  return (
    <AdminLayout>
      <PageTransition>
        <section className="py-9 px-4">
          <MotionContainer>
            <div className="max-w-4xl mx-auto z-10">
              <h2 className="text-3xl font-bold mb-8">Manage Profile</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-1 font-medium">File Title / ID</label>
                  <input type="text" value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} placeholder="e.g., profile-img" className="w-full px-4 py-2 rounded" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Upload Image / PDF / Video</label>
                  <input ref={inputFileRef} type="file" accept="image/*,application/pdf,video/*" onChange={handleFileChange} className="w-full px-4 py-2 rounded" />
                </div>

                {(filePreviewURL || profile.imgUrl) && (
                  <div className="w-96 overflow-auto rounded-lg bg-gray-900">
                    <p className="font-medium mb-2">File Preview:</p>
                    {filePreviewURL ? ( <img src={filePreviewURL} alt="Preview" className="rounded-lg shadow" />
                    ) : profile.imgUrl?.endsWith('.pdf') ? ( <a href={profile.imgUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Uploaded PDF</a>
                    ) : profile.imgUrl?.includes('video') ? ( <video src={profile.imgUrl} controls className="rounded-lg shadow" />
                    ) : ( <img src={profile.imgUrl} alt="Existing" className="rounded-lg shadow" />
                    )}
                  </div>
                )}

                {uploading && (
                  <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-blue-500 transition-all" style={{ width: `${uploadProgress}%`}} />
                    <p className="text-sm mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <AutoResizingTextarea value={profile.description} onChange={handleInputChange} className="w-full p-3 rounded border-gray-300" placeholder="Enter Description here" required />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Detailed Description</label>
                  <AutoResizingTextarea value={detailedDescriptionText} onChange={handleDetailedDescriptionChange} className="w-full p-3 rounded border-gray-300" placeholder="Enter Detailed Description separated by commas" required />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Quote</label>
                  <input type="text" value={profile.quote} onChange={(e) => handleInputChange('quote', e.target.value)} className="w-full p-3 rounded border-gray-300" required />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Skills</label>
                  <AutoResizingTextarea value={skillsText} onChange={handleSkillsChange} className="w-full p-3 rounded border-gray-300" placeholder="Enter skills separated by commas" required />
                </div>

                <div className="text-center">
                  <button type="submit" disabled={isSaving || uploading} className="bg-primary text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Profile'}</button>
                </div>

              </form>
            </div>
          </MotionContainer>
          <Toaster position="bottom-right" />
        </section>
      </PageTransition>
    </AdminLayout>
  );
}
