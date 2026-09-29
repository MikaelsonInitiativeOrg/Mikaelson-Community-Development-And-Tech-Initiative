// Copy from the old src/features/website/components/faq/faq-content.tsx.
// The "•" runs are now real lists, and the old link to /community (a page
// that no longer exists) points to the ways in that do exist. Shared with
// the Help Center's search.

export type FaqGroup = "about" | "taking-part";

export type FaqLink = { label: string; href: string };

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
  { id: "taking-part", label: "Taking part" },
];

export const FAQS: FaqItem[] = [
  {
    id: "what-is-the-initiative",
    group: "about",
    question: "What is the Mikaelson Initiative?",
    paragraphs: [
      "The Mikaelson Initiative is a youth-driven movement using technology, intentional living, and community to transform Africa from the inside out.",
      "We focus on empowering students and young changemakers across Africa through our community programs, labs, and partnership networks.",
    ],
  },
  {
    id: "how-to-join",
    group: "taking-part",
    question: "How can I join the Mikaelson Community?",
    paragraphs: [
      "Membership is open to ambitious students and changemakers across Africa who are committed to excellence and intentional growth.",
      "To get involved, apply to volunteer with us or write to us through our contact page.",
    ],
    links: [
      { label: "Volunteer with us", href: "/volunteer" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    id: "programs",
    group: "taking-part",
    question: "What programs do you offer?",
    paragraphs: ["We offer various programs, including:"],
    list: [
      "Personal Growth Campaigns",
      "Innovation Labs and Workshops",
      "Mentorship and Partnership Networks",
      "Community Events and Collaborations",
      "Student Leadership Development",
    ],
  },
  {
    id: "membership-fee",
    group: "taking-part",
    question: "Is there a membership fee?",
    paragraphs: [
      "No, joining the Mikaelson Community is completely free. We believe in making personal development and community support accessible to all students and young professionals across Africa.",
    ],
  },
  {
    id: "mikaelson-labs",
    group: "about",
    question: "What is Mikaelson Labs?",
    paragraphs: [
      "Mikaelson Labs is our innovation hub, where we build and experiment with new ideas to solve challenges across Africa. It’s a space for creative collaboration, technology development, and solution-oriented thinking.",
    ],
    links: [{ label: "Visit Mikaelson Labs", href: "/labs" }],
  },
  {
    id: "how-to-contribute",
    group: "taking-part",
    question: "How can I contribute to the initiative?",
    paragraphs: ["There are many ways to contribute:"],
    list: [
      "Join our community and participate actively",
      "Volunteer for programs and events",
      "Share your skills and expertise",
      "Sponsor our programs",
      "Spread the word about our mission",
    ],
    links: [
      { label: "Volunteer", href: "/volunteer" },
      { label: "Sponsor a program", href: "/sponsor" },
    ],
  },
  {
    id: "universities",
    group: "about",
    question: "What universities are you currently working with?",
    paragraphs: [
      "We’ve touched 4 universities and counting, with over 3,000 students reached. We’re continuously expanding our presence across African universities.",
      "Contact us if you’d like to bring the Initiative to your campus.",
    ],
    links: [{ label: "Bring us to your campus", href: "/contact" }],
  },
  {
    id: "contact-the-team",
    group: "about",
    question: "How can I contact the team?",
    paragraphs: [
      "You can reach us through our contact page, follow us on social media, or email us directly at hello@mikaelsoninitiative.org. We’re always happy to hear from community members and potential collaborators.",
    ],
    links: [
      { label: "Contact page", href: "/contact" },
      { label: "Email us", href: "mailto:hello@mikaelsoninitiative.org" },
    ],
  },
];

/** Everything in an answer as plain text, for search. */
export function faqText(item: FaqItem) {
  return [...item.paragraphs, ...(item.list ?? [])].join(" ");
}
