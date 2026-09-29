// Every rule, value and step from the original Code of Conduct (August 10,
// 2025), unchanged in meaning. Only the presentation is new.

export const CONDUCT_EMAIL = "conduct@mikaelsoninitiative.org";
export const LAST_UPDATED = "August 10, 2025";

// "What to include" (7.2), used as a gentle prompt inside the email.
export const WHAT_TO_INCLUDE = [
  "Date, time, and location of the incident",
  "Description of what happened",
  "Names of people involved (if known)",
  "Any witnesses to the incident",
  "Screenshots, recordings, or other evidence (if available)",
  "Impact of the incident on you or others",
];

// Opens the reader's own email app, addressed to the conduct team, with
// the "what to include" list as headings. Nothing is sent from this site.
export const REPORT_MAILTO =
  `mailto:${CONDUCT_EMAIL}?subject=${encodeURIComponent("Code of Conduct concern")}` +
  `&body=${encodeURIComponent(WHAT_TO_INCLUDE.map((line) => `${line}:\n\n`).join(""))}`;

export const PLEDGE = [
  "The Mikaelson Community Development And Tech Initiative (Mikaelson Initiative) is committed to creating a harassment-free, inclusive, and respectful environment for all community members, participants, volunteers, and staff.",
  "We pledge to make participation in our community a welcoming experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.",
];

export const VISION =
  "We strive to build the next generation of African leaders through excellence, integrity, collaboration, and mutual respect.";

// 3. Community Guidelines: the three values.
export const VALUES = [
  {
    key: "growth",
    title: "Excellence and growth",
    text: "We encourage all members to pursue excellence in their personal and professional development while supporting others in their journey. This includes:",
    points: [
      "Committing to continuous learning and improvement",
      "Setting and working toward meaningful goals",
      "Seeking mentorship and offering guidance to others",
      "Embracing challenges as opportunities for growth",
      "Maintaining high standards in all community interactions",
    ],
  },
  {
    key: "together",
    title: "Collaboration and support",
    text: "We value collaboration over competition. Members should actively support each other’s initiatives and contribute to collective success through:",
    points: [
      "Sharing resources, knowledge, and opportunities",
      "Offering help and assistance when needed",
      "Celebrating others’ achievements and milestones",
      "Building meaningful professional and personal relationships",
      "Participating actively in community initiatives",
    ],
  },
  {
    key: "integrity",
    title: "Integrity and accountability",
    text: "We expect all members to act with integrity, take responsibility for their actions, and hold themselves accountable to our community standards:",
    points: [
      "Being honest and transparent in all interactions",
      "Honoring commitments and following through on promises",
      "Taking responsibility for mistakes and working to correct them",
      "Respecting confidentiality when required",
      "Acting ethically in all professional and personal endeavors",
    ],
  },
] as const;

// 2. Our Standards.
export const EXPECTED = [
  "Demonstrating empathy and kindness toward other people",
  "Being respectful of differing opinions, viewpoints, and experiences",
  "Giving and gracefully accepting constructive feedback",
  "Accepting responsibility and apologizing to those affected by our mistakes",
  "Focusing on what is best not just for us as individuals, but for the overall community",
  "Using welcoming and inclusive language",
  "Supporting fellow members in their personal and professional growth",
  "Sharing knowledge, resources, and opportunities generously",
  "Celebrating diversity and promoting equal participation",
];

export const UNACCEPTABLE = [
  "The use of sexualized language or imagery, and sexual attention or advances of any kind",
  "Trolling, insulting or derogatory comments, and personal or political attacks",
  "Public or private harassment, intimidation, or stalking",
  "Publishing others’ private information without their explicit permission",
  "Discrimination or prejudice based on any protected characteristic",
  "Disruptive behavior during events, meetings, or online discussions",
  "Deliberate spreading of misinformation or false claims",
  "Inappropriate use of nudity and/or sexual images in community spaces",
  "Other conduct which could reasonably be considered inappropriate in a professional setting",
];

