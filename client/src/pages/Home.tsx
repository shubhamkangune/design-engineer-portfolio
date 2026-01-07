import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Download, 
  Mail, 
  Linkedin, 
  Phone, 
  ExternalLink, 
  Cog, 
  PenTool, 
  Cpu, 
  Database,
  Wrench,
  DraftingCompass,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
// Using Formspree for contact submissions (no backend required)
import { toast } from "@/hooks/use-toast";

// Import Assets
import blueprintHero from '@assets/generated_images/abstract_mechanical_blueprint_background.png';
// leather project images are served from client/public/projects/leather-strip-cutting/
import hydraulicPress from '@assets/generated_images/3d_hydraulic_press_cad.png';
import blankingDie from '@assets/generated_images/3d_blanking_die_cad.png';

const RESUME_LINK = "/attached_assets/Shubham_Kangune_Mechanical_Design_Engineer_2025_1766061788798.pdf";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Contact form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();

    // validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Validation error", description: "Name, email and message are required." });
      return;
    }
    // Use Formspree JSON endpoint (no backend). Endpoint provided by owner.
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdrgwyp';

    setSending(true);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || 'Website contact',
          message: form.message,
        }),
      });

      if (res.ok) {
        toast({ title: 'Message sent', description: "Thanks — I'll get back to you soon." });
        setForm({ name: '', email: '', subject: '', message: '' });
        setSent(true);
        // hide success box after a short interval
        setTimeout(() => setSent(false), 8000);
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || 'Failed to send message.';
        toast({ title: 'Send failed', description: errorMsg });
      }
    } catch (err: any) {
      console.error('Formspree error:', err);
      toast({ title: 'Network error', description: 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  }

  // Inline success flag
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
      
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={blueprintHero} 
            alt="Mechanical Blueprint Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        </div>
        
        <div className="container px-4 md:px-6 z-10 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-4 uppercase tracking-[0.2em]">
              Hello, I am
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold text-primary mb-6 tracking-tighter">
              SHUBHAM KANGUNE
            </h1>
            <p className="text-xl md:text-3xl text-foreground/80 font-light mb-8 max-w-3xl mx-auto">
              Mechanical Design Engineer
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Specializing in CAD design, tool & die development, and manufacturing optimization.
              Transforming concepts into precision engineered solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-heading font-bold text-lg h-12 px-8 cursor-pointer" onClick={() => window.location.href = '/designs'} data-testid="button-view-designs">
                View My Designs
              </Button>
              <Button variant="outline" size="lg" className="font-heading font-bold text-lg h-12 px-8" asChild data-testid="button-download-cv">
                <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download CV
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-secondary/30 relative">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">ABOUT ME</h2>
            </div>
            
            <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I am a passionate <strong className="text-primary font-medium">Mechanical Engineering graduate</strong> with a strong foundation in CAD design, 
                  tool and die development, and manufacturing processes. 
                </p>
                <p>
                  My academic journey and practical internship experiences have equipped me with proficiency in 
                  industry-standard tools like <span className="text-foreground font-medium">SolidWorks, CATIA, and AutoCAD</span>. 
                  I have hands-on experience in designing blanking dies, validating designs through simulation, 
                  and optimizing manufacturing workflows.
                </p>
                <p>
                  I am eager to contribute as a Mechanical Design Engineer, leveraging my skills in 
                  <span className="text-foreground font-medium"> GD&T, 2D/3D modelling, and design validation</span> to deliver efficient 
                  and innovative engineering solutions.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border border-border shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-xl mb-4 border-b border-border pb-2">Education</h3>
                
                <div className="space-y-1">
                  <div className="font-bold text-foreground">B.E. Mechanical Engineering</div>
                  <div className="text-sm text-primary font-medium">2022-2025</div>
                  <div className="text-sm text-muted-foreground">Ajeenkya D.Y. Patil School of Engineering</div>
                  <div className="text-sm font-medium">CGPA: 7.2 / 10.0</div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="font-bold text-foreground">Diploma in Mechanical Eng.</div>
                  <div className="text-sm text-primary font-medium">2019-2022</div>
                  <div className="text-sm text-muted-foreground">Ashok Institute of Engineering</div>
                  <div className="text-sm font-medium">Percentage: 72.46%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">TECHNICAL EXPERTISE</h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <motion.div variants={fadeInUp} className="bg-secondary/20 border border-border p-6 rounded-lg hover:border-primary/50 transition-colors" data-testid="skill-design">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <DraftingCompass size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Design & Modelling</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> SolidWorks</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> CATIA V5</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> AutoCAD</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Fusion 360</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-secondary/20 border border-border p-6 rounded-lg hover:border-primary/50 transition-colors" data-testid="skill-engineering">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Layers size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Engineering Core</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Mechanical Design</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Tool & Die Design</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> GD&T Standards</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Design Validation</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-secondary/20 border border-border p-6 rounded-lg hover:border-primary/50 transition-colors" data-testid="skill-analysis">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Cog size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Analysis & Sim</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> ANSYS</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Structural Analysis</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Simulation</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-secondary/20 border border-border p-6 rounded-lg hover:border-primary/50 transition-colors" data-testid="skill-productivity">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Database size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Productivity & Code</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Python, C, C++</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> MS Excel & Office</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Documentation</li>
                </ul>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 md:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="h-1 w-12 bg-primary" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">EXPERIENCE</h2>
            </div>

            <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-12">
              
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary" />
                <div className="bg-background p-6 md:p-8 rounded-lg border border-border shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-primary">Mechanical Design Intern</h3>
                      <div className="text-lg font-medium">Maxpertise Technology Labs Pvt. Ltd.</div>
                    </div>
                    <div className="text-muted-foreground font-medium mt-2 md:mt-0 bg-secondary px-3 py-1 rounded text-sm">
                      Bengaluru
                    </div>
                  </div>
                  
                  <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                    <li>Designed and optimized <strong className="text-foreground">blanking dies</strong> in SolidWorks, improving manufacturing efficiency and accuracy.</li>
                    <li>Collaborated with senior engineers to deliver die design projects within strict deadlines with <strong className="text-foreground">zero errors</strong>.</li>
                    <li>Gained hands-on experience in industrial design standards and production workflows.</li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section id="projects" className="py-20 md:py-32 bg-background bg-grid-pattern">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">FEATURED PROJECTS</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A selection of mechanical designs. <Link href="/designs"><a className="text-primary hover:underline font-medium">View all designs</a></Link>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Project 1 */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50" data-testid="featured-project-leather">
                  <div className="h-48 sm:h-40 overflow-hidden relative bg-secondary">
                        {/* Image moved to public folder for deployment: /projects/leather-strip-cutting/leather-main.jpg */}
                        <img
                          src="/projects/leather-strip-cutting/lather_main.jpg"
                          srcSet="/projects/leather-strip-cutting/lather_main.jpg 1x, /projects/leather-strip-cutting/later_2.jpg 2x"
                          alt="Leather Cutting Machine"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-normal">SolidWorks</Badge>
                      <Badge variant="secondary" className="text-xs font-normal">Fabrication</Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">Leather Strip Cutting Device</CardTitle>
                    <CardDescription>Sponsored by Divyam Leather Crafts Pvt. Ltd.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Designed and developed a semi-automated machine to enhance artisans' efficiency. 
                      Implemented an innovative cutting mechanism that reduced material waste.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project 2 */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50" data-testid="featured-project-hydraulic">
                  <div className="h-48 overflow-hidden relative bg-secondary">
                    <img 
                      src={hydraulicPress} 
                      alt="Hydraulic Press Machine" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-normal">Pascal's Law</Badge>
                      <Badge variant="secondary" className="text-xs font-normal">Hydraulics</Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">Hydraulic Press Machine</CardTitle>
                    <CardDescription>Academic Research & Fabrication</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Researched and applied Pascal's Law to design a functional press. 
                      Coordinated fabrication and developed testing procedures.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project 3 */}
              <motion.div variants={fadeInUp}>
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50" data-testid="featured-project-blanking">
                  <div className="h-48 overflow-hidden relative bg-secondary">
                    <img 
                      src={blankingDie} 
                      alt="Blanking Die Design" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs font-normal">SolidWorks</Badge>
                      <Badge variant="secondary" className="text-xs font-normal">Tool Design</Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">Blanking Die Optimization</CardTitle>
                    <CardDescription>Maxpertise Technology Labs</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Designed complex blanking dies with a focus on precision and durability.
                      Optimized for better material usage and reduced wear.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* View All Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button size="lg" className="font-heading font-bold text-lg h-12 px-8 cursor-pointer" onClick={() => window.location.href = '/designs'} data-testid="button-view-all-designs">
                View All Designs
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8 justify-center">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">CERTIFICATIONS</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {["Catia V5 (Skill-Lync)", "Autocad Certified (Disha Institute)", "Fusion 360 (Autodesk)"].map((cert, i) => (
              <div key={i} className="flex items-center gap-3 bg-background px-6 py-4 rounded-lg border border-border shadow-sm" data-testid={`cert-${i}`}>
                <div className="bg-primary/10 p-2 rounded-full">
                  <AwardIcon />
                </div>
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-heading font-bold">LET'S BUILD SOMETHING GREAT</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
                I am currently open to opportunities as a Mechanical Design Engineer. 
                Feel free to reach out for collaborations or interview requests.
              </p>
              
              <div className="space-y-4 pt-6">
                <a href="mailto:shubhamcsc4656@gmail.com" className="flex items-center gap-4 text-xl hover:text-white transition-colors" data-testid="contact-email">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  shubhamcsc4656@gmail.com
                </a>
                <a href="tel:8459117697" className="flex items-center gap-4 text-xl hover:text-white transition-colors" data-testid="contact-phone">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  +91 84591 17697
                </a>
                <a href="https://www.linkedin.com/in/shubhamkangune/" target="_blank" className="flex items-center gap-4 text-xl hover:text-white transition-colors" data-testid="contact-linkedin">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  linkedin.com/in/shubhamkangune
                </a>
              </div>
            </div>

            <div className="bg-background text-foreground p-8 rounded-xl shadow-2xl">
              <h3 className="text-2xl font-heading font-bold mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input name="name" placeholder="Your Name" value={form.name} onChange={onChange} data-testid="form-name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" placeholder="your@email.com" type="email" value={form.email} onChange={onChange} data-testid="form-email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input name="subject" placeholder="Job Opportunity / Inquiry" value={form.subject} onChange={onChange} data-testid="form-subject" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea name="message" placeholder="Hello Shubham, I would like to discuss..." className="min-h-[120px]" value={form.message} onChange={onChange} data-testid="form-message" />
                </div>
                <Button type="submit" className="w-full font-bold h-12 text-lg" data-testid="button-send-message" disabled={sending}>{sending ? "Sending..." : "Send Message"}</Button>
              </form>
              {sent && (
                <div className="mt-4 p-4 rounded-md bg-primary/10 border border-primary">
                  <p className="font-medium text-primary">Message sent — thank you!</p>
                  <p className="text-sm text-muted-foreground mt-1">I'll get back to you shortly.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border text-center text-muted-foreground text-sm">
        <div className="container">
          <p>© 2025 Shubham Kangune. All rights reserved.</p>
          <p className="mt-2">Designed & Developed by Shubham Kangune.</p>
        </div>
      </footer>

    </div>
  );
}

function AwardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-award"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
