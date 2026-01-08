"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Save,
  X,
  Home,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Upload,
  Cog,
  GripVertical,
  User,
  Camera,
  Sun,
  Moon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAuthenticated, logout } from "@/lib/auth";
import Link from "next/link";

interface Design {
  _id?: string;
  id: string;
  title: string;
  description: string;
  software: string[];
  image: string;
  category: string;
  details?: string;
}

interface PracticeModel {
  _id?: string;
  id: string;
  name: string;
  image: string;
  viewer?: string;
  download?: string;
  tools?: string[];
  order?: number;
}

interface ProfileSettings {
  profilePhoto: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  skills: SkillCategory[];
  resumeUrl: string;
  resumeFileName?: string;
}

interface SkillCategory {
  icon: string;
  title: string;
  items: string[];
}

const defaultSkills: SkillCategory[] = [
  {
    icon: "DraftingCompass",
    title: "CAD Software",
    items: ["CATIA V5 (Part, Assembly, Drafting)", "SolidWorks", "AutoCAD (2D Drafting)", "Fusion 360"]
  },
  {
    icon: "Layers",
    title: "Plastic Product Design",
    items: ["Wall Thickness & Draft Angles", "Ribs, Bosses & Gussets", "Snaps, Clips & Locators", "Parting Line & Tooling Direction"]
  },
  {
    icon: "Cog",
    title: "Engineering Fundamentals",
    items: ["GD&T (Datums, Profile, Position)", "Tool & Die Design Basics", "ANSYS (Basic Structural)", "2D/3D Technical Drawings"]
  },
  {
    icon: "Database",
    title: "Tooling & Manufacturing",
    items: ["Injection Molding Basics", "Undercuts, Sliders & Lifters", "Blanking Die Design", "DFM Awareness"]
  }
];