// 4. Participation Guidelines and 5. Professional and Academic Integrity.
export const PARTICIPATION = [
  {
    title: "At events and programs",
    text: "During Mikaelson Initiative events, workshops, programs, and activities:",
    points: [
      "Arrive on time and come prepared with necessary materials",
      "Participate actively and constructively in all activities",
      "Respect speakers, facilitators, organizers, and fellow participants",
      "Follow health and safety guidelines and protocols",
      "Keep mobile devices on silent during sessions unless otherwise instructed",
      "Respect venue rules, regulations, and property",
      "Use designated channels for feedback, questions, and concerns",
      "Dress appropriately for the occasion and setting",
    ],
  },
  {
    title: "In our online spaces",
    text: "In our digital spaces, including social media groups, forums, video calls, and virtual events:",
    points: [
      "Keep discussions relevant, constructive, and on-topic",
      "Avoid spam, excessive self-promotion, or irrelevant content",
      "Respect privacy, confidentiality, and intellectual property",
      "Give proper credit and attribution when sharing others’ work",
      "Use appropriate language, tone, and professional communication",
      "Report violations promptly to moderators or administrators",
      "Follow platform-specific guidelines and terms of service",
      "Maintain appropriate backgrounds and attire during video calls",
    ],
  },
  {
    title: "Academic honesty",
    text: "All members must maintain the highest standards of academic and professional integrity:",
    points: [
      "Avoiding plagiarism and properly citing all sources",
      "Submitting original work and collaborating ethically",
      "Respecting intellectual property rights",
      "Being honest about qualifications, achievements, and experience",
      "Maintaining confidentiality of sensitive information",
    ],
  },
  {
    title: "Representing the Initiative",
    text: "When representing the Mikaelson Community Development And Tech Initiative (Mikaelson Initiative) or participating in community activities:",
    points: [
      "Conduct yourself in a manner that reflects positively on the community",
      "Respect organizational policies and procedures",
      "Maintain professional boundaries in all relationships",
      "Avoid conflicts of interest and disclose potential conflicts",
      "Protect the reputation and integrity of the organization",
    ],
  },
];

// 6. Enforcement Responsibilities.
export const ENFORCEMENT_INTRO =
  "Community leaders, staff, and designated moderators are responsible for clarifying and enforcing our standards of acceptable behavior. They will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.";

export const INVESTIGATION = [
  "Initial assessment within 48 hours of report",
  "Fair and impartial investigation of all parties involved",
  "Appropriate documentation of incidents and actions taken",
  "Follow-up with affected parties as appropriate",
  "Regular review of policies and procedures",
];

export const LADDER = [
  {
    title: "Correction",
    impact: "Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.",
    consequence:
      "A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate.",
  },
  {
    title: "Warning",
    impact: "A violation through a single incident or series of actions.",
    consequence:
      "A warning with consequences for continued behavior. No interaction with the people involved for a specified period of time.",
  },
  {
    title: "Temporary ban",
    impact: "A serious violation of community standards, including sustained inappropriate behavior.",
    consequence:
      "A temporary ban from any sort of interaction or public communication with the community for a specified period of time.",
  },
  {
    title: "Permanent ban",
    impact:
      "Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment, or aggression.",
    consequence: "A permanent ban from any sort of public interaction within the community.",
  },
];

// 7.1 Reporting Channels. The original also listed "an anonymous report
// through our online form", but that form never existed (its link was
// "#"), so it is not offered here.
export const CHANNELS = [
  { text: "Contact our support team through the official contact form", href: "/contact" },
  { text: `Email us directly at ${CONDUCT_EMAIL}`, href: `mailto:${CONDUCT_EMAIL}` },
  { text: "Reach out to event organizers or staff during programs" },
  { text: "Use the reporting features available in our digital platforms" },
  { text: "Contact community leaders or mentors directly" },
];

export const CONFIDENTIALITY =
  "All reports will be handled with discretion and confidentiality. We are committed to protecting the privacy of both reporters and those being reported. Support resources are available for those affected by violations.";

// 8. Scope and Application.
export const SCOPE = [
  "Official events, workshops, and programs",
  "Online platforms, forums, and social media groups",
  "Email communications and private messages",
  "Virtual meetings and video conferences",
  "Community partnerships and collaborations",
  "Representation of the community in external forums",
];

export const SCOPE_NOTE =
  "This Code of Conduct also applies when an individual is officially representing the community in public spaces. Examples include using an official email address, posting via an official social media account, or acting as an appointed representative at events.";

// 9. Support Resources.
export const SUPPORT = {
  internal: [
    "Peer mentorship and buddy system",
    "Conflict resolution and mediation services",
    "Counseling and wellness resources",
    "Academic and professional development support",
    "Financial assistance programs (when available)",
  ],
  external: [
    "Local law enforcement agencies",
    "Mental health and counseling services",
    "Legal aid and advocacy organizations",
    "Educational institution support services",
    "Community crisis intervention programs",
  ],
};

// 10. Policy Updates and Amendments.
export const REVIEW = [
  "Annual review of the Code of Conduct and its effectiveness",
  "Community feedback collection and incorporation",
  "Consultation with experts in community management and ethics",
  "Alignment with organizational mission and values",
  "Compliance with applicable laws and regulations",
];

export const NOTIFY = [
  "Post the updated version on our official website",
  "Notify all community members via email or platform announcement",
  "Provide a summary of significant changes",
  "Offer opportunities for questions and clarification",
  "Ensure all community leaders are trained on updates",
];

// 12. Attribution and Acknowledgments.
export const ATTRIBUTION = [
  "This Code of Conduct is adapted from the Contributor Covenant, version 2.1, and incorporates best practices from various community guidelines and organizational codes of conduct.",
  "We acknowledge the work of community leaders and organizations worldwide who have contributed to developing ethical standards for inclusive and respectful communities.",
  "This Code of Conduct reflects our commitment to building the next generation of African leaders through excellence, integrity, and mutual respect.",
];
