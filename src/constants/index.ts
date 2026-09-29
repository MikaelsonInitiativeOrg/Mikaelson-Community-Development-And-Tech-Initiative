export interface TeamMember {
  name: string;
  country: string;
  role: string;
  img: string;
  department?: FilterType;
}

// Filter options
export const FILTERS = {
  ALL: "All",
  BOARD: "Board & Advisory",
  LEADS: "Team Leads",
  OPERATIONS: "Operations",
  TECH: "Tech team",
  DESIGN: "Design team",
} as const;


export type FilterType = keyof typeof FILTERS;

// Team data
export const TEAM_MEMBERS: TeamMember[] = [

  // ── Board & Advisory ────────────────────────────────────
  {
    name: "Michael S. Olukayode",
    department: "BOARD",
    country: "NG",
    role: "President, Board of Trustees",
    img: "/assets/images/MichaelOlukayode.jpg",
  },
  {
    name: "Khadijah Abdul Juma",
    department: "BOARD",
    country: "KE",
    role: "Advisor on Partnership and Growth Network",
    img: "/assets/images/Khadija-Abdul.png",
  },
  {
    name: "Imam Bashir Abdulwahab",
    department: "BOARD",
    country: "NG",
    role: "Secretary, Board of Trustees",
    img: "/assets/images/Imam-Bashir.JPG",
  },

  // ── Team Leads ──────────────────────────────────────────
  {
    name: "Oluwole Feranmi",
    department: "LEADS",
    role: "Operations Manager",
    country: "NG",
    img: "/assets/images/FeranmiOluwole.JPG",
  },

  // ── Operations ──────────────────────────────────────────
  {
    name: "Irene Chidinma Ezechi",
    department: "OPERATIONS",
    country: "NG",
    role: "Regional Program manager",
    img: "/assets/images/Irene-Ezechi.jpg",
  },
  {
    name: "Mariam Jimoh",
    department: "OPERATIONS",
    country: "NG",
    role: "ESG & Impact Lead",
    img: "/assets/images/MariamJimoh.jpeg",
  },
  {
    name: "Olusola Blessing",
    department: "OPERATIONS",
    country: "NG",
    role: "Technical Content Writer",
    img: "/assets/images/BlessingOlusola.jpeg",
  },

  // ── Tech Team ────────────────────────────────────────────
  {
    name: "Iretioluwa Ogunmola",
    department: "TECH",
    country: "NG",
    role: "Product Management Lead",
    img: "/assets/images/Ireti.jpeg",
  },
  {
    name: "Olatunji-Aresa A. Olamide",
    department: "TECH",
    country: "NG",
    role: "Frontend Engineer",
    img: "/assets/images/AriyoAresa.jpg",
  },
  {
    name: "Boluwatife Adeleke",
    department: "TECH",
    country: "NG",
    role: "Product Marketing Manager",
    img: "/assets/images/Boluwatife-Mercy.jpeg",
  },
  {
    name: "Theresa Gyamfi",
    department: "TECH",
    country: "GH",
    role: "GRC Analyst & Policy Engineer",
    img: "/assets/images/AsieduGyamfi.png",
  },
  {
    name: "Obochi Happiness Adah",
    department: "TECH",
    country: "NG",
    role: "Backend Engineer",
    img: "/assets/images/HappinessObochi.jpg",
  },
  {
    name: "Abayomi Favour",
    department: "TECH",
    country: "NG",
    role: "Mobile Developer",
    img: "/assets/images/FavourAbayomi.jpg",
  },
  {
    name: "Maxwell Oba-Joshua",
    department: "TECH",
    country: "NG",
    role: "Full-Stack Engineer",
    img: "/assets/images/MaxwellJoshua.jpg",
  },
  {
    name: "Olamilekan J. Aremu",
    department: "TECH",
    country: "NG",
    role: "Full-Stack Engineer",
    img: "/assets/images/OlamilekanAremu.jpg",
  },
  {
    name: "Adeoye Esther Toluwanimi",
    department: "TECH",
    country: "NG",
    role: "Social Media Relations",
    img: "/assets/images/AdeoyeEsther.jpg",
  },

  // ── Design Team ──────────────────────────────────────────
  {
    name: "Mercy Kalu",
    department: "DESIGN",
    country: "NG",
    role: "Product Designer",
    img: "/assets/images/MercyKalu.jpg",
  },
  {
    name: "Abraham Ekundayo",
    department: "DESIGN",
    country: "NG",
    role: "Product Designer",
    img: "/assets/images/AbrahamEkundayo.jpeg",
  },
  {
    name: "Idowu Ayomide Victor",
    department: "DESIGN",
    country: "NG",
    role: "Graphic Designer",
    img: "/assets/images/AyomideIdowu.jpg",
  },
  {
    name: "Beloved-John Adejumo",
    department: "DESIGN",
    country: "NG",
    role: "Graphic Designer",
    img: "/assets/images/Beloved-john.jpg",
  },
  {
    name: "Ayegbusi Bright Temitope",
    department: "DESIGN",
    country: "NG",
    role: "Graphic Designer",
    img: "/assets/images/AyegbusiBright.jpg",
  },
];
