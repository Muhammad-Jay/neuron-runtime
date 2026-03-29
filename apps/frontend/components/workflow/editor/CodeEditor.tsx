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

    // Your specific "Amethyst" theme tokens
    const amethystHighlightStyle = HighlightStyle.define([
        // { tag: t.comment, color: '#7c7c7c' },
        // { tag: t.keyword, color: '#984eff' },
        // { tag: t.string, color: '#87ffa9' },
        // { tag: t.variableName, color: '#acacac' },
        // { tag: t.propertyName, color: '#88a1fd' },
        // { tag: t.typeName, color: '#be6bef' },
        // { tag: t.number, color: '#f48067' },

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

        const state = EditorState.create({
            doc: value,
            extensions: [
                basicSetup,
                javascript(), // Can be dynamic if you add more languages
                autocompletion(),
                oneDarkTheme,
                syntaxHighlighting(amethystHighlightStyle),
                EditorView.theme({
                    "&": { height: height, fontSize: "12px" },
                    ".cm-scroller": { overflow: "auto" },
                    "&.cm-focused": { outline: "none" }
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
        // Run once on mount to initialize
    }, []);

    // Handle external value updates (e.g., template resets)
    useEffect(() => {
        if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
            viewRef.current.dispatch({
                changes: { from: 0, to: viewRef.current.state.doc.length, insert: value }
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