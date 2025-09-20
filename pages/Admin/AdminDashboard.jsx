// pages/Admin/AdminDashboard.jsx
import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout.jsx';

export default function AdminDashboardPage() {
  return (
    <>
      <Head>
        <title>Shubham Pal | Portfolio Dashboard</title>
      </Head>
      <AdminLayout>
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-10">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold drop-shadow-md">Shubham Pal Portfolio Dashboard</h1>
            <p className="text-gray-400 mt-2">Your complete portfolio overview</p>
          </header>

          {/* Sections Container */}
          <div className=" flex flex-col gap-6">
            {/* Profile Overview */}
            <SectionCard title="👤 Profile" description="Personal info, bio, and social links." />

            {/* Projects */}
            <SectionCard title="📁 Projects" description="All your featured and past projects." />

            {/* Certificates */}
            <SectionCard title="📜 Certificates" description="Certifications and achievements." />

            {/* Education */}
            <SectionCard title="🎓 Education" description="Your academic background." />

            {/* Resume */}
            <SectionCard title="📄 Resume" description="View or download your resume." />

            {/* Add more sections if needed */}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

function SectionCard({ title, description }) {
  return (
    <div className="bg-white/10 p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm hover:scale-[1.02] transform transition-all duration-200">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
