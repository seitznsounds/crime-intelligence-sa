"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Check, X, User, Users, Activity, FileText } from "lucide-react";
import { getPendingReports, approveCitizenReport, rejectCitizenReport } from "@/app/admin/reports/actions";

export default function ReportQueuePanel() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mappingStates, setMappingStates] = useState<Record<string, string>>({});
    const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await getPendingReports();
            setReports(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleApprove = async (reportId: string, originalName: string) => {
        setProcessingId(reportId);
        const mappedName = mappingStates[reportId] || originalName;
        try {
            await approveCitizenReport(reportId, mappedName);
            await loadReports();
        } catch (e) {
            console.error(e);
            alert("Failed to approve report.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (reportId: string) => {
        const reason = rejectionReasons[reportId] || "";
        if (!reason.trim()) {
            alert("Please provide a reason for rejecting this report.");
            return;
        }
        if (!confirm("Are you sure you want to reject and archive this report?")) return;
        setProcessingId(reportId);
        try {
            await rejectCitizenReport(reportId, reason);
            await loadReports();
        } catch (e) {
            console.error(e);
            alert("Failed to reject report.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-12 flex items-center justify-center text-muted-foreground border-border-glass">
                <Activity className="w-6 h-6 animate-spin mr-3" /> Fetching pending reports...
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="glass-card p-12 text-center border-border-glass bg-bg-glass">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Check className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Queue Empty</h3>
                <p className="text-xs text-muted-foreground mt-2">All citizen reports have been reviewed.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reports.map((report) => (
                <div key={report.id} className="glass-card p-6 border-border-glass bg-bg-glass-heavy flex flex-col lg:flex-row gap-6 relative overflow-hidden">
                    {processingId === report.id && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Activity className="w-6 h-6 animate-spin text-accent-blue" />
                        </div>
                    )}
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {report.target_type === 'person' ? <User className="w-4 h-4 text-accent-blue" /> : <Users className="w-4 h-4 text-accent-crimson" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {report.target_type === 'person' ? 'Individual' : 'Organisation'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-foreground">{report.target_name}</h3>
                                <p className="text-xs text-accent-gold font-bold uppercase tracking-widest mt-1">{report.category}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">Hash: {report.reporter_hash.substring(0, 8)}...</span>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-2">{new Date(report.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="bg-background/50 border border-border-glass rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                <FileText className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Report Description & Intel</span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{report.description}</p>
                        </div>
                    </div>

                    <div className="w-full lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border-glass pt-6 lg:pt-0 lg:pl-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Map to Entity (Correction)</label>
                            <input 
                                type="text"
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2 text-xs focus:border-accent-blue outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder={`Default: ${report.target_name}`}
                                value={mappingStates[report.id] !== undefined ? mappingStates[report.id] : report.target_name}
                                onChange={(e) => setMappingStates(prev => ({ ...prev, [report.id]: e.target.value }))}
                            />
                            <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
                                Change this if the reported name is misspelled and needs to map to an existing database entity (e.g., "Jon Doe").
                            </p>
                        </div>

                        <div className="space-y-2 mt-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Rejection Reason</label>
                            <input 
                                type="text"
                                className="w-full bg-background border border-border-glass rounded-xl px-4 py-2 text-xs focus:border-accent-crimson outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="Required if rejecting"
                                value={rejectionReasons[report.id] || ""}
                                onChange={(e) => setRejectionReasons(prev => ({ ...prev, [report.id]: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-2 mt-auto pt-4">
                            <button 
                                onClick={() => handleReject(report.id)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-accent-crimson/10 border border-white/10 hover:border-accent-crimson/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent-crimson transition-all flex items-center justify-center gap-2"
                            >
                                <X className="w-3.5 h-3.5" /> Reject
                            </button>
                            <button 
                                onClick={() => handleApprove(report.id, report.target_name)}
                                className="flex-1 px-4 py-3 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-accent-blue transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
