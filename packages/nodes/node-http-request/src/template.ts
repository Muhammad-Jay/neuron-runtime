// src/template.ts

import { NodeTemplate } from "@neuron/shared";
import { Globe } from "lucide-react";

export const httpTemplate: NodeTemplate = {
    key: "http",
    type: "httpNode",
    label: "HTTP Request",
    category: "Network",
    icon: Globe,
    description: "Make an external API request",
    defaultConfig: {
        meta: {
            label: "HTTP Request",
            description: "Call external APIs"
        },
        url: "",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: {},
        executionConfig: {
            retry: {
                enabled: false,
                maxAttempts: 3,
                delayMs: 1000
            },
            timeout: {
                enabled: true,
                durationMs: 30000
            },
            errorHandling: {
                continueOnError: false
            }
        }
    }
};