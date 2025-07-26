import { motion } from 'framer-motion';

export default function EducationCard({
  title,
  institute,
  duration,
  handleClick,
  items,
  sectionTitle = 'Achievements & Activities'
}) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
      }}
      whileHover={{
        rotateY: 6,
        rotateX: 2,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 200 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2`}
      >
        <h3 className="text-xl font-bold text-secondary">{title}</h3>
        <p className="text-gray-300 dark:text-gray-300">{institute}</p>
        <p className="text-sm text-gray-400 dark:text-gray-400">{duration}</p>
        {handleClick && (
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center text-secondary hover:text-tertiary mt-2 md:mt-0"
          >
            See Certificate
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        )}
      </div>

      {/* Items List */}
      {items && items.length > 0 && (
        <div>
          {sectionTitle && (
            <h4 className="font-semibold mb-2 text-secondary">{sectionTitle}:</h4>
          )}
          <ul className="list-disc pl-5">
            {items.map((item, idx) => (
              <li key={idx} className="text-[0.9rem] text-gray-300 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
