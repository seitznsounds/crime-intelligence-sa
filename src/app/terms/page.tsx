import PageShell from "@/components/layout/PageShell";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Crime Intelligence SA",
  description: "Terms of use for the Crime Intelligence SA platform.",
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms and Conditions"
      subtitle="Guidelines for utilizing the Crime Intelligence SA platform."
      badge="Legal"
      badgeColor="gold"
      icon={<Scale className="w-6 h-6 text-accent-gold" />}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]}
    >
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="glass-card p-8 sm:p-12 border-border-glass bg-bg-glass prose prose-invert max-w-none">
          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground mt-0">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            By accessing Crime Intelligence SA, you agree to these terms. This platform is provided as a public service for the purpose of exposing systemic corruption and documenting public interest intelligence.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">2. Use of Information</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            The data, statistics, and network maps provided on this platform are aggregated from public records, high court judgments, and vetted whistleblower submissions. While we strive for absolute accuracy, the information is provided "as is" for research and public awareness purposes.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">3. Whistleblower Submissions</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            If you submit information via our Report portal, you confirm that to the best of your knowledge, the information provided is truthful. You agree not to submit fabricated evidence or use the platform to harass individuals with false claims.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">4. Platform Independence</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Crime Intelligence SA is an independent, non-governmental project. We are not affiliated with the South African Police Service (SAPS) or any political party. We do not have law enforcement powers.
          </p>

          <h2 className="text-xl font-bold uppercase tracking-widest text-foreground">5. Limitation of Liability</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The creators and maintainers of Crime Intelligence SA shall not be held liable for any direct or indirect consequences arising from the use of the information contained on this platform. Users are encouraged to independently verify critical information.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
