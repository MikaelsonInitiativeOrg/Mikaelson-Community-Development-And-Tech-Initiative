// Shared class strings for the Labs test page. Named transition properties
// only, press feedback at scale(0.97), no hover growth.

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] " +
  "active:scale-[0.97] motion-reduce:active:scale-100 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]";

export const buttonPrimary = `${base} bg-[#5CE1E6] text-black hover:bg-[#7fe8ec]`;

export const buttonOutline =
  `${base} border border-[#003E45]/30 text-[#003E45] hover:border-[#003E45] ` +
  "dark:border-white/25 dark:text-white dark:hover:border-white/70";

export const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";
