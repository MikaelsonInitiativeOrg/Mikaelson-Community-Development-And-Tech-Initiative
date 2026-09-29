// Button classes: named transition properties, press feedback, no hover growth.
const base =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-base font-semibold " +
  "transition-[transform,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] " +
  "active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0097A7]";

export const btn = {
  // Turquoise with black text (13:1).
  primary: `${base} bg-[#5CE1E6] text-black hover:bg-[#4fd3d8]`,
  // Deep teal with white text (11.8:1).
  dark: `${base} bg-[#003E45] text-white hover:bg-[#00525b] dark:bg-white dark:text-[#003E45] dark:hover:bg-[#EEFCFC]`,
  outline: `${base} border border-[#003E45]/25 text-[#003E45] hover:border-[#003E45] dark:border-white/25 dark:text-white dark:hover:border-white`,
};
