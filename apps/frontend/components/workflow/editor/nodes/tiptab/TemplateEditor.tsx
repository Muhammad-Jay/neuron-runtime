'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import {VariableNode, VariableSuggestion} from "@/components/workflow/editor/nodes/tiptab/variableNode";

interface Variable {
    id: string
    label: string
}

interface Props {
    value?: string
    variables: Variable[]
    onChange?: (value: string) => void
    placeholder?: string
}

export default function TemplateEditor({
                                           value,
                                           variables,
                                           onChange,
                                           placeholder,
                                       }: Props) {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Minimal kit for a single-line variable input
                bold: false,
                italic: false,
                heading: false,
                code: false,
                blockquote: false,
            }),

            VariableNode.configure({
                suggestion: VariableSuggestion(variables),
            }),
        ],
        immediatelyRender: false,
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-[32px] px-2 py-1 text-xs text-neutral-200 bg-neutral-950 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-700 transition-colors',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getText())
        },
    })

    useEffect(() => {
        if (editor && variables) {
            editor.extensionManager.extensions.find(
                (ext) => ext.name === 'variable'
            ).options.suggestion.items = ({ query }) => {
                return variables
                    .filter(v => v.id.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 10)
            }
        }
    }, [variables, editor])

    return <EditorContent editor={editor} className="w-full" />
}