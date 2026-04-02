"use client";

import React, { memo, useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { oneDarkTheme } from '@codemirror/theme-one-dark';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { cn } from '@/lib/utils';

interface JaguarEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: 'javascript' | 'json';
    className?: string;
    height?: string;
}

const CodeEditor = ({
                        value,
                        onChange,
                        language = 'javascript',
                        className,
                        height = "300px"
                    }: JaguarEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    // Helper to ensure we always have a string for CodeMirror
    const getSafeValue = (val: any): string => {
        if (typeof val === 'string') return val;
        return ""; // Fallback for null, undefined, or {}
    };

    const amethystHighlightStyle = HighlightStyle.define([
        { tag: t.comment, color: '#7c7c7c' },
        { tag: t.keyword, color: '#984eff' },
        { tag: t.string, color: '#87ffa9' },
        { tag: t.variableName, color: '#acacac' },
        { tag: t.propertyName, color: '#88a1fd' },
        { tag: t.typeName, color: '#be6bef' },
        { tag: t.number, color: '#f48067' },
    ]);

    useEffect(() => {
        if (!editorRef.current) return;

        // CRITICAL FIX: Ensure CodeMirror receives a string on initialization
        const safeDoc = getSafeValue(value);

        const state = EditorState.create({
            doc: safeDoc,
            extensions: [
                basicSetup,
                javascript(),
                autocompletion(),
                oneDarkTheme,
                syntaxHighlighting(amethystHighlightStyle),
                EditorView.theme({
                    "&": { height: height, fontSize: "12px" },
                    ".cm-scroller": { overflow: "auto" },
                    "&.cm-focused": { outline: "none" },
                    ".cm-content": { fontFamily: 'JetBrains Mono, monospace' }
                }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, []);

    // Handle external updates (like "Load Boilerplate")
    useEffect(() => {
        const safeValue = getSafeValue(value);

        if (viewRef.current && safeValue !== viewRef.current.state.doc.toString()) {
            viewRef.current.dispatch({
                changes: {
                    from: 0,
                    to: viewRef.current.state.doc.length,
                    insert: safeValue
                }
            });
        }
    }, [value]);

    return (
        <div
            ref={editorRef}
            className={cn(
                "w-full rounded-md border border-neutral-950 bg-black overflow-hidden",
                className
            )}
        />
    );
};

export default memo(CodeEditor);