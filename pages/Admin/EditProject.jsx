import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PageTransition from '../../components/PageTransition';
import { MotionContainer } from '../../components/MotionElements';
import AdminLayout from '../../components/AdminLayout';

export default function EditProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreviewURL, setFilePreviewURL] = useState('');
  const fileInputRef = useRef(null); 
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', tech: '', link: '', github: '', category: 'FULL_STACK', image: '', });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try { const res = await fetch('/api/projects'); const data = await res.json();
      if (res.ok) { setProjects(data.data || []); } 
      else { toast.error(data.error || 'Failed to fetch projects'); }
    } 
    catch (error) { toast.error('Error fetching projects'); } 
    finally { setLoading(false); }
  };

  const openModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      setForm({
        title: project.title,
        description: project.description,
        tech: project.tech.join(', '),
        link: project.link,
        github: project.github,
        category: project.category,
        image: project.image || '',
      });
      setFilePreviewURL(project.image || '');
    } 
    else { setForm({ title: '', description: '', tech: '', link: '', github: '', category: 'FULL_STACK', image: '', }); setFilePreviewURL(''); }
    setFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ title: '', description: '', tech: '', link: '', github: '', category: 'FULL_STACK', image: '', });
    setFile(null);
    setFilePreviewURL('');
    setEditingProject(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const allowedTypes = ['image/', 'video/', 'application/pdf'];
    const isValid = allowedTypes.some((type) => selected.type.startsWith(type));
    if (!isValid) { toast.error('Only images, videos, or PDFs are allowed.'); return; }
    if (filePreviewURL) { URL.revokeObjectURL(filePreviewURL); }
    setFile(selected);
    if (selected.type.startsWith('image/')) { setFilePreviewURL(URL.createObjectURL(selected)); } 
    else { setFilePreviewURL(''); }
  };

  const handleFormChange = (field, value) => { setForm((prev) => ({ ...prev, [field]: value })); };

  const uploadWithProgress = (formData) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/uploadFile');
      xhr.upload.onprogress = (event) => { if (event.lengthComputable) { const percent = Math.round((event.loaded / event.total) * 100); setUploadProgress(percent); }};
      xhr.onload = () => { if (xhr.status === 200) { resolve(JSON.parse(xhr.responseText)); } else { reject(new Error('Upload failed')); }};
      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving project...');
    try {
      let uploadedUrl = form.image;
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', form.title || 'project-file');
        const uploadRes = await uploadWithProgress(formData);
        if (!uploadRes.url) throw new Error(uploadRes.error || 'Upload failed');
        uploadedUrl = uploadRes.url;
        toast.success('File uploaded!');
      }

      const payload = {
        title: form.title,
        description: form.description,
        tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
        link: form.link,
        github: form.github,
        category: form.category,
        image: uploadedUrl,
      };

      const method = editingProject ? 'PUT' : 'POST';
      const endpoint = '/api/projects';
      if (editingProject) { payload._id = editingProject._id; }
      const res = await fetch(endpoint, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      toast.success(editingProject ? 'Project updated' : 'Project added');
      closeModal();
      fetchProjects();
    } 
    catch (err) { toast.error(err.message); } 
    finally { setUploading(false); setUploadProgress(0); toast.dismiss(loadingToast); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try { const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' }); const data = await res.json();
      if (res.ok) { toast.success('Project deleted'); fetchProjects(); } 
      else { toast.error(data.error || 'Failed to delete'); }
    } 
    catch (err) { toast.error('Delete error'); }
  };

  return (
    <AdminLayout>
      <PageTransition>
        <section className="py-9 px-4">
          <MotionContainer>
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Projects</h2>
                <button onClick={() => openModal()} className="bg-primary text-white px-4 py-2 rounded">Add More</button>
              </div>

              {loading ? ( <p className="text-white">Loading...</p>
              ) : (
                <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700 text-left">
                      <th className="p-3">Image</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Tech</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj._id} className="border-t border-gray-700">
                        <td className="p-3">
                          {proj.image?.endsWith('.pdf') ? ( <a href={proj.image} target="_blank" rel="noreferrer" className="text-blue-400 underline">PDF</a>
                            ) : proj.image?.includes('video') ? ( <video src={proj.image} className="w-20 h-14 object-cover" controls />
                            ) : ( <img src={proj.image} alt={proj.title} className="w-20 h-14 object-cover rounded" />
                          )}
                        </td>
                        <td className="p-3">{proj.title}</td>
                        <td className="p-3">{proj.category}</td>
                        <td className="p-3">{proj.tech.join(', ')}</td>
                        <td className="p-3 space-x-1 flex flex-row">
                          <button onClick={() => openModal(proj)} className="text-blue-400 bg-none">✏️</button>
                          <button onClick={() => handleDelete(proj._id)} className="text-red-400 bg-none">x</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal */}
            {modalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
                  <h3 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={form.title} onChange={e => handleFormChange('title', e.target.value)} placeholder="Project Title" required className="w-full p-2 rounded" />
                    <textarea value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Description" required className="w-full p-2 rounded" rows={3} />
                    <input type="text" value={form.tech} onChange={e => handleFormChange('tech', e.target.value)} placeholder="Tech (comma separated)" className="w-full p-2 rounded" />
                    <input type="url" value={form.link} onChange={e => handleFormChange('link', e.target.value)} placeholder="Live Link" className="w-full  p-2 rounded" />
                    <input type="url" value={form.github} onChange={e => handleFormChange('github', e.target.value)} placeholder="GitHub Link" className="w-full p-2 rounded" />
                    <select value={form.category} onChange={e => handleFormChange('category', e.target.value)} className="w-full p-2 rounded">
                      <option value="FULL_STACK">FULL_STACK</option>
                      <option value="DATA_SCIENCE">DATA_SCIENCE</option>
                    </select>

                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf,video/*" onChange={handleFileChange} className="w-full p-2 rounded" />

                    {(filePreviewURL || form.image) && (
                      <div className="mt-2">
                        <p className="font-medium">Preview:</p>
                        {filePreviewURL ? ( <img src={filePreviewURL} alt="Preview" className="max-h-48 rounded" />
                          ) : form.image.endsWith('.pdf') ? ( <a href={form.image} target="_blank" rel="noreferrer" className="text-blue-600 underline">View PDF</a>
                          ) : ( <img src={form.image} alt="Current" className="max-h-48 rounded" />
                        )}
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
                      <button type="submit" disabled={uploading} className="bg-primary text-white px-4 py-2 rounded">{editingProject ? 'Update' : 'Add'}</button>
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
