import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';
import { MotionContainer } from '../../components/MotionElements';
import AdminLayout from '../../components/AdminLayout';
import AutoResizingTextarea from '../../components/AutoResizingTextarea';
import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('../../components/PdfPreview'), { ssr: false, loading: () => <div className="text-white">Loading PDF preview...</div>,});

export default function EditCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreviewURL, setFilePreviewURL] = useState('');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({ title: '', provider: '', icon: '', url: '', date: '', skills: '', category: 'FULL_STACK', });

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try { const res = await fetch('/api/certificates'); const data = await res.json();
      if (res.ok) { setCertificates(data.data || []); } 
      else { toast.error(data.error || 'Failed to fetch certificates'); }} 
    catch { toast.error('Error fetching certificates');} 
    finally { setLoading(false);}
  };
   
  const openModal = (certificate = null) => {
    setEditingCertificate(certificate);
    if (certificate) { setForm({ title: certificate.title || '', provider: certificate.provider || '', icon: certificate.icon || '', url: certificate.url || '', date: certificate.date ? certificate.date.slice(0, 10) : '', skills: certificate.skills.join(', ') || '', category: certificate.category || 'FULL_STACK', });} 
    else { setForm({ title: '', provider: '', icon: '', url: '', date: '', skills: '', category: 'FULL_STACK', }); setFile(null); setFilePreviewURL('');} setModalOpen(true); };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCertificate(null);
    setForm({ title: '', provider: '', icon: '', url: '', date: '', skills: '', category: 'FULL_STACK',});
    setFile(null);
    setFilePreviewURL('');
  };


  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return; const allowedTypes = ['image/', 'application/pdf']; const isValid = allowedTypes.some((type) => selected.type.startsWith(type));
    if (!isValid) { toast.error('Only images or PDFs are allowed.'); return; }
    if (filePreviewURL) URL.revokeObjectURL(filePreviewURL); setFile(selected);
    if (selected.type.startsWith('image/')) { setFilePreviewURL(URL.createObjectURL(selected));} 
    else { setFilePreviewURL('');}
  };

  const handleFormChange = (field, value) => { setForm((prev) => ({ ...prev, [field]: value })); };

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
    const loadingToast = toast.loading('Saving certificate...');
    try {
      let uploadedUrl = form.url;
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', form.title || 'certificate-file');
        const uploadRes = await uploadWithProgress(formData);
        if (!uploadRes.url) throw new Error(uploadRes.error || 'Upload failed');
        uploadedUrl = uploadRes.url;
        toast.success('File uploaded!');
      }

      const payload = { ...form, url: uploadedUrl, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),};

      const method = editingCertificate ? 'PUT' : 'POST';
      const endpoint = '/api/certificates';
      if (editingCertificate) payload._id = editingCertificate._id;

      const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      toast.success(editingCertificate ? 'Certificate updated' : 'Certificate added');
      closeModal();
      fetchCertificates();
    } catch (err) { toast.error(err.message); 
    } finally { setUploading(false); setUploadProgress(0); toast.dismiss(loadingToast);}
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try { const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' }); const data = await res.json();
      if (res.ok) { toast.success('Certificate deleted'); fetchCertificates();} 
      else { toast.error(data.error || 'Failed to delete');}
    } catch { toast.error('Delete error');}
  };

  return (
    <AdminLayout>
      <PageTransition>
        <section className="py-9 px-4">
          <MotionContainer>
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Certificates</h2>
                <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded">Add New</button>
              </div>

              {loading ? ( <p className="text-white">Loading...</p>
              ) : (
                <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700 text-left">
                      <th className="p-3">Preview</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Skills</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((certificate) => (
                      <tr key={certificate._id} className="border-t border-gray-700">
                        <td className="p-3">
                          <div className="w-20 h-14 overflow-hidden rounded border border-gray-600"><PdfPreview fileUrl={certificate.url}/></div>
                        </td>
                        <td className="p-3">{certificate.title}</td>
                        <td className="p-3">{certificate.provider}</td>
                        <td className="p-3">{certificate.category}</td>
                        <td className="p-3">{certificate.skills.join(', ')}</td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => openModal(certificate)} className="text-blue-400">✏️</button>
                          <button onClick={() => handleDelete(certificate._id)} className="text-red-400">x</button>
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
                  <h3 className="text-xl font-bold mb-4">{editingCertificate ? 'Edit Certificate' : 'Add Certificate'}</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} placeholder="Certificate Title" required className="w-full p-2 rounded"/>
                    <input type="text" value={form.provider} onChange={(e) => handleFormChange('provider', e.target.value)} placeholder="Provider" required className="w-full p-2 rounded"/>
                    <input type="text" value={form.icon} onChange={(e) => handleFormChange('icon', e.target.value)} placeholder="Icon (emoji or keyword)" className="w-full p-2 rounded"/>
                    <input type="date" value={form.date} onChange={(e) => handleFormChange('date', e.target.value)} className="w-full p-2 rounded"/>
                    <AutoResizingTextarea value={form.skills} onChange={(e) => handleFormChange('skills', e.target.value)} placeholder="Skills (comma separated)" className="w-full border p-2 rounded"/>
                    <select value={form.category} onChange={(e) => handleFormChange('category', e.target.value)} className="w-full p-2 rounded">
                      <option value="FULL_STACK">FULL_STACK</option>
                      <option value="DATA_SCIENCE">DATA_SCIENCE</option>
                    </select>
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf" onChange={handleFileChange} className="w-full p-2 rounded"/>

                    {(filePreviewURL || form.url) && (
                      <div className="mt-2 space-y-2">
                        <p className="font-medium">Preview:</p>
                        {(() => {
                          const url = filePreviewURL || form.url;
                          if (!url) { return <p className="text-sm text-gray-500">No file selected</p>;} 
                          else { return (<div className="w-20 h-14 overflow-hidden rounded border border-gray-600"><PdfPreview fileUrl={url} /></div>);}
                        })()}
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
                      <button type="submit" disabled={uploading} className="bg-primary text-white px-4 py-2 rounded">
                        {editingCertificate ? 'Update' : 'Add'}
                      </button>
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
