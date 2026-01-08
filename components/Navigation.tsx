"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DEFAULT_RESUME_LINK =
  "/attached_assets/shubham_kangune_resume.pdf";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_LINK);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Fetch profile to get dynamic resume URL
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.resumeUrl) {
          setResumeUrl(data.resumeUrl);
        }
      })
      .catch(console.error);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const sections = [
    { id: "home", label: "Home", href: "/" },
    { id: "designs", label: "Design Work", href: "/designs" },
    { id: "about", label: "About", href: "/#about" },
    { id: "skills", label: "Skills", href: "/#skills" },
    { id: "experience", label: "Experience", href: "/#experience" },
    { id: "contact", label: "Contact", href: "/#contact" },
  ];

  const scrollToSection = (id: string, href: string) => {
    setIsMenuOpen(false);

    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading font-bold text-xl md:text-2xl text-primary tracking-wider hover:opacity-80 transition-opacity"
        >
          S.KANGUNE
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((section) =>
            section.href.startsWith("/#") ? (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id, section.href)}
                className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
                data-testid={`nav-${section.id}`}
              >
                {section.label}
              </button>
            ) : (
              <Link
                key={section.id}
                href={section.href}
                className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
                data-testid={`nav-${section.id}`}
              >
                {section.label}
              </Link>
            )
          )}
          <Button asChild size="sm" className="ml-4 font-heading font-bold">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-resume"
            >
              <Download className="mr-2 h-4 w-4" /> Resume
            </a>
          </Button>
          
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2"
            data-testid="theme-toggle"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" data-testid="nav-menu-toggle">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-6 mt-10">
              {sections.map((section) =>
                section.href.startsWith("/#") ? (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, section.href)}
                    className="text-lg font-medium hover:text-primary transition-colors text-left uppercase font-heading"
                    data-testid={`mobile-nav-${section.id}`}
                  >
                    {section.label}
                  </button>
                ) : (
                  <Link
                    key={section.id}
                    href={section.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors text-left uppercase font-heading"
                    data-testid={`mobile-nav-${section.id}`}
                  >
                    {section.label}
                  </Link>
                )
              )}
              <Button
                asChild
                className="w-full mt-4"
                data-testid="mobile-nav-resume"
              >
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </a>
              </Button>
              
              {/* Mobile Dark Mode Toggle */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="w-full mt-2 flex items-center justify-center gap-2"
              >
                {isDark ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-500" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" /> Dark Mode
                  </>
                )}
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
