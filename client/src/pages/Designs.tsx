import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import PracticeCard from "@/components/PracticeCard";
import practiceModels from "@/data/practiceModels";

// Import Assets
import hydraulicPress from '@assets/generated_images/3d_hydraulic_press_cad.png';
import blankingDie from '@assets/generated_images/3d_blanking_die_cad.png';

interface Design {
  id: string;
  title: string;
  description: string;
  software: string[];
  image: string;
  category: string;
  details?: string;
}

const designs: Design[] = [
  {
    id: "leather-cutting",
    title: "Leather Strip Cutting Device",
    description: "Semi-automated machine designed to enhance leather artisans' efficiency with precision cutting mechanism.",
    software: ["SolidWorks", "CAD Design"],
    category: "Academic Project",
    // image served from public folder: /projects/leather-strip-cutting/
    // image served from public folder: /projects/leather-strip-cutting/
    image: '/projects/leather-strip-cutting/lather_main.jpg',
    details: "Sponsored by Divyam Leather Crafts Pvt. Ltd. - Implemented innovative cutting mechanism reducing material waste and accelerating production.",
  },
  {
    id: "hydraulic-press",
    title: "Hydraulic Press Machine",
    description: "Functional hydraulic system design based on Pascal's Law with fabrication and testing procedures.",
    software: ["CAD Design", "Hydraulics"],
    category: "Academic Project",
    image: hydraulicPress,
    details: "Researched and applied Pascal's Law to design a functional press. Coordinated fabrication and developed testing procedure to validate efficiency.",
  },
  {
    id: "blanking-die",
    title: "Sheet Metal Blanking Die",
    description: "Optimized die design for precision sheet metal stamping with improved material usage and durability.",
    software: ["SolidWorks", "Tool & Die Design"],
    category: "Internship Work",
    image: blankingDie,
    details: "Designed at Maxpertise Technology Labs. Optimized geometry for better material usage and reduced wear during manufacturing.",
  },
  // Template for future designs - uncomment and modify as needed
  // {
  //   id: "future-design-1",
  //   title: "Your Design Title",
  //   description: "Short description of the design",
  //   software: ["SolidWorks", "CATIA"],
  //   category: "Category",
  //   image: "path-to-image",
  //   details: "Detailed description or technical notes",
  // },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Designs() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-secondary/30 relative">
        <div className="container px-4 md:px-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 tracking-tighter">
              DESIGN WORK
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive showcase of mechanical design projects and CAD work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {designs.map((design) => (
              <motion.div key={design.id} variants={fadeInUp} data-testid={`design-card-${design.id}`}>
                <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  
                  {/* Design Image */}
                  <div className="h-56 overflow-hidden relative bg-secondary">
                    {/* design.image may be a public path; using srcSet for higher-density displays */}
                    <img
                      src={design.image}
                      srcSet={design.id === 'leather-cutting' ? "/projects/leather-strip-cutting/lather_main.jpg 1x, /projects/leather-strip-cutting/later_2.jpg 2x" : undefined}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="font-medium">
                        {design.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Header */}
                  <CardHeader>
                    <CardTitle className="font-heading font-bold text-xl line-clamp-2">
                      {design.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {design.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Software Tags */}
                  <div className="px-6 pb-2 flex flex-wrap gap-2">
                    {design.software.map((tool, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-normal">
                        {tool}
                      </Badge>
                    ))}
                  </div>

                  {/* Card Content */}
                  <CardContent className="flex-grow">
                    {design.details && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {design.details}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Practice CAD Models - rendered as reusable cards; add new entries in src/data/practiceModels.ts */}
            {practiceModels.map((model) => (
              <motion.div key={model.id} variants={fadeInUp} data-testid={`practice-card-${model.id}`}>
                <PracticeCard model={model} />
              </motion.div>
            ))}
          </motion.div>

          {/* Add More Designs Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground text-lg">
              More designs coming soon. Check back for updates on new projects and portfolio expansions.
            </p>
          </motion.div>
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
