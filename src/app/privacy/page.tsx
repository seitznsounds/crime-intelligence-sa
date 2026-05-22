import PageShell from "@/components/layout/PageShell";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Crime Intelligence SA",
  description: "Our commitment to zero-tracking and absolute anonymity.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      subtitle="Your anonymity is our operational standard. We do not track you."
      badge="Privacy"
      badgeColor="blue"
      icon={<ShieldCheck className="w-6 h-6 text-accent-blue" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }]}
    >
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="glass-card p-8 sm:p-12 border-border-glass bg-bg-glass prose prose-invert max-w-none">
          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground mt-0">1. Zero Tracking Policy</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Crime Intelligence SA is built on a foundation of absolute anonymity. We do not track IP addresses, we do not use tracking cookies, and we do not monitor individual user sessions. Your activity on this platform is private.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">2. Whistleblower Protection</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            When you submit evidence through our Secure Uplink, we employ client-side encryption. Before any file reaches our servers, we automatically strip all identifying metadata, including EXIF data, GPS coordinates, and device fingerprints.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">3. Data Security</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            All stored intelligence is protected using industry-standard encryption protocols. Access to sensitive evidence is restricted and guarded by Zero-Knowledge Proofs (ZKP) to ensure that even system administrators cannot link submissions to individual identities.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">4. Third-Party Services</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            We minimize the use of third-party services. The platform runs independently, funded by public donations. Any integrations (such as our payment gateway for donations) are strictly siloed and do not share your reading habits or interaction data with external advertisers.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">5. Changes to This Policy</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If we update our security protocols or privacy practices, we will reflect those changes here. However, our core commitment to zero tracking and whistleblower anonymity will never be compromised.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
