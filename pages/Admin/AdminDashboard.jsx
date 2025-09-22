'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';

function SectionCard({ title, description, count, href, error }) {
  return (
    <Link href={href} className="block no-underline hover:no-underline focus:no-underline active:no-underline">
      <div
        className={`cursor-pointer bg-white/10 p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm transform transition-all duration-200 hover:scale-[1.02] ${
          error ? 'border-red-500' : ''
        }`}
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <p className="text-gray-300">{description}</p>
            {typeof count === 'number' && (
              <p className="mt-2 font-bold text-white">Count: {count}</p>
            )}
          </>
        )}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async (endpoint, setter, name) => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Fetch failed');
        setter(data.data || []);
      } catch (err) {
        console.error(`Error fetching ${name}:`, err.message);
        setErrors(prev => ({ ...prev, [name]: err.message }));
        setter(null);
      }
    };

    fetchData('/api/profile', setProfile, 'profile');
    fetchData('/api/projects', setProjects, 'projects');
    fetchData('/api/certificates', setCertificates, 'certificates');
    fetchData('/api/education', setEducation, 'education');
    fetchData('/api/resume', setResumes, 'resumes');
  }, []);

  return (
    <>
      <Head>
        <title>Shubham Pal | Portfolio Dashboard</title>
      </Head>

      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-10">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold drop-shadow-md">Shubham Pal Portfolio Dashboard</h1>
            <p className="text-gray-400 mt-2">Overview of all portfolio sections</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectionCard
              title="👤 Profile"
              description="Personal info, bio, and social links."
              href="/Admin/EditProfile"
              count={profile ? 1 : 0}
              error={errors.profile}
            />
            <SectionCard
              title="📁 Projects"
              description="All your projects."
              href="/Admin/EditProject"
              count={projects?.length}
              error={errors.projects}
            />
            <SectionCard
              title="📜 Certificates"
              description="Certifications and achievements."
              href="/Admin/EditCertificate"
              count={certificates?.length}
              error={errors.certificates}
            />
            <SectionCard
              title="🎓 Education"
              description="Academic background."
              href="/Admin/EditEducation"
              count={education?.length}
              error={errors.education}
            />
            <SectionCard
              title="📄 Resume"
              description="Uploaded resumes."
              href="/Admin/EditResume"
              count={resumes?.length}
              error={errors.resumes}
            />
          </div>
        </div>
      </AdminLayout>

      <Toaster position="bottom-right" />
    </>
  );
}
