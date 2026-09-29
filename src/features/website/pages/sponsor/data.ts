// Content from src/features/website/components/sponsor/*. The original
// options carry no amounts, so neither do these. Each "outcome" retells the
// option's own description in warmer words; nothing new is claimed.

export type GiveOption = {
  id: "student" | "workshop" | "partner";
  title: string;
  description: string;
  /** What it makes possible, in warm words, from the description itself. */
  outcome: string;
  /** Shown as an icon (no pictures on this page): money, a workshop, a handshake. */
  icon: "money" | "workshop" | "partner";
  action: { kind: "give"; label: string } | { kind: "contact"; label: string; href: string };
};

export const GIVE_OPTIONS: GiveOption[] = [
  {
    id: "student",
    title: "Sponsor a Student",
    description:
      "Provide a full scholarship for a promising student to participate in our intensive programs, covering mentorship, resources, and community access.",
    outcome:
      "A promising young person gets a full place in our programs, with a mentor in their corner, the resources to keep going and a community to grow with.",
    icon: "money",
    action: { kind: "give", label: "Donate now" },
  },
  {
    id: "workshop",
    title: "Fund a Workshop",
    description:
      "Enable us to host specialized workshops on topics like software development, entrepreneurship, and intentional living for our community.",
    outcome:
      "A room of young people learns together, on things like software development, starting a business and living with intention.",
    icon: "workshop",
    action: { kind: "give", label: "Give today" },
  },
  {
    id: "partner",
    title: "Become a Partner",
    description:
      "Join our network of corporate partners committed to fostering talent and driving innovation in Africa. Let's build the future together.",
    outcome:
      "Your organization stands beside young talent across Africa, and we build what comes next together.",
    icon: "partner",
    action: { kind: "contact", label: "Contact us", href: "/contact" },
  },
];

export const PAYSTACK_URL = "https://paystack.com/pay/mikaelson-initiative";

export const WIRE = {
  bank: "First Bank of Nigeria",
  accountName: "Mikaelson Community Development And Tech Initiative",
  accountNumber: "2048233790",
  confirmEmail: "hello@mikaelsoninitiative.org",
};

export const PARTNER_EMAIL = "partnership@mikaelsoninitiative.org";

export const PARTNER_STEPS = [
  "Discuss partnership opportunities tailored to your organization.",
  "Select a partnership package and sign the agreement.",
  "Collaborate on programs and track impact together.",
];

export const SUPPORTERS = [
  { src: "/assets/images/Google.png", alt: "Google", width: 140, height: 50 },
  { src: "/assets/images/Microsoft.png", alt: "Microsoft", width: 140, height: 50 },
  { src: "/assets/images/Canva.png", alt: "Canva", width: 120, height: 50 },
  { src: "/assets/images/Adobe-Express.png", alt: "Adobe Express", width: 120, height: 50 },
  { src: "/assets/images/Anthropic.svg", alt: "Anthropic", width: 160, height: 18 },
  { src: "/assets/images/OpenAI.svg", alt: "OpenAI", width: 140, height: 38 },
];
