import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const RESUME_LINK = "/attached_assets/Shubham_Kangune_Mechanical_Design_Engineer_2025_1766061788798.pdf";

interface NavigationProps {
  currentPath?: string;
}

export default function Navigation({ currentPath }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

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
      
      // If not on home page, navigate using window.location to include hash
      if (location !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="font-heading font-bold text-xl md:text-2xl text-primary tracking-wider hover:opacity-80 transition-opacity">
            S.KANGUNE
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
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
              <Link key={section.id} href={section.href}>
                <a 
                  className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide"
                  data-testid={`nav-${section.id}`}
                >
                  {section.label}
                </a>
              </Link>
            )
          ))}
          <Button asChild size="sm" className="ml-4 font-heading font-bold">
            <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer" data-testid="nav-resume">
              <Download className="mr-2 h-4 w-4" /> Resume
            </a>
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
              {sections.map((section) => (
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
                  <Link key={section.id} href={section.href}>
                    <a 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors text-left uppercase font-heading"
                      data-testid={`mobile-nav-${section.id}`}
                    >
                      {section.label}
                    </a>
                  </Link>
                )
              ))}
              <Button asChild className="w-full mt-4" data-testid="mobile-nav-resume">
                <a href={RESUME_LINK} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
