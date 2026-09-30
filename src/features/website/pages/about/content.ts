// Everything on the About page, taken from the old about components
// (about-header, about-organisation, our-story, what-we-do, sdg-section,
// team-section, join-section) and the home page's ecosystem
// tabs. Same facts and meaning; only the wording is warmer in places.

export const PROMISES = [
  {
    title: "Our mission",
    text: "To empower African communities through innovative technology solutions, quality education, and sustainable development programs that foster economic growth and social progress.",
  },
  {
    title: "Our vision",
    text: "A thriving Africa where every community has access to technology, education, and opportunities that enable them to build prosperous, sustainable futures.",
  },
  {
    title: "Our values",
    text: "Innovation, community collaboration, sustainability, integrity, and empowerment drive everything we do as we work to transform Africa's future.",
  },
];

export const STORY = [
  "The Mikaelson Initiative was born from a deeply personal struggle. Our founder, Oluwasegun Olukayode, discovered a critical problem that was holding him back as both a student and an individual: procrastination, losing focus, and lacking a structured, purposeful life. These challenges were not just academic setbacks; they were barriers that prevented him from reaching his full potential and living the impactful life he envisioned.",
  "Recognising that he wasn't alone, Oluwasegun realised that countless other African students were facing the same challenges: brilliant minds held back by a lack of structure, focus, and intentional personal development. That realisation sparked a mission to create something bigger than himself.",
  "What began as one person's journey to overcome procrastination and build a focused, structured life has grown into a movement reaching thousands of students across multiple universities. Today, the Mikaelson Initiative stands for hope, possibility and action: changing not just individuals, but building a better Africa, one student at a time.",
];

export type EcosystemPart = {
  id: string;
  name: string;
  badge: string;
  text: string;
  problem: string;
  solution: string;
  highlights: string[];
  cta: { label: string; href: string; external?: boolean };
};

// The four parts of the ecosystem, detailing the structural problems we solve.
export const PARTS: EcosystemPart[] = [
  {
    id: "school-club",
    name: "Mikaelson School Club",
    badge: "Secondary Schools & Universities",
    text: "Brings intentional habit systems, student leadership, and peer accountability directly into schools where young Africans learn every day.",
    problem:
      "Across Africa, students face severe procrastination, academic drift, and a complete absence of structured personal development. Traditional education emphasizes exam memorization, leaving young people without daily discipline habits, emotional resilience, or peer accountability to build purposeful lives.",
    solution:
      "We establish student-led Mikaelson School Clubs directly within secondary schools and universities. Through structured weekly sessions, habit-building frameworks, leadership curriculums, and peer circles, we build personal discipline and character where students already spend their days.",
    highlights: [
      "Student-led weekly sessions on habit building & time mastery",
      "Peer accountability circles that keep students from drifting",
      "Campus-wide cultural shift from passive learning to proactive leadership",
    ],
    cta: { label: "Start a School Club", href: "https://club.mikaelsoninitiative.org", external: true },
  },
  {
    id: "institute",
    name: "Mikaelson Institute for African Studies",
    badge: "Pan-African Research & Scholarship",
    text: "Our pan-African research institute publishing original scholarship to reclaim African intellectual thought and shape continental policy.",
    problem:
      "African history, intellectual systems, and public policy have long been dominated by foreign paradigms and external institutions. Young African scholars and students lack accessible, credible platforms to publish rigorous research, interrogate colonial legacies, and develop indigenous solutions for continental governance.",
    solution:
      "A dedicated academic research institute producing peer-reviewed scholarship across four foundational areas: History & Decolonization, Society & Politics, Arts & Culture, and Religion & Philosophy. Through our Call for Papers, Ubuntu Fellowship, and research library, we empower young Africans to lead continental discourse from within.",
    highlights: [
      "Peer-reviewed scholarship across 4 key African disciplines",
      "Open Call for Papers for emerging students and African researchers",
      "The Ubuntu Program and a growing open-access African library",
    ],
    cta: { label: "Visit the Institute", href: "https://institute.mikaelsoninitiative.org", external: true },
  },
  {
    id: "labs",
    name: "Mikaelson Labs",
    badge: "Innovation Hub & Applied Tech",
    text: "Our experimental engineering space where bold ideas turn into production-grade software addressing authentic African socioeconomic challenges.",
    problem:
      "A massive divide separates theoretical classroom learning from practical technological execution. Talented young Africans frequently lack engineering labs, technical mentorship, and product incubation environments to transform their ideas into functional software that solves real African problems.",
    solution:
      "An experimental engineering environment where students transition from passive learners into builders. Teams collaborate on practical, real-world software—including RIO AI (intelligent habit tracking and accountability) and Rental Hub (verified, transparent housing access for Nigerian cities).",
    highlights: [
      "Hands-on software development, UI/UX design, and AI tooling",
      "Incubating homegrown solutions like RIO AI & Rental Hub",
      "Bridging the skills gap for high-impact African tech careers",
    ],
    cta: { label: "Explore Mikaelson Labs", href: "/labs", external: false },
  },
  {
    id: "network",
    name: "Partnership & Growth Network",
    badge: "Mentorship & Institutional Alliances",
    text: "Connects emerging changemakers with mentors, corporate partners, and academic institutions so individual growth scales into community-wide progress.",
    problem:
      "Isolated ambition and systemic opportunity ceilings. Ambitious young Africans with remarkable potential frequently stall because they lack direct access to seasoned industry leaders, institutional networks, funding pathways, and collaborative ecosystems necessary to scale their impact.",
    solution:
      "We forge strategic alliances between students, academic institutions, corporate partners, and civic organizations. By pairing students with dedicated mentors, sponsorships, and real-world opportunities, we turn individual growth into collective progress across African communities.",
    highlights: [
      "Mentorship pairing with seasoned professionals and leaders",
      "Institutional partnerships connecting schools and corporate allies",
      "Sponsorship and funding pathways that back promising youth",
    ],
    cta: { label: "Partner with Us", href: "/contact", external: false },
  },
];

export const SDGS = [
  {
    goal: 4,
    name: "Quality Education",
    text: "Empowering students and educators with technology-driven learning solutions and productivity tools.",
  },
  {
    goal: 8,
    name: "Decent Work & Economic Growth",
    text: "Creating opportunities for skill development and fostering entrepreneurship in African communities.",
  },
  {
    goal: 9,
    name: "Industry, Innovation & Infrastructure",
    text: "Building innovative technology solutions and digital infrastructure for sustainable development.",
  },
  {
    goal: 11,
    name: "Sustainable Cities & Communities",
    text: "Fostering community collaboration and building sustainable, inclusive local ecosystems.",
  },
  {
    goal: 17,
    name: "Partnerships for the Goals",
    text: "Building strategic partnerships with organisations, institutions and communities for collective impact.",
  },
];
