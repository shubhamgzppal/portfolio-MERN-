import PageTransition from './components/PageTransition.jsx';

import ResumeCart from "./assets/SHUBHAM PAL Resume canav.pdf"

// Common data that stays the same across domains
const commonData = {
  education: [
    {
      degree: "Diploma in Information Technology",
      institution: "Government Polytechnic College Ghaziabad",
      period: "Aug 2022 - Aug 2025",
      details: []
    },
    {
      degree: "Intermediate",
      institution: "Hindu Inter College Zanamia RS, Ghazipur",
      period: "Aug 2017 - Aug 2018",
      details: []
    }
  ],
  softSkills: [
    "Learning Agility",
    "Time Management",
    "Adaptability",
    "Team Collaboration"
  ],
  languages: [
    { name: "Hindi", level: "Native" },
    { name: "English", level: "Professional" }
  ],
  workExperience: {
    status: "Fresher"
  }
};

// Domain-specific data
const domainData = {
  FULL_STACK: {
    title: "Full Stack Developer",
    summary: "Motivated and eager Full Stack Developer with a strong foundation in HTML, CSS, JavaScript, and backend technologies like Node.js, PHP, and Python. Experienced in developing responsive and scalable web applications using the MERN stack and other modern web technologies. Seeking an opportunity to apply my skills in a dynamic environment to build innovative and impactful web solutions.",
    skills: [
      { category: "Languages", items: "HTML5, CSS3, JavaScript (ES6+), Python, PHP, Java" },
      { category: "Frontend Technologies", items: "React.js, Tailwind CSS, Bootstrap, JavaScript, jQuery" },
      { category: "Backend Technologies", items: "Node.js, Express.js, PHP" },
      { category: "Databases", items: "MySQL, MongoDB" },
      { category: "Version Control", items: "Git, GitHub" },
      { category: "APIs", items: "RESTful APIs, WebSockets" },
      { category: "Cloud Technologies", items: "AWS, Google Cloud" },
      { category: "Other Tools & Technologies", items: "WordPress, Thunder Client, Postman" }
    ],
    certifications: [
      { name: "Web Design", issuer: "MSME" },
      { name: "Core Java", issuer: "Internshala" },
      { name: "O Level", issuer: "NIELIT" }
    ],
    projects: [
      {
        title: "E-Commerce Website",
        tech: "MongoDB, Express, React, Node.js, Tailwind CSS, RESTful APIs, JWT Authentication",
        description: "Developed a fully functional e-commerce website with features including product browsing, cart management, and checkout process. Implemented JWT authentication, MongoDB integration, and payment gateway. Ensured responsive design and optimized performance. Deployed on AWS with Docker for scalability.",
        highlights: [
          "Implemented secure user authentication using JWT for login/signup",
          "Integrated MongoDB for storing user and product data",
          "Implemented payment gateway integration for seamless transactions",
          "Ensured responsive design using Tailwind CSS and React",
          "Deployed on AWS and Dockerized for easy scalability"
        ]
      },
      {
        title: "Netflix Clone",
        tech: "MongoDB, Express, React, Node.js, WebSockets, Tailwind CSS, RESTful APIs",
        description: "Built a Netflix clone with fully responsive UI and real-time features. Implemented video streaming, user authentication, and personalized watchlists.",
        highlights: [
          "Implemented real-time features using WebSockets for live updates",
          "Integrated video streaming API for direct content playback",
          "Created user authentication system with saved watchlists",
          "Used MongoDB to manage movie data and user preferences",
          "Designed responsive UI matching Netflix's interface"
        ]
      }
    ]
  },
  DATA_SCIENCE: {
    title: "Data Scientist",
    summary: "Analytical and detail-oriented Data Scientist with strong foundation in statistical analysis, machine learning, and data visualization. Experienced in developing predictive models and extracting meaningful insights from complex datasets. Seeking opportunities to leverage data-driven approaches to solve challenging business problems.",
    skills: [
      { category: "Programming Languages", items: "Python, R, SQL" },
      { category: "Machine Learning", items: "Scikit-learn, TensorFlow, PyTorch" },
      { category: "Data Analysis", items: "Pandas, NumPy, SciPy" },
      { category: "Visualization", items: "Matplotlib, Seaborn, Plotly" },
      { category: "Big Data", items: "Hadoop, Spark" },
      { category: "Statistics", items: "Hypothesis Testing, A/B Testing" },
      { category: "Tools", items: "Jupyter, Git, Docker" }
    ],
    certifications: [
      { name: "Gen AI", issuer: "GCD" },
      { name: "Machine Learning", issuer: "Stanford Online" },
      { name: "Data Science Fundamentals", issuer: "IBM" },
      { name: "Python for Data Science", issuer: "DataCamp" }
    ],
    projects: [
      {
        title: "Predictive Analytics Dashboard",
        tech: "Python, Scikit-learn, Streamlit",
        description: "Interactive dashboard for sales prediction and trend analysis using machine learning"
      },
      {
        title: "Customer Segmentation",
        tech: "Python, K-means, Matplotlib",
        description: "Analysis and visualization of customer segments using clustering algorithms"
      }
    ]
  }
};

