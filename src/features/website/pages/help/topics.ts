import { CalendarDays, Compass, LifeBuoy, Users, type LucideIcon } from "lucide-react";

// The four categories from the old src/features/website/components/help-center.
// Each topic now leads somewhere real. Dropped: "Setting Up Your Profile"
// and "Account Issues" (the site no longer has member accounts).

export type HelpTopic = { title: string; description: string; href: string };

export type HelpCategory = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  topics: HelpTopic[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "getting-started",
    icon: Compass,
    title: "Getting started",
    description: "Learn how to join our community and get the most out of your membership.",
    topics: [
      {
        title: "How to join the community",
        description: "Who can join, and the ways in.",
        href: "/faq#how-to-join",
      },
      {
        title: "Is there a membership fee?",
        description: "Joining the Mikaelson Community is free.",
        href: "/faq#membership-fee",
      },
    ],
  },
  {
    id: "programs-events",
    icon: CalendarDays,
    title: "Programs & events",
    description: "Information about our programs, workshops, and community events.",
    topics: [
      {
        title: "Upcoming events",
        description: "Stay updated on workshops and gatherings.",
        href: "/blog",
      },
      {
        title: "Program registration",
        description: "How to register for development programs.",
        href: "/contact",
      },
    ],
  },
  {
    id: "technical-support",
    icon: LifeBuoy,
    title: "Technical support",
    description: "Get help with website issues and technical difficulties.",
    topics: [
      {
        title: "Website problems",
        description: "Report bugs, broken links, or issues.",
        href: "/contact",
      },
    ],
  },
  {
    id: "community-support",
    icon: Users,
    title: "Community support",
    description: "Connect with other members and get support from the community.",
    topics: [
      {
        title: "Finding mentors",
        description: "How to connect with mentors and advisors.",
        href: "/contact",
      },
      {
        title: "Collaboration opportunities",
        description: "Discover collaboration options.",
        href: "/volunteer",
      },
    ],
  },
];
