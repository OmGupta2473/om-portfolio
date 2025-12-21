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
  AlertTriangle,
  Bot 
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
    width: 100%;
  }

  a { text-decoration: none; color: inherit; }
  ul { list-style: none; }
  img { max-width: 100%; display: block; }

  /* UTILITIES */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.25rem;
  }
  
  @media (min-width: 768px) {
    .container { padding: 0 1.5rem; }
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
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    .btn { padding: 0.75rem 2rem; font-size: 1rem; }
  }

  .btn-primary {
    background-color: var(--primary-hover);
    color: white;
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
  }
  
  .btn-primary:hover {
    background-color: #b91c1c;
    box-shadow: 0 0 25px rgba(220, 38, 38, 0.7);
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
    padding: 0.75rem 0;
  }
  
  @media (min-width: 768px) {
    .navbar { padding: 1.5rem 0; }
  }

  .navbar.scrolled {
    background-color: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(127, 29, 29, 0.3);
    padding: 0.5rem 0;
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

  .nav-link:hover { color: white; }
  .nav-link::after {
    content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
    background-color: var(--primary); transition: width 0.3s ease;
  }
  .nav-link:hover::after { width: 100%; }

  .social-group {
    display: flex; gap: 1rem; margin-left: 1rem; padding-left: 1rem; border-left: 1px solid #374151;
  }
  .social-icon { color: #9ca3af; transition: all 0.3s ease; }
  .social-icon:hover { color: var(--primary); transform: scale(1.1); }
  .mobile-toggle { display: block; cursor: pointer; color: white; }

  @media (min-width: 768px) {
    .nav-links { display: flex; }
    .mobile-toggle { display: none; }
  }

  /* HERO SECTION */
  .hero-section {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4rem; 
    padding-bottom: 0.5rem; 
    position: relative;
    overflow: hidden;
    background: transparent; 
  }

  .hero-grid {
    display: flex; 
    flex-direction: column;
    gap: 0.5rem; 
    align-items: center;
    position: relative;
    z-index: 1; 
    width: 100%;
  }

  .hero-title {
    font-size: clamp(2rem, 7vw, 4.5rem); 
    font-weight: bold;
    line-height: 1.1;
    margin-bottom: 0.25rem;
    text-align: center;
  }

  .hero-subtitle {
    font-size: clamp(0.9rem, 3.5vw, 1.5rem);
    color: var(--text-gray);
    margin-bottom: 1.25rem;
    min-height: 2rem; 
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
  }
  
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .hero-orbit-container {
    position: relative;
    height: 250px; 
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    transform: scale(0.65); /* Mobile Scale */
    transform-origin: center center;
  }

  .profile-circle {
    width: 130px; 
    height: 130px;
    border-radius: 50%;
    border: 4px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 25px rgba(220, 38, 38, 0.3);
    overflow: hidden;
    background: #111827;
    position: relative;
    z-index: 10;
  }

  .profile-img { width: 100%; height: 100%; object-fit: cover; }

  .orbit-ring { position: absolute; border-radius: 50%; border: 1px solid #1f2937; }
  .orbit-ring.inner { width: 210px; height: 210px; }
  .orbit-ring.outer { width: 310px; height: 310px; border-style: dashed; border-color: rgba(31, 41, 55, 0.5); }

  @media (min-width: 1024px) {
    .hero-section { min-height: 100vh; padding-top: 5rem; padding-bottom: 3rem; }
    .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 3rem; }
    .hero-title { font-size: 4.5rem; text-align: left; margin-bottom: 1.5rem; }
    .hero-subtitle { font-size: 1.5rem; justify-content: flex-start; text-align: left; min-height: 3rem; margin-bottom: 2rem; }
    .hero-actions { justify-content: flex-start; gap: 1rem; margin-bottom: 0; }
    
    /* DESKTOP ORBIT FIXES */
    /* Remove translate, reset scale, ensure centered alignment */
    .hero-orbit-container { 
      height: 450px; 
      margin-top: 0; 
      transform: translateX(0) scale(1); 
    }
    
    .profile-circle { width: 224px; height: 224px; box-shadow: 0 0 50px rgba(220, 38, 38, 0.3); }
    
    /* Tightened rings for desktop */
    .orbit-ring.inner { width: 330px; height: 330px; }
    .orbit-ring.outer { width: 450px; height: 450px; }
  }

  /* SECTIONS */
  .section {
    padding: 3rem 0;
    position: relative;
    background: transparent;
  }
  
  @media (min-width: 768px) {
    .section { padding: 6rem 0; }
  }

  .section-header {
    display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;
  }
  .section-line { height: 2px; width: 3rem; background-color: var(--primary); }
  .section-label { color: var(--primary); font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.8rem; }

  .about-grid {
    display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center;
  }

  .skill-tag {
    display: inline-block;
    padding: 0.4rem 0.9rem; 
    background: #111827; border: 1px solid #1f2937; border-radius: 9999px;
    font-size: 0.8rem; color: #d1d5db;
    margin: 0 0.4rem 0.4rem 0;
    transition: all 0.3s;
  }
  .skill-tag:hover { border-color: var(--primary); color: white; }

  .code-card {
    background: #0f1115; border: 1px solid #1f2937; border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    font-family: monospace; transition: border-color 0.5s;
    width: 100%; overflow-x: auto; font-size: 0.85rem;
  }
  .code-card:hover { border-color: rgba(239, 68, 68, 0.3); }

  @media (min-width: 768px) {
    .about-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
    .skill-tag { padding: 0.5rem 1rem; font-size: 0.875rem; margin: 0 0.5rem 0.5rem 0; }
    .code-card { padding: 1.5rem; font-size: 0.9rem; }
    .section-header { margin-bottom: 1.5rem; }
  }

  /* PROJECTS SECTION */
  .project-grid {
    display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1.5rem;
  }

  .project-card {
    background: #111827; border: 1px solid #1f2937; border-radius: 1rem;
    overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex; flex-direction: column; position: relative; 
  }
  .project-card:hover {
    box-shadow: 0 20px 40px -5px rgba(220, 38, 38, 0.15), 0 0 15px rgba(220, 38, 38, 0.1);
    transform: translateY(-5px) scale(1.01); 
    border-color: rgba(239, 68, 68, 0.5); z-index: 10;
  }

  .project-links {
    margin-top: auto; display: flex; gap: 1rem;
    opacity: 1; transform: translateY(0);
    padding-top: 1.25rem; transition: all 0.3s ease;
  }
  .project-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.8rem; font-weight: 500; color: #d1d5db; transition: color 0.2s;
  }
  .project-btn:hover { color: var(--primary); }

  @media (min-width: 768px) {
    .project-grid { grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 3rem; }
    .project-links { opacity: 0; transform: translateY(15px); padding-top: 1.5rem; }
    .project-card:hover .project-links { opacity: 1; transform: translateY(0); }
    .project-btn { font-size: 0.875rem; }
  }

  /* CONTACT SECTION */
  .contact-input {
    width: 100%; background: black; border: 1px solid #1f2937; border-radius: 0.5rem;
    padding: 0.75rem 1rem; color: white;
    margin-bottom: 0.75rem; outline: none; transition: border-color 0.3s;
    font-size: 0.9rem;
  }
  .contact-input:focus { border-color: var(--primary); }
  .contact-label { display: block; font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.35rem; }

  .glass-card {
    background: rgba(17, 24, 39, 0.5); backdrop-filter: blur(4px);
    padding: 1.25rem; border-radius: 1rem; border: 1px solid #1f2937;
  }
  .contact-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }

  @media (min-width: 768px) {
    .glass-card { padding: 2rem; }
    .contact-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
    .contact-input { margin-bottom: 1.5rem; font-size: 0.95rem; }
    .contact-label { font-size: 0.875rem; margin-bottom: 0.5rem; }
  }

  /* ANIMATIONS */
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25%); } }
  .animate-bounce { animation: bounce 1s infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .animate-spin { animation: spin 1s linear infinite; }
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
    if (!canvas) return; 
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const isMobile = window.innerWidth < 768;
    const particles = [];
    const particleCount = isMobile ? 15 : 50; 

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

        if (!isMobile) {
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
        }
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
          style={{ fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <span className="text-gradient">Welcome</span><span style={{color: 'var(--primary)'}}>.</span>
        </motion.div>

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

        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.95)', borderBottom: '1px solid #333' }}
            className="md:hidden"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 0' }}>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  style={{ color: '#d1d5db', fontSize: '1.1rem', fontWeight: 500 }}
                >
                  {link.name}
                </a>
              ))}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
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

