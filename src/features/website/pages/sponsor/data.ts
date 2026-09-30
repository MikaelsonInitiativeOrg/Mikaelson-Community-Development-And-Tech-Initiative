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

/** The Initiative's Paystack payment page: the fallback if the site's own
 * checkout is unavailable (e.g. PAYSTACK_SECRET_KEY isn't set). */
export const PAYSTACK_URL = "https://paystack.com/pay/mikaelson-initiative";

export type BankAccount = {
  bank: string;
  currency: "NGN" | "USD" | "GBP" | "EUR";
  currencySymbol: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
  note?: string;
};

/** Local Nigerian Naira (NGN) accounts */
export const LOCAL_ACCOUNTS: BankAccount[] = [
  {
    bank: "Guaranty Trust Bank",
    currency: "NGN",
    currencySymbol: "₦",
    accountName: "Mikaelson Community Development and Tech Initiative",
    accountNumber: "3004744203",
    note: "Local NGN bank transfer / online banking",
  },
  {
    bank: "First Bank of Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
    accountName: "Mikaelson Community Development And Tech Initiative",
    accountNumber: "2048233790",
    note: "Local NGN bank transfer / online banking",
  },
];

/** International Domiciliary accounts (USD, GBP, EUR) */
export const INTERNATIONAL_ACCOUNTS: BankAccount[] = [
  {
    bank: "Guaranty Trust Bank (USD)",
    currency: "USD",
    currencySymbol: "$",
    accountName: "Mikaelson Community Development and Tech Initiative",
    accountNumber: "3004744227",
    swiftCode: "GTBINGLA",
    note: "United States Dollar (USD) domiciliary & wire transfer",
  },
  {
    bank: "Guaranty Trust Bank (GBP)",
    currency: "GBP",
    currencySymbol: "£",
    accountName: "Mikaelson Community Development and Tech Initiative",
    accountNumber: "3004744241",
    swiftCode: "GTBINGLA",
    note: "British Pound Sterling (GBP) domiciliary & wire transfer",
  },
  {
    bank: "Guaranty Trust Bank (EUR)",
    currency: "EUR",
    currencySymbol: "€",
    accountName: "Mikaelson Community Development and Tech Initiative",
    accountNumber: "3004744265",
    swiftCode: "GTBINGLA",
    note: "Euro (EUR) domiciliary & wire transfer",
  },
];

/** All accounts combined (for components that accept the full list) */
export const BANK_ACCOUNTS: BankAccount[] = [
  ...LOCAL_ACCOUNTS,
  ...INTERNATIONAL_ACCOUNTS,
];

/** Guaranty Trust Bank International Wire Routing & Correspondent Bank Details */
export const GTBANK_INTERNATIONAL_WIRE = {
  bankName: "Guaranty Trust Bank Plc (GTBank)",
  beneficiaryName: "Mikaelson Community Development and Tech Initiative",
  swiftCode: "GTBINGLA",
  bankAddress: "Plot 635, Akin Adesola Street, Victoria Island, Lagos, Nigeria",
  correspondents: [
    {
      currency: "USD ($)",
      bank: "Citibank, New York, USA",
      swift: "CITIUS33",
      routingAba: "021000089",
    },
    {
      currency: "GBP (£)",
      bank: "Standard Chartered Bank, London, UK",
      swift: "SCBLGB2L",
      sortCode: "60-91-04",
    },
    {
      currency: "EUR (€)",
      bank: "Citibank, London, UK / Deutsche Bank, Frankfurt",
      swift: "CITIGB2L / DEUTDEFF",
      sortCode: "18-50-08",
    },
  ],
};

/** Where individuals send their transfer confirmation. */
export const CONFIRM_EMAIL = "hello@mikaelsoninitiative.org";

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