export default function Resume() {
  // Show combined resume information; download is the same PDF
  const content = { ...domainData.FULL_STACK };

  return (
    <PageTransition>
      <section
        className="bg-transparent dark:bg-transparent text-white-100 dark:text-white-100 section-py"
        id="resume"
        style={{
          perspective: '1600px',
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 wavy-underline drop-shadow-lg">Resume</h2>
          <p className="mb-8 font-semibold drop-shadow">Download my latest {content.title} resume or view it online.</p>
          {/* Resume Preview */}            
          <div 
            className="mb-8 p-8 glass bg-white/20 dark:bg-primary/40 rounded-lg shadow-xl border border-secondary/20 backdrop-blur-sm mx-4 group"
            style={{}}>
            <div className="space-y-6 text-left">
              {/* Personal Info */}
              <div className="border-b text-center border-secondary/20 pb-4">
                <h3 className="text-2xl font-bold text-secondary drop-shadow-lg">SHUBHAM PAL</h3>
                <p className="text-gray-100 dark:text-gray-300 font-semibold drop-shadow">{content.title}</p>
                <p className="text-gray-300 dark:text-gray-400 font-semibold drop-shadow">Khanpur Khanpur, Ghazipur • 780-028-6043 • shubhamgzppal@gmail.com</p>
                <div className="flex justify-center gap-4 mt-2 text-sm font-semibold drop-shadow">
                  <a href="https://www.linkedin.com/in/shubham-pal-700215253/" className="text-secondary hover:text-tertiary font-semibold drop-shadow">LinkedIn</a>
                  <a href="https://github.com/shubhamgzppal" className="text-secondary hover:text-tertiary font-semibold drop-shadow">GitHub</a>
                  <a href="#contact" className="text-secondary hover:text-tertiary font-semibold drop-shadow">Email</a>
                </div>
              </div>
              {/* Summary */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">SUMMARY</h4>
                <p className="text-gray-300 dark:text-gray-300 text-sm font-semibold drop-shadow">{content.summary}</p>
              </div>
              {/* Technical Skills */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">TECHNICAL SKILLS</h4>
                <ul className="flex flex-col gap-2">
                  {content.skills.map((skill, index) => (
                    <li key={index} className="text-sm font-semibold drop-shadow">
                      <span className="font-medium text-secondary drop-shadow">{skill.category}:</span>{" "}
                      <span className="text-gray-300 dark:text-gray-300 font-semibold drop-shadow">{skill.items}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Projects */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">PROJECTS</h4>
                <div className="space-y-6">
                  {content.projects.map((project, index) => (
                    <div key={index} className="border-secondary/10 last:border-0 last:pb-1">
                      <h5 className="font-medium text-secondary text-lg drop-shadow">{project.title}</h5>
                      <p className="text-sm text-gray-300 dark:text-gray-400 drop-shadow font-semibold mt-1">
                        <span className="font-medium drop-shadow">Technologies Used:</span> {project.tech}
                      </p>
                      <p className="text-sm text-gray-300 dark:text-gray-300 drop-shadow font-semibold mt-2">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Education */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">EDUCATION</h4>
                <div className="space-y-4">
                  {commonData.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-secondary drop-shadow">{edu.degree}</h5>
                        <p className="text-sm text-gray-300 dark:text-gray-300 drop-shadow font-semibold">{edu.institution}</p>
                      </div>
                      <p className="text-sm text-gray-300 dark:text-gray-400 drop-shadow font-semibold">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Work Experience */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">WORK EXPERIENCE</h4>
                <p className="text-sm text-gray-300 dark:text-gray-300 drop-shadow font-semibold">{commonData.workExperience.status}</p>
              </div>
              {/* Additional Information */}
              <div>
                <h4 className="text-xl font-semibold mb-3 text-secondary drop-shadow">ADDITIONAL INFORMATION</h4>
                {/* Soft Skills */}
                <div className="mb-4">
                  <p className="text-sm">
                    <span className="font-medium text-secondary">Soft Skills:</span>{" "}
                    <span className="text-gray-300 dark:text-gray-300 drop-shadow font-semibold">
                      {commonData.softSkills.join(", ")}
                    </span>
                  </p>
                </div>
                {/* Languages */}
                <div className="mb-4">
                  <p className="text-sm">
                    <span className="font-medium text-secondary">Languages:</span>{" "}
                    <span className="text-gray-300 dark:text-gray-300 drop-shadow font-semibold">
                      {commonData.languages.map(lang => lang.name).join(", ")}
                    </span>
                  </p>
                </div>
                {/* Certifications */}
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-secondary">Certifications:</span>{" "}
                    <span className="text-gray-300 dark:text-gray-300 drop-shadow font-semibold">
                      {content.certifications.map(cert => `${cert.name} (${cert.issuer})`).join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Download Button */}
          <a
            href={ResumeCart}
            download="SHUBHAM PAL Resume canav.pdf"
            className="bouncy bg-secondary text-primary px-8 py-3 rounded-lg font-semibold shadow-card hover:bg-tertiary transition inline-flex items-center gap-2 group drop-shadow"
          >
            <span>Download Resume</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </section>
    </PageTransition>
  );
}
