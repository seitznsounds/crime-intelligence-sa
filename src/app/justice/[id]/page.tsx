import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { FileSignature, ShieldCheck, Download, Printer, Globe, History, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JusticePackagePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createServerClient();

  const { data: pkg, error } = await supabase
    .from("historical_records")
    .select("*")
    .eq("id", id)
    .eq("category", "EVIDENCE_PACKAGE")
    .single();

  if (error || !pkg) notFound();

  const content = JSON.parse(pkg.content);
  const metadata = content.metadata;
  const intelligence = content.intelligence;

  return (
    <PageShell
      title="International Justice Dossier"
      subtitle={`Formal intelligence submission prepared for ${metadata.recipient}.`}
      badge="Certified Submission"
      badgeColor="blue"
      icon={<FileSignature className="w-6 h-6 text-accent-blue" />}
      actions={
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <Printer className="w-3.5 h-3.5" /> Print Dossier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow-blue">
            <Download className="w-3.5 h-3.5" /> Export Signed PDF
          </button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-12 pb-32">
        {/* Certificate Header */}
        <div className="glass-card p-10 border-accent-blue/30 bg-bg-glass-heavy relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue" />
            <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent-blue/10 rounded-full border border-accent-blue/20">
                    <ShieldCheck className="w-12 h-12 text-accent-blue" />
                </div>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-widest">Certificate of Intelligence Authenticity</h2>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-mono text-muted-foreground uppercase">
                <div className="flex flex-col gap-1"><span className="text-accent-blue font-bold">Package_ID</span><span>{pkg.id}</span></div>
                <div className="flex flex-col gap-1"><span className="text-accent-blue font-bold">Issued_At</span><span>{new Date(pkg.created_at).toUTCString()}</span></div>
                <div className="flex flex-col gap-1"><span className="text-accent-blue font-bold">Classification</span><span>{metadata.classification}</span></div>
            </div>
            <div className="p-4 bg-black/40 border border-border-glass rounded-xl text-[10px] font-mono text-emerald-400 break-all leading-relaxed">
                SIGNATURE_OATH: {metadata.signature}
            </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <Globe className="w-4 h-4 text-accent-blue" /> Executive Summary
            </h3>
            <div className="p-8 border border-border-glass rounded-3xl bg-bg-glass text-[15px] leading-relaxed text-foreground/80 italic font-light">
                "{pkg.summary}"
            </div>
        </section>

        {/* Intelligence Nodes */}
        <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <History className="w-4 h-4 text-accent-blue" /> Evidence Corpus [{intelligence.length} Nodes]
            </h3>

            <div className="space-y-6">
                {intelligence.map((node: any, i: number) => (
                    <div key={i} className="glass-card p-8 border-border-glass bg-bg-glass space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-mono text-accent-blue uppercase tracking-widest mb-1 block">NODE_{node.type.toUpperCase()}_{i+1}</span>
                                <h4 className="text-2xl font-bold tracking-tighter uppercase">{node.payload.full_name || node.payload.name || node.payload.title}</h4>
                            </div>
                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest text-muted-foreground">Verified_Node</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-white/5">
                            <div className="space-y-4">
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Forensic Summary</p>
                                <p className="text-[13px] text-foreground/70 leading-relaxed">{node.payload.description || node.payload.summary || node.payload.content?.substring(0, 300)}</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Metadata Hash</p>
                                <div className="space-y-2">
                                    {Object.entries(node.payload.metadata || {}).slice(0, 4).map(([k, v]: [string, any]) => (
                                        <div key={k} className="flex justify-between text-[11px] font-mono py-1 border-b border-white/5">
                                            <span className="text-muted-foreground uppercase">{k}</span>
                                            <span className="text-foreground truncate max-w-[200px]">{String(v)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-crimson/60">
                            <AlertTriangle className="w-4 h-4" /> COMPROMISE_RISK: {node.payload.risk_score || 80}%
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="pt-20 border-t border-white/5 text-center space-y-4 opacity-40">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Confidential Investigative Work Product</p>
            <p className="text-[9px] max-w-2xl mx-auto leading-relaxed uppercase font-light">
                This document is generated by the Google Antigravity Intelligence Engine. The data contained herein is derived from 
                verified forensic audits, commission findings, and citizen intelligence reports. Any unauthorized 
                redistribution outside of designated international justice bodies is a violation of cryptographic protocols.
            </p>
        </div>
      </div>
    </PageShell>
  );
}