const HERO_TITLES = [
  'a ML Engineering Enthusiast',
  'an AI Development Enthusiast',
  'a Full Stack Development Enthusiast'
];

// 3. Hero Section
const Hero = () => {
  const typingText = useTypewriter(HERO_TITLES);
  const avatarUrl = "./avatar.png";
  const [radius, setRadius] = useState(110); // Default mobile radius

  useEffect(() => {
    const updateRadius = () => {
      // Increase radius on desktop (≥ 1024px) so icons clear the larger avatar
      if (window.innerWidth >= 1024) {
        setRadius(190);
      } else {
        setRadius(110);
      }
    };

    updateRadius(); // Initial check
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <section id="home" className="hero-section">
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: '500px', height: '500px', background: 'rgba(239, 68, 68, 0.2)', 
        borderRadius: '50%', filter: 'blur(100px)', zIndex: -1 
      }} />

      <div className="container hero-grid">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Hi, I'm <br />
            <span className="text-gradient">Om Gupta</span>
          </h1>
          <div className="hero-subtitle">
             <span style={{color: 'white', fontWeight: 600, minWidth: '100%', display: 'inline-block'}}>{typingText}</span>
          </div>
          <div className="hero-actions">
            <a href="/OmResumeSDE.pdf" download className="btn btn-primary">
              <Download size={18} /> Download CV
            </a>
            <a href="#projects" className="btn btn-outline">
              View Projects <ChevronRight size={18} />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-orbit-container"
        >
          <div className="profile-circle">
             <img src={avatarUrl} alt="Om Profile" className="profile-img" />
          </div>

          <div className="orbit-ring inner" />
          <div className="orbit-ring outer" />

          <OrbitingIcon icon={<Code2 size={20} />} angle={0} radius={radius} speed={20} />
          <OrbitingIcon icon={<BrainCircuit size={20} />} angle={72} radius={radius} speed={20} />
          <OrbitingIcon icon={<Database size={20} />} angle={144} radius={radius} speed={20} />
          <OrbitingIcon icon={<Globe size={20} />} angle={216} radius={radius} speed={20} />
          <OrbitingIcon icon={<Cpu size={20} />} angle={288} radius={radius} speed={20} />
        </motion.div>
      </div>
    </section>
  );
};

