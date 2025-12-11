import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Globe, 
  Database,
  Menu,
  X,
  ChevronRight,
  Download,
  BrainCircuit,
  FileJson,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously,
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * --- FIREBASE CONFIGURATION ---
 */
const firebaseConfig = {
  apiKey: "AIzaSyAVi6zM-r29R-P9pPiXBmNbqXj5SOASLOk",
  authDomain: "om-portfolio-b0444.firebaseapp.com",
  projectId: "om-portfolio-b0444",
  storageBucket: "om-portfolio-b0444.firebasestorage.app",
  messagingSenderId: "180646636434",
  appId: "1:180646636434:web:3acf1eaa3e806a0a006f4b",
  measurementId: "G-L0RV2G32KH"
};

// Initialize Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Use a unique App ID for the data path
// FIXED: Use the environment variable __app_id if available, otherwise fallback
const appId = typeof __app_id !== 'undefined' ? __app_id : 'om-portfolio-b0444';

/**
 * 1. CSS STYLES (Replaces Tailwind)
 */
const styles = `
  :root {
    --primary: #ef4444; /* red-500 */
    --primary-hover: #dc2626; /* red-600 */
    --bg-dark: #0a0a0a; /* neutral-950 */
    --bg-card: #111827; /* gray-900 */
    --text-white: #f3f4f6;
    --text-gray: #9ca3af;
    --border-color: #1f2937;
    --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    background-color: var(--bg-dark);
    color: var(--text-white);
    font-family: var(--font-main);
    overflow-x: hidden;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  /* UTILITIES */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .text-gradient {
    background: linear-gradient(to right, #ef4444, #f97316);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: var(--primary-hover);
    color: white;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
  }
  
  .btn-primary:hover {
    background-color: #b91c1c;
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #374151;
    color: var(--text-gray);
  }

  .btn-outline:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* NAVBAR */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50; 
    transition: all 0.3s ease;
    padding: 1.5rem 0;
  }

  .navbar.scrolled {
    background-color: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(127, 29, 29, 0.3);
    padding: 1rem 0;
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: none;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    color: #d1d5db;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.025em;
    position: relative;
  }

  .nav-link:hover {
    color: white;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 0.3s ease;
  }

  .nav-link:hover::after {
    width: 100%;
  }

  .social-group {
    display: flex;
    gap: 1rem;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid #374151;
  }

  .social-icon {
    color: #9ca3af;
    transition: all 0.3s ease;
  }

  .social-icon:hover {
    color: var(--primary);
    transform: scale(1.1);
  }

  .mobile-toggle {
    display: block;
    cursor: pointer;
    color: white;
  }

  @media (min-width: 768px) {
    .nav-links { display: flex; }
    .mobile-toggle { display: none; }
  }

  /* HERO SECTION */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5rem;
    position: relative;
    overflow: hidden;
    background: transparent; 
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
    position: relative;
    z-index: 1; 
  }

  .hero-title {
    font-size: 3rem;
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: var(--text-gray);
    margin-bottom: 2rem;
    height: 2.5rem;
    display: flex; 
    align-items: center;
  }

  .hero-orbit-container {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-circle {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 4px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 50px rgba(220, 38, 38, 0.3);
    overflow: hidden;
    background: #111827;
    position: relative;
    z-index: 10;
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid #1f2937;
  }
  
  .orbit-ring.inner { width: 280px; height: 280px; }
  .orbit-ring.outer { width: 400px; height: 400px; border-style: dashed; border-color: rgba(31, 41, 55, 0.5); }

  @media (min-width: 768px) {
    .hero-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    .hero-title { font-size: 4.5rem; }
    .profile-circle { width: 224px; height: 224px; }
    .orbit-ring.inner { width: 380px; height: 380px; }
    .orbit-ring.outer { width: 550px; height: 550px; }
    .hero-orbit-container { transform: translateX(40px); }
  }

  /* SECTIONS */
  .section {
    padding: 6rem 0;
    position: relative;
    background: transparent;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .section-line {
    height: 2px;
    width: 3rem;
    background-color: var(--primary);
  }

  .section-label {
    color: var(--primary);
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
  }

  .skill-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 9999px;
    font-size: 0.875rem;
    color: #d1d5db;
    margin: 0 0.75rem 0.75rem 0;
    transition: all 0.3s;
  }

  .skill-tag:hover {
    border-color: var(--primary);
    color: white;
  }

  .code-card {
    background: #0f1115;
    border: 1px solid #1f2937;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    font-family: monospace;
    transition: border-color 0.5s;
  }
  
  .code-card:hover {
    border-color: rgba(239, 68, 68, 0.3);
  }

  @media (min-width: 768px) {
    .about-grid { grid-template-columns: 1fr 1fr; }
  }

  /* PROJECTS SECTION */
  .project-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 3rem;
  }

  .project-card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    position: relative; 
  }

  .project-card:hover {
    box-shadow: 0 20px 40px -5px rgba(220, 38, 38, 0.15), 0 0 15px rgba(220, 38, 38, 0.1);
    transform: translateY(-10px) scale(1.02);
    border-color: rgba(239, 68, 68, 0.5);
    z-index: 10;
  }

  .project-links {
    margin-top: auto; 
    display: flex;
    gap: 1rem;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.4s ease;
    padding-top: 1.5rem;
  }

  .project-card:hover .project-links {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .project-links {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .project-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #d1d5db;
    transition: color 0.2s;
  }

  .project-btn:hover {
    color: var(--primary);
  }

  @media (min-width: 768px) {
    .project-grid { grid-template-columns: 1fr 1fr; }
  }

  /* CONTACT SECTION */
  .contact-input {
    width: 100%;
    background: black;
    border: 1px solid #1f2937;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    color: white;
    margin-bottom: 1.5rem;
    outline: none;
    transition: border-color 0.3s;
  }

  .contact-input:focus {
    border-color: var(--primary);
  }

  .contact-label {
    display: block;
    font-size: 0.875rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }

  .glass-card {
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(4px);
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #1f2937;
  }

  /* UTILS */
  .code-purple { color: #c084fc; }
  .code-yellow { color: #fef08a; }
  .code-green { color: #4ade80; }
  .code-red { color: #f87171; }
  .code-blue { color: #60a5fa; }
  .code-orange { color: #fb923c; }
  
  /* ANIMATIONS */
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-25%); }
  }
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

/**
 * UTILITIES & HOOKS
 */
const useTypewriter = (words, loop = true) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    let timeoutDelay;
    if (subIndex === words[index].length && !reverse) {
      timeoutDelay = 2000;
    } else if (reverse) {
      timeoutDelay = 15;
    } else {
      timeoutDelay = 30;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, timeoutDelay);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return `${words[index].substring(0, subIndex)}${blink ? "|" : " "}`;
};

/**
 * COMPONENTS
 */

// 1. Particle Background
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ef4444';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10, pointerEvents: 'none', opacity: 0.5}} />;
};

// 2. Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span className="text-gradient">Welcome</span><span style={{color: 'var(--primary)'}}>.</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
          <div className="social-group">
            <SocialIcon Icon={Github} href="https://github.com/OmGupta2473" />
            <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/in/om-gupta-265b80268/" />
            <SocialIcon Icon={Mail} href="mailto:omgupta2473@gmail.com" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid #333' }}
            className="md:hidden"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 0' }}>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  style={{ color: '#d1d5db', fontSize: '1.125rem', fontWeight: 500 }}
                >
                  {link.name}
                </a>
              ))}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                 <SocialIcon Icon={Github} href="https://github.com/OmGupta2473" />
                 <SocialIcon Icon={Linkedin} href="https://www.linkedin.com/in/om-gupta-265b80268/" />
                 <SocialIcon Icon={Mail} href="mailto:omgupta2473@gmail.com" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SocialIcon = ({ Icon, href }) => (
  <a href={href} target="_blank" rel="noreferrer" className="social-icon">
    <Icon size={20} />
  </a>
);

// Defined outside to prevent re-render glitches
const HERO_TITLES = [
  'ML Engineering Enthusiast',
  'AI Development Enthusiast',
  'Full Stack Development Enthusiast'
];

// 3. Hero Section
const Hero = () => {
  const typingText = useTypewriter(HERO_TITLES);

  const avatarUrl = "./avatar.png";

  return (
    <section id="home" className="hero-section">
      {/* Background Glow - positioned behind content */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: '500px', height: '500px', background: 'rgba(239, 68, 68, 0.2)', 
        borderRadius: '50%', filter: 'blur(100px)', zIndex: -1 
      }} />

      <div className="container hero-grid">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Hi, I'm <br />
            <span className="text-gradient">Om Gupta</span>
          </h1>
          <div className="hero-subtitle">
             <span style={{color: 'white', fontWeight: 600, minWidth: '400px', display: 'inline-block'}}>{typingText}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a 
              href="/OmResumeSDE.pdf" 
              download 
              className="btn btn-primary"
            >
              <Download size={18} /> Download CV
            </a>
            <a href="#projects" className="btn btn-outline">
              View Projects <ChevronRight size={18} />
            </a>
          </div>
        </motion.div>

        {/* Orbit Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-orbit-container"
        >
          {/* Central Profile */}
          <div className="profile-circle">
             <img src={avatarUrl} alt="Om Profile" className="profile-img" />
          </div>

          {/* Orbit Rings */}
          <div className="orbit-ring inner" />
          <div className="orbit-ring outer" />

          {/* Orbiting Icons */}
          <OrbitingIcon icon={<Code2 />} angle={0} radius={190} speed={20} />
          <OrbitingIcon icon={<BrainCircuit />} angle={72} radius={190} speed={20} />
          <OrbitingIcon icon={<Database />} angle={144} radius={190} speed={20} />
          <OrbitingIcon icon={<Globe />} angle={216} radius={190} speed={20} />
          <OrbitingIcon icon={<Cpu />} angle={288} radius={190} speed={20} />

        </motion.div>
      </div>
    </section>
  );
};

const OrbitingIcon = ({ icon, angle, radius, speed }) => {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '50%', left: '50%', marginTop: -24, marginLeft: -24,
        width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#111827', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '50%',
        color: '#f87171', boxShadow: '0 0 15px rgba(220, 38, 38, 0.4)'
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
    >
      <div 
         style={{ 
            transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
         }}
      >
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: speed, ease: "linear" }}>
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

// 4. About Section
const About = () => {
  const skills = [
    "Python", "C++", "MySQL", "React", "Data Structures", 
    "Machine Learning", "TensorFlow", "PyTorch", "Pandas", 
    "NumPy", "Streamlit", "RAG", "Git", "Firebase", "Vercel"
  ];

  return (
    <section id="about" className="section">
      <div className="container about-grid">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <div className="section-line"></div>
            <span className="section-label">About Me</span>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            Bridging Logic with <br/><span style={{ color: '#6b7280' }}>Innovation.</span>
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1.125rem', textAlign: 'justify' }}>
            Enthusiastic Computer Science Engineering student with strong foundations in programming, data structures, machine learning, and full-stack development. Experienced in AI-powered applications, data-driven problem-solving, and scalable software development. Seeking opportunities to apply technical skills, collaborate effectively, and contribute meaningfully to organizational goals.
          </p>

          <div>
             {skills.map((skill) => (
               <span key={skill} className="skill-tag">
                 {skill}
               </span>
             ))}
          </div>
        </motion.div>

        {/* Right Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
           {/* Glow Effect */}
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(220, 38, 38, 0.2)', filter: 'blur(60px)', borderRadius: '50%', zIndex: -10, transform: 'translateY(2.5rem)' }} />
           
           <div className="code-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1f2937' }}>
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#ef4444' }} />
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#eab308' }} />
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#22c55e' }} />
                 <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4b5563' }}>om_kumar.py</span>
              </div>

              <div style={{ lineHeight: 2, fontSize: '0.9rem' }}>
                <div><span className="code-purple">class</span> <span className="code-yellow">Engineer</span>:</div>
                <div style={{ paddingLeft: '1.5rem' }}><span className="code-purple">def</span> <span className="code-blue">__init__</span>(<span className="code-orange">self</span>):</div>
                <div style={{ paddingLeft: '3rem' }}><span className="code-orange">self</span>.<span className="code-red">name</span> = <span className="code-green">"Om"</span></div>
                <div style={{ paddingLeft: '3rem' }}><span className="code-orange">self</span>.<span className="code-red">role</span> = <span className="code-green">"CSE Student"</span></div>
                <div style={{ paddingLeft: '3rem' }}><span className="code-orange">self</span>.<span className="code-red">stack</span> = [<span className="code-green">"Python"</span>, <span className="code-green">"React"</span>, <span className="code-green">"ML"</span>]</div>
                <br/>
                <div style={{ paddingLeft: '1.5rem' }}><span className="code-purple">def</span> <span className="code-blue">mission</span>(<span className="code-orange">self</span>):</div>
                <div style={{ paddingLeft: '3rem' }}><span className="code-purple">return</span> <span className="code-green">"Build scalable AI solutions"</span></div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

// 5. Projects Section
const Projects = () => {
  const projects = [
    {
      title: "AI Chatbot Mobile App",
      desc: "Cross-platform mobile app featuring distinct AI personalities. Built with React Native and integrated with LLM APIs for interactive conversations.",
      tech: ["React Native", "LLM API", "AsyncStorage"],
      color: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      link: "#", 
      github: "https://github.com/OmGupta2473/AIChatIntegration",
      icon: <Smartphone size={48} />
    },
    {
      title: "Financial Risk Prediction",
      desc: "ML model predicting financial risk using supervised learning. Features rigorous data analysis and reliable predictive accuracy.",
      tech: ["Python", "Scikit-learn", "Pandas", "ML"],
      color: "linear-gradient(135deg, #2563eb, #06b6d4)",
      link: "#", 
      github: "https://github.com/OmGupta2473/credit-risk-analysis",
      icon: <Database size={48} />
    },
    {
      title: "Moonz Nail Store",
      desc: "Full-stack E-Commerce & Booking platform with Google Auth, Real-time DB, and online booking system.",
      tech: ["React", "Firebase", "Vercel"],
      color: "linear-gradient(135deg, #a855f7, #db2777)",
      link: "https://moonz-nail-store.vercel.app",
      github: "https://github.com/OmGupta2473/moonz-nail-store",
      icon: <Globe size={48} />
    },
    {
      title: "CSV Agent (RAG)",
      desc: "RAG Application allowing natural language Q&A on CSV data using Embeddings and Groq API.",
      tech: ["Python", "Groq API", "Streamlit", "HuggingFace"],
      color: "linear-gradient(135deg, #22c55e, #059669)",
      link: "#",
      github: "https://github.com/OmGupta2473",
      icon: <FileJson size={48} />
    },
    {
      title: "AI PDF Query System",
      desc: "Intelligent system to query DNA/Medical PDFs using Natural Language Processing and LangChain.",
      tech: ["Python", "LangChain", "Streamlit", "NLP"],
      color: "linear-gradient(135deg, #ef4444, #ea580c)",
      link: "#",
      github: "https://github.com/OmGupta2473/File-Analysis-AI-Query-System",
      icon: <BrainCircuit size={48} />
    }
  ];

  return (
    <section id="projects" className="section">
       {/* Background Noise removed */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '4rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        >
          <span className="section-label">My Work</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Featured Projects</h2>
        </motion.div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              className="project-card"
            >
              {/* Gradient Header - Thin Strip, No Icons */}
              <div style={{ height: '6px', width: '100%', background: project.color }} />

              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{project.title}</h3>
                <p style={{ color: '#9ca3af', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>{project.desc}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {project.tech.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6b7280', background: 'black', padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #1f2937' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Links (Slide in on hover) */}
                <div className="project-links">
                  {project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="project-btn">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  <a href={project.github} target="_blank" rel="noreferrer" className="project-btn">
                    <Github size={16} /> GitHub Repo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Contact Section
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth Listener
  useEffect(() => {
    // Correct Auth Flow
    const initAuth = async () => {
      try {
        // Check for custom token provided by the environment (Preview)
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          // Fallback to Anonymous auth (Local/Production)
          // This requires "Anonymous" to be enabled in Firebase Console
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
        // specific error codes for disabled provider
        if (error.code === 'auth/configuration-not-found' || 
            error.code === 'auth/admin-restricted-operation' ||
            error.code === 'auth/operation-not-allowed') {
           setAuthError(true);
        }
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); // Reset after 5s
    } catch (error) {
      console.error("Error sending message:", error);
      // Improve error message readability
      if (error.message.includes('insufficient permissions')) {
        setErrorMessage("Permission denied. Please check Firestore Rules.");
      } else {
        setErrorMessage(error.message);
      }
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" style={{ overflow: 'hidden' }}>
      <div className="container contact-grid">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          
          {/* Info */}
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: false }}
          >
            <span className="section-label">Get in Touch</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0 2rem' }}>Let's connect and <br /> build the future.</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '3rem' }}>
              I am currently open to freelance projects and internship opportunities. Whether you have a question about my stack or just want to say hi, I'll try my best to get back to you!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <a href="mailto:omgupta2473@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#d1d5db' }}>
                <div style={{ width: '3rem', height: '3rem', background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <Mail size={20} />
                </div>
                <span>omgupta2473@gmail.com</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#d1d5db' }}>
                <div style={{ width: '3rem', height: '3rem', background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <MapPin size={20} />
                </div>
                <span>Jharkhand, India</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: false }}
             className="glass-card"
          >
            {authError ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Authentication Required</h3>
                    <p style={{ fontSize: '0.9rem' }}>Please enable <strong>Anonymous Authentication</strong> in your Firebase Console to use this form.</p>
                </div>
            ) : status === 'success' ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} style={{ color: '#22c55e', marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: '#9ca3af' }}>Thanks for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setStatus('idle')} style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '0.5rem 1.5rem', borderRadius: '9999px', cursor: 'pointer' }}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label className="contact-label">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="contact-input"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="contact-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="contact-label">Message</label>
                  <textarea 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-input"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  style={{ width: '100%', opacity: status === 'submitting' ? 0.7 : 1 }} 
                  className="btn btn-primary"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem' }} /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
                {status === 'error' && (
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.25rem' }}>
                       <AlertTriangle size={18} />
                       <span style={{ fontWeight: 'bold' }}>Submission Failed</span>
                    </div>
                    <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                      {errorMessage || "Something went wrong. Please check your connection."}
                    </p>
                  </div>
                )}
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// 7. Footer
const Footer = () => (
  <footer style={{ padding: '2rem 0', background: 'var(--bg-dark)', borderTop: '1px solid #111827', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>
    <p>© {new Date().getFullYear()} Om. All rights reserved.</p>
  </footer>
);

// MAIN APP COMPONENT
const App = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <ParticleBackground />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;