// Copy from the redesigned Mikaelson Initiative ecosystem.
// Questions reflect the four parts of the ecosystem (School Club, Labs,
// Network, Institute), the founder's mission, habits, SDGs, and ways to take part.
// Shared with the Help Center's search.

export type FaqGroup = "about" | "ecosystem" | "taking-part";

export type FaqLink = { label: string; href: string; external?: boolean };

export type FaqItem = {
  /** Anchor on /faq, e.g. /faq#membership-fee. */
  id: string;
  group: FaqGroup;
  question: string;
  paragraphs: string[];
  list?: string[];
  links?: FaqLink[];
};

export const FAQ_GROUPS: { id: FaqGroup | "all"; label: string }[] = [
  { id: "all", label: "All questions" },
  { id: "about", label: "About us" },
  { id: "ecosystem", label: "Our ecosystem" },
  { id: "taking-part", label: "Taking part" },
];

export const FAQS: FaqItem[] = [
  /* ----------------------------------------------------------- About us */
  {
    id: "what-is-the-initiative",
    group: "about",
    question: "What is the Mikaelson Initiative, and what does it stand for?",
    paragraphs: [
      "The Mikaelson Initiative is a youth and community development non-profit headquartered in Lagos, Nigeria. We are dedicated to building the habits, knowledge, communities, and capacity behind the people who will build what Africa becomes.",
      "Born from our founder's personal journey to overcome procrastination and a lack of structure, we build practical systems for human development, education, technology, and African scholarship that help students grow as leaders and keep each other going.",
    ],
    list: [
      "Innovation: Crafting practical solutions for real African challenges",
      "Community collaboration: Fostering peer accountability and collective progress",
      "Sustainability: Developing long-term habits and enduring institutions",
      "Integrity: Upholding safety, ethical standards, and transparency",
      "Empowerment: Putting resources and mentors directly beside young people",
    ],
    links: [
      { label: "Learn more about us", href: "/about-us" },
      { label: "Meet our team", href: "/team" },
    ],
  },
  {
    id: "who-we-serve",
    group: "about",
    question: "Who is the Initiative for, and where do you operate?",
    paragraphs: [
      "We serve secondary school and university students, young innovators, and emerging changemakers across Africa. Some have an idea they cannot stop thinking about; others are searching for structure, discipline, and community. What they share is a desire to grow.",
      "Headquartered in Lagos, Nigeria, our programs and school clubs operate across Nigerian schools and campuses, with expanding pan-African chapters and networks in Kenya, Ghana, and beyond.",
    ],
    links: [
      { label: "Explore who we serve", href: "/#who-we-serve" },
    ],
  },
  {
    id: "independence-identity",
    group: "about",
    question: "Is the Mikaelson Initiative affiliated with other organizations or brands?",
    paragraphs: [
      "No. The Mikaelson Initiative is an independent, non-partisan, non-profit institution. It is not affiliated with, funded by, or connected to any external entertainment entities, commercial franchises, or other organizations sharing the Mikaelson name.",
      "Everything we build is dedicated strictly to youth leadership, African education, community advancement, and research.",
    ],
    links: [
      { label: "Read our story", href: "/about-us" },
    ],
  },
  {
    id: "sdgs-global-goals",
    group: "about",
    question: "What global goals does the Initiative work towards?",
    paragraphs: [
      "Our initiatives and community programs directly advance five United Nations Sustainable Development Goals (SDGs):",
    ],
    list: [
      "SDG 4 (Quality Education): Technology-driven learning solutions, habit formation, and leadership systems.",
      "SDG 8 (Decent Work & Economic Growth): Skill development, student entrepreneurship, and career mentorship.",
      "SDG 9 (Industry, Innovation & Infrastructure): Real-world technology products built inside Mikaelson Labs.",
      "SDG 11 (Sustainable Cities & Communities): Inclusive local campus and city communities that support one another.",
      "SDG 17 (Partnerships for the Goals): Uniting schools, mentors, and corporate allies for collective impact.",
    ],
    links: [
      { label: "See our SDG commitments", href: "/about-us#global-goals" },
    ],
  },
  {
    id: "contact-the-team",
    group: "about",
    question: "How can I contact the Mikaelson Initiative team?",
    paragraphs: [
      "You can reach us through our letter-style contact form, by writing directly to hello@mikaelsoninitiative.org, or through our official social media channels. We are always glad to hear from students, educators, and potential partners.",
    ],
    links: [
      { label: "Send a message", href: "/contact" },
      { label: "Email hello@mikaelsoninitiative.org", href: "mailto:hello@mikaelsoninitiative.org" },
    ],
  },

  /* ------------------------------------------------------- Our Ecosystem */
  {
    id: "what-is-the-ecosystem",
    group: "ecosystem",
    question: "What is the Mikaelson ecosystem, and what are its four parts?",
    paragraphs: [
      "The Mikaelson Initiative is built as one integrated ecosystem with four specialized parts, designed to support young Africans at every stage of their personal and intellectual journey:",
    ],
    list: [
      "Mikaelson School Club: Student-led campus clubs building discipline, peer accountability, and intentional habits in schools.",
      "Mikaelson Labs: The innovation hub where student ideas turn into functional technology and practical solutions.",
      "Partnership & Growth Network: Strategic connections with schools, corporate partners, and mentors to scale impact.",
      "Mikaelson Institute: Pan-African academic research and scholarship exploring Africa's past, present, and future.",
    ],
    links: [
      { label: "Explore the ecosystem", href: "/#our-ecosystem" },
    ],
  },
  {
    id: "school-club",
    group: "ecosystem",
    question: "What is the Mikaelson School Club, and how does it work?",
    paragraphs: [
      "The Mikaelson School Club brings the Initiative's values directly into secondary schools and university campuses through student-led chapters.",
      "Members meet weekly for structured sessions focused on habits, personal discipline, leadership, and peer accountability. It serves as the bridge between individual transformation and institutional culture change, starting where students already learn.",
    ],
    links: [
      { label: "Visit the School Club website", href: "https://club.mikaelsoninitiative.org", external: true },
    ],
  },
  {
    id: "mikaelson-labs",
    group: "ecosystem",
    question: "What is Mikaelson Labs, and what projects are being built?",
    paragraphs: [
      "Mikaelson Labs is our innovation hub where students move from passive learning to hands-on execution. It offers an experimental environment for developing skills in software, design, and problem-solving to address real-world African challenges.",
      "Current projects in active development include RIO AI (an intelligent habit-tracking and accountability platform for students) and Rental Hub (a verified housing platform for Nigerian cities).",
    ],
    links: [
      { label: "Explore Mikaelson Labs", href: "/labs" },
    ],
  },
  {
    id: "mikaelson-institute",
    group: "ecosystem",
    question: "What is the Mikaelson Institute for African Studies?",
    paragraphs: [
      "The Mikaelson Institute is our pan-African academic research institute, publishing scholarship across four core areas: History & Decolonization, Society & Politics, Arts & Culture, and Religion & Philosophy.",
      "The Institute invites student and scholar submissions through a Call for Papers, hosts the Ubuntu Program, and maintains a growing library so young Africans can learn, read, and contribute to African thought.",
    ],
    links: [
      { label: "Visit the Mikaelson Institute", href: "https://institute.mikaelsoninitiative.org", external: true },
    ],
  },
  {
    id: "partnership-network",
    group: "ecosystem",
    question: "What is the Partnership & Growth Network?",
    paragraphs: [
      "The Partnership & Growth Network connects students and emerging leaders with mentors, academic institutions, and corporate organizations.",
      "It provides access to career opportunities, resources, and collaborative environments that accelerate growth, ensuring individual personal development turns into collective progress across African communities.",
    ],
    links: [
      { label: "Partner with us", href: "/contact" },
      { label: "Become a sponsor", href: "/sponsor" },
    ],
  },

  /* -------------------------------------------------------- Taking part */
  {
    id: "how-to-join",
    group: "taking-part",
    question: "How can I join or participate in the Mikaelson Community?",
    paragraphs: [
      "Participation is open to any student, educator, or young professional in Africa who is committed to personal growth, discipline, and community impact.",
      "There are multiple ways to get involved depending on what you wish to do:",
    ],
    list: [
      "Join or launch a Mikaelson School Club chapter at your school or university.",
      "Collaborate on practical tech projects inside Mikaelson Labs.",
      "Read library resources or submit research papers to the Mikaelson Institute.",
      "Apply to volunteer your skills and mentor students with our operations, tech, or design teams.",
    ],
    links: [
      { label: "Start a School Club", href: "https://club.mikaelsoninitiative.org", external: true },
      { label: "Volunteer with us", href: "/volunteer" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    id: "membership-fee",
    group: "taking-part",
    question: "Is there any membership fee or cost to participate?",
    paragraphs: [
      "No. Joining the Mikaelson School Club, participating in community sessions, and accessing core programs is completely free.",
      "We believe in making personal development, habit leadership, and community support accessible to all students across Africa, regardless of financial background.",
    ],
  },
  {
    id: "start-a-club",
    group: "taking-part",
    question: "How can a student or school start a Mikaelson School Club?",
    paragraphs: [
      "Any student leader or educator can start an official chapter on their campus. We provide the complete club framework: session templates, habit leadership curriculums, peer accountability systems, and continuous mentorship from our team.",
      "To get started, visit the School Club portal or reach out through our contact page to request the chapter onboarding guide.",
    ],
    links: [
      { label: "School Club portal", href: "https://club.mikaelsoninitiative.org", external: true },
      { label: "Contact our team", href: "/contact" },
    ],
  },
  {
    id: "how-to-contribute",
    group: "taking-part",
    question: "How can individuals and organisations support or sponsor the Initiative?",
    paragraphs: [
      "We welcome collaboration from individuals, schools, and organizations who want to stand beside young African talent:",
    ],
    list: [
      "Volunteer: Lend your time and expertise in mentorship, software engineering, design, or operations.",
      "Individual Giving: Support student scholarships or workshop expenses directly by bank transfer to our First Bank or GTBank accounts.",
      "Corporate Sponsorship: Fund student cohorts or sponsor community workshops online via Paystack.",
      "Institutional Partnerships: Collaborate with your institution to expand club chapters and resource access.",
    ],
    links: [
      { label: "Ways to give & sponsor", href: "/sponsor" },
      { label: "Apply to volunteer", href: "/volunteer" },
      { label: "Partner with us", href: "/contact" },
    ],
  },
  {
    id: "community-standards",
    group: "taking-part",
    question: "What are your standards for community safety and conduct?",
    paragraphs: [
      "We are dedicated to providing a safe, respectful, and inclusive environment across all our club sessions, virtual workshops, and events.",
      "Our Code of Conduct outlines expectations for mutual respect, collaboration, and accountability, alongside a zero-tolerance policy for harassment or discrimination. If you ever need to report a concern, our team provides confidential reporting channels.",
    ],
    links: [
      { label: "Read our Code of Conduct", href: "/code-of-conduct" },
      { label: "Review our Privacy Policy", href: "/privacy" },
    ],
  },
];

/** Everything in an answer as plain text, for search. */
export function faqText(item: FaqItem) {
  return [...item.paragraphs, ...(item.list ?? [])].join(" ");
}
