import Link from "next/link";
import type { LegalSection } from "@/features/website/pages/legal/legal-document";
import type { LegalLink } from "@/features/website/pages/legal/legal-links";
import { Email, Note } from "@/features/website/pages/legal/prose";

// Text moved verbatim from the old components/terms/terms-content.tsx (removed).
// Only change: the four remaining "Mikaelson Innovation and Community
// Development Initiative" now read with the organisation's correct name
// (as commit bb50e25 did elsewhere).

const ORG = "Mikaelson Community Development And Tech Initiative (Mikaelson Initiative)";

// Written only from the sections below; no new obligations.
export const TERMS_PLAIN_WORDS = [
  <>These Terms are a legally binding agreement. By using our Services, you agree to them.</>,
  <>You must be at least 16. If you are under 18, you need a parent&rsquo;s or guardian&rsquo;s consent.</>,
  <>Treat every community member with respect. Harassment, discrimination and spam are not allowed.</>,
  <>
    You keep ownership of what you share, and give us a licence to use it to operate and promote our Services.
  </>,
  <>Our Services are provided &ldquo;as is&rdquo;, and our educational content is not professional advice.</>,
  <>These Terms are governed by the laws of the Federal Republic of Nigeria.</>,
  <>We give at least 30 days&rsquo; notice for significant changes to these Terms.</>,
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    number: "1",
    title: "Acceptance of Terms",
    stop: true,
    content: (
      <>
        <p>
          Welcome to the {ORG} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms and Conditions
          (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User,&rdquo; &ldquo;you,&rdquo;
          or &ldquo;your&rdquo;) and the {ORG} regarding your access to and use of our website, mobile applications, and
          all related services (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p>
          <strong>
            By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by
            these Terms.
          </strong>{" "}
          If you do not agree to these Terms, you must not access or use our Services.
        </p>
        <Note label="Important Notice">
          These Terms apply to all users of our Services, including but not limited to community members, program
          participants, partners, and visitors to our website.
        </Note>
      </>
    ),
  },
  {
    id: "definitions",
    number: "2",
    title: "Definitions",
    content: (
      <dl>
        <dt>&lsquo;Services&rsquo;</dt>
        <dd>
          All products, services, platforms, and resources provided by the {ORG}, including but not limited to our
          website, community platform, educational programs, events, and labs.
        </dd>
        <dt>&lsquo;User Content&rsquo;</dt>
        <dd>
          Any content, information, data, text, images, videos, or other materials that you submit, post, or share
          through our Services.
        </dd>
        <dt>&lsquo;Community&rsquo;</dt>
        <dd>
          The {ORG} community platform and all associated programs, events, and member interactions.
        </dd>
        <dt>&lsquo;Account&rsquo;</dt>
        <dd>Your registered user account on our platform.</dd>
        <dt>&lsquo;Intellectual Property&rsquo;</dt>
        <dd>All copyrights, trademarks, patents, trade secrets, and other intellectual property rights.</dd>
      </dl>
    ),
  },
  {
    id: "our-services",
    number: "3",
    title: "Our Services",
    content: (
      <>
        <p>The {ORG} provides:</p>
        <ul>
          <li>
            <strong>Community Platform:</strong> A digital space for students and young professionals to connect, learn,
            and grow together
          </li>
          <li>
            <strong>Educational Programs:</strong> Structured learning experiences focused on personal development,
            leadership, and skill building
          </li>
          <li>
            <strong>Innovation Labs:</strong> Technology solutions and product development initiatives
          </li>
          <li>
            <strong>Networking Events:</strong> Virtual and in-person gatherings for community building
          </li>
          <li>
            <strong>Mentorship Programs:</strong> Connections between experienced professionals and emerging talent
          </li>
          <li>
            <strong>Resources and Content:</strong> Educational materials, tools, and resources for personal and
            professional development
          </li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time, with or without
          notice.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    number: "4",
    title: "Eligibility and Registration",
    content: (
      <>
        <h3>4.1 Age Requirements</h3>
        <p>
          You must be at least 16 years old to use our Services. If you are under 18, you must have parental or guardian
          consent to use our Services.
        </p>
        <h3>4.2 Registration</h3>
        <p>To access certain features of our Services, you may need to create an account. When registering, you must:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and update your information as necessary</li>
          <li>Keep your login credentials confidential</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
        <h3>4.3 Account Security</h3>
        <p>
          You are responsible for maintaining the security of your account and password. You must immediately notify us
          of any unauthorized use of your account.
        </p>
      </>
    ),
  },
  {
    id: "community-guidelines",
    number: "5",
    title: "Community Guidelines",
    content: (
      <>
        <p>
          The {ORG} is built on principles of respect, growth, and collaboration. All community members must adhere to
          the following guidelines:
        </p>
        <h3>5.1 Respectful Interaction</h3>
        <ul>
          <li>Treat all community members with respect and dignity</li>
          <li>Use inclusive and appropriate language</li>
          <li>Respect diverse perspectives and backgrounds</li>
          <li>Engage constructively in discussions and debates</li>
        </ul>
        <h3>5.2 Prohibited Behavior</h3>
        <ul>
          <li>Harassment, bullying, or intimidation of any kind</li>
          <li>Discrimination based on race, gender, religion, nationality, or other protected characteristics</li>
          <li>Sharing of false, misleading, or harmful information</li>
          <li>Spam, self-promotion, or commercial solicitation without permission</li>
          <li>Sharing of inappropriate or offensive content</li>
        </ul>
        <h3>5.3 Content Standards</h3>
        <p>All User Content must be:</p>
        <ul>
          <li>Relevant to the community and platform purpose</li>
          <li>Original or properly attributed</li>
          <li>Free from malicious code or harmful links</li>
          <li>Compliant with applicable laws and regulations</li>
        </ul>
      </>
    ),
  },
  {
    id: "user-responsibilities",
    number: "6",
    title: "User Responsibilities",
    content: (
      <>
        <p>As a user of our Services, you are responsible for:</p>
        <ul>
          <li>
            <strong>Compliance:</strong> Following all applicable laws, regulations, and these Terms
          </li>
          <li>
            <strong>Account Security:</strong> Maintaining the confidentiality of your login credentials
          </li>
          <li>
            <strong>Accurate Information:</strong> Providing truthful and current information
          </li>
          <li>
            <strong>Content Ownership:</strong> Ensuring you have the right to share any content you post
          </li>
          <li>
            <strong>Reporting Violations:</strong> Reporting any violations of these Terms or community guidelines
          </li>
          <li>
            <strong>Device Security:</strong> Maintaining appropriate security measures on your devices
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    number: "7",
    title: "Intellectual Property Rights",
    stop: true,
    content: (
      <>
        <h3>7.1 Our Content</h3>
        <p>
          All content, features, and functionality of our Services, including but not limited to text, graphics, logos,
          images, videos, software, and their compilation, are owned by the {ORG} and are protected by copyright,
          trademark, and other intellectual property laws.
        </p>
        <h3>7.2 Your Content</h3>
        <p>
          You retain ownership of any intellectual property rights in content you create and share through our Services.
          However, by sharing content on our platform, you grant us a non-exclusive, royalty-free, worldwide license to
          use, display, reproduce, modify, and distribute your content for the purposes of operating and promoting our
          Services.
        </p>
        <h3>7.3 Respect for Third-Party Rights</h3>
        <p>
          You must respect the intellectual property rights of others. Do not post content that infringes on copyrights,
          trademarks, or other intellectual property rights.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    number: "8",
    title: "Privacy and Data Protection",
    content: (
      <>
        <p>
          Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference.
        </p>
        <p>By using our Services, you consent to:</p>
        <ul>
          <li>The collection and processing of your personal data as described in our Privacy Policy</li>
          <li>The use of cookies and similar technologies</li>
          <li>Communications from us regarding our Services and community activities</li>
        </ul>
      </>
    ),
  },
  {
    id: "payment",
    number: "9",
    title: "Payment Terms",
    content: (
      <>
        <h3>9.1 Free Services</h3>
        <p>
          Many of our Services are provided free of charge. We reserve the right to introduce fees for certain services
          with appropriate notice.
        </p>
        <h3>9.2 Paid Services</h3>
        <p>For any paid services or events:</p>
        <ul>
          <li>All fees are stated in Nigerian Naira unless otherwise specified</li>
          <li>Payment is required before access to paid services</li>
          <li>Refunds are subject to our refund policy</li>
          <li>We reserve the right to change pricing with 30 days&rsquo; notice</li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited-conduct",
    number: "10",
    title: "Prohibited Conduct",
    content: (
      <>
        <p>You may not use our Services to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Transmit malicious code or engage in hacking activities</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt our Services</li>
          <li>Create fake accounts or impersonate others</li>
          <li>Engage in fraudulent or deceptive practices</li>
          <li>Collect personal information without consent</li>
          <li>Use our Services for commercial purposes without permission</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimers",
    number: "11",
    title: "Disclaimers and Warranties",
    content: (
      <>
        <p>
          Our Services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
          either express or implied. To the fullest extent permitted by law, we disclaim all warranties, including but not
          limited to:
        </p>
        <ul>
          <li>Merchantability and fitness for a particular purpose</li>
          <li>Non-infringement of third-party rights</li>
          <li>Accuracy, completeness, or reliability of content</li>
          <li>Uninterrupted or error-free operation</li>
          <li>Security or freedom from viruses</li>
        </ul>
        <Note label="Educational Purposes">
          Our educational content and programs are for informational purposes only and do not constitute professional
          advice. Always consult with qualified professionals for specific guidance.
        </Note>
      </>
    ),
  },
  {
    id: "liability",
    number: "12",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by law, the {ORG} shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including but not limited to:
        </p>
        <ul>
          <li>Loss of profits, data, or business opportunities</li>
          <li>Personal injury or property damage</li>
          <li>Loss of privacy or security breaches</li>
          <li>Failure to meet professional or educational goals</li>
        </ul>
        <p>
          Our total liability for any claims related to these Terms or our Services shall not exceed the amount you have
          paid us in the 12 months preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    number: "13",
    title: "Termination",
    stop: true,
    content: (
      <>
        <h3>13.1 Termination by You</h3>
        <p>
          You may terminate your account at any time by contacting us or using the account deletion feature in your
          profile settings.
        </p>
        <h3>13.2 Termination by Us</h3>
        <p>We may suspend or terminate your access to our Services immediately, without prior notice, if you:</p>
        <ul>
          <li>Violate these Terms or our community guidelines</li>
          <li>Engage in harmful or disruptive behavior</li>
          <li>Provide false or misleading information</li>
          <li>Fail to pay required fees</li>
          <li>Request deletion of your account</li>
        </ul>
        <h3>13.3 Effect of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to access and use our Services will cease immediately</li>
          <li>We may delete your account and associated data</li>
          <li>Provisions regarding intellectual property, liability, and dispute resolution will survive</li>
        </ul>
      </>
    ),
  },
  {
    id: "governing-law",
    number: "14",
    title: "Governing Law and Jurisdiction",
    content: (
      <p>
        These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any
        legal action or proceeding arising under these Terms will be brought exclusively in the competent courts of
        Nigeria, and you consent to personal jurisdiction in such courts.
      </p>
    ),
  },
  {
    id: "changes",
    number: "15",
    title: "Changes to These Terms",
    content: (
      <>
        <p>We reserve the right to modify these Terms at any time. When we make changes, we will:</p>
        <ul>
          <li>Post the updated Terms on our website</li>
          <li>Update the &ldquo;Last Updated&rdquo; date</li>
          <li>Notify users of material changes via email or platform notification</li>
          <li>Provide at least 30 days&rsquo; notice for significant changes</li>
        </ul>
        <p>Your continued use of our Services after any modifications constitutes acceptance of the updated Terms.</p>
      </>
    ),
  },
  {
    id: "contact",
    number: "16",
    title: "Contact Information",
    content: (
      <>
        <p>If you have any questions, concerns, or complaints regarding these Terms, please contact us:</p>
        <h3>General Inquiries</h3>
        <p>
          <Link href="/contact">Visit our Contact Page</Link>
        </p>
        <h3>Legal Matters</h3>
        <p>
          Email: <Email address="legal@mikaelsoninitiative.org" />
        </p>
        <h3>Community Guidelines</h3>
        <p>
          Email: <Email address="community@mikaelsoninitiative.org" />
        </p>
      </>
    ),
  },
];

// From the old terms-question.tsx cards.
export const TERMS_LINKS: LegalLink[] = [
  { title: "Contact Us", href: "/contact", cta: "Get in touch" },
  { title: "Privacy Policy", text: "Learn how we protect and use your data.", href: "/privacy", cta: "Read policy" },
  {
    title: "Community Guidelines",
    text: "Understand our community standards.",
    href: "/code-of-conduct",
    cta: "View guidelines",
  },
];
