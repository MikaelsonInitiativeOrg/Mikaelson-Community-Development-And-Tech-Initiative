import Link from "next/link";
import type { LegalSection } from "@/features/website/pages/legal/legal-document";
import type { LegalLink } from "@/features/website/pages/legal/legal-links";
import { Email, Note } from "@/features/website/pages/legal/prose";

// Text moved verbatim from the old components/privacy/privacy-content.tsx (removed).

// Written only from the sections below; no new obligations.
export const PRIVACY_PLAIN_WORDS = [
  <>We do not sell, trade, or rent your personal information to third parties.</>,
  <>We collect what you give us, and some information automatically when you use our Services.</>,
  <>You can ask to access, correct or delete your personal information, and withdraw consent for marketing.</>,
  <>You can control cookies through your browser settings.</>,
  <>If you are between 16 and 18, you need a parent&rsquo;s or guardian&rsquo;s consent to use our Services.</>,
  <>We give at least 30 days&rsquo; notice for significant changes affecting your rights.</>,
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "overview",
    number: "1",
    title: "Overview",
    stop: true,
    content: (
      <>
        <p>
          At the Mikaelson Community Development And Tech Initiative (Mikaelson Initiative), we are committed to
          protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our website, mobile applications, and related services
          (collectively, the &lsquo;Services&rsquo;).
        </p>
        <p>
          By using our Services, you consent to the collection and use of your information as described in this Privacy
          Policy. If you do not agree with our policies and practices, please do not use our Services.
        </p>
        <Note label="Key Principles">
          We are committed to transparency, data minimization, purpose limitation, and ensuring your rights are respected
          throughout your interaction with our platform.
        </Note>
      </>
    ),
  },
  {
    id: "information-we-collect",
    number: "2",
    title: "Information We Collect",
    content: (
      <>
        <h3>2.1 Information You Provide</h3>
        <p>We collect information you voluntarily provide to us, including:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> Name, email address, username, password, educational institution, and
            profile details
          </li>
          <li>
            <strong>Contact Information:</strong> Phone number, mailing address, and emergency contact details
          </li>
          <li>
            <strong>Program Participation:</strong> Applications, resumes, project submissions, and participation records
          </li>
          <li>
            <strong>Communications:</strong> Messages, feedback, survey responses, and support inquiries
          </li>
          <li>
            <strong>Payment Information:</strong> Billing details for paid services (processed securely through
            third-party providers)
          </li>
        </ul>
        <h3>2.2 Automatically Collected Information</h3>
        <p>When you use our Services, we automatically collect certain information:</p>
        <ul>
          <li>
            <strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, time spent, click patterns, and feature interactions
          </li>
          <li>
            <strong>Location Data:</strong> General geographic location based on IP address
          </li>
          <li>
            <strong>Cookies and Tracking:</strong> Information stored through cookies, web beacons, and similar
            technologies
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    number: "3",
    title: "How We Use Your Information",
    content: (
      <>
        <h3>3.1 Service Provision</h3>
        <ul>
          <li>Creating and managing your account</li>
          <li>Providing access to community programs and resources</li>
          <li>Processing applications and participation requests</li>
          <li>Facilitating mentorship connections and networking</li>
          <li>Delivering educational content and materials</li>
        </ul>
        <h3>3.2 Communication</h3>
        <ul>
          <li>Sending program updates and announcements</li>
          <li>Responding to inquiries and providing support</li>
          <li>Delivering newsletters and marketing communications (with your consent)</li>
          <li>Notifying you of policy changes or important information</li>
        </ul>
        <h3>3.3 Improvement and Analytics</h3>
        <ul>
          <li>Analyzing usage patterns to improve our Services</li>
          <li>Conducting research and generating insights</li>
          <li>Developing new features and programs</li>
          <li>Ensuring platform security and preventing fraud</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    number: "4",
    title: "Information Sharing and Disclosure",
    stop: true,
    content: (
      <>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information only
          in the following limited circumstances:
        </p>
        <h3>4.1 With Your Consent</h3>
        <p>We may share your information when you explicitly consent to such sharing, such as:</p>
        <ul>
          <li>Connecting you with mentors or program participants</li>
          <li>Featuring your achievements or projects (with permission)</li>
          <li>Facilitating partnerships with educational institutions</li>
        </ul>
        <h3>4.2 Service Providers</h3>
        <p>We may share information with trusted third-party service providers who:</p>
        <ul>
          <li>Help us operate and maintain our platform</li>
          <li>Process payments and handle financial transactions</li>
          <li>Provide analytics and marketing services</li>
          <li>Offer customer support and communication tools</li>
        </ul>
        <h3>4.3 Legal Requirements</h3>
        <p>We may disclose your information when required by law or to:</p>
        <ul>
          <li>Comply with legal process, court orders, or government requests</li>
          <li>Protect the rights, property, or safety of our organization or users</li>
          <li>
            Investigate potential violations of our <Link href="/terms">Terms of Service</Link>
          </li>
          <li>Prevent fraud, security breaches, or illegal activities</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    number: "5",
    title: "Data Security and Protection",
    content: (
      <>
        <h3>5.1 Technical Safeguards</h3>
        <ul>
          <li>Encryption of data in transit and at rest</li>
          <li>Secure servers and database protection</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Multi-factor authentication for sensitive accounts</li>
        </ul>
        <h3>5.2 Organizational Measures</h3>
        <ul>
          <li>Limited access to personal information on a need-to-know basis</li>
          <li>Employee training on data protection and privacy</li>
          <li>Incident response procedures for data breaches</li>
          <li>Regular review and update of security policies</li>
        </ul>
        <Note label="Security Limitation">
          While we implement robust security measures, no method of transmission over the internet or electronic storage
          is 100% secure. We cannot guarantee absolute security of your information.
        </Note>
      </>
    ),
  },
  {
    id: "cookies",
    number: "6",
    title: "Cookies and Tracking Technologies",
    content: (
      <>
        <p>
          We use cookies and similar technologies to enhance your experience and gather information about usage patterns.
        </p>
        <h3>6.1 Types of Cookies</h3>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for basic website functionality
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us analyze website usage and performance
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences and settings
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)
          </li>
        </ul>
        <h3>6.2 Cookie Management</h3>
        <p>
          You can control cookies through your browser settings. However, disabling certain cookies may limit your
          ability to use some features of our Services.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    number: "7",
    title: "Your Privacy Rights",
    stop: true,
    content: (
      <>
        <p>You have several rights regarding your personal information:</p>
        <h3>7.1 Access and Portability</h3>
        <ul>
          <li>Request access to your personal information</li>
          <li>Obtain a copy of your data in a portable format</li>
          <li>Receive information about how your data is processed</li>
        </ul>
        <h3>7.2 Correction and Updates</h3>
        <ul>
          <li>Update or correct inaccurate personal information</li>
          <li>Modify your profile and account settings</li>
          <li>Change your communication preferences</li>
        </ul>
        <h3>7.3 Deletion and Restriction</h3>
        <ul>
          <li>Request deletion of your personal information</li>
          <li>Restrict processing of your data in certain circumstances</li>
          <li>Object to processing based on legitimate interests</li>
        </ul>
        <h3>7.4 Withdrawal of Consent</h3>
        <ul>
          <li>Withdraw consent for marketing communications</li>
          <li>Opt out of data processing where consent is the legal basis</li>
          <li>Unsubscribe from newsletters and promotional emails</li>
        </ul>
      </>
    ),
  },
  {
    id: "international-transfers",
    number: "8",
    title: "International Data Transfers",
    content: (
      <>
        <p>
          As we operate primarily in Nigeria and serve users across Africa, your information may be transferred to and
          processed in countries other than your own. We ensure appropriate safeguards are in place when transferring
          data internationally, including:
        </p>
        <ul>
          <li>Adequacy decisions by relevant data protection authorities</li>
          <li>Standard contractual clauses with third-party processors</li>
          <li>Certification under recognized privacy frameworks</li>
          <li>Explicit consent for transfers where required</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    number: "9",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this
          Privacy Policy or as required by law:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> Retained while your account is active and for 2 years after closure
          </li>
          <li>
            <strong>Program Participation:</strong> Kept for 5 years for alumni engagement and impact measurement
          </li>
          <li>
            <strong>Communications:</strong> Stored for 3 years for customer service and legal purposes
          </li>
          <li>
            <strong>Marketing Data:</strong> Retained until you withdraw consent or 2 years of inactivity
          </li>
          <li>
            <strong>Legal Compliance:</strong> Kept as required by applicable laws and regulations
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    number: "10",
    title: "Children’s Privacy",
    content: (
      <>
        <p>
          Our Services are primarily intended for individuals 16 years of age and older. We do not knowingly collect
          personal information from children under 16 without parental consent.
        </p>
        <p>
          If you are between 16 and 18 years old, you must have parental or guardian consent before using our Services. If
          we become aware that we have collected information from a child under 16 without proper consent, we will take
          steps to delete such information promptly.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    number: "11",
    title: "Third-Party Services and Links",
    content: (
      <>
        <p>
          Our Services may contain links to third-party websites, applications, or services that are not operated by us.
          This Privacy Policy does not apply to these external services.
        </p>
        <p>
          We encourage you to review the privacy policies of any third-party services you access through our platform. We
          are not responsible for the privacy practices or content of these external sites.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    number: "12",
    title: "Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or
          service offerings. When we make changes, we will:
        </p>
        <ul>
          <li>Post the updated Privacy Policy on our website</li>
          <li>Update the &lsquo;Last Updated&rsquo; date at the top of this policy</li>
          <li>Notify you via email or platform notification for material changes</li>
          <li>Provide at least 30 days&rsquo; notice for significant changes affecting your rights</li>
          <li>Obtain your consent where required by applicable law</li>
        </ul>
        <p>
          Your continued use of our Services after any modifications constitutes acceptance of the updated Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    number: "13",
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please
          contact us:
        </p>
        <h3>General Privacy Inquiries</h3>
        <p>
          <Link href="/contact">Visit our Contact Page</Link>
        </p>
        <h3>Data Protection Officer</h3>
        <p>
          Email: <Email address="privacy@mikaelsoninitiative.org" />
        </p>
        <h3>Data Requests</h3>
        <p>
          Email: <Email address="data-requests@mikaelsoninitiative.org" />
        </p>
      </>
    ),
  },
];

// From the old privacy-questions.tsx cards.
export const PRIVACY_LINKS: LegalLink[] = [
  { title: "Contact Privacy Team", href: "mailto:privacy@mikaelsoninitiative.org", cta: "Get in touch" },
  {
    title: "Terms & Conditions",
    text: "Review our complete terms of service.",
    href: "/terms",
    cta: "Read terms",
  },
  {
    title: "Data Rights",
    text: "Exercise your data protection rights.",
    href: "mailto:data-requests@mikaelsoninitiative.org",
    cta: "Submit request",
  },
];
