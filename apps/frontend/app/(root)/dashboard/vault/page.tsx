"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import { Copy, Eye, EyeOff, Key, Trash2, Plus, Search } from "lucide-react"
import {useVault} from "@/hooks/useVault";
import {Secret} from "@/types/workflow";

function maskSecret() {
    return "••••••••••••••••"
}

function VaultHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-inner">
                    <Key size={18} className="text-neutral-400" />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-neutral-100 tracking-tight">Secrets Vault</h1>
                    <p className="text-[11px] text-neutral-500">
                        Securely store API keys and credentials used by your workflow nodes.
                    </p>
                </div>
            </div>
        </div>
    )
}

function SecretRow({
                       secret,
                       onDelete
                   }: {
    secret: Secret
    onDelete: (id: string) => void
}) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="group flex items-center justify-between px-4 py-3 border border-neutral-800 rounded-lg bg-neutral-950 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-200">
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-neutral-200 uppercase tracking-wider">{secret.name}</span>
                <span className="text-[10px] font-mono text-neutral-500">
          {visible ? "sk_live_v1_8823...9901" : maskSecret()}
        </span>
            </div>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                    onClick={() => setVisible(v => !v)}
                >
                    {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                >
                    <Copy size={14} />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    onClick={() => onDelete(secret.id)}
                >
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    )
}

function CreateSecretDialog({ onCreate }: { onCreate: (name: string, value: string) => void }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [value, setValue] = useState("")

    function submit() {
        if (!name.trim() || !value.trim()) return
        onCreate(name, value)
        setName("")
        setValue("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2 text-[11px] font-bold uppercase tracking-wider h-9 px-4">
                    <Plus size={14} />
                    Add New Secret
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-950 border-neutral-800 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold text-neutral-100 uppercase tracking-widest">
                        Create Secret
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                            Secret Name
                        </label>
                        <Input
                            placeholder="OPENAI_API_KEY"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="text-xs bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-neutral-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                            Secret Value
                        </label>
                        <Input
                            type="password"
                            placeholder="sk-xxxxxxxxxxxxxxxx"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="text-xs bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-neutral-700"
                        />
                    </div>
                </div>
                <DialogFooter className="mt-6 gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-xs text-neutral-400">
                        Cancel
                    </Button>
                    <Button size="sm" onClick={submit} className="text-xs px-6">
                        Save to Vault
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function VaultPage() {
    const { secrets, isLoading, addSecret, removeSecret } = useVault();

    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredSecrets = secrets.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-100" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
            <VaultHeader />

            <Card className="border-neutral-800 bg-neutral-950/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl">
                {/* Toolbar */}
                <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900/20">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-3.5 h-3.5" />
                        <Input
                            placeholder="Search secrets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-xs bg-neutral-950 border-neutral-800 w-full focus:ring-0"
                        />
                    </div>
                    <CreateSecretDialog onCreate={addSecret} />
                </div>

                {/* Scrollable List */}
                <ScrollArea className="h-[450px] sm:h-[550px] w-full">
                    <div className="p-5 space-y-3">
                        {filteredSecrets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-neutral-600 gap-2">
                                <Search size={24} className="opacity-20" />
                                <p className="text-xs italic tracking-wide">No secrets found in the vault</p>
                            </div>
                        ) : (
                            filteredSecrets.map(secret => (
                                <SecretRow
                                    key={secret.id}
                                    secret={secret}
                                    onDelete={(id) => setDeleteId(id)}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Meta */}
                <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
          <span className="text-[9px] uppercase font-black text-neutral-600 tracking-[0.2em]">
            System Status: Encrypted
          </span>
                    <span className="text-[9px] uppercase font-black text-neutral-400 tracking-[0.2em]">
            {filteredSecrets.length} Entries
          </span>
                </div>
            </Card>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteId}>
                <AlertDialogContent className="bg-neutral-950 border-neutral-800 max-w-[90vw] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-bold uppercase tracking-widest text-neutral-100">
                            Confirm Deletion
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <p className="text-[12px] text-neutral-400 leading-relaxed">
                            Are you sure you want to remove this secret? Nodes currently referencing this variable in your workflows will encounter execution errors.
                        </p>
                    </div>
                    <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel
                            onClick={() => setDeleteId(null)}
                            className="text-xs border-neutral-800 hover:bg-neutral-900 h-9"
                        >
                            Go Back
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && removeSecret(deleteId)}
                            className="text-xs bg-rose-600 hover:bg-rose-700 text-white border-0 h-9 px-6"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}