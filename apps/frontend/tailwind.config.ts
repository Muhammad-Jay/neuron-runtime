// tailwind.config.ts
import generated from "@tailwindcss/typography";

export default {
    darkMode: "class",
    theme: {
        extend: {
            animations: {
                "indeterminate-progress": "indeterminate-progress 1.5s infinite linear",
            },
            keyframes: {
                "indeterminate-progress": {
                    "0%": {transform: "translateX(-100%)"},
                    "100%": {transform: "translateX(100%)"},
                },
            }
        },
    },
    plugins: [
        generated,
        // ...
    ],
}