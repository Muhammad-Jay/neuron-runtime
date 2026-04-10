'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Copy, Eye, EyeOff, Key, Trash2, Plus, Search } from 'lucide-react';
import { useVault } from '@/hooks/useVault';
import { Secret } from '@/types/workflow';

function maskSecret() {
  return '••••••••••••••••';
}

function VaultHeader() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 shadow-inner">
          <Key size={18} className="text-neutral-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-neutral-100">
            Secrets Vault
          </h1>
          <p className="text-[11px] text-neutral-500">
            Securely store API keys and credentials used by your workflow nodes.
          </p>
        </div>
      </div>
    </div>
  );
}

function SecretRow({
  secret,
  onDelete,
}: {
  secret: Secret;
  onDelete: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="group flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/50">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-medium tracking-wider text-neutral-200 uppercase">
          {secret.name}
        </span>
        <span className="font-mono text-[10px] text-neutral-500">
          {visible ? 'sk_live_v1_8823...9901' : maskSecret()}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
        >
          <Copy size={14} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-rose-500/70 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          onClick={() => onDelete(secret.id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

function CreateSecretDialog({
  onCreate,
}: {
  onCreate: (name: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  function submit() {
    if (!name.trim() || !value.trim()) return;
    onCreate(name, value);
    setName('');
    setValue('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 gap-2 px-4 text-[11px] font-bold tracking-wider uppercase"
        >
          <Plus size={14} />
          Add New Secret
        </Button>
      </DialogTrigger>
      <DialogContent className="border-neutral-800 bg-neutral-950 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold tracking-widest text-neutral-100 uppercase">
            Create Secret
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Secret Name
            </label>
            <Input
              placeholder="OPENAI_API_KEY"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-neutral-800 bg-neutral-900 text-xs focus:ring-1 focus:ring-neutral-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Secret Value
            </label>
            <Input
              type="password"
              placeholder="sk-xxxxxxxxxxxxxxxx"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border-neutral-800 bg-neutral-900 text-xs focus:ring-1 focus:ring-neutral-700"
            />
          </div>
        </div>
        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-xs text-neutral-400"
          >
            Cancel
          </Button>
          <Button size="sm" onClick={submit} className="px-6 text-xs">
            Save to Vault
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function VaultPage() {
    const { secrets, isLoading, addSecret, removeSecret } = useVault();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSecrets = secrets.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#030303]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-100" />
            </div>
        );
    }

    return (
        /* 1. Fixed Height Container:
          h-svh (Small Viewport Height) ensures it fits mobile and desktop perfectly
        */
        <div className="flex h-svh w-full flex-col overflow-hidden bg-[#030303] px-4 py-6 sm:px-8 sm:py-9">

            {/* Header stays at the top */}
            <VaultHeader />

            {/* 2. Flex-1 Card:
        The card now takes up all remaining space
      */}
            <Card className="flex flex-1 flex-col overflow-hidden border-neutral-800 bg-neutral-950/50 shadow-2xl backdrop-blur-sm">

                {/* Toolbar stays fixed below header */}
                <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/20 p-5 sm:flex-row">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-600" />
                        <Input
                            placeholder="Search secrets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full border-neutral-800 bg-neutral-950 pl-9 text-xs focus:ring-0"
                        />
                    </div>
                    <CreateSecretDialog onCreate={addSecret} />
                </div>

                {/* 3. Dynamic Scroll Area:
          h-full inside a flex-1 container allows it to grow/shrink
        */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="space-y-3 px-5 py-5">
                            {filteredSecrets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-20 text-neutral-600">
                                    <Search size={24} className="opacity-20" />
                                    <p className="text-xs tracking-wide italic">
                                        No secrets found in the vault
                                    </p>
                                </div>
                            ) : (
                                filteredSecrets.map((secret) => (
                                    <SecretRow
                                        key={secret.id}
                                        secret={secret}
                                        onDelete={(id) => setDeleteId(id)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Optional: Footer stays fixed at the bottom of the card */}
                <div className="flex shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-900/40 px-6 py-3">
          <span className="text-[9px] font-black tracking-[0.2em] text-neutral-600 uppercase">
            System Status: Encrypted
          </span>
                    <span className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">
            {filteredSecrets.length} Entries
          </span>
                </div>
            </Card>

            {/* Delete Alert - kept outside the flow */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                {/* ... existing AlertDialog content ... */}
            </AlertDialog>
        </div>
    );
}
