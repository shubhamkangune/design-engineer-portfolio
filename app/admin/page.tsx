"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"designs" | "practice">("designs");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [practiceModels, setPracticeModels] = useState<PracticeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  }, [router]);

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
    });
  }

  // Convert file to base64
  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "design" | "practice"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === "design") {
        setFormData({ ...formData, image: base64 });
      } else {
        setPracticeFormData({ ...practiceFormData, image: base64 });
      }
    };
    reader.readAsDataURL(file);
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
    });
    setIsCreatingPractice(true);
  }

  function openEditPracticeModal(model: PracticeModel) {
    setPracticeFormData({
      name: model.name,
      image: model.image,
      viewer: model.viewer || "",
      download: model.download || "",
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
        ) : (
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

            {/* Practice Models Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {practiceModels.map((model) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
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
                        <CardTitle className="text-lg line-clamp-1">
                          {model.name}
                        </CardTitle>
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
                      </CardContent>

                      {/* Actions */}
                      <div className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditPracticeModal(model)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setDeletePracticeConfirm(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

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
        )}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Download URL</label>
              <Input
                value={practiceFormData.download}
                onChange={(e) =>
                  setPracticeFormData({
                    ...practiceFormData,
                    download: e.target.value,
                  })
                }
                placeholder="e.g., /cad-files/model.sldprt"
              />
              <p className="text-xs text-muted-foreground">
                Optional download link for CAD file
              </p>
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