// Sortable card wrapper for drag-and-drop
function SortablePracticeCard({
  model,
  onEdit,
  onDelete,
}: {
  model: PracticeModel;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: model.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle - Always visible on top-left of card */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -top-2 -left-2 z-20 p-2 rounded-lg bg-white shadow-lg border-2 border-primary/20 cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:border-primary transition-all"
        title="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-primary" />
      </div>

      <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="h-40 overflow-hidden relative bg-secondary">
          <img
            src={model.image}
            alt={model.name}
            className="w-full h-full object-cover"
          />
          {model.viewer && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                3D Viewer
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{model.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {model.viewer && (
              <a
                href={model.viewer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View in 3D
              </a>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          {model.download && (
            <Badge variant="outline" className="text-xs">
              Download Available
            </Badge>
          )}
          {model.tools && model.tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {model.tools.map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"designs" | "practice" | "profile">("designs");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [practiceModels, setPracticeModels] = useState<PracticeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [editingPractice, setEditingPractice] = useState<PracticeModel | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingPractice, setIsCreatingPractice] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletePracticeConfirm, setDeletePracticeConfirm] = useState<
    string | null
  >(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetPracticeConfirm, setResetPracticeConfirm] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<ProfileSettings>({
    profilePhoto: "",
    name: "SHUBHAM KANGUNE",
    title: "Mechanical Design Engineer",
    tagline: "Transforming complex engineering challenges into innovative mechanical solutions",
    bio: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    skills: defaultSkills,
    resumeUrl: "/attached_assets/Shubham_Kangune_Mechanical_Design_Engineer_2025_1766061788798.pdf",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  
  // Dark mode state
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  function toggleTheme() {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form state for designs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    software: "",
    category: "",
    image: "",
    details: "",
  });

  // Form state for practice models
  const [practiceFormData, setPracticeFormData] = useState({
    name: "",
    image: "",
    viewer: "",
    download: "",
    tools: [] as string[],
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }

    // Load data from API
    fetchDesigns();
    fetchPracticeModels();
    fetchProfile();
  }, [router]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data && !data.error) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  async function fetchDesigns() {
    try {
      setLoading(true);
      const res = await fetch("/api/designs");
      const data = await res.json();
      // Ensure data is an array
      setDesigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch designs:", error);
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPracticeModels() {
    try {
      const res = await fetch("/api/practice-models");
      const data = await res.json();
      setPracticeModels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch practice models:", error);
      setPracticeModels([]);
    }
  }

  // Handle drag end for reordering practice models
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = practiceModels.findIndex((m) => m.id === active.id);
      const newIndex = practiceModels.findIndex((m) => m.id === over.id);

      const reordered = arrayMove(practiceModels, oldIndex, newIndex);
      setPracticeModels(reordered);

      // Save new order to backend
      setReordering(true);
      try {
        await fetch("/api/practice-models/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderedIds: reordered.map((m) => m.id),
          }),
        });
      } catch (error) {
        console.error("Failed to save order:", error);
        // Revert on error
        await fetchPracticeModels();
      } finally {
        setReordering(false);
      }
    }
  }

  function handleLogout() {
    logout();
    router.push("/admin-login");
  }

  function openCreateModal() {
    setFormData({
      title: "",
      description: "",
      software: "",
      category: "",
      image: "",
      details: "",
    });
    setIsCreating(true);
  }

  function openEditModal(design: Design) {
    setFormData({
      title: design.title,
      description: design.description,
      software: design.software.join(", "),
      category: design.category,
      image: design.image,
      details: design.details || "",
    });
    setEditingDesign(design);
  }

  function closeModal() {
    setIsCreating(false);
    setEditingDesign(null);
    setFormData({
      title: "",
      description: "",
      software: "",
      category: "",
      image: "",
      details: "",
    });
  }

  function closePracticeModal() {
    setIsCreatingPractice(false);
    setEditingPractice(null);
    setPracticeFormData({
      name: "",
      image: "",
      viewer: "",
      download: "",
      tools: ["SolidWorks"],
    });
  }

  // Convert file to base64 with compression
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "design" | "practice"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compression options
      const options = {
        maxSizeMB: 0.5, // 500KB max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === "design") {
          setFormData({ ...formData, image: base64 });
        } else {
          setPracticeFormData({ ...practiceFormData, image: base64 });
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to compress image. Please try a different image.");
    }
  }

  async function handleSave() {
    const softwareArray = formData.software
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setSaving(true);
    try {
      if (isCreating) {
        await fetch("/api/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            software: softwareArray,
            category: formData.category,
            image: formData.image || "/images/3d_blanking_die_cad.png",
            details: formData.details,
          }),
        });
      } else if (editingDesign) {
        await fetch(`/api/designs/${editingDesign.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            software: softwareArray,
            category: formData.category,
            image: formData.image,
            details: formData.details,
          }),
        });
      }
      await fetchDesigns();
      closeModal();
    } catch (error) {
      console.error("Failed to save design:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/designs/${id}`, { method: "DELETE" });
      await fetchDesigns();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete design:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      await fetch("/api/designs/reset", { method: "POST" });
      await fetchDesigns();
      setResetConfirm(false);
    } catch (error) {
      console.error("Failed to reset designs:", error);
    } finally {
      setSaving(false);
    }
  }

  // Practice Model functions
  function openCreatePracticeModal() {
    setPracticeFormData({
      name: "",
      image: "",
      viewer: "",
      download: "",
      tools: ["SolidWorks"],
    });
    setIsCreatingPractice(true);
  }

  function openEditPracticeModal(model: PracticeModel) {
    setPracticeFormData({
      name: model.name,
      image: model.image,
      viewer: model.viewer || "",
      download: model.download || "",
      tools: model.tools && model.tools.length > 0 ? model.tools : ["SolidWorks"],
    });
    setEditingPractice(model);
  }

  async function handleSavePractice() {
    setSaving(true);
    try {
      if (isCreatingPractice) {
        await fetch("/api/practice-models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: practiceFormData.name,
            image:
              practiceFormData.image || "/projects/practice/placeholder.png",
            viewer: practiceFormData.viewer || undefined,
            download: practiceFormData.download || undefined,
            tools: practiceFormData.tools || ["SolidWorks"],
          }),
        });
      } else if (editingPractice) {
        await fetch(`/api/practice-models/${editingPractice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: practiceFormData.name,
            image: practiceFormData.image,
            viewer: practiceFormData.viewer || undefined,
            download: practiceFormData.download || undefined,
            tools: practiceFormData.tools || ["SolidWorks"],
          }),
        });
      }
      await fetchPracticeModels();
      closePracticeModal();
    } catch (error) {
      console.error("Failed to save practice model:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePractice(id: string) {
    setSaving(true);
    try {
      await fetch(`/api/practice-models/${id}`, { method: "DELETE" });
      await fetchPracticeModels();
      setDeletePracticeConfirm(null);
    } catch (error) {
      console.error("Failed to delete practice model:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPractice() {
    setSaving(true);
    try {
      await fetch("/api/practice-models/reset", { method: "POST" });
      await fetchPracticeModels();
      setResetPracticeConfirm(false);
    } catch (error) {
      console.error("Failed to reset practice models:", error);
    } finally {
      setSaving(false);
    }
  }

  // Profile functions
  async function handleProfilePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compression options for profile photo
      const options = {
        maxSizeMB: 0.3, // 300KB max for profile photos
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };

      // Compress image
      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfile({ ...profile, profilePhoto: base64 });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing profile photo:", error);
      alert("Failed to compress image. Please try a different image.");
    }
  }

  function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a PDF
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Resume file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfile({ ...profile, resumeUrl: base64, resumeFileName: file.name });
      alert("Resume uploaded! Click 'Save Profile' to save your changes.");
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const savedProfile = await response.json();
      
      // Update local state with the saved profile (includes converted resume URL)
      if (savedProfile && !savedProfile.error) {
        setProfile(savedProfile);
      }
      
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-heading font-bold text-xl text-primary">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-background/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("designs")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                activeTab === "designs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Design Works ({designs.length})
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                activeTab === "practice"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Practice Models ({practiceModels.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {activeTab === "designs" ? (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-heading font-bold">
                  Design Works
                </h2>
                <p className="text-muted-foreground">
                  Manage your portfolio designs ({designs.length} total)
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetConfirm(true)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button size="sm" onClick={openCreateModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Design
                </Button>
              </div>
            </div>

            {/* Designs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {designs.map((design) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300">
                      {/* Image */}
                      <div className="h-40 overflow-hidden relative bg-secondary">
                        <img
                          src={design.image}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {design.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">
                          {design.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {design.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-1 mb-4">
                          {design.software.map((tool, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      {/* Actions */}
                      <div className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditModal(design)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setDeleteConfirm(design.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {designs.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">
                  No Designs Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first design project
                </p>
                <Button onClick={openCreateModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Design
                </Button>
              </div>
            )}
          </>
        ) : activeTab === "practice" ? (
          <>
            {/* Practice Models Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-heading font-bold">
                  Practice Models
                </h2>
                <p className="text-muted-foreground">
                  Manage CAD practice models with external viewer links (
                  {practiceModels.length} total)
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResetPracticeConfirm(true)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button size="sm" onClick={openCreatePracticeModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Practice Model
                </Button>
              </div>
            </div>

            {/* Reordering indicator */}
            {reordering && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Saving new order...</span>
              </div>
            )}

            {/* Drag hint */}
            {practiceModels.length > 1 && (
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                Drag cards to reorder. Changes are saved automatically.
              </p>
            )}

            {/* Practice Models Grid with Drag and Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={practiceModels.map((m) => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {practiceModels.map((model) => (
                    <SortablePracticeCard
                      key={model.id}
                      model={model}
                      onEdit={() => openEditPracticeModal(model)}
                      onDelete={() => setDeletePracticeConfirm(model.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {practiceModels.length === 0 && (
              <div className="text-center py-16">
                <Cog className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">
                  No Practice Models Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first practice CAD model
                </p>
                <Button onClick={openCreatePracticeModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Practice Model
                </Button>
              </div>
            )}
          </>
        ) : activeTab === "profile" ? (
          <>
            {/* Profile Settings */}
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold">Profile Settings</h2>
                <p className="text-muted-foreground">
                  Update your profile photo and information displayed on the portfolio
                </p>
              </div>

              {/* Profile Photo Upload */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Photo
                  </CardTitle>
                  <CardDescription>
                    Upload a professional headshot to display on your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    {/* Photo Preview */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary border-4 border-primary/20 shadow-lg">
                        {profile.profilePhoto ? (
                          <img
                            src={profile.profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      {/* Upload Button Overlay */}
                      <label className="absolute bottom-0 right-0 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                          <Camera className="h-5 w-5" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePhotoUpload}
                        />
                      </label>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-3">
                        Recommended: Square image, at least 400×400px, max 2MB
                      </p>
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePhotoUpload}
                          />
                        </label>
                        {profile.profilePhoto && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => setProfile({ ...profile, profilePhoto: "" })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    This information is displayed on your portfolio homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        placeholder="e.g., Mechanical Design Engineer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tagline</label>
                    <Input
                      value={profile.tagline}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      placeholder="A short tagline about yourself"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell visitors about yourself, your expertise, and what you do"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How recruiters and companies can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn URL</label>
                      <Input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume / CV
                  </CardTitle>
                  <CardDescription>
                    Upload your resume PDF to allow visitors to download it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    {/* Resume Preview */}
                    <div className="relative">
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-secondary border-2 border-primary/20 shadow-lg flex items-center justify-center">
                        <FileText className="h-10 w-10 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      {profile.resumeUrl ? (
                        <div className="mb-3">
                          <p className="text-sm text-green-600 font-medium mb-1">
                            ✓ Resume uploaded
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {profile.resumeUrl.startsWith("data:") 
                              ? (profile.resumeFileName || "New PDF ready to save") 
                              : profile.resumeUrl.split("/").pop()}
                          </p>
                          {profile.resumeUrl.startsWith("data:") && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              ⚠️ Click "Save Profile" to save this resume
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-3">
                          No resume uploaded yet. Upload a PDF file (max 5MB).
                        </p>
                      )}
                      <div className="flex gap-2">
                        <label className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Resume
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleResumeUpload}
                          />
                        </label>
                        {profile.resumeUrl && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Preview
                              </a>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => setProfile({ ...profile, resumeUrl: "" })}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* URL Input as alternative */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <label className="text-sm font-medium">Or enter Resume URL</label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={profile.resumeUrl?.startsWith("data:") ? "" : profile.resumeUrl || ""}
                        onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                        placeholder="/attached_assets/your-resume.pdf"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use a path from /public folder or an external URL
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    Technical Skills
                  </CardTitle>
                  <CardDescription>
                    Manage your skill categories displayed in the Technical Expertise section
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(profile.skills || defaultSkills).map((category, catIndex) => (
                    <div key={catIndex} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={category.icon}
                            onChange={(e) => {
                              const newSkills = [...(profile.skills || defaultSkills)];
                              newSkills[catIndex] = { ...newSkills[catIndex], icon: e.target.value };
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="px-2 py-1 border border-border rounded text-sm bg-background"
                          >
                            <option value="DraftingCompass">📐 Drafting</option>
                            <option value="Layers">📚 Layers</option>
                            <option value="Cog">⚙️ Cog</option>
                            <option value="Database">💾 Database</option>
                            <option value="Wrench">🔧 Wrench</option>
                            <option value="Code">💻 Code</option>
                          </select>
                          <Input
                            value={category.title}
                            onChange={(e) => {
                              const newSkills = [...(profile.skills || defaultSkills)];
                              newSkills[catIndex] = { ...newSkills[catIndex], title: e.target.value };
                              setProfile({ ...profile, skills: newSkills });
                            }}
                            className="font-bold w-48"
                            placeholder="Category Title"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            const newSkills = (profile.skills || defaultSkills).filter((_, i) => i !== catIndex);
                            setProfile({ ...profile, skills: newSkills });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newSkills = [...(profile.skills || defaultSkills)];
                                const newItems = [...newSkills[catIndex].items];
                                newItems[itemIndex] = e.target.value;
                                newSkills[catIndex] = { ...newSkills[catIndex], items: newItems };
                                setProfile({ ...profile, skills: newSkills });
                              }}
                              className="flex-1 h-8 text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => {
                                const newSkills = [...(profile.skills || defaultSkills)];
                                const newItems = newSkills[catIndex].items.filter((_, i) => i !== itemIndex);
                                newSkills[catIndex] = { ...newSkills[catIndex], items: newItems };
                                setProfile({ ...profile, skills: newSkills });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const newSkills = [...(profile.skills || defaultSkills)];
                            newSkills[catIndex] = {
                              ...newSkills[catIndex],
                              items: [...newSkills[catIndex].items, "New Skill"]
                            };
                            setProfile({ ...profile, skills: newSkills });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Skill
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const newSkills = [
                        ...(profile.skills || defaultSkills),
                        { icon: "Cog", title: "New Category", items: ["Skill 1", "Skill 2"] }
                      ];
                      setProfile({ ...profile, skills: newSkills });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Skill Category
                  </Button>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={savingProfile}
                  className="px-8"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
                {profileSaved && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Profile saved successfully!
                  </span>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={isCreating || !!editingDesign} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {isCreating ? "Add New Design" : "Edit Design"}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Create a new design work entry for your portfolio"
                : "Update the design work details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Hydraulic Press Machine"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the project"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Academic Project, Internship Work"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Software/Tools (comma-separated)
              </label>
              <Input
                value={formData.software}
                onChange={(e) =>
                  setFormData({ ...formData, software: e.target.value })
                }
                placeholder="e.g., SolidWorks, CATIA, AutoCAD"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="e.g., /images/my-design.png"
              />
              <p className="text-xs text-muted-foreground">
                Use a path from /public folder (e.g., /images/design.png)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Details</label>
              <Textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                placeholder="Additional details about the project"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.title || !formData.description || !formData.category
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {isCreating ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-destructive">
              Delete Design
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this design? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetConfirm} onOpenChange={setResetConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Reset to Defaults
            </DialogTitle>
            <DialogDescription>
              This will restore the original 3 design works and remove any
              custom designs you&apos;ve added. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Practice Model Create/Edit Modal */}
      <Dialog
        open={isCreatingPractice || !!editingPractice}
        onOpenChange={closePracticeModal}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {isCreatingPractice
                ? "Add New Practice Model"
                : "Edit Practice Model"}
            </DialogTitle>
            <DialogDescription>
              {isCreatingPractice
                ? "Add a new CAD practice model with external viewer link"
                : "Update the practice model details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={practiceFormData.name}
                onChange={(e) =>
                  setPracticeFormData({
                    ...practiceFormData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g., V-Block Assembly (Practice)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <div className="flex gap-2">
                <Input
                  value={
                    practiceFormData.image.startsWith("data:")
                      ? "Base64 image uploaded"
                      : practiceFormData.image
                  }
                  onChange={(e) =>
                    setPracticeFormData({
                      ...practiceFormData,
                      image: e.target.value,
                    })
                  }
                  placeholder="e.g., /projects/practice/model.png"
                  disabled={practiceFormData.image.startsWith("data:")}
                />
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" size="icon" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "practice")}
                  />
                </label>
              </div>
              {practiceFormData.image.startsWith("data:") && (
                <div className="mt-2">
                  <img
                    src={practiceFormData.image}
                    alt="Preview"
                    className="h-20 w-auto rounded border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-destructive"
                    onClick={() =>
                      setPracticeFormData({ ...practiceFormData, image: "" })
                    }
                  >
                    Remove image
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Upload an image (stored as base64) or use a URL path
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                3D Viewer URL (External Link)
              </label>
              <Input
                value={practiceFormData.viewer}
                onChange={(e) =>
                  setPracticeFormData({
                    ...practiceFormData,
                    viewer: e.target.value,
                  })
                }
                placeholder="e.g., https://autode.sk/4qfPYu8"
              />
              <p className="text-xs text-muted-foreground">
                Autodesk Viewer or other external 3D viewer link
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Design Tools *</label>
              
              {/* Preset Tool Buttons */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["SolidWorks", "CATIA V5", "AutoCAD", "Fusion 360", "FreeCAD", "Inventor"].map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => {
                      const currentTools = practiceFormData.tools || [];
                      const updated = currentTools.includes(tool)
                        ? currentTools.filter((t) => t !== tool)
                        : [...currentTools, tool];
                      setPracticeFormData({
                        ...practiceFormData,
                        tools: updated,
                      });
                    }}
                    className={`px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                      (practiceFormData.tools || []).includes(tool)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>

              {/* Custom Tool Input */}
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  id="customToolInput"
                  placeholder="Enter custom software name"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.currentTarget;
                      const customTool = input.value.trim();
                      if (customTool) {
                        const currentTools = practiceFormData.tools || [];
                        if (!currentTools.includes(customTool)) {
                          setPracticeFormData({
                            ...practiceFormData,
                            tools: [...currentTools, customTool],
                          });
                        }
                        input.value = "";
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById("customToolInput") as HTMLInputElement;
                    const customTool = input?.value.trim();
                    if (customTool) {
                      const currentTools = practiceFormData.tools || [];
                      if (!currentTools.includes(customTool)) {
                        setPracticeFormData({
                          ...practiceFormData,
                          tools: [...currentTools, customTool],
                        });
                      }
                      if (input) input.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Display Selected Tools */}
              {(practiceFormData.tools || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {practiceFormData.tools.map((tool) => (
                    <div
                      key={tool}
                      className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-full text-sm border border-blue-300"
                    >
                      <span className="font-medium">{tool}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPracticeFormData({
                            ...practiceFormData,
                            tools: (practiceFormData.tools || []).filter((t) => t !== tool),
                          });
                        }}
                        className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closePracticeModal}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSavePractice}
              disabled={!practiceFormData.name}
            >
              <Save className="h-4 w-4 mr-2" />
              {isCreatingPractice ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Practice Model Confirmation Dialog */}
      <Dialog
        open={!!deletePracticeConfirm}
        onOpenChange={() => setDeletePracticeConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-destructive">
              Delete Practice Model
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this practice model? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletePracticeConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletePracticeConfirm &&
                handleDeletePractice(deletePracticeConfirm)
              }
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Practice Models Confirmation Dialog */}
      <Dialog
        open={resetPracticeConfirm}
        onOpenChange={setResetPracticeConfirm}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              Reset Practice Models to Defaults
            </DialogTitle>
            <DialogDescription>
              This will restore the original practice models and remove any
              custom ones you&apos;ve added. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPracticeConfirm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPractice}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