const OrbitingIcon = ({ icon, angle, radius, speed }) => {
  return (
    <motion.div
      style={{
        position: 'absolute', top: '50%', left: '50%', marginTop: -20, marginLeft: -20,
        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#111827', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '50%',
        color: '#f87171', boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)'
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
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <div className="section-line"></div>
            <span className="section-label">About Me</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '1rem' }}>
            Bridging Logic with <br/><span style={{ color: '#6b7280' }}>Innovation.</span>
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem', textAlign: 'justify' }}>
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(220, 38, 38, 0.2)', filter: 'blur(60px)', borderRadius: '50%', zIndex: -10, transform: 'translateY(2.5rem)' }} />
           
           <div className="code-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1f2937' }}>
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#ef4444' }} />
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#eab308' }} />
                 <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#22c55e' }} />
                 <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4b5563' }}>om_gupta.py</span>
              </div>

              <div style={{ lineHeight: 1.8, fontSize: '0.8rem' }}>
                <div><span className="code-purple">class</span> <span className="code-yellow">Engineer</span>:</div>
                <div style={{ paddingLeft: '1rem' }}><span className="code-purple">def</span> <span className="code-blue">__init__</span>(<span className="code-orange">self</span>):</div>
                <div style={{ paddingLeft: '2rem' }}><span className="code-orange">self</span>.<span className="code-red">name</span> = <span className="code-green">"Om"</span></div>
                <div style={{ paddingLeft: '2rem' }}><span className="code-orange">self</span>.<span className="code-red">role</span> = <span className="code-green">"CSE Student"</span></div>
                <div style={{ paddingLeft: '2rem' }}><span className="code-orange">self</span>.<span className="code-red">stack</span> = [<span className="code-green">"Python"</span>, <span className="code-green">"React"</span>, <span className="code-green">"ML"</span>]</div>
                <br/>
                <div style={{ paddingLeft: '1rem' }}><span className="code-purple">def</span> <span className="code-blue">mission</span>(<span className="code-orange">self</span>):</div>
                <div style={{ paddingLeft: '2rem' }}><span className="code-purple">return</span> <span className="code-green">"Build scalable AI solutions"</span></div>
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
      title: "Enterprise AI Agent",
      desc: "Production-grade Autonomous Multi-Agent system. Orchestrates specialized agents for deterministic financial analytics (0% hallucinations) and RAG-based policy search. Containerized with Docker.",
      tech: ["LangChain", "Docker", "Python", "ChromaDB"],
      color: "linear-gradient(135deg, #3b82f6, #8b5cf6)", // Blue to Purple
      link: "https://enterprise-agent.onrender.com/",
      github: "https://github.com/OmGupta2473/enterprise-agent",
      icon: <Bot size={48} />
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
      title: "AI PDF Query System",
      desc: "Intelligent system to query DNA/Medical PDFs using Natural Language Processing and LangChain.",
      tech: ["Python", "LangChain", "Streamlit", "NLP"],
      color: "linear-gradient(135deg, #ef4444, #ea580c)",
      link: "#",
      github: "https://github.com/OmGupta2473/File-Analysis-AI-Query-System",
      icon: <BrainCircuit size={48} />
    },
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
      title: "CSV Agent (RAG)",
      desc: "RAG Application allowing natural language Q&A on CSV data using Embeddings and Groq API.",
      tech: ["Python", "Groq API", "Streamlit", "HuggingFace"],
      color: "linear-gradient(135deg, #22c55e, #059669)",
      link: "#",
      github: "https://github.com/OmGupta2473",
      icon: <FileJson size={48} />
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
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
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="project-card"
            >
              <div style={{ height: '6px', width: '100%', background: project.color }} />

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{project.title}</h3>
                    {/* Optional: Add icon to top right corner for visual flair */}
                    <div style={{color: '#374151', transform: 'scale(0.8)'}}>{project.icon}</div>
                </div>
                
                <p style={{ color: '#9ca3af', marginBottom: '1rem', flex: 1, lineHeight: 1.5, fontSize: '0.95rem' }}>{project.desc}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {project.tech.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#6b7280', background: 'black', padding: '0.2rem 0.6rem', borderRadius: '0.2rem', border: '1px solid #1f2937' }}>
                      {t}
                    </span>
                  ))}
                </div>

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
  const [status, setStatus] = useState('idle'); 
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auth Listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
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
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'contact_messages'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); 
    } catch (error) {
      console.error("Error sending message:", error);
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
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
        >
          <span className="section-label">Get in Touch</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0 1.5rem' }}>Let's connect and <br /> build the future.</h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '2rem' }}>
            I am currently open to freelance projects and internship opportunities. Whether you have a question about my stack or just want to say hi, I'll try my best to get back to you!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="mailto:omgupta2473@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d1d5db', fontSize: '0.9rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <Mail size={18} />
              </div>
              <span>omgupta2473@gmail.com</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d1d5db', fontSize: '0.9rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', background: '#111827', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <MapPin size={18} />
              </div>
              <span>Jharkhand, India</span>
            </div>
          </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
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