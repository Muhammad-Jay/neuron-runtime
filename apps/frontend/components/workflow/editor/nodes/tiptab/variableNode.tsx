import { Node } from '@tiptap/core'
import Suggestion, {SuggestionOptions} from '@tiptap/suggestion'
import tippy, { Instance } from 'tippy.js'

export interface Variable {
    id: string;
    label: string;
}

export const VariableNode = Node.create({
    name: 'variable',
    group: 'inline',
    inline: true,
    atom: true, // Crucial: treats the variable as a single unit (like an emoji)

    addAttributes() {
        return {
            id: { default: null },
            label: { default: null },
        }
    },

    addOptions() {
        return {
            suggestion: {
                char: '{{',
                // Define logic here once
                command: ({ editor, range, props }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent([
                            {
                                type: this.name,
                                attrs: props,
                            },
                            {
                                type: 'text',
                                text: ' ',
                            }
                        ])
                        .run()
                }
            },
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-variable]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            {
                'data-variable': '',
                class: 'px-1.5 py-0.5 rounded bg-neutral-800 text-primary border border-neutral-700 font-medium mx-0.5',
            },
            `{{${HTMLAttributes.id}}}`
        ]
    },

    renderText({ node }) {
        return `{{${node.attrs.id}}}`
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export const VariableSuggestion = (variables: Variable[]): Omit<SuggestionOptions, 'editor' | 'command'> => ({
    char: '{',
    allowSpaces: true,
    startOfLine: false,

    items: ({ query }) => {
        return variables
            .filter(v => v.id.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10)
    },

    render: () => {
        let component: HTMLDivElement
        let popup: any

        return {
            onStart: props => {
                component = document.createElement('div')
                // Added z-50 and relative to ensure it's on top
                component.className = 'bg-neutral-900 border border-neutral-700 rounded-md text-xs py-1 shadow-xl min-w-[120px] z-[9999] relative'

                props.items.forEach(item => {
                    const option = document.createElement('div')
                    option.className = 'px-3 py-2 cursor-pointer hover:bg-neutral-800 text-neutral-300'
                    option.innerText = item.label

                    // Force the style to ensure it's visible to the pointer
                    option.style.pointerEvents = 'auto'

                    // USE BOTH FOR DEBUGGING
                    option.onclick = () => console.log("Standard click fired");

                    option.onmousedown = (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent Tippy or Editor from stealing the event

                        console.log("🔥 VARIABLE SELECTED:", item);

                        props.command(item);
                    }

                    component.appendChild(option)
                })

                popup = tippy(document.body, { // Target body directly
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onExit() {
                if (popup && popup[0]) {
                    popup[0].destroy()
                }
            },
        }
    },
})