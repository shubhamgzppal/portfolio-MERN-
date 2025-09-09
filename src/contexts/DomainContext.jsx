// DomainContext replaced with no-op exports. The app now shows combined content without context.
export const domains = {
  FULL_STACK: { title: 'Full Stack Developer', icon: '💻' },
  DATA_SCIENCE: { title: 'Data Scientist', icon: '📊' }
};

export function DomainProvider({ children }) {
  return children;
}

export const useDomain = () => ({ domainData: domains.FULL_STACK });
