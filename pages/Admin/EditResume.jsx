import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import PageTransition from '../../components/PageTransition';
import { MotionContainer } from '../../components/MotionElements';
import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('../../components/PdfPreview'), { ssr: false, loading: () => <div className="text-white">Loading PDF preview...</div>,});

export default function EditResume() {
  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try { const res = await fetch('/api/resume'); const data = await res.json(); if (res.ok) setResumes(data.data); else toast.error(data.error || 'Failed to fetch resumes');} 
    catch { toast.error('Error fetching resumes');}
  };

  const handleFileChange = (e) => { const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') { toast.error('Only PDF files are allowed.'); return;}
    setFile(selected);
  };

  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/uploadFile');
      xhr.upload.onprogress = (event) => { if (event.lengthComputable) { const percent = Math.round((event.loaded / event.total) * 100); setUploadProgress(percent);}};
      xhr.onload = () => { if (xhr.status === 200) { resolve(JSON.parse(xhr.responseText));} else { reject(new Error('Upload failed'));}};
      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.send(formData);
    });
  };

  const handleUpload = async (e) => { e.preventDefault();
    if (!title || !file) { toast.error('Both title and PDF are required.'); return;} setUploading(true); const loadingToast = toast.loading('Uploading...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      const uploadRes = await uploadWithProgress(formData);
      if (!uploadRes.success || !uploadRes.url) { throw new Error(uploadRes.error || 'File upload failed');}
      const res = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, resumeUrl: uploadRes.url }),});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save resume');
      toast.success('Resume uploaded successfully');
      setTitle('');
      setFile(null);
      setUploadProgress(0);
      fileInputRef.current.value = '';
      fetchResumes();
    } catch (err) { toast.error(err.message || 'Upload error');
    } finally { toast.dismiss(loadingToast); setUploading(false); setUploadProgress(0);}
  };

  const handleDelete = async (id) => { if (!confirm('Delete this resume?')) return;
    try { const res = await fetch(`/api/resume?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error); toast.success('Resume deleted'); fetchResumes();
    } catch (err) { toast.error(err.message);}
  };

  return (
    <AdminLayout>
      <PageTransition>
        <section className="py-10 px-4">
          <MotionContainer>
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white">Upload Resume</h2>

              <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow space-y-4">
                <input type="text" placeholder="Title (e.g. John Doe Resume)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded" required />
                <input type="file" accept="application/pdf" onChange={handleFileChange} ref={fileInputRef} className="w-full p-2 rounded" required />

                {uploading && (
                  <div>
                    <div className="relative h-3 bg-gray-200 rounded overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <button type="submit" className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </form>

              <div className="bg-gray-800 rounded text-white">
                <h3 className="text-xl font-semibold px-2 text-center py-4">Uploaded Resumes</h3>
                {resumes.length === 0 ? ( <p>No resumes uploaded.</p>
                ) : (
                  <ul>
                    {resumes.map((resume) => (
                      <li key={resume._id} className="bg-gray-900 rounded text-white">
                        <div className="flex justify-between p-2">
                          <span className="font-semibold">{resume.title}</span>
                          <button onClick={() => handleDelete(resume._id)} className="text-red-400 hover:underline" aria-label={`Delete ${resume.title}`}>
                            Delete
                          </button>
                        </div>

                        {/* PDF preview shown inline */}
                        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-secondary/10 relative">
                          <PdfPreview fileUrl={resume.resumeUrl} />
                        </div>
                      </li>
                    ))}
                  </ul> 
                )}
              </div>
            </div>
            <Toaster position="bottom-right" />
          </MotionContainer>
        </section>
      </PageTransition>
    </AdminLayout>
  );
}
