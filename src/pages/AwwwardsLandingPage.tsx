import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Award, Sparkles, ChevronDown, Menu, X } from 'lucide-react';

const AwwwardsLandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollPosition / windowHeight);
      setActiveSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const websites = [
    {
      title: "Immersive Experience",
      category: "Digital Agency",
      year: "2024",
      award: "Site of the Day",
      color: "from-purple-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop"
    },
    {
      title: "Creative Portfolio",
      category: "Design Studio",
      year: "2024",
      award: "Developer Award",
      color: "from-blue-600 to-cyan-600",
      image: "https://images.unsplash.com/photo-1558865869-c93f6f8482af?w=800&h=600&fit=crop"
    },
    {
      title: "Future Vision",
      category: "Tech Innovation",
      year: "2024",
      award: "Innovation Award",
      color: "from-green-600 to-teal-600",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"
    },
    {
      title: "Minimalist Design",
      category: "Architecture",
      year: "2024",
      award: "Design Excellence",
      color: "from-orange-600 to-red-600",
      image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Award className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold">AWWWARDS 2024</span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {['Winners', 'Nominees', 'Collections', 'Academy'].map((item, i) => (
              <motion.a
                key={item}
                href="#"
                className="hover:text-yellow-500 transition-colors relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-px bg-yellow-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full bg-black z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl">
              {['Winners', 'Nominees', 'Collections', 'Academy'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="hover:text-yellow-500 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col items-center justify-center relative px-6"
      >
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-500">Top 16 Websites of 2024</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-300 to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            AWWWARDS
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Celebrating Excellence in Web Design, Creativity, and Innovation
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-full flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Winners</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Your Site
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </motion.section>

      {/* Featured Websites Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Award-Winning
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> Excellence</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the most innovative and beautifully crafted websites that pushed boundaries in 2024
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {websites.map((site, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ backgroundImage: `linear-gradient(to bottom right, ${site.color.replace('from-', '').replace('to-', ', ')})` }} />

                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={site.image}
                    alt={site.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>

                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{site.title}</h3>
                      <p className="text-gray-400">{site.category}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-yellow-500">{site.award}</span>
                    </div>
                    <span className="text-sm text-gray-500">{site.year}</span>
                  </div>

                  <motion.button
                    className="mt-4 w-full py-3 bg-white/10 rounded-lg text-center font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Project →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "16", label: "Award Winners", suffix: "" },
              { number: "250", label: "Nominees", suffix: "+" },
              { number: "98", label: "Countries", suffix: "" },
              { number: "4.8", label: "Million Votes", suffix: "M" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.number}{stat.suffix}
                </motion.div>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Join the
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Hall of Fame?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Submit your website and compete for the most prestigious awards in web design
          </p>
          <motion.button
            className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-full hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Your Website Now
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Award className="w-6 h-6 text-yellow-500" />
            <span className="text-sm text-gray-400">© 2024 AWWWARDS. Recognizing Digital Excellence.</span>
          </div>
          <div className="flex space-x-6">
            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
              <motion.a
                key={social}
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors text-sm"
                whileHover={{ y: -2 }}
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AwwwardsLandingPage;