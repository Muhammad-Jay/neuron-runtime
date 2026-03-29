"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { JsonRenderer } from "@/components/JsonRenederer";
import { OutputFormatType } from "../../../../../shared/src/types/node.types";
import { cn } from "@/lib/utils";

interface OutputRendererProps {
    content: string;
    format: {
        type: OutputFormatType;
        syntaxHighlight?: boolean;
        minify?: boolean;
    };
}

export const OutputRenderer = ({ content, format }: OutputRendererProps) => {
    const isJson = format.type === 'json';
    const isMarkdown = format.type === 'markdown';

    return (
        <div className="w-full h-full flex flex-col bg-transparent selection:bg-blue-500/30">
            {/* 1. MINIMAL CONTENT ENGINE */}
            <div className="flex-1 relative overflow-y-auto custom-scrollbar group">
                <div className="relative z-10">
                    {isJson ? (
                        <div className="font-mono text-[12px] leading-relaxed text-blue-400/90">
                            <JsonRenderer
                                data={JSON.parse(content)}
                                maxHeight="none" // Let parent handle scrolling
                                className="w-full bg-transparent p-0 border-none shadow-none"
                            />
                        </div>
                    ) : isMarkdown ? (
                        <article className="prose prose-invert prose-sm max-w-none
                            prose-p:text-neutral-400 prose-p:leading-relaxed
                            prose-headings:text-neutral-100 prose-headings:font-bold prose-headings:tracking-tight
                            prose-strong:text-blue-400 prose-code:text-emerald-400 prose-code:bg-emerald-500/5
                            prose-code:px-1 prose-code:rounded-sm prose-pre:bg-neutral-900/50
                            prose-pre:border prose-pre:border-neutral-800">
                            <ReactMarkdown
                                components={{
                                    // Style H1
                                    h1: ({ node, ...props }) => (
                                        <h1 className="text-[1.875rem] font-bold tracking-tight text-white mt-8 mb-2 leading-[1.3]" {...props} />
                                    ),
                                    // Notion H2: Smaller but distinct
                                    h2: ({ node, ...props }) => (
                                        <h2 className="text-[1.5rem] font-semibold text-white/90 mt-6 mb-1.5 leading-[1.3]" {...props} />
                                    ),
                                    // Notion H3: Bold and compact
                                    h3: ({ node, ...props }) => (
                                        <h3 className="text-[1.25rem] font-semibold text-white/85 mt-4 mb-1 leading-[1.3]" {...props} />
                                    ),
                                    // Notion Paragraph: Soft gray, high readability
                                    p: ({ node, ...props }) => (
                                        <p className="text-[16px] leading-[1.6] text-neutral-400 mb-[0.5em] font-normal" {...props} />
                                    ),
                                    // Notion Lists
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc list-inside space-y-1.5 mb-4 text-neutral-400 pl-1" {...props} />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol className="list-decimal list-inside space-y-1.5 mb-4 text-neutral-400 pl-1" {...props} />
                                    ),
                                    // Style Code Blocks
                                    code: ({ node, ...props }) => (
                                        <code
                                            className={`bg-neutral-800 px-1 py-0.5 rounded font-mono text-emerald-400`}
                                            {...props}
                                        />
                                    ),
                                    // Style Lists
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className="border-l-[3px] border-neutral-700 pl-4 py-0.5 my-4 italic text-neutral-400" {...props} />
                                    ),
                                    // Notion Links: Underlined and subtle
                                    a: ({ node, ...props }) => (
                                        <a className="text-neutral-300 underline decoration-neutral-600 underline-offset-[3px] hover:text-blue-400 transition-colors" {...props} />
                                    ),
                                }}
                            >{content}</ReactMarkdown>
                        </article>
                    ) : (
                        <pre className="font-mono text-[12px] text-neutral-400 whitespace-pre-wrap leading-relaxed">
                            {content}
                        </pre>
                    )}
                </div>
            </div>

            {/* 2. PRECISION STATUS LINE (Single minimal line at bottom) */}
            <div className="mt-4 pt-3 border-t border-neutral-800/50 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                        Payload::{format.type}
                    </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600 uppercase">
                    {new TextEncoder().encode(content).length} bytes
                </span>
            </div>
        </div>
    );
};