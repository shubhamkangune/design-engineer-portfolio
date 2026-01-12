"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Download,
  Mail,
  Linkedin,
  Phone,
  Cog,
  Database,
  DraftingCompass,
  Layers,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

interface SkillCategory {
  icon: string;
  title: string;
  items: string[];
}

interface ProfileData {
  profilePhoto: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  skills?: SkillCategory[];
  resumeUrl?: string;
}

const DEFAULT_RESUME_LINK =
  "/attached_assets/Shubham_Kangune_Mechanical_Design_Engineer_2025_1766061788798.pdf";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Icon mapping for skills
const iconMap: { [key: string]: React.ReactNode } = {
  DraftingCompass: <DraftingCompass size={28} />,
  Layers: <Layers size={28} />,
  Cog: <Cog size={28} />,
  Database: <Database size={28} />,
};

// Typewriter effect component
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity text-primary`}>|</span>
    </span>
  );
}

// 3D Tilt Card Component for Profile Photo
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();
        if (data && !data.error) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, []);

  function toast({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    setToastMessage({ title, description });
    setTimeout(() => setToastMessage(null), 5000);
  }

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: "Validation error",
        description: "Name, email and message are required.",
      });
      return;
    }

    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdrgwyp";

    setSending(true);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || "Website contact",
          message: form.message,
        }),
      });

      if (res.ok) {
        toast({
          title: "Message sent",
          description: "Thanks — I'll get back to you soon.",
        });
        setForm({ name: "", email: "", subject: "", message: "" });
        setSent(true);
        setTimeout(() => setSent(false), 8000);
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = data.error || "Failed to send message.";
        toast({ title: "Send failed", description: errorMsg });
      }
    } catch (err: unknown) {
      console.error("Formspree error:", err);
      toast({ title: "Network error", description: "Failed to send message." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[100] bg-card border border-border p-4 rounded-lg shadow-lg max-w-sm">
          <p className="font-bold">{toastMessage.title}</p>
          <p className="text-sm text-muted-foreground">
            {toastMessage.description}
          </p>
        </div>
      )}

      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/abstract_mechanical_blueprint_background.webp"
            alt="Mechanical Blueprint Background"
            className="w-full h-full object-cover opacity-10"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
        </div>

        <div className="container px-4 md:px-6 z-10 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Profile Photo with Clean Hover Effect */}
            {profile?.profilePhoto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="relative group cursor-pointer">
                  {/* Rotating border animation */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-full opacity-75 blur group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" />
                  
                  {/* Main photo container */}
                  <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-background shadow-2xl">
                    <img
                      src={profile.profilePhoto}
                      alt={profile.name || "Profile"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-4 uppercase tracking-[0.2em]">
              Hello, I am
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold text-primary mb-6 tracking-tighter">
              {profile?.name || "SHUBHAM KANGUNE"}
            </h1>
            <div className="text-xl md:text-3xl text-foreground/80 font-light mb-8 max-w-3xl mx-auto h-10 md:h-12">
              <TypewriterText 
                text={profile?.title || "Mechanical Design Engineer"} 
                className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent font-medium"
              />
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {profile?.tagline || "Specializing in CAD design, tool & die development, and manufacturing optimization. Transforming concepts into precision engineered solutions."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="font-heading font-bold text-lg h-12 px-8 cursor-pointer"
                onClick={() => router.push("/designs")}
                data-testid="button-view-designs"
              >
                View My Designs
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-heading font-bold text-lg h-12 px-8"
                asChild
                data-testid="button-download-cv"
              >
                <a href={profile?.resumeUrl || DEFAULT_RESUME_LINK} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download CV
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

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
            className="max-w-5xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-primary" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                ABOUT ME
              </h2>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                {profile?.bio ? (
                  <p>{profile.bio}</p>
                ) : (
                  <>
                    <p>
                      I am a passionate{" "}
                      <strong className="text-primary font-medium">
                        Mechanical Engineering graduate
                      </strong>{" "}
                      with a strong foundation in CAD design, tool and die
                      development, and manufacturing processes.
                    </p>
                    <p>
                      My academic journey and practical internship experiences have
                      equipped me with proficiency in industry-standard tools like{" "}
                      <span className="text-foreground font-medium">
                        SolidWorks, CATIA, and AutoCAD
                      </span>
                      . I have hands-on experience in designing blanking dies,
                      validating designs through simulation, and optimizing
                      manufacturing workflows.
                    </p>
                    <p>
                      I am eager to contribute as a Mechanical Design Engineer,
                      leveraging my skills in
                      <span className="text-foreground font-medium">
                        {" "}
                        GD&T, 2D/3D modelling, and design validation
                      </span>{" "}
                      to deliver efficient and innovative engineering solutions.
                    </p>
                  </>
                )}
                
                {/* Quick Contact Info */}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              <div className="bg-background p-6 rounded-lg border border-border shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-xl mb-4 border-b border-border pb-2">
                  Education
                </h3>

                <div className="space-y-1">
                  <div className="font-bold text-foreground">
                    B.E. Mechanical Engineering
                  </div>
                  <div className="text-sm text-primary font-medium">
                    2022-2025
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ajeenkya D.Y. Patil School of Engineering
                  </div>
                  <div className="text-sm font-medium">CGPA: 7.2 / 10.0</div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="font-bold text-foreground">
                    Diploma in Mechanical Eng.
                  </div>
                  <div className="text-sm text-primary font-medium">
                    2019-2022
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ashok Institute of Engineering
                  </div>
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
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
                TECHNICAL EXPERTISE
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(profile?.skills || [
                { icon: "DraftingCompass", title: "CAD Software", items: ["CATIA V5", "SolidWorks", "AutoCAD", "Fusion 360"] },
                { icon: "Layers", title: "Plastic Product Design", items: ["Wall Thickness", "Ribs & Bosses", "Snaps & Clips", "Parting Line"] },
                { icon: "Cog", title: "Engineering Fundamentals", items: ["GD&T", "Tool & Die Design", "ANSYS", "2D/3D Drawings"] },
                { icon: "Database", title: "Tooling & Manufacturing", items: ["Injection Molding", "Sliders & Lifters", "Blanking Die", "DFM"] }
              ]).map((category, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-secondary/20 border border-border p-6 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    {iconMap[category.icon] || <Cog size={28} />}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                EXPERIENCE
              </h2>
            </div>

            <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-12">
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-background border-4 border-primary" />
                <div className="bg-background p-6 md:p-8 rounded-lg border border-border shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-primary">
                        Mechanical Design Intern
                      </h3>
                      <div className="text-lg font-medium">
                        Maxpertise Technology Labs Pvt. Ltd.
                      </div>
                    </div>
                    <div className="text-muted-foreground font-medium mt-2 md:mt-0 bg-secondary px-3 py-1 rounded text-sm">
                      Bengaluru
                    </div>
                  </div>

                  <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                    <li>
                      Assisted in designing{" "}
                      <strong className="text-foreground">blanking dies</strong>{" "}
                      using SolidWorks under senior engineer guidance.
                    </li>
                    <li>
                      Learned 2D/3D modeling workflows, BOM preparation, and{" "}
                      <strong className="text-foreground">manufacturing drawing</strong>{" "}
                      standards.
                    </li>
                    <li>
                      Gained practical exposure to tool design principles and
                      sheet metal component geometry.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section
        id="projects"
        className="py-20 md:py-32 bg-background bg-grid-pattern"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
                FEATURED PROJECTS
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A selection of mechanical designs.{" "}
                <Link
                  href="/designs"
                  className="text-primary hover:underline font-medium"
                >
                  View all designs
                </Link>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp}>
                <Card
                  className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                  data-testid="featured-project-leather"
                >
                  <div className="h-48 sm:h-40 overflow-hidden relative bg-secondary">
                    <img
                      src="/projects/leather-strip-cutting/lather_main.jpg"
                      alt="Leather Cutting Machine"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        SolidWorks
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        Fabrication
                      </Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">
                      Leather Strip Cutting Device
                    </CardTitle>
                    <CardDescription>
                      Sponsored by Divyam Leather Crafts Pvt. Ltd.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Designed and developed a semi-automated machine to enhance
                      artisans&apos; efficiency. Implemented an innovative
                      cutting mechanism that reduced material waste.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card
                  className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                  data-testid="featured-project-hydraulic"
                >
                  <div className="h-48 overflow-hidden relative bg-secondary">
                    <img
                      src="/projects/leather-strip-cutting/hydro.png"
                      alt="Hydraulic Press Machine"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        Pascal&apos;s Law
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        Hydraulics
                      </Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">
                      Hydraulic Press Machine
                    </CardTitle>
                    <CardDescription>
                      Academic Research & Fabrication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Researched and applied Pascal&apos;s Law to design a
                      functional press. Coordinated fabrication and developed
                      testing procedures.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card
                  className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                  data-testid="featured-project-blanking"
                >
                  <div className="h-48 overflow-hidden relative bg-secondary">
                    <img
                      src="/projects/leather-strip-cutting/intern.png"
                      alt="Blanking Die Design"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        SolidWorks
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        Tool Design
                      </Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl">
                      Blanking Die Optimization
                    </CardTitle>
                    <CardDescription>
                      Maxpertise Technology Labs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Designed complex blanking dies with a focus on precision
                      and durability. Optimized for better material usage and
                      reduced wear.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                className="font-heading font-bold text-lg h-12 px-8 cursor-pointer"
                onClick={() => router.push("/designs")}
                data-testid="button-view-all-designs"
              >
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              CERTIFICATIONS
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "CATIA V5 - Plastic Product Design (Skill-Lync)",
              "AutoCAD Certified (Disha Institute)",
              "Fusion 360 Basics (Autodesk)",
            ].map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-background px-6 py-4 rounded-lg border border-border shadow-sm"
                data-testid={`cert-${i}`}
              >
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
      <section
        id="contact"
        className="py-20 md:py-32 bg-[#0145a3] text-primary-foreground"
      >
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-heading font-bold">
                LET&apos;S BUILD SOMETHING GREAT
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
                I am actively seeking entry-level opportunities as a Mechanical
                Design Engineer or Plastic Product Design Trainee. Open to
                learning and contributing in an industry environment.
              </p>

              <div className="space-y-4 pt-6">
                <a
                  href="mailto:shubhamcsc4656@gmail.com"
                  className="flex items-center gap-4 text-xl hover:text-white transition-colors"
                  data-testid="contact-email"
                >
                  <div className="bg-white/10 p-3 rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  shubhamcsc4656@gmail.com
                </a>
                <a
                  href="tel:8459117697"
                  className="flex items-center gap-4 text-xl hover:text-white transition-colors"
                  data-testid="contact-phone"
                >
                  <div className="bg-white/10 p-3 rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  +91 84591 17697
                </a>
                <a
                  href="https://www.linkedin.com/in/shubhamkangune/"
                  target="_blank"
                  className="flex items-center gap-4 text-xl hover:text-white transition-colors"
                  data-testid="contact-linkedin"
                >
                  <div className="bg-white/10 p-3 rounded-full">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  linkedin.com/in/shubhamkangune
                </a>
              </div>
            </div>

            <div className="bg-background text-foreground p-8 rounded-xl shadow-2xl">
              <h3 className="text-2xl font-heading font-bold mb-6">
                Send a Message
              </h3>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={onChange}
                      data-testid="form-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      placeholder="your@email.com"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      data-testid="form-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    name="subject"
                    placeholder="Job Opportunity / Inquiry"
                    value={form.subject}
                    onChange={onChange}
                    data-testid="form-subject"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Hello Shubham, I would like to discuss..."
                    className="min-h-[120px]"
                    value={form.message}
                    onChange={onChange}
                    data-testid="form-message"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-bold h-12 text-lg"
                  data-testid="button-send-message"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
              {sent && (
                <div className="mt-4 p-4 rounded-md bg-primary/10 border border-primary">
                  <p className="font-medium text-primary">
                    Message sent — thank you!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    I&apos;ll get back to you shortly.
                  </p>
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
