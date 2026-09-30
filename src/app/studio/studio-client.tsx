"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileEdit,
  FolderOpen,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ModeToggle } from "@/components/mode-toggler";
import ArticleBody from "@/features/website/pages/blog/article-body";
import { formatDate, readingMinutes, type Post } from "@/features/website/pages/blog/posts";

const CATEGORY_PRESETS = [
  "Leadership & Discipline",
  "Mikaelson School Club",
  "Mikaelson Labs & Tech",
  "African Studies & Culture",
  "Student Growth & Mindset",
  "Partnerships & Community",
];

const SAMPLE_COVERS = [
  { label: "Community Classroom", url: "/assets/images/community-1.png" },
  { label: "Student Facilitator", url: "/assets/images/community-2.png" },
  { label: "Students Circle", url: "/assets/images/hero-1.png" },
  { label: "Initiative Session", url: "/assets/images/community-3.png" },
];

export function StudioClient({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Editing state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">("split");

  // Media upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBodyImage, setUploadingBodyImage] = useState(false);
  const [coverUrlManual, setCoverUrlManual] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bodyFileInputRef = useRef<HTMLInputElement>(null);

  // Load posts once authenticated
  useEffect(() => {
    if (authenticated) {
      loadPosts();
    }
  }, [authenticated]);

  const loadPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/studio/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else if (res.status === 401) {
        setAuthenticated(false);
      }
    } catch {
      toast.error("Failed to load stories from database.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;

    setAuthLoading(true);
    try {
      const res = await fetch("/api/studio/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: passkeyInput }),
      });

      if (res.ok) {
        setAuthenticated(true);
        toast.success("Welcome to Mikaelson Studio!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Incorrect passkey. Please try again.");
      }
    } catch {
      toast.error("Network error trying to authenticate.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/studio/auth", { method: "DELETE" });
    setAuthenticated(false);
    setPosts([]);
    setEditingPost(null);
    toast.info("Signed out of Studio.");
  };

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingPost({
      _id: "",
      title: "",
      slug: { current: "" },
      category: "Leadership & Discipline",
      excerpt: "",
      coverImage: "/assets/images/community-1.png",
      author: {
        name: "Michael Segun",
        role: "Initiative Lead",
        avatar: "",
      },
      publishedAt: new Date().toISOString(),
      showAsPopup: false,
      status: "published",
      body: "",
      seoTitle: "",
      seoDescription: "",
    });
  };

  const handleEdit = (post: Post) => {
    setIsNew(false);
    setEditingPost({ ...post });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/studio/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Story deleted.");
        setPosts((prev) => prev.filter((p) => p._id !== id));
        if (editingPost?._id === id) {
          setEditingPost(null);
        }
      } else {
        toast.error("Failed to delete story.");
      }
    } catch {
      toast.error("Error communicating with database.");
    }
  };

  const handleTogglePopup = async (post: Post) => {
    const nextStatus = !post.showAsPopup;
    try {
      const res = await fetch(`/api/studio/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showAsPopup: nextStatus }),
      });

      if (res.ok) {
        toast.success(
          nextStatus
            ? `"${post.title}" is now featured on the homepage pop-up!`
            : "Story removed from homepage pop-up."
        );
        loadPosts();
      }
    } catch {
      toast.error("Failed to update pop-up status.");
    }
  };

  const handleSave = async (publishStatus: "published" | "draft" = "published") => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) {
      toast.error("Please enter a title for your story.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editingPost,
        status: publishStatus,
      };

      if (isNew) {
        const res = await fetch("/api/studio/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success(
            publishStatus === "published"
              ? "Story published to website successfully!"
              : "Draft saved successfully!"
          );
          setEditingPost(null);
          loadPosts();
        } else {
          const err = await res.json();
          toast.error(err.error || "Failed to create story.");
        }
      } else {
        const res = await fetch(`/api/studio/posts/${editingPost._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success(
            publishStatus === "published"
              ? "Story updated and published!"
              : "Draft updated!"
          );
          setEditingPost(null);
          loadPosts();
        } else {
          const err = await res.json();
          toast.error(err.error || "Failed to update story.");
        }
      }
    } catch {
      toast.error("Error saving story to database.");
    } finally {
      setSaving(false);
    }
  };

  // Filtered stories list
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );
  const uploadImageFile = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, GIF, SVG).");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 5MB.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to upload image.");
        return null;
      }

      const data = await res.json();
      return data.url;
    } catch {
      toast.error("Network error while uploading image.");
      return null;
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    setUploadingCover(true);
    const toastId = toast.loading("Uploading cover photograph...");
    const url = await uploadImageFile(file);
    setUploadingCover(false);

    if (url) {
      setEditingPost({ ...editingPost, coverImage: url });
      toast.success("Cover image uploaded successfully!", { id: toastId });
    } else {
      toast.dismiss(toastId);
    }
    if (coverFileInputRef.current) coverFileInputRef.current.value = "";
  };

  const handleCoverDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!editingPost) return;
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    setUploadingCover(true);
    const toastId = toast.loading("Uploading dropped cover image...");
    const url = await uploadImageFile(file);
    setUploadingCover(false);

    if (url) {
      setEditingPost({ ...editingPost, coverImage: url });
      toast.success("Cover image uploaded successfully!", { id: toastId });
    } else {
      toast.dismiss(toastId);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    if (!editingPost) return;
    const textarea = document.getElementById("story-body-input") as HTMLTextAreaElement | null;
    if (!textarea) {
      setEditingPost({ ...editingPost, body: (editingPost.body || "") + textToInsert });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = editingPost.body?.substring(0, start) || "";
    const after = editingPost.body?.substring(end) || "";

    const newBody = `${before}${textToInsert}${after}`;
    setEditingPost({ ...editingPost, body: newBody });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    setUploadingBodyImage(true);
    const toastId = toast.loading("Uploading image for story...");
    const url = await uploadImageFile(file);
    setUploadingBodyImage(false);

    if (url) {
      const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      insertTextAtCursor(`\n\n![${alt}](${url})\n\n`);
      toast.success("Image uploaded & inserted into story!", { id: toastId });
    } else {
      toast.dismiss(toastId);
    }
    if (bodyFileInputRef.current) bodyFileInputRef.current.value = "";
  };

  const handleBodyDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    e.preventDefault();
    setUploadingBodyImage(true);
    const toastId = toast.loading("Uploading dropped image...");
    const url = await uploadImageFile(file);
    setUploadingBodyImage(false);

    if (url) {
      const alt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      insertTextAtCursor(`\n\n![${alt}](${url})\n\n`);
      toast.success("Image dropped & inserted!", { id: toastId });
    } else {
      toast.dismiss(toastId);
    }
  };

  /* ---------------------------------------------------- PASSKEY GATE */
  if (!authenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 bg-[#F4F9F9] text-[#111111] dark:bg-[#050A0A] dark:text-white transition-colors duration-200">
        {/* Top bar controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-[#003E45] transition-colors hover:text-[#0097A7] dark:text-white/70 dark:hover:text-white"
          >
            ← Return to website
          </Link>
          <ModeToggle />
        </div>

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#003E45]/15 bg-white p-8 sm:p-10 shadow-2xl shadow-[#003E45]/10 dark:border-white/15 dark:bg-[#0E1718] dark:shadow-black/70">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#003E45] text-[#5CE1E6] shadow-md dark:bg-white/10 dark:text-[#5CE1E6]">
              <KeyRound className="size-7" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#003E45] dark:text-white">
              Mikaelson Studio
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#333333] dark:text-white/70">
              Enter your team passkey to access the editorial engine, publish blogs, and manage homepage features.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#003E45] dark:text-[#5CE1E6]">
                Team Passkey
              </label>
              <div className="relative mt-2">
                <input
                  type="password"
                  required
                  placeholder="Enter passkey (e.g. mikaelson2026)"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full rounded-xl border border-black/20 bg-[#F8FAFA] px-4 py-3 text-sm font-medium text-[#111111] placeholder:text-[#777777] transition-colors focus:border-[#003E45] focus:bg-white focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#5CE1E6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-[#003E45] px-6 text-sm font-semibold text-white transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#002B30] active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-50 dark:bg-[#5CE1E6] dark:text-[#050A0A] dark:hover:bg-[#4bcdd2]"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="size-4" aria-hidden="true" />
                  <span>Unlock Studio</span>
                </>
              )}
            </button>

            <p className="pt-2 text-center text-xs text-[#666666] dark:text-white/50">
              Passkey is managed in your project environment settings.
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- STORY EDITOR */
  if (editingPost) {
    const minutes = readingMinutes(editingPost.body);

    const insertMarkdown = (prefix: string, suffix: string = "") => {
      const textarea = document.getElementById("story-body-input") as HTMLTextAreaElement | null;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = editingPost.body?.substring(start, end) || "text";
      const before = editingPost.body?.substring(0, start) || "";
      const after = editingPost.body?.substring(end) || "";

      const newBody = `${before}${prefix}${selected}${suffix}${after}`;
      setEditingPost({ ...editingPost, body: newBody });

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      }, 50);
    };

    return (
      <div className="flex min-h-screen flex-col">
        {/* Editor Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-white/95 px-4 backdrop-blur-md sm:px-8 dark:border-white/10 dark:bg-[#0c1414]/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-xs font-semibold text-[#444] transition-colors hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>Back to Stories</span>
            </button>

            <span className="hidden text-xs font-semibold text-[#777] sm:inline dark:text-white/40">
              {isNew ? "Creating New Story" : `Editing: ${editingPost.title || "Untitled"}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden rounded-full bg-black/5 p-0.5 sm:flex dark:bg-white/10">
              <button
                type="button"
                onClick={() => setPreviewMode("edit")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  previewMode === "edit"
                    ? "bg-white text-black shadow-sm dark:bg-[#5ce1e6] dark:text-black"
                    : "text-[#666] hover:text-black dark:text-white/60 dark:hover:text-white"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("split")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  previewMode === "split"
                    ? "bg-white text-black shadow-sm dark:bg-[#5ce1e6] dark:text-black"
                    : "text-[#666] hover:text-black dark:text-white/60 dark:hover:text-white"
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("preview")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  previewMode === "preview"
                    ? "bg-white text-black shadow-sm dark:bg-[#5ce1e6] dark:text-black"
                    : "text-[#666] hover:text-black dark:text-white/60 dark:hover:text-white"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("draft")}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-black/15 px-4 text-xs font-semibold text-[#444] transition-colors hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("published")}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#003e45] px-5 text-xs font-semibold text-white shadow-sm transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#002b30] active:scale-95 disabled:opacity-50 dark:bg-[#5ce1e6] dark:text-black dark:hover:bg-[#4bcdd2]"
            >
              {saving ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span>Publish to Website</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Editor Main Canvas */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Form Editor */}
          {(previewMode === "edit" || previewMode === "split") && (
            <div
              className={`${
                previewMode === "split" ? "w-full lg:w-1/2 border-r border-black/10 dark:border-white/10" : "w-full"
              } overflow-y-auto p-6 lg:p-10 space-y-8`}
            >
              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#555] dark:text-white/70">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How We Build Daily Discipline in African Classrooms"
                    value={editingPost.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const autoSlug = newTitle
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");

                      setEditingPost({
                        ...editingPost,
                        title: newTitle,
                        slug: isNew || !editingPost.slug.current ? { current: autoSlug } : editingPost.slug,
                      });
                    }}
                    className="mt-1.5 w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 text-xl font-bold text-[#111] transition-colors focus:border-[#003e45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-[#5ce1e6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#666] dark:text-white/60">
                    URL Slug (perm-link):
                  </label>
                  <div className="mt-1 flex items-center rounded-xl border border-black/10 bg-black/[0.02] px-3.5 py-2 text-xs font-mono text-[#555] dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                    <span className="opacity-60">/blog/</span>
                    <input
                      type="text"
                      value={editingPost.slug.current}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          slug: { current: e.target.value.toLowerCase().replace(/\s+/g, "-") },
                        })
                      }
                      className="ml-1 flex-1 bg-transparent font-mono outline-none text-[#003e45] dark:text-[#5ce1e6]"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Ecosystem */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#555] dark:text-white/70">
                  Theme / Ecosystem Category
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORY_PRESETS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingPost({ ...editingPost, category: cat })}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        editingPost.category === cat
                          ? "bg-[#003e45] text-white shadow-sm dark:bg-[#5ce1e6] dark:text-black"
                          : "border border-black/10 bg-white text-[#555] hover:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/30"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Homepage Pop-up Feature Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-[#003e45]/20 bg-[#eefcfc] p-4 dark:border-white/15 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#003e45] text-[#5ce1e6] dark:bg-[#5ce1e6] dark:text-black">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#003e45] dark:text-white">
                      Feature on Homepage Pop-up
                    </p>
                    <p className="text-xs text-[#555] dark:text-white/60">
                      Displays this story in the floating announcement card when visitors land on the homepage.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={editingPost.showAsPopup}
                    onChange={(e) => setEditingPost({ ...editingPost, showAsPopup: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-black/20 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#003e45] peer-checked:after:translate-x-full dark:bg-white/20 dark:peer-checked:bg-[#5ce1e6] dark:peer-checked:after:bg-black" />
                </label>
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#555] dark:text-white/70">
                    Story Summary / Excerpt *
                  </label>
                  <span
                    className={`text-xs ${
                      (editingPost.excerpt?.length || 0) > 260
                        ? "text-rose-500 font-bold"
                        : "text-[#777] dark:text-white/40"
                    }`}
                  >
                    {editingPost.excerpt?.length || 0} / 260
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="A clear 1-2 sentence overview shown on blog cards, search engines, and social media previews..."
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-black/15 bg-white p-3.5 text-sm text-[#333] transition-colors focus:border-[#003e45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-[#5ce1e6]"
                />
              </div>

              {/* Cover Photograph */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#003E45] dark:text-[#5CE1E6]">
                    Cover Photograph
                  </label>
                  <button
                    type="button"
                    onClick={() => setCoverUrlManual(!coverUrlManual)}
                    className="text-xs font-semibold text-[#0097A7] hover:underline dark:text-[#5CE1E6]"
                  >
                    {coverUrlManual ? "Hide URL / Presets" : "Or use URL / Preset"}
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                {/* Cover Image Preview (if set) */}
                {editingPost.coverImage && (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-black/10 bg-[#F4F9F9] dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="relative h-48 w-full sm:h-56">
                      <Image
                        src={editingPost.coverImage}
                        alt="Cover image preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="truncate rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm max-w-[65%]">
                          {editingPost.coverImage.startsWith("/api/studio/media")
                            ? "Uploaded file"
                            : editingPost.coverImage}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => coverFileInputRef.current?.click()}
                            disabled={uploadingCover}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-[#003E45] shadow-sm backdrop-blur-sm transition-all hover:bg-white active:scale-95 dark:bg-[#5CE1E6] dark:text-[#050A0A]"
                          >
                            {uploadingCover ? (
                              <RefreshCw className="size-3.5 animate-spin" />
                            ) : (
                              <Upload className="size-3.5" aria-hidden="true" />
                            )}
                            <span>{uploadingCover ? "Uploading..." : "Replace"}</span>
                          </button>
                          <button
                            type="button"
                            title="Remove cover image"
                            onClick={() => setEditingPost({ ...editingPost, coverImage: "" })}
                            className="inline-flex items-center justify-center size-8 rounded-lg bg-rose-600/90 text-white backdrop-blur-sm transition-colors hover:bg-rose-700 active:scale-95"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Dropzone (if no cover image) */}
                {!editingPost.coverImage && (
                  <div
                    onClick={() => coverFileInputRef.current?.click()}
                    onDrop={handleCoverDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                      uploadingCover
                        ? "border-[#003E45] bg-[#EEFCFC]/60 dark:border-[#5CE1E6] dark:bg-white/[0.04]"
                        : "border-[#003E45]/25 bg-[#F8FAFA] hover:border-[#003E45] hover:bg-[#EEFCFC]/30 dark:border-white/20 dark:bg-white/[0.02] dark:hover:border-[#5CE1E6]"
                    }`}
                  >
                    {uploadingCover ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <RefreshCw className="size-8 animate-spin text-[#003E45] dark:text-[#5CE1E6]" />
                        <p className="text-sm font-bold text-[#003E45] dark:text-white">
                          Uploading image to database...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#003E45]/10 text-[#003E45] dark:bg-[#5CE1E6]/15 dark:text-[#5CE1E6]">
                          <Upload className="size-6" />
                        </div>
                        <p className="mt-3 text-sm font-bold text-[#003E45] dark:text-white">
                          Click to upload cover image, or drag & drop here
                        </p>
                        <p className="mt-1 text-xs text-[#666] dark:text-white/60">
                          PNG, JPG, WebP, GIF or SVG (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Expandable Manual URL / Presets */}
                {coverUrlManual && (
                  <div className="mt-3 rounded-2xl border border-black/10 bg-[#FAFDFD] p-4 dark:border-white/10 dark:bg-white/[0.02]">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#666] dark:text-white/60">
                      Direct Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or /assets/images/..."
                      value={editingPost.coverImage || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-[#111] focus:border-[#003E45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white"
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-[#777] dark:text-white/40">Presets:</span>
                      {SAMPLE_COVERS.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setEditingPost({ ...editingPost, coverImage: sample.url })}
                          className="rounded-lg border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-[#555] hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[#555] dark:text-white/70">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Michael Segun or Mikaelson Editorial Team"
                    value={editingPost.author?.name || ""}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        author: { ...editingPost.author, name: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-[#333] focus:border-[#003e45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#555] dark:text-white/70">Author Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & Initiative Lead, Facilitator"
                    value={editingPost.author?.role || ""}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        author: { ...editingPost.author, role: e.target.value, name: editingPost.author?.name || "Mikaelson Initiative" },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2 text-sm text-[#333] focus:border-[#003e45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Body Markdown Content */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#555] dark:text-white/70">
                    Story Content (Markdown)
                  </label>
                  <span className="text-xs text-[#777] dark:text-white/40">{minutes} min read</span>
                </div>

                {/* Markdown Toolbar */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-t-xl border border-b-0 border-black/15 bg-black/[0.03] p-2 dark:border-white/15 dark:bg-white/5">
                  <button
                    type="button"
                    title="Heading 2"
                    onClick={() => insertMarkdown("## ")}
                    className="rounded px-2 py-1 text-xs font-bold text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    title="Heading 3"
                    onClick={() => insertMarkdown("### ")}
                    className="rounded px-2 py-1 text-xs font-bold text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    H3
                  </button>
                  <span className="h-4 w-px bg-black/15 dark:bg-white/15" />
                  <button
                    type="button"
                    title="Bold"
                    onClick={() => insertMarkdown("**", "**")}
                    className="rounded px-2 py-1 text-xs font-bold text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    onClick={() => insertMarkdown("*", "*")}
                    className="rounded px-2 py-1 text-xs italic text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    title="Quote"
                    onClick={() => insertMarkdown("> ")}
                    className="rounded px-2 py-1 text-xs text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Quote
                  </button>
                  <span className="h-4 w-px bg-black/15 dark:bg-white/15" />
                  <button
                    type="button"
                    title="Bullet List"
                    onClick={() => insertMarkdown("- ")}
                    className="rounded px-2 py-1 text-xs text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    title="Numbered List"
                    onClick={() => insertMarkdown("1. ")}
                    className="rounded px-2 py-1 text-xs text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    1. List
                  </button>
                  <span className="h-4 w-px bg-black/15 dark:bg-white/15" />
                  <button
                    type="button"
                    title="Insert Link"
                    onClick={() => insertMarkdown("[link text](", ")")}
                    className="rounded px-2 py-1 text-xs text-[#444] hover:bg-black/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    Link
                  </button>

                  <span className="h-4 w-px bg-black/15 dark:bg-white/15" />

                  {/* Hidden File Input for Story Body Images */}
                  <input
                    ref={bodyFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                    onChange={handleBodyImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    title="Upload and insert an image into the story"
                    disabled={uploadingBodyImage}
                    onClick={() => bodyFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold text-[#003E45] hover:bg-[#003E45]/10 dark:text-[#5CE1E6] dark:hover:bg-white/10"
                  >
                    {uploadingBodyImage ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    <span>{uploadingBodyImage ? "Uploading..." : "Upload Image"}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    id="story-body-input"
                    rows={14}
                    placeholder="Write your story using markdown... (Tip: You can drag & drop images directly onto this box!)"
                    value={editingPost.body || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleBodyDrop}
                    className="w-full rounded-b-xl border border-black/15 bg-white p-4 font-mono text-sm leading-relaxed text-[#222] transition-colors focus:border-[#003E45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:focus:border-[#5CE1E6]"
                  />

                  {uploadingBodyImage && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-b-xl bg-white/70 backdrop-blur-[2px] dark:bg-black/70">
                      <div className="flex items-center gap-2 rounded-full bg-[#003E45] px-4 py-2 text-xs font-semibold text-white shadow-lg dark:bg-[#5CE1E6] dark:text-[#050A0A]">
                        <RefreshCw className="size-4 animate-spin" />
                        <span>Uploading image into article...</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-1.5 text-[11px] text-[#777] dark:text-white/40">
                  Tip: Use the <strong>Upload Image</strong> button or drag and drop images directly into the text editor.
                </p>
              </div>
            </div>
          )}

          {/* Right Live Preview Canvas */}
          {(previewMode === "preview" || previewMode === "split") && (
            <div
              className={`${
                previewMode === "split" ? "hidden lg:block lg:w-1/2" : "w-full"
              } overflow-y-auto bg-white p-8 lg:p-12 dark:bg-[#050a0a]`}
            >
              <div className="mx-auto max-w-[720px]">
                <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7f8] px-3 py-1 text-xs font-semibold text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                    <Eye className="size-3.5" aria-hidden="true" />
                    <span>Live Website Preview</span>
                  </span>
                  <span className="text-xs font-semibold text-[#777] dark:text-white/50">{minutes} min read</span>
                </div>

                {editingPost.coverImage ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#e8f7f8] dark:bg-white/5">
                    <Image
                      src={editingPost.coverImage}
                      alt={editingPost.title}
                      fill
                      sizes="720px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-[#666] dark:text-white/60">
                  {editingPost.category ? (
                    <span className="rounded-full bg-[#e8f7f8] px-2.5 py-0.5 text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                      {editingPost.category}
                    </span>
                  ) : null}
                  <span>By {editingPost.author?.name || "Mikaelson Initiative"}</span>
                  <span>•</span>
                  <span>{formatDate(editingPost.publishedAt, "long")}</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#003e45] dark:text-white">
                  {editingPost.title || "Untitled Story"}
                </h1>

                {editingPost.excerpt ? (
                  <p className="mt-4 text-lg leading-relaxed text-[#555] dark:text-white/60">
                    {editingPost.excerpt}
                  </p>
                ) : null}

                <hr className="my-8 border-black/10 dark:border-white/10" />

                <ArticleBody body={editingPost.body || "Start typing your story on the left to see it render here live..."} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------- STORIES DASHBOARD */
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftsCount = posts.filter((p) => p.status === "draft").length;
  const popupPost = posts.find((p) => p.showAsPopup);

  return (
    <div className="min-h-screen">
      {/* Studio Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#0c1414]/95">
        <div className="mx-auto flex h-18 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#003e45] text-white shadow-sm dark:bg-[#5ce1e6] dark:text-black">
                <span className="font-extrabold text-base">M</span>
              </div>
              <div>
                <p className="font-extrabold text-base leading-none text-[#003e45] dark:text-white">
                  Mikaelson Studio
                </p>
                <p className="text-[11px] font-semibold text-[#0097a7] dark:text-[#5ce1e6]">
                  Editorial & Story Engine
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#444] transition-colors hover:bg-black/5 dark:border-white/15 dark:text-white/80 dark:hover:bg-white/10"
            >
              <span>View Live Blog</span>
              <ExternalLink className="size-3" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#003e45] px-5 text-xs font-semibold text-white shadow-sm transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#002b30] active:scale-95 motion-reduce:active:scale-100 dark:bg-[#5ce1e6] dark:text-black dark:hover:bg-[#4bcdd2]"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>Write Story</span>
            </button>

            <ModeToggle />

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out of Studio"
              className="inline-flex size-10 items-center justify-center rounded-full text-[#666] transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="mx-auto max-w-[1240px] px-4 py-10 sm:px-8">
        {/* Metric Badges */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c1414]">
            <p className="text-xs font-semibold text-[#666] dark:text-white/60">Published Stories</p>
            <p className="mt-2 text-3xl font-extrabold text-[#003e45] dark:text-[#5ce1e6]">
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c1414]">
            <p className="text-xs font-semibold text-[#666] dark:text-white/60">Drafts</p>
            <p className="mt-2 text-3xl font-extrabold text-[#777] dark:text-white/50">{draftsCount}</p>
          </div>

          <div className="rounded-2xl border border-[#003e45]/20 bg-[#eefcfc] p-5 shadow-sm dark:border-white/15 dark:bg-white/5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-[#003e45] dark:text-[#5ce1e6]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Homepage Pop-up Story</span>
            </p>
            <p className="mt-2 truncate text-base font-bold text-[#111] dark:text-white">
              {popupPost ? popupPost.title : "Defaulting to latest"}
            </p>
          </div>
        </div>

        {/* Stories Management Card */}
        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-[#0c1414]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
              <input
                type="text"
                placeholder="Search stories by title or excerpt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-black/15 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#111] focus:border-[#003e45] focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:focus:border-[#5ce1e6]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#003e45] text-white dark:bg-[#5ce1e6] dark:text-black"
                    : "text-[#666] hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                All ({posts.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#003e45] text-white dark:bg-[#5ce1e6] dark:text-black"
                      : "text-[#666] hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stories List Table / Cards */}
          <div className="mt-8 space-y-3">
            {loadingPosts ? (
              <div className="py-16 text-center text-sm text-[#777] dark:text-white/50">
                <RefreshCw className="mx-auto size-6 animate-spin text-[#003e45] dark:text-[#5ce1e6]" />
                <p className="mt-3">Loading your stories...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/15 p-12 text-center dark:border-white/15">
                <p className="text-base font-bold text-[#111] dark:text-white">No stories found</p>
                <p className="mt-1 text-xs text-[#666] dark:text-white/50">
                  {search ? "Try clearing your search query." : "Write your first story to get started."}
                </p>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#003e45] px-5 py-2 text-xs font-semibold text-white dark:bg-[#5ce1e6] dark:text-black"
                >
                  <Plus className="size-3.5" />
                  <span>Write a Story</span>
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const minutes = readingMinutes(post.body);
                const liveUrl = `/blog/${post.slug.current}`;

                return (
                  <div
                    key={post._id}
                    className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 transition-colors hover:border-[#5ce1e6] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:hover:border-[#5ce1e6]"
                  >
                    <div className="flex items-start gap-4">
                      {post.coverImage ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#e8f7f8] dark:bg-white/5">
                          <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {post.category ? (
                            <span className="rounded-full bg-[#e8f7f8] px-2.5 py-0.5 text-[11px] font-semibold text-[#003e45] dark:bg-white/10 dark:text-[#5ce1e6]">
                              {post.category}
                            </span>
                          ) : null}

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              post.status === "published"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-black/10 text-[#666] dark:bg-white/10 dark:text-white/60"
                            }`}
                          >
                            {post.status || "published"}
                          </span>

                          {post.showAsPopup ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                              <Sparkles className="size-3" aria-hidden="true" />
                              <span>Homepage Pop-up</span>
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-1 font-bold text-base text-[#111] dark:text-white">
                          {post.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-3 text-xs text-[#666] dark:text-white/50">
                          <span>By {post.author?.name || "Mikaelson Initiative"}</span>
                          <span>•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{minutes} min read</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePopup(post)}
                        title={
                          post.showAsPopup
                            ? "Remove from homepage pop-up"
                            : "Feature in homepage pop-up banner"
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          post.showAsPopup
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            : "border border-black/10 text-[#666] hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10"
                        }`}
                      >
                        <Sparkles className="size-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">
                          {post.showAsPopup ? "Featured Pop-up" : "Set as Pop-up"}
                        </span>
                      </button>

                      <Link
                        href={liveUrl}
                        target="_blank"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-black/10 text-[#555] hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
                        title="View live article"
                      >
                        <ExternalLink className="size-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-[#003e45] text-white hover:bg-[#002b30] dark:bg-[#5ce1e6] dark:text-black dark:hover:bg-[#4bcdd2]"
                        title="Edit story"
                      >
                        <FileEdit className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(post._id, post.title)}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-black/10 text-[#888] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        title="Delete story"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
