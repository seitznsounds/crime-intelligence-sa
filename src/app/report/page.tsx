"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck, UploadCloud, Lock, FileText, ChevronRight, AlertCircle,
    CheckCircle2, Activity, ShieldAlert, Fingerprint, Target, Users, User,
    X, Car, Building2, MapPin, Plus, ChevronDown
} from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import WhatNext from "@/components/layout/WhatNext";
import { submitCitizenReport } from "./actions";
import { PERSON_CATEGORIES, ORG_CATEGORIES } from "./constants";

export default function ReportPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    // Removed resultData as reports now go to a pending queue
    const [reporterHash, setReporterHash] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Intel Accordion
    const [showIntelSection, setShowIntelSection] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        target_type: "person",
        target_name: "",
        description: "",
        known_affiliates: "",
        known_vehicles: "",
        known_businesses: "",
        known_locations: ""
    });

    useEffect(() => {
        let hash = localStorage.getItem("crim_intel_reporter_hash");
        if (!hash) {
            hash = crypto.randomUUID();
            localStorage.setItem("crim_intel_reporter_hash", hash);
        }
        setReporterHash(hash);
    }, []);

    // Reset category when target_type changes
    useEffect(() => {
        const cats = formData.target_type === "person" ? PERSON_CATEGORIES : ORG_CATEGORIES;
        setFormData(prev => ({ ...prev, category: cats[0] }));
    }, [formData.target_type]);

    const activeCategories = formData.target_type === "person" ? PERSON_CATEGORIES : ORG_CATEGORIES;

    const steps = [
        { id: 1, title: "Target", icon: <Target className="w-4 h-4" /> },
        { id: 2, title: "Category", icon: <FileText className="w-4 h-4" /> },
        { id: 3, title: "Evidence", icon: <UploadCloud className="w-4 h-4" /> },
        { id: 4, title: "Submit", icon: <Lock className="w-4 h-4" /> },
    ];

    const handleNext = () => setStep(s => Math.min(s + 1, 4));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const canProceedStep1 = !!formData.target_name;
    const canProceedStep2 = !!formData.category && !!formData.description;

    const submitReport = async () => {
        if (!formData.target_name || !formData.description) return;
        setIsSubmitting(true);

        try {
            await submitCitizenReport({
                reporter_hash: reporterHash,
                target_name: formData.target_name,
                target_type: formData.target_type,
                category: formData.category,
                description: formData.description,
                known_affiliates: formData.known_affiliates || undefined,
                known_vehicles: formData.known_vehicles || undefined,
                known_businesses: formData.known_businesses || undefined,
                known_locations: formData.known_locations || undefined
            });
            // setResultData(result);
            setIsComplete(true);
        } catch (e) {
            console.error("Failed to submit:", e);
            alert("Failed to submit report securely. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (idx: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const inputCls = "w-full bg-bg-glass-heavy border border-border-glass rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-accent-crimson/40 text-foreground transition-all placeholder:text-muted-foreground/30";

    return (
        <PageShell
            title="Report Criminal Activity"
            subtitle="Report crime anonymously. Your identity is fully protected — we never see your name, IP address, or device information."
            badge="Anonymous Reporting"
            badgeColor="crimson"
            icon={<ShieldCheck className="w-6 h-6 text-accent-crimson" />}
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Act", href: "/vote" },
                { label: "Report", href: "/report" },
            ]}
            guidance="Use this form to anonymously report criminal activity. Start by identifying who or what you're reporting, then choose a category. The more citizens who independently report the same target, the higher their risk profile becomes."
        >
            <div className="max-w-4xl mx-auto py-10 sm:py-16">
                {/* Step Progress */}
                <div className="flex items-center justify-between mb-16 px-4 relative max-w-2xl mx-auto">
                    <div className="absolute left-10 right-10 top-5 h-[1px] bg-border-glass" />
                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${step >= s.id ? "bg-accent-crimson border-accent-crimson text-white shadow-glow-crimson" : "bg-bg-glass border-border-glass text-muted-foreground"}`}>
                                {s.icon}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-8 sm:p-12 bg-bg-glass border-border-glass relative min-h-[450px] flex flex-col rounded-3xl">
                            <AnimatePresence mode="wait">
                                {!isComplete ? (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex-1"
                                    >
                                        {/* ────────── STEP 1: TARGET ────────── */}
                                        {step === 1 && (
                                            <div className="space-y-8">
                                                <div>
                                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">Who or what are you reporting?</label>
                                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, target_type: "person" })}
                                                            className={`py-5 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${formData.target_type === "person" ? "bg-accent-crimson/10 border-accent-crimson text-accent-crimson shadow-glow-crimson" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/[0.08]"}`}
                                                        >
                                                            <User className="w-6 h-6" />
                                                            An Individual
                                                        </button>
                                                        <button
                                                            onClick={() => setFormData({ ...formData, target_type: "organization" })}
                                                            className={`py-5 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${formData.target_type === "organization" ? "bg-accent-crimson/10 border-accent-crimson text-accent-crimson shadow-glow-crimson" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/[0.08]"}`}
                                                        >
                                                            <Users className="w-6 h-6" />
                                                            Organisation / Gang
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">
                                                        {formData.target_type === "person" ? "Full name of the person" : "Name of the organisation / gang"}
                                                    </label>
                                                    <input
                                                        value={formData.target_name}
                                                        onChange={e => setFormData({ ...formData, target_name: e.target.value })}
                                                        className={inputCls}
                                                        placeholder={formData.target_type === "person" ? "e.g. John Doe" : "e.g. The Cash Heist Syndicate"}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ────────── STEP 2: CATEGORY + DESCRIPTION + OPTIONAL INTEL ────────── */}
                                        {step === 2 && (
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">What type of crime are you reporting?</label>
                                                    <select
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                        className={`${inputCls} appearance-none cursor-pointer`}
                                                    >
                                                        {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">Tell us what happened</label>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                        className={`${inputCls} h-32 leading-relaxed resize-none`}
                                                        placeholder="Describe what happened, when, and any details that could help verify this report..."
                                                    />
                                                </div>

                                                {/* Optional Intel Accordion */}
                                                <div className="border border-border-glass rounded-2xl overflow-hidden">
                                                    <button
                                                        onClick={() => setShowIntelSection(!showIntelSection)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Plus className={`w-4 h-4 text-accent-gold transition-transform ${showIntelSection ? "rotate-45" : ""}`} />
                                                            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-gold">Add More Details (Optional)</span>
                                                        </div>
                                                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showIntelSection ? "rotate-180" : ""}`} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {showIntelSection && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-4 pt-0 space-y-4">
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                                                                        Any extra details help us verify the report and build a more complete picture. Only fill in what you know.
                                                                    </p>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                                                                                <Users className="w-3 h-3" /> Known Associates
                                                                            </label>
                                                                            <input
                                                                                value={formData.known_affiliates}
                                                                                onChange={e => setFormData({ ...formData, known_affiliates: e.target.value })}
                                                                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2.5 text-xs focus:border-accent-gold outline-none transition-all"
                                                                                placeholder="e.g. Jane Doe, Bra Mike"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                                                                                <Car className="w-3 h-3" /> Vehicles
                                                                            </label>
                                                                            <input
                                                                                value={formData.known_vehicles}
                                                                                onChange={e => setFormData({ ...formData, known_vehicles: e.target.value })}
                                                                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2.5 text-xs focus:border-accent-gold outline-none transition-all"
                                                                                placeholder="e.g. White BMW X5, GP 123 ABC"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                                                                                <Building2 className="w-3 h-3" /> Businesses / Properties
                                                                            </label>
                                                                            <input
                                                                                value={formData.known_businesses}
                                                                                onChange={e => setFormData({ ...formData, known_businesses: e.target.value })}
                                                                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2.5 text-xs focus:border-accent-gold outline-none transition-all"
                                                                                placeholder="e.g. Cash & Carry on Main Rd"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                                                                                <MapPin className="w-3 h-3" /> Known Locations
                                                                            </label>
                                                                            <input
                                                                                value={formData.known_locations}
                                                                                onChange={e => setFormData({ ...formData, known_locations: e.target.value })}
                                                                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2.5 text-xs focus:border-accent-gold outline-none transition-all"
                                                                                placeholder="e.g. Corner of 5th Ave, Hillbrow"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        )}

                                        {/* ────────── STEP 3: EVIDENCE UPLOAD ────────── */}
                                        {step === 3 && (
                                            <div className="space-y-6">
                                                {/* Hidden file input */}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                                    className="hidden"
                                                    onChange={onFilesSelected}
                                                />

                                                <div
                                                    onClick={handleFileUpload}
                                                    className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-border-glass rounded-3xl group hover:border-accent-crimson/30 transition-all bg-bg-glass-heavy cursor-pointer"
                                                >
                                                    <div className="w-16 h-16 bg-bg-glass rounded-2xl flex items-center justify-center mb-4 border border-border-glass group-hover:scale-110 transition-transform">
                                                        <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-accent-crimson transition-colors" />
                                                    </div>
                                                    <p className="text-[13px] font-bold uppercase tracking-widest mb-1 text-foreground">Click to Upload Evidence</p>
                                                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">Images, videos, PDFs — all metadata is stripped</p>
                                                    <p className="text-[9px] text-muted-foreground/40 mt-4 font-mono uppercase tracking-widest">This step is optional. You can skip if you have no files.</p>
                                                </div>

                                                {/* Uploaded file list */}
                                                {uploadedFiles.length > 0 && (
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">{uploadedFiles.length} file(s) selected</label>
                                                        {uploadedFiles.map((f, idx) => (
                                                            <div key={idx} className="flex items-center justify-between bg-bg-glass-heavy border border-border-glass rounded-xl px-4 py-3">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <UploadCloud className="w-4 h-4 text-accent-crimson shrink-0" />
                                                                    <span className="text-xs font-mono truncate">{f.name}</span>
                                                                    <span className="text-[9px] text-muted-foreground shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                                                                </div>
                                                                <button onClick={() => removeFile(idx)} className="p-1 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-accent-crimson transition-colors shrink-0">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ────────── STEP 4: REVIEW & SUBMIT ────────── */}
                                        {step === 4 && (
                                            <div className="space-y-8">
                                                <div className="p-5 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl flex gap-4">
                                                    <AlertCircle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                                                    <p className="text-[12px] text-accent-gold/80 leading-relaxed font-medium">
                                                        By submitting, you confirm this report is accurate to the best of your knowledge. The target will be immediately flagged in the intelligence database.
                                                    </p>
                                                </div>

                                                <div className="space-y-3">
                                                    {[
                                                        { label: "Target", value: formData.target_name || "—" },
                                                        { label: "Type", value: formData.target_type === "person" ? "Individual" : "Organisation" },
                                                        { label: "Category", value: formData.category },
                                                        ...(formData.known_affiliates ? [{ label: "Associates", value: formData.known_affiliates }] : []),
                                                        ...(formData.known_vehicles ? [{ label: "Vehicles", value: formData.known_vehicles }] : []),
                                                        ...(formData.known_businesses ? [{ label: "Businesses", value: formData.known_businesses }] : []),
                                                        ...(formData.known_locations ? [{ label: "Locations", value: formData.known_locations }] : []),
                                                        { label: "Evidence Files", value: `${uploadedFiles.length} file(s)` },
                                                        { label: "Security", value: "AES-256 · Anonymous Hash" }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-start py-3 border-b border-border-glass gap-4">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">{item.label}</span>
                                                            <span className="text-[11px] font-mono font-bold text-right">{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-bg-glass-heavy border border-border-glass rounded-2xl p-4">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Report Summary</label>
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{formData.description}</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-10 text-center"
                                    >
                                        <div className="w-24 h-24 bg-accent-blue/10 rounded-full flex items-center justify-center mb-8 border border-accent-blue/20 shadow-glow-blue">
                                            <CheckCircle2 className="w-12 h-12 text-accent-blue" />
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tighter uppercase mb-3 text-foreground">Report Submitted.</h2>
                                        <p className="text-[13px] text-muted-foreground font-light mb-12 max-w-sm mx-auto leading-relaxed">
                                            Your report has been securely transmitted and is pending intelligence verification. Once vetted by our analysts, it will be integrated into the central database.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setIsComplete(false);
                                                setStep(1);
                                                setUploadedFiles([]);
                                                setShowIntelSection(false);
                                                setFormData({ category: PERSON_CATEGORIES[0], target_type: "person", target_name: "", description: "", known_affiliates: "", known_vehicles: "", known_businesses: "", known_locations: "" });
                                            }}
                                            className="px-10 py-4 bg-bg-glass border border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-bg-glass-heavy transition-all text-foreground"
                                        >
                                            Submit Another Report
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            {!isComplete && (
                                <div className="mt-12 pt-10 border-t border-border-glass flex justify-between items-center">
                                    <button
                                        onClick={handleBack}
                                        disabled={step === 1}
                                        className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        Back
                                    </button>

                                    {step < 4 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                                            className="flex items-center gap-3 px-10 py-4 bg-bg-glass border border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-bg-glass-heavy transition-all text-foreground group disabled:opacity-50"
                                        >
                                            {step === 3 ? (uploadedFiles.length > 0 ? "Next Step" : "Skip") : "Next Step"} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={submitReport}
                                            disabled={isSubmitting || !formData.target_name || !formData.description}
                                            className="relative px-12 py-4 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-glow-crimson overflow-hidden disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-3">
                                                    <Activity className="w-4 h-4 animate-spin" /> Processing...
                                                </span>
                                            ) : (
                                                "Submit Report"
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 border-border-glass bg-bg-glass">
                            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-accent-crimson" /> How It Works
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { icon: <Target className="w-5 h-5 text-accent-crimson" />, title: "Instant Flagging", desc: "Targets are registered in our database immediately from the very first report. Every report matters." },
                                    { icon: <ShieldAlert className="w-5 h-5 text-accent-gold" />, title: "Heat Corroboration", desc: "When multiple citizens independently report the same target, their Risk Score automatically escalates." },
                                    { icon: <Fingerprint className="w-5 h-5 text-accent-blue" />, title: "Spam Protection", desc: "Your browser receives a unique anonymous token. You can't spam reports on the same target — but different people can." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 shrink-0">{item.icon}</div>
                                        <div>
                                            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1 text-foreground">{item.title}</h4>
                                            <p className="text-[12px] text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.01]">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-4 h-4 text-accent-crimson" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Privacy Guarantee</span>
                            </div>
                            <p className="text-[12px] text-muted-foreground/80 leading-relaxed font-light italic">
                                &quot;We do not track IP addresses. We do not store cookies. Your anonymity is our top priority.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <WhatNext suggestions={[
                { title: "Expose Board", description: "View the Risk Scores of suspects that the community has flagged.", href: "/expose", icon: "ShieldAlert" },
                { title: "Vote on Priorities", description: "Help decide which corruption cases the community investigates next.", href: "/vote", icon: "Vote" },
            ]} />
        </PageShell>
    );
}
