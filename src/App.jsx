import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './components/Reveal';
import SectionHeading from './components/SectionHeading';
import {
  certifications,
  education,
  navLinks,
  projects,
  skillHighlights,
  skills,
  socialLinks,
  stats,
} from './data/portfolioData';

const roles = [
  'Big Data Analytics Enthusiast',
  'Aspiring Software Developer',
  'Frontend-Focused Problem Solver',
];

const sectionIds = navLinks.map((item) => item.id);

const iconMap = {
  LinkedIn: 'in',
  GitHub: '{}',
  Email: '@',
  Phone: '+',
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: '-15% 0px -40% 0px',
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const current = roles[roleIndex];
    const isComplete = typedText === current;
    const speed = isDeleting ? 45 : 85;

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting && !isComplete) {
          setTypedText(current.slice(0, typedText.length + 1));
          return;
        }

        if (!isDeleting && isComplete) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && typedText) {
          setTypedText(current.slice(0, typedText.length - 1));
          return;
        }

        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      },
      isComplete && !isDeleting ? 1500 : speed,
    );

    return () => window.clearTimeout(timeout);
  }, [typedText, isDeleting, roleIndex]);

  const statItems = useMemo(
    () =>
      stats.map((item, index) => ({
        ...item,
        delay: index * 0.1,
      })),
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit the form right now.');
      }

      setFormStatus({
        type: data.offline ? 'info' : 'success',
        message: data.message,
      });
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="loader-ring" />
              <div className="text-center">
                <p className="font-display text-xl tracking-[0.35em] text-white/80">KUNAL RAJPUT</p>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/45">Crafting a premium portfolio</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-1 bg-white/5">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-white via-white/80 to-white/30"
          animate={{ scaleX: scrollProgress / 100 }}
          transition={{ type: 'spring', stiffness: 120, damping: 24, mass: 0.2 }}
        />
      </div>

      <div className="fixed inset-0 -z-20 bg-[#050505]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#0a0a0a_0%,#050505_45%,#020202_100%)]" />
      <div className="fixed inset-0 -z-10 bg-grid bg-[size:72px_72px] opacity-[0.08]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.22)_48%,rgba(5,5,5,0.92)_100%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="font-display text-lg font-semibold tracking-[0.24em] text-white">
            KR
          </a>

          <div className="hidden max-w-[58vw] items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            {navLinks.map((item) => {
              const isActive = item.id === activeSection;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white text-slate-950' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <a
            href="/Kunal_Rajput_Resume.txt"
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-white/90"
          >
            Resume
            <span aria-hidden="true">+</span>
          </a>
        </nav>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-white/55">
                  Available for internships and collaborations
                </span>
                <h1 className="mt-8 font-display text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Kunal Rajput
                </h1>
                <p className="mt-5 text-xl font-medium text-white/80 sm:text-2xl">
                  CSE Student | Big Data Analytics Enthusiast | Aspiring Software Developer
                </p>
                <div className="mt-5 flex min-h-[2.2rem] items-center text-base text-white/60 sm:text-lg">
                  <span className="mr-3 text-white/40">Focused on</span>
                  <span className="font-semibold text-white">{typedText}</span>
                  <span className="typing-caret ml-1 inline-block h-6 w-px bg-white/80" />
                </div>
                <p className="mt-8 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                  I am a B.Tech Computer Science student specializing in Big Data Analytics, passionate about technology,
                  data-driven problem-solving, and building practical digital products that are useful, accessible, and thoughtfully designed.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    Explore Projects
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Contact Me
                  </a>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  {statItems.map((item) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.6, delay: item.delay }}
                      className="soft-card rounded-3xl p-5"
                    >
                      <p className="font-display text-3xl text-white">{item.value}</p>
                      <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)] blur-3xl" />
                <div className="soft-card relative overflow-hidden rounded-[2rem] border border-white/10 p-4 shadow-card">
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                    <img
                      src="/kunalprofile.jpeg"
                      alt="Kunal Rajput portrait"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/40">Specialization</p>
                      <p className="mt-2 text-sm font-semibold text-white/88">Big Data Analytics</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/40">Location</p>
                      <p className="mt-2 text-sm font-semibold text-white/88">Phagwara, Punjab</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="about" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <SectionHeading
                eyebrow="About"
                title="Building a strong foundation in software, data, and product thinking"
                description="I enjoy learning how data can be transformed into actionable insights and how software can turn ideas into practical user experiences."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="soft-card grid gap-6 rounded-[2rem] p-8 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/42">Profile</p>
                  <p className="mt-4 text-base leading-8 text-white/68">
                    My interests sit at the intersection of analytics, web development, and problem-solving. I like building clean interfaces,
                    understanding user needs, and using data to support better decisions.
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/42">What I value</p>
                  <ul className="mt-4 space-y-3 text-white/68">
                    {['Practical learning', 'Thoughtful execution', 'Clear communication', 'Consistent improvement'].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Skills"
                title="A growing toolkit across programming, frontend engineering, and analytics"
                description="Built around strong fundamentals in programming and a practical interest in designing responsive, data-aware digital experiences."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <div className="soft-card rounded-[2rem] p-8">
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-white to-white/45"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.9, delay: index * 0.08 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {skillHighlights.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.5, delay: index * 0.07 }}
                      className="soft-card flex min-h-[124px] items-end rounded-[1.75rem] p-5"
                    >
                      <p className="font-medium text-white/85">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="projects" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Projects"
                title="Selected work across web development and analytics"
                description="Each project helped strengthen practical skills in frontend implementation, structured thinking, and translating ideas into usable outputs."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {projects.map((project, index) => (
                <Reveal key={project.title} delay={index * 0.08}>
                  <article className="group soft-card flex h-full flex-col rounded-[2rem] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/42">{project.domain}</p>
                        <h3 className="mt-3 font-display text-2xl text-white">{project.title}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/65">
                        {project.date}
                      </span>
                    </div>
                    <p className="mt-5 text-base leading-7 text-white/68">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {item}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-white/62">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/70" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 pt-4">
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:translate-x-1"
                      >
                        View Project
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Certifications"
                title="Industry-recognized certifications in Big Data, Analytics, and Business Intelligence"
                description="Professional learning milestones completed through Lovely Professional University in collaboration with IBM and Cognitive Class."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {certifications.map((certificate, index) => (
                <Reveal key={certificate.title} delay={index * 0.05}>
                  <article className="soft-card flex h-full flex-col rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/85">
                        CE
                      </div>
                      {certificate.featured ? (
                        <span className="rounded-full border border-white/20 bg-white text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-950 px-3 py-1">
                          IBM Track
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-6 font-display text-2xl text-white">{certificate.title}</h3>
                    <div className="mt-5 space-y-3 text-sm text-white/62">
                      <p>Issuer: {certificate.issuer}</p>
                      <p>Provider: {certificate.provider}</p>
                      <p>Date: {certificate.date}</p>
                    </div>
                    <a
                      href={certificate.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white"
                    >
                      View Certificate
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Education"
                title="Academic journey shaped by curiosity, consistency, and technical growth"
                description="A timeline of education milestones that reflects a steady path toward software engineering and analytics-focused problem solving."
              />
            </Reveal>
            <div className="mt-12 space-y-6">
              {education.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <article className="timeline-card relative overflow-hidden rounded-[2rem] p-7 sm:p-8">
                    <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:gap-10">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/42">{item.period}</p>
                        <div className="mt-4 h-4 w-4 rounded-full border-4 border-[#050505] bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl text-white">{item.title}</h3>
                        <p className="mt-3 text-white/68">{item.place}</p>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-white/62">{item.detail}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <div className="soft-card h-full rounded-[2rem] p-8">
                <SectionHeading
                  eyebrow="Contact"
                  title="Let’s build something thoughtful and useful"
                  description="I’m open to internships, student opportunities, collaborations, and conversations around software, data, and digital products."
                />
                <div className="mt-10 space-y-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-semibold text-white/85">
                        {iconMap[item.label]}
                      </span>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-white/40">{item.label}</p>
                        <p className="mt-1 text-white/75">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="soft-card rounded-[2rem] p-8">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-white/60">Name</span>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm text-white/60">Email</span>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>
                  <label className="space-y-2 block">
                    <span className="text-sm text-white/60">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Opportunity, collaboration, or quick hello"
                    />
                  </label>
                  <label className="space-y-2 block">
                    <span className="text-sm text-white/60">Message</span>
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="form-input min-h-[170px] resize-none"
                      placeholder="Share a little about your message, opportunity, or project."
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  {formStatus.message ? (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        formStatus.type === 'error'
                          ? 'border-red-400/30 bg-red-500/10 text-red-100'
                          : formStatus.type === 'info'
                            ? 'border-amber-300/30 bg-amber-400/10 text-amber-50'
                            : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-50'
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  ) : null}
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Designed and developed for Kunal Rajput with a premium MERN portfolio experience.</p>
          <p>Built with React, Tailwind CSS, Framer Motion, Express, and MongoDB-ready APIs.</p>
        </div>
      </footer>

      <div className="sticky bottom-4 z-40 px-5 md:hidden">
        <div className="mx-auto flex max-w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#050505]/85 p-2 backdrop-blur-xl">
          {navLinks.map((item) => {
            const isActive = item.id === activeSection;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                  isActive ? 'bg-white text-slate-950' : 'text-white/65'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;

