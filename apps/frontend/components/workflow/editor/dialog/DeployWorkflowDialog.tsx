"use client"

import React, { useState } from "react"
import {
    Globe,
    Lock,
    Zap,
    Copy,
    Check,
    Settings2,
    ShieldCheck,
    Rocket,
    AlertTriangle,
    RefreshCw,
    Activity,
    Trash2,
    Calendar,
    Hash,
    ExternalLink,
    Eye,
    EyeOff
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { EditorPanel } from "../EditorPanel"
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { AppButton } from "@/components/CustomButton";
import {cn, getBackendEndpoint} from "@/lib/utils"


export function DeployWorkflowPanel({ isOpen, onOpenChange, workflowName = "untitled" }: { isOpen: boolean, onOpenChange: (open: boolean) => void, workflowName: string }) {
    const { editorState, deployWorkflow, deleteDeployment, isDeploying } = useWorkflowEditor();

    const [isPrivate, setIsPrivate] = useState(true)
    const [copied, setCopied] = useState(false)
    const [urlCopied, setUrlCopied] = useState(false) // Separate state for URL copy
    const [secretKey, setSecretKey] = useState<string | null>(null)
    const [showKey, setShowKey] = useState(false)

    const generateKey = () => {
        const result = `nrn_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setSecretKey(result);
        setShowKey(true);
    }

    const copyToClipboard = (val: string, isUrl = false) => {
        navigator.clipboard.writeText(val)
        if (isUrl) {
            setUrlCopied(true)
            setTimeout(() => setUrlCopied(false), 2000)
        } else {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }


    // Deterministic URL based on your backend structure
    const deployedUrl = `${getBackendEndpoint()}/execute/workflow/${editorState.deployment?.id}`;

    return (
        <EditorPanel
            open={isOpen}
            onOpenChange={onOpenChange}
            title={editorState.deployment ? "Deployment Status" : `Deploy ${workflowName}`}
            icon={editorState.deployment ? <Activity size={20} className="text-emerald-500" /> : <ShieldCheck size={20} />}
            description={editorState.deployment ? "Monitoring live orchestration instance." : "Finalize your orchestration mesh and security parameters."}
            position="Top Center"
            className="h-fit max-h-[600px] p-3"
            width="w-[550px]"
        >
            <div className="flex flex-col gap-6 py-2">
                <AnimatePresence mode="wait">
                    {editorState.deployment !== null ? (
                        /* --- ACTIVE DEPLOYMENT DASHBOARD --- */
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Live Badge Card */}
                            <div className="p-5 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Rocket size={20} />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Instance Active</p>
                                        <h4 className="text-sm font-semibold text-white tracking-tight">{editorState.deployment?.name || editorState.workflow.name}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1">Status</p>
                                    <span className="text-[10px] py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                                        HEALTHY
                                    </span>
                                </div>
                            </div>

                            {/* --- NEW: PRODUCTION ENDPOINT LAYER --- */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <Globe size={12} className="text-primary" />
                                    <Label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                                        Production Endpoint
                                    </Label>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            readOnly
                                            value={deployedUrl}
                                            className="bg-black/40 border-white/5 rounded-xl font-mono text-[11px] text-primary pr-10 h-10 focus-visible:ring-0"
                                        />
                                        <ExternalLink size={10} className="absolute right-3 top-3.5 text-primary opacity-20" />
                                    </div>
                                    <AppButton
                                        icon={urlCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        label={urlCopied ? "Copied" : "Copy"}
                                        onClick={() => copyToClipboard(deployedUrl, true)}
                                        className="bg-white/5 border border-white/10 text-white text-[10px] font-black px-4 rounded-xl hover:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <DetailCard icon={<Hash size={14}/>} label="Deployment ID" value={editorState.deployment?.id?.slice(0, 18) + '...'} />
                                <DetailCard icon={<Calendar size={14}/>} label="Deployed At" value={new Date(editorState.deployment?.createdAt).toLocaleDateString()} />
                                <DetailCard icon={<Lock size={14}/>} label="Security" value={editorState.deployment?.private ? "Private Key" : "Public Access"} />
                                <DetailCard icon={<Settings2 size={14}/>} label="Environment" value="Production" />
                            </div>

                            {/* Danger Zone */}
                            <div className="pt-6 border-t border-neutral-800/50 flex items-center justify-between">
                                <div>
                                    <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Danger Zone</h5>
                                    <p className="text-[10px] text-neutral-600 mt-1">This will instantly kill the production API endpoint.</p>
                                </div>
                                <AppButton
                                    icon={<Trash2 size={14} />}
                                    label="Delete"
                                    variant="ghost"
                                    onClick={() => deleteDeployment()}
                                    className="bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all px-6 rounded-xl text-[10px] uppercase font-black tracking-widest"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* --- CREATE DEPLOYMENT SECTION --- */
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Visibility Toggle */}
                            <div
                                onClick={() => setIsPrivate(!isPrivate)}
                                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer">
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {isPrivate ? <Lock size={16} className="text-neutral-500" /> : <Globe size={16} className="text-primary animate-pulse" />}
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-white">Private Execution</Label>
                                        <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                                            {isPrivate ? "Requires X-Neuron-Key for all API requests." : "Open endpoint. Accessible without auth."}
                                        </p>
                                    </div>
                                </div>
                                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} className="data-[state=checked]:bg-primary" />
                            </div>

                            {/* Security Layer */}
                            <AnimatePresence mode="wait">
                                {isPrivate && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={12} className="text-indigo-400" />
                                                <Label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Security Payload</Label>
                                            </div>
                                            {secretKey && <span className="text-[9px] font-mono text-amber-500/80 flex items-center gap-1"><AlertTriangle size={10} /> One-time reveal</span>}
                                        </div>

                                        {!secretKey ? (
                                            <button onClick={generateKey} className="w-full py-5 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all group flex flex-col items-center justify-center gap-2">
                                                <RefreshCw size={18} className="text-neutral-600 group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Generate Deployment API Key</span>
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Input
                                                            readOnly
                                                            type={showKey ? "text" : "password"}
                                                            value={secretKey}
                                                            className="bg-black/40 border-primary/20 rounded-xl font-mono text-[11px] text-primary pr-10 h-10"
                                                        />
                                                        <button
                                                            onClick={() => setShowKey(!showKey)}
                                                            className="absolute right-3 top-3 text-neutral-600 hover:text-primary transition-colors"
                                                        >
                                                            {showKey ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                        </button>
                                                    </div>
                                                    <AppButton icon={copied ? <Check size={14}/> : <Copy size={14}/>} label="Copy" onClick={() => copyToClipboard(secretKey)} className="bg-primary text-black text-[10px] font-black px-6 rounded-xl" />
                                                </div>
                                                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
                                                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                    <p className="text-[10px] text-amber-200/60 leading-relaxed italic">Key is hidden after panel exit. Store it securely.</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AppButton
                                icon={<Rocket size={14} />}
                                label="Initialize Deployment"
                                loading={isDeploying}
                                onClick={() => deployWorkflow({ secretKey, private: isPrivate })}
                                disabled={isDeploying || (isPrivate && !secretKey)}
                                className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Link */}
                <div className="pt-4 mt-auto border-t border-neutral-800/50">
                    <button onClick={() => onOpenChange(false)} className="w-full text-center text-[9px] text-neutral-600 font-bold uppercase tracking-widest hover:text-white transition-colors">
                        Return to Canvas
                    </button>
                </div>
            </div>
        </EditorPanel>
    )
}


function DetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-500">
                {icon}
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-xs font-semibold text-white tracking-tight truncate">{value}</p>
        </div>
    )
}