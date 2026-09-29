// Shared classes for the About page, from the redesign tokens.
export const h2 =
  "text-[28px] leading-tight font-bold tracking-[-0.02em] text-[#003E45] md:text-[40px] dark:text-white";
export const body = "text-base leading-[1.7] text-[#555] sm:text-[18px] dark:text-white/65";
export const wrap = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]";
const shape =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] " +
  "active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2";
const base = `${shape} focus-visible:outline-[#0097A7]`;

export const btn = {
  primary: `${base} bg-[#5CE1E6] text-black hover:bg-[#7fe8ec]`,
  dark: `${base} bg-[#003E45] text-white hover:bg-[#00525b] dark:bg-white dark:text-[#003E45] dark:hover:bg-[#EEFCFC]`,
  // On the deep teal band the focus ring is turquoise, so it stays visible.
  primaryOnTeal: `${shape} focus-visible:outline-[#5CE1E6] bg-[#5CE1E6] text-black hover:bg-[#7fe8ec]`,
  onTeal: `${shape} focus-visible:outline-[#5CE1E6] border border-white/35 text-white hover:border-white`,
};

// Inline text links (min 44px tap height via padding).
export const textLink =
  `inline-flex min-h-11 items-center gap-1.5 font-semibold text-[#003E45] underline decoration-[#5CE1E6] decoration-2 underline-offset-4 ` +
  `transition-colors duration-150 hover:decoration-[#003E45] dark:text-[#5CE1E6] dark:hover:decoration-[#5CE1E6] rounded-sm ${focus}`;
