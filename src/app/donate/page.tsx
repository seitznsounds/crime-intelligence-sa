"use client";

import React from 'react';
import PageShell from "@/components/layout/PageShell";
import { Heart, ShieldCheck, Zap, Globe, Coins, Vote, Search } from "lucide-react";
import WhatNext from "@/components/layout/WhatNext";
import dynamic from 'next/dynamic';

const DonationModule = dynamic(() => import('@/components/intel/DonationModule').then(mod => mod.DonationModule), {
  ssr: false,
  loading: () => (
    <div className="glass-card border border-border-glass rounded-2xl bg-background/80 backdrop-blur-md h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
    </div>
  )
});

export default function DonatePage() {
  return (
    <PageShell
      title="Support Our Work"
      subtitle="Help us keep this platform running independently. Your donations pay for the servers and systems that keep our data secure and accessible."
      badge="Donate"
      badgeColor="crimson"
      icon={<Heart className="w-6 h-6 text-accent-crimson" />}
      guidance="We are 100% independent and rely on donations to keep our servers running and our investigations going. You can choose to support the project fund or buy the creator a coffee."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Donate", href: "/donate" },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Why Donate? */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground italic">Transparency is not free.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Maintaining a high-fidelity intelligence hub requires robust cloud architecture, vector database maintenance, and continuous forensic data ingestion. 
              We are 100% independent and fueled entirely by individual contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { 
                title: "Infrastructure", 
                desc: "Funding for Supabase DB, Edge Functions, and high-performance hosting.",
                icon: Zap,
                color: "text-accent-blue"
              },
              { 
                title: "Data Acquisition", 
                desc: "Scaling Apify RAG pipelines to crawl archives and breaking forensic news.",
                icon: Globe,
                color: "text-accent-gold"
              },
              { 
                title: "System Security", 
                desc: "Maintaining AES-256 secure terminals and cryptographic evidence signing.",
                icon: ShieldCheck,
                color: "text-emerald-500"
              },
              { 
                title: "Independent Intel", 
                desc: "Zero reliance on state funding or corporate grants to ensure uncorrupted data.",
                icon: Coins,
                color: "text-accent-crimson"
              }
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 border-border-glass bg-bg-glass space-y-4">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <h4 className="text-sm font-black uppercase tracking-widest text-foreground">{item.title}</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-8 glass-card border-accent-blue/20 bg-accent-blue/5 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-blue mb-4 italic">Commitment to Integrity</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Every cent donated to the <strong className="text-foreground">Project Fund</strong> is strictly allocated to the operational costs of the Crime Intelligence SA platform. 
              The <strong className="text-foreground">Support Creator</strong> option is available for those who wish to directly reward the architectural design and engineering hours behind the system.
            </p>
          </div>
        </div>

        {/* The Donation Module */}
        <div className="lg:col-span-5 sticky top-24">
          <DonationModule />
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/40" />
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">
              Paystack Secure Terminal // South Africa
            </p>
          </div>
        </div>
      </div>

      <WhatNext suggestions={[
        { title: "Help Choose Priorities", description: "Vote on which corruption cases we should investigate next.", href: "/vote", icon: Vote },
        { title: "About This Platform", description: "Learn how this platform works and our mission.", href: "/about", icon: Search },
      ]} />
    </PageShell>
  );
}
