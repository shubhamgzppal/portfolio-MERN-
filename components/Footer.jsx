export default function Footer() {
  return (
    <footer className="text-white dark:text-white-100 py-4 text-center bg-primary/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-card transition-transform duration-300">
      <p className="text-sm font-semibold drop-shadow">&copy; {new Date().getFullYear()} Shubham Pal. All rights reserved.</p>
      <div className="flex justify-center gap-6 mt-2">
        <a href="https://github.com/shubhamgzppal" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary transition font-semibold drop-shadow">GitHub</a>
        <a href="https://www.linkedin.com/in/shubham-pal-700215253/" target="_blank" rel="noopener noreferrer" className="hover:text-tertiary transition font-semibold drop-shadow">LinkedIn</a>
        <a href="mailto:shubhamgzppal@gmail.com" className="hover:text-tertiary wavy-underline transition font-semibold drop-shadow">Email</a>
      </div>
    </footer>
  );
}
