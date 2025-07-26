import PageTransition from './components/PageTransition.jsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MotionContainer } from './components/MotionElements';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your message...');

    try {
      const formData = new FormData(event.target);      
      formData.append("access_key", "0967280e-cd1e-456e-91d2-b893af376313");
      formData.append("from_name", formData.get("name"));
      formData.append("subject", "New Contact Form Submission");

      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });

      const res = await response.json();
      
      if (res.success) {
        toast.success(
          <div>
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-sm">I'll get back to you as soon as possible.</p>
          </div>,
          {
            duration: 5000,
            position: 'bottom-right',
          }
        );
        event.target.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss(loadingToast);    }
  };
  
  return (
    <PageTransition>
      <section className="bg-transparent dark:bg-transparent text-white-100 dark:text-white-100 items-center py-16 px-4" id="contact">
        <MotionContainer>
          <div className="max-w-4xl mx-auto ">
            <div className="text-center mb-12">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 wavy-underline drop-shadow-lg">Get in Touch</h2>
                <p className="text-gray-100 dark:text-gray-300 max-w-2xl mx-auto font-semibold drop-shadow">Have a question or want to work together? Feel free to reach out!</p>
              </motion.div>
            </div>

            <motion.div 
              className="transform-gpu transition-all rounded-xl shadow-xl border backdrop-blur-sm p-8 mx-4 group bg-white/10 dark:bg-primary/20 border-secondary/10 font-semibold drop-shadow"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={onSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 text-primary dark:text-black-100 rounded-lg border border-secondary focus:outline-none focus:ring-2 focus:ring-primary transform-gpu transition-all duration-300"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.input              
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg text-primary dark:text-black-100 border border-secondary focus:outline-none focus:ring-2 focus:ring-primary transform-gpu transition-all duration-300"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.textarea
                    name="message"
                    placeholder="Your Message"
                    className="w-full px-4 py-3 rounded-lg border text-primary dark:text-black-100 border-secondary focus:outline-none focus:ring-2 focus:ring-primary transform-gpu transition-all duration-300"
                    rows={5}
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-center"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white-100 px-8 py-3 rounded-lg font-semibold shadow-card transform-gpu transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05, rotateY: 5, rotateX: -2 }}
                    whileTap={{ scale: 0.95, rotateY: 0, rotateX: 0 }}
                    style={{
                      boxShadow: '0 8px 24px rgba(0,255,247,0.25), 0 1.5px 8px rgba(0,0,0,0.10)',
                      transform: 'translateZ(16px)',
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-gray-100 dark:text-gray-300 mb-4 font-semibold drop-shadow">Or reach out directly via:</p>
              <div className="flex justify-center gap-6">
                <motion.a 
                  href="https://github.com/shubhamgzppal"
                  className="text-secondary hover:text-tertiary transition-colors flex items-center gap-2 font-semibold drop-shadow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
                  </svg>
                  <span>GitHub</span>
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/shubham-pal-700215253/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-tertiary transition-colors flex items-center gap-2 font-semibold drop-shadow"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                  <span>LinkedIn</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </MotionContainer>
        <Toaster position="bottom-right" />
      </section>
    </PageTransition>
  );
}
