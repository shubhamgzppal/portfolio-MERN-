import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';
import { MotionContainer } from '../../components/MotionElements';
import AdminLayout from '../../components/AdminLayout';
import AutoResizingTextarea from '../../components/AutoResizingTextarea';
import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('../../components/PdfPreview'), { ssr: false, loading: () => <div className="text-white">Loading PDF preview...</div>,});

export default function EditEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreviewURL, setFilePreviewURL] = useState('');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({ title: '', institute: '', duration: '', category: 'DIPLOMA', certificateUrl: '', focusAreas: '', achievements: '', });

  useEffect(() => { fetchEducationItems(); }, []);

  const fetchEducationItems = async () => {
    setLoading(true);
    try { const res = await fetch('/api/education'); const data = await res.json();
      if (res.ok) { setItems(data.data || []); }
      else { toast.error(data.error || 'Failed to fetch education items');}
    } 
    catch (err) { toast.error('Error fetching education items');} 
    finally { setLoading(false); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setForm({
        title: item.title,
        institute: item.institute,
        duration: item.duration,
        category: item.category,
        certificateUrl: item.certificateUrl || '',
        focusAreas: item.focusAreas?.join(', ') || '',
        achievements: item.achievements?.join(', ') || '',
      });
      setFilePreviewURL(item.certificateUrl || '');
    } 
    else { setForm({ title: '', institute: '', duration: '', category: 'DIPLOMA', certificateUrl: '', focusAreas: '', achievements: '', }); setFilePreviewURL(''); }
    setFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm({ title: '', institute: '', duration: '', category: 'DIPLOMA', certificateUrl: '', focusAreas: '', achievements: '', });
    setFile(null);
    setFilePreviewURL('');
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return; const allowedTypes = ['application/pdf', 'image/']; const isValid = allowedTypes.some((type) => selected.type.startsWith(type));
    if (!isValid) { toast.error('Only images or PDFs allowed for certificate'); return; }
    if (filePreviewURL) URL.revokeObjectURL(filePreviewURL); setFile(selected);
    if (selected.type.startsWith('image/')) { setFilePreviewURL(URL.createObjectURL(selected)); } 
    else { setFilePreviewURL(''); }
  };

  const handleFormChange = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); };

  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/uploadFile');
      xhr.upload.onprogress = (event) => { if (event.lengthComputable) { const percent = Math.round((event.loaded / event.total) * 100); setUploadProgress(percent); }};
      xhr.onload = () => { if (xhr.status === 200) { resolve(JSON.parse(xhr.responseText));} else { reject(new Error('Upload failed'));}};
      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving education item...');
    try {
      let certUrl = form.certificateUrl;
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', form.title || 'education-cert');
        const uploadRes = await uploadWithProgress(formData);
        if (!uploadRes.url) throw new Error(uploadRes.error || 'Upload failed');
        certUrl = uploadRes.url;
        toast.success('File uploaded'); 
      }

      const payload = {
        title: form.title,
        institute: form.institute,
        duration: form.duration,
        category: form.category,
        certificateUrl: certUrl,
        focusAreas: form.focusAreas.split('.').map(s => s.trim()).filter(Boolean),
        achievements: form.achievements.split('.').map(s => s.trim()).filter(Boolean),
      };

      let method = 'POST';
      if (editingItem) { method = 'PUT'; payload._id = editingItem._id; }
      const res = await fetch('/api/education', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success(editingItem ? 'Updated item' : 'Added item');
      closeModal();
      fetchEducationItems();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure to delete this item?')) return;
    try {
      const res = await fetch(`/api/education?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success('Deleted');
      fetchEducationItems();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <AdminLayout>
      <PageTransition>
        <section className="py-9 px-4">
          <MotionContainer>
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Education</h2>
                <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded">
                  Add Education
                </button>
              </div>

              {loading ? (
                <p className="text-white">Loading...</p>
              ) : (
                <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700 text-left">
                      <th className="p-3">Certificate / Preview</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Institute</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item._id} className="border-t border-gray-700">
                        <td className="p-3">
                          <div className="w-20 h-14 overflow-hidden rounded border border-gray-600"><PdfPreview fileUrl={item.certificateUrl}/></div>
                        </td>
                        <td className="p-3">{item.title}</td>
                        <td className="p-3">{item.institute}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">{item.duration}</td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => openModal(item)} className="text-blue-400 bg-none">✏️</button>
                          <button onClick={() => handleDelete(item._id)} className="text-red-400 bg-none">x</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
                  <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Education' : 'Add Education'}</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={form.title} onChange={e => handleFormChange('title', e.target.value)} placeholder="Title" required className="w-full p-2 rounded"/>
                    <input type="text" value={form.institute} onChange={e => handleFormChange('institute', e.target.value)} placeholder="Institute" required className="w-full p-2 rounded"/>
                    <input type="text" value={form.duration} onChange={e => handleFormChange('duration', e.target.value)} placeholder="Duration (e.g. 2022‑2025)" required className="w-full p-2 rounded"/>
                    <input type="text" value={form.category} onChange={e => handleFormChange('category', e.target.value)} placeholder="category" required className="w-full p-2 rounded"/>
                    <AutoResizingTextarea value={form.focusAreas} onChange={e => handleFormChange('focusAreas', e.target.value)} placeholder="Focus Areas (Dot-separated )" className="w-full p-2 rounded"/>
                    <AutoResizingTextarea value={form.achievements} onChange={e => handleFormChange('achievements', e.target.value)} placeholder="Achievements (Dot-separated)" className="w-full p-2 rounded"/>
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf" onChange={handleFileChange} className="w-full p-2 rounded"/>

                    {(filePreviewURL || form.certificateUrl) && (
                      <div className="mt-2">
                        <p className="font-medium">Preview:</p>
                        {filePreviewURL ? (
                          <div className="w-20 h-14 overflow-hidden rounded border border-gray-600"><PdfPreview fileUrl={form.certificateUrl}/></div>
                        ) : (<p>no file uploaded</p>   )}
                      </div>
                    )}

                    {uploading && (
                      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${uploadProgress}%` }} />
                        <p className="text-sm mt-1">{uploadProgress}% uploaded</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-4">
                      <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" disabled={uploading} className="bg-primary text-white px-4 py-2 rounded">{editingItem ? 'Update' : 'Add'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </MotionContainer>
          <Toaster position="bottom-right" />
        </section>
      </PageTransition>
    </AdminLayout>
  );
}