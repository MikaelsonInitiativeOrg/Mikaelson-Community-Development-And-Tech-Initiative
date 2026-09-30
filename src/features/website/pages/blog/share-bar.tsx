"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareBarProps {
  title: string;
  slug: string;
  excerpt?: string;
  className?: string;
}

export function ShareBar({ title, slug, excerpt, className = "" }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  // Canonical full URL for sharing across the web
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://mikaelsoninitiative.org";
  const shareUrl = `${siteUrl}/blog/${slug}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} — Mikaelson Initiative`);
  const encodedSummary = excerpt ? encodeURIComponent(excerpt) : "";

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied! Ready to share across the net.", {
          duration: 3000,
        });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Could not copy link to clipboard.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const shareLinks = [
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&via=mcdti_org`,
      icon: (
        <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} \n${shareUrl}`)}`,
      icon: (
        <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
        </svg>
      ),
      color: "hover:bg-[#25D366] hover:text-white dark:hover:bg-[#25D366] dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      color: "hover:bg-[#0A66C2] hover:text-white dark:hover:bg-[#0A66C2] dark:hover:text-white",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      color: "hover:bg-[#1877F2] hover:text-white dark:hover:bg-[#1877F2] dark:hover:text-white",
    },
  ];

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#003e45] dark:text-[#5ce1e6]">
        <Share2 className="size-4" aria-hidden="true" />
        <span>Share to the World</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {shareLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${item.name}`}
            aria-label={`Share on ${item.name}`}
            className={`inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#444] transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 motion-reduce:active:scale-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 ${item.color}`}
          >
            {item.icon}
          </a>
        ))}

        <button
          type="button"
          onClick={handleCopy}
          title="Copy direct story link"
          aria-label="Copy direct story link"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 text-xs font-semibold text-[#003e45] transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#003e45] active:scale-95 motion-reduce:active:scale-100 dark:border-white/10 dark:bg-white/5 dark:text-[#5ce1e6] dark:hover:border-[#5ce1e6]"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              <span>Copy link</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNativeShare}
          className="hidden sm:inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#003e45] px-3.5 text-xs font-semibold text-white transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#002b30] active:scale-95 motion-reduce:active:scale-100 dark:bg-[#5ce1e6] dark:text-[#050a0a]"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
