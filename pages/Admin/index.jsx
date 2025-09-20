import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const hasAccess = localStorage.getItem('adminAccess');

    if (hasAccess === 'true') {
      toast.success("Access granted!");
      router.push("/Admin/AdminDashboard");
    } else {
      toast.error("Access denied! Redirecting to home.");
      router.push("/");
    }
  }, [router]);

  return null; 
}
