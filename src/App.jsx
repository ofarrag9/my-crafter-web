import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';

const Button = ({ className, onClick, children, type = "button", disabled = false }) => (
  <button
    className={`px-4 md:px-8 py-2 md:py-3 text-sm md:text-base bg-indigo-500 text-white hover:bg-teal-400 rounded-md transition-transform transform hover:scale-110 shadow-md ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onClick}
    type={type}
    disabled={disabled}
  >
    {children}
  </button>
);

const Card = ({ className, children, onClick }) => (
  <div 
    className={`rounded-2xl shadow-xl bg-white text-blue-600 cursor-pointer ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const services = [
  {
    id: 'custom-designs',
    title: 'Custom Designs',
    description: "Tailored websites that reflect your brand's identity and message.",
    imageUrl: 'custom.webp',
    detailedDescription: `
      At Crafted Web, we specialize in creating visually captivating and user-friendly websites tailored to your business needs. Our team of experienced designers will collaborate with you to understand your brand and target audience, ensuring each design resonates and engages visitors.
      
      We focus on creating responsive websites that look great on any device, optimizing user experience to drive conversions. Whether you're starting from scratch or revamping an existing site, our design process guarantees a polished, professional look that enhances your brand identity and leaves a lasting impression on your customers.
      
      Our custom design services include:
      • Brand-aligned visual aesthetics
      • User-centered interface design
      • Custom graphics and illustrations
      • Typography selection and hierarchy
      • Color scheme development
      • Interactive elements and animations
    `,
    ctaText: 'Schedule Design Consultation'
  },
  {
    id: 'responsive-layouts',
    title: 'Responsive Layouts',
    description: 'Optimized for desktops, tablets, and smartphones for a seamless user experience.',
    imageUrl: 'manydev.webp',
    detailedDescription: `
      In today's multi-device world, responsive design isn't just a feature - it's essential. At Crafted Web, we build websites that adapt beautifully to any screen size, from large desktop monitors to tablets and smartphones.
      
      Our responsive layouts ensure your content remains accessible, readable, and visually appealing regardless of how your customers access your site. This approach not only improves user experience but also boosts your search engine rankings, as Google prioritizes mobile-friendly websites.
      
      Our responsive layout services include:
      • Fluid grid layouts that adjust to any screen size
      • Flexible images and media that scale appropriately
      • Media queries to target specific devices and viewport sizes
      • Performance optimization for mobile connections
      • Touch-friendly navigation and interactive elements
      • Extensive cross-device testing and quality assurance
    `,
    ctaText: 'See Our Responsive Work'
  },
  {
    id: 'seo-performance',
    title: 'SEO & Performance',
    description: 'Boost your visibility and website speed with our expert optimization strategies.',
    imageUrl: 'anal.webp',
    detailedDescription: `
      A beautiful website is only effective if people can find it and it loads quickly. Our SEO and performance optimization services ensure your website ranks well in search engines and provides a lightning-fast experience for your visitors.
      
      We implement technical SEO best practices during development and optimize your content structure to improve visibility. Additionally, we fine-tune your website's performance to minimize load times, reduce bounce rates, and improve conversion rates.
      
      Our SEO & Performance services include:
      • Keyword research and implementation
      • On-page SEO optimization
      • Technical SEO audits and improvements
      • Image and asset optimization
      • Caching strategies and CDN implementation
      • Core Web Vitals optimization
      • Page speed optimization
      • Regular performance reporting and updates
    `,
    ctaText: 'Boost Your Site Performance'
  },
];

// Portfolio items array from previous code
const portfolioItems = [
  {
    title: 'ShiftSync',
    description: 'A website that allows effortless shift management for businesses.',
    imageUrl: 'portfolio1.webp',
    link: 'https://shift-sync.netlify.app'
  },
  // {
  //   title: 'Health & Wellness Clinic',
  //   description: 'Modern, accessible website for a healthcare provider featuring appointment scheduling.',
  //   imageUrl: 'portfolio2.webp',
  //   link: 'https://wellnessclinic.example.com'
  // },
  // {
  //   title: 'Gourmet Catering',
  //   description: 'E-commerce site with menu showcase and event booking system.',
  //   imageUrl: 'portfolio3.webp',
  //   link: 'https://gourmetcatering.example.com'
  // },
  // {
  //   title: 'Tech Innovation Hub',
  //   description: 'Interactive platform for a tech startup with animated features and product demos.',
  //   imageUrl: 'portfolio4.webp',
  //   link: 'https://techhub.example.com'
  // }
];

const CraftedWeb = () => {
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const form = useRef();
  
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const openServiceDetail = (serviceId) => {
    setActiveService(serviceId);
    // Add the detail page to browser history to enable back button functionality
    window.history.pushState({ serviceId }, "", `#${serviceId}`);
    // Reset scroll position to top when opening service detail
    window.scrollTo(0, 0);
  };

  const closeServiceDetail = () => {
    setActiveService(null);
    // Update browser history
    window.history.pushState({}, "", "/");
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && services.some(service => service.id === hash)) {
        setActiveService(hash);
      } else {
        setActiveService(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check URL hash on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && services.some(service => service.id === hash)) {
      setActiveService(hash);
      // Reset scroll position to top
      window.scrollTo(0, 0);
    }
  }, []);

  // Reset form status after 5 seconds
  useEffect(() => {
    if (formStatus.success || formStatus.error) {
      const timer = setTimeout(() => {
        setFormStatus({
          submitting: false,
          success: false,
          error: false,
          message: ''
        });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.from_name || !formData.reply_to || !formData.message) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please fill in all fields'
      });
      return;
    }

    setFormStatus({
      submitting: true,
      success: false,
      error: false,
      message: ''
    });

    // Replace these with your actual EmailJS service ID, template ID, and user ID
    const serviceId = 'service_ynxciw5';
    const templateId = 'template_vryjae8';
    const userId = 'FtaeMeTTx0n47v_W7';

    emailjs.sendForm(serviceId, templateId, form.current, userId)
      .then((result) => {
        setFormStatus({
          submitting: false,
          success: true,
          error: false,
          message: 'Message sent successfully!'
        });
        // Reset form
        setFormData({
          name: '',
          reply_to: '',
          message: ''
        });
      }, (error) => {
        setFormStatus({
          submitting: false,
          success: false,
          error: true,
          message: 'Failed to send message. Please try again.'
        });
        console.error('EmailJS error:', error);
      });
  };

  // Get the current service details if a service is active
  const currentService = services.find(service => service.id === activeService);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-teal-300 text-white flex flex-col items-center w-full overflow-x-hidden">
      {activeService ? (
  // Service Detail Page
  <div className="w-full min-h-screen bg-gradient-to-r from-indigo-500 to-teal-300">
  <header className="w-full py-4 md:py-6 shadow-lg bg-white text-blue-600 text-center sticky top-0 z-50">
    <nav className="flex justify-between items-center px-4 md:px-8 lg:px-18">
      <div className="text-xl md:text-3xl font-bold">Crafted Web</div>
      <Button 
        onClick={closeServiceDetail}
        className="bg-indigo-600 hover:bg-teal-400"
      >
        Back to Home
      </Button>
    </nav>
  </header>

  <motion.div 
    className="flex-grow"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 min-h-[calc(100vh-80px)] w-full">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-screen-xl mx-auto">
        <div className="w-full md:w-1/2 flex items-center">
          <motion.div
            className="bg-cover bg-center w-full h-64 md:h-96 lg:h-116 rounded-lg shadow-xl"
            style={{ backgroundImage: `url(${currentService.imageUrl})` }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
        
        <div className="w-full md:w-1/2 flex items-center mt-6 md:mt-0">
          <motion.div
            className="w-full"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-white">{currentService.title}</h1>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 md:p-6 text-black shadow-xl">
              {currentService.detailedDescription.split('\n').map((paragraph, idx) => 
                paragraph.trim().startsWith('•') ? (
                  <ul key={idx} className="list-disc pl-6 mb-4">
                    {paragraph.split('•').filter(item => item.trim()).map((item, i) => (
                      <li key={i} className="mb-2 text-base md:text-lg">{item.trim()}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={idx} className="mb-4 text-base md:text-lg">{paragraph}</p>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>

  <footer className="w-full py-4 bg-gradient-to-r from-indigo-500 to-teal-300 text-center text-white">
    © {new Date().getFullYear()} Crafted Web. All rights reserved.
  </footer>
</div>
      ) : (
        // Main Homepage
        <>
          <header className="w-full py-4 md:py-6 shadow-lg bg-white text-blue-600 text-center sticky top-0 z-50">
            <nav className="flex justify-between items-center px-4 md:px-8 lg:px-18">
              <div className="text-xl md:text-3xl font-bold">Crafted Web</div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  onClick={toggleMenu}
                  className="p-2 text-blue-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
              
              {/* Desktop menu */}
              <div className="hidden md:flex space-x-2 lg:space-x-4">
                <Button onClick={() => scrollToSection('home')}>Home</Button>
                <Button onClick={() => scrollToSection('about')}>About</Button>
                <Button onClick={() => scrollToSection('services')}>Services</Button>
                <Button onClick={() => scrollToSection('portfolio')}>Portfolio</Button>
                <Button onClick={() => scrollToSection('contact')}>Contact</Button>
              </div>
            </nav>
            
            {/* Mobile menu dropdown */}
            {menuOpen && (
              <motion.div 
                className="md:hidden bg-white text-blue-600 py-4 shadow-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-3">
                  <Button onClick={() => scrollToSection('home')}>Home</Button>
                  <Button onClick={() => scrollToSection('about')}>About</Button>
                  <Button onClick={() => scrollToSection('services')}>Services</Button>
                  <Button onClick={() => scrollToSection('portfolio')}>Portfolio</Button>
                  <Button onClick={() => scrollToSection('contact')}>Contact</Button>
                </div>
              </motion.div>
            )}
          </header>

          <section
            id="home"
            className="relative h-screen w-full flex items-center justify-center text-center text-white"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
              style={{ 
                backgroundImage: "url('home2.webp')", 
                opacity: 0.6,
                backgroundSize: "cover"
              }}
              initial={{ scale: 1 }}
              //animate={{ scale: 1.1 }}
              //transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.div
              className="relative z-10 px-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl text-white-600 font-extrabold mb-4">Crafted Web</h1>
              <p className="text-xl sm:text-3xl md:text-4xl lg:text-6xl text-white-600 mb-6 md:mb-8">We Build Websites That Convert</p>
              <Button
                className="bg-green-500 text-white text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:bg-green-600"
                onClick={() => scrollToSection('services')}
              >
                View Services
              </Button>
            </motion.div>
          </section>

          <section
            id="about"
            className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4 md:px-12 items-center text-base md:text-xl py-12 md:py-0 md:min-h-screen"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-green-500 text-xl md:text-3xl font-bold uppercase mb-2">
                Crafting Digital Success
              </h2>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
                Transforming your online presence
              </h2>
              <p className="text-base md:text-xl lg:text-3xl text-gray-100">
                At Crafted Web, we specialize in elevating businesses by
                creating stunning, functional websites. Whether you lack an online
                presence or your current website falls short, our expert team is
                ready to transform your digital landscape.  Let us craft you a
                website at a very affordable price so that you can stand out in 
                the marketplace!
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-300 w-full h-64 md:h-96 lg:h-[1000px] flex items-center justify-center text-gray-700 text-xl md:text-2xl rounded-lg mt-6 md:mt-0"
              style={{ backgroundImage: "url('about.png')", backgroundSize: 'cover' }}
              initial={{ scale: 0.8 }}
            >
            </motion.div>
          </section>

          <section id="services" className="mt-12 md:mt-20 pb-12 md:pb-20 grid grid-cols-1 bg-gradient-to-r to-blue-300 from-pink-200 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 py-12 md:py-16">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-center col-span-1 md:col-span-3 mb-6 md:mb-8">Our Service</h2>
            {services.map((service, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} className="mb-4 md:mb-0">
                <Card onClick={() => openServiceDetail(service.id)}>
                  <CardContent>
                    <motion.div
                      className="bg-cover bg-center w-full h-48 md:h-64 lg:h-80 mb-4 md:mb-6 rounded-lg"
                      style={{ backgroundImage: `url(${service.imageUrl})` }}
                      whileHover={{ rotate: 1.7 }}
                    />
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">{service.title}</h2>
                    <p className="text-base md:text-lg">{service.description}</p>
                    <div className="mt-4 text-teal-500 font-semibold flex items-center">
                      <span>Learn more</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>

          <section id="portfolio" className="w-full bg-gradient-to-r to-indigo-300 from-teal-500 px-4 md:px-8 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-center mb-6 md:mb-12">Our Portfolio</h2>
              <p className="text-base md:text-2xl lg:text-3xl text-center mb-8 md:mb-12">
                Check out some of the amazing websites we've built!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {portfolioItems.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="h-full"
                  >
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      <Card className="overflow-hidden h-full">
                        <CardContent className="p-0">
                          <div 
                            className="h-48 md:h-64 bg-cover bg-center" 
                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                          />
                          <div className="p-4 md:p-6">
                            <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-teal-500 font-semibold">View Project</span>
                              <motion.div 
                                className="bg-teal-500 text-white p-2 rounded-full"
                                whileHover={{ rotate: 90 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </motion.div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="contact" className="mt-12 md:mt-20 text-center px-4 md:px-12 py-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8">Contact Us</h2>
            <p className="text-lg md:text-2xl mb-6">
              Ready to build or transform your website? Get in touch today!
            </p>
            <motion.form
              ref={form}
              onSubmit={handleSubmit}
              className="max-w-md md:max-w-2xl mx-auto space-y-4 md:space-y-6"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1 }}
            >
              <input
                type="text"
                name="from_name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full p-3 md:p-4 rounded-lg text-gray-800 bg-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-xl"
              />
              <input
                type="email"
                name="reply_to"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 md:p-4 rounded-lg text-gray-800 bg-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-xl"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full p-3 md:p-4 rounded-lg text-gray-800 bg-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base md:text-xl"
                rows="6"
              />

              {formStatus.message && (
                <div className={`p-3 md:p-4 rounded-lg text-white ${formStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
                  {formStatus.message}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={formStatus.submitting}
                className="bg-blue-600 text-white text-base md:text-xl px-6 py-3 md:px-10 md:py-5 rounded-full shadow-lg hover:bg-indigo-600"
              >
                {formStatus.submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.form>
          </section>

          <footer className="w-full py-4 mt-12 md:mt-20 bg-gradient-to-r from-indigo-500 to-teal-300 text-center text-white">
            &copy; {new Date().getFullYear()} Crafted Web. All rights reserved.
          </footer>
        </>
      )}
    </div>
  );
};

export default CraftedWeb;