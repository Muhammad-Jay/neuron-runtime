// src/executor.ts

import { HttpRequestNode } from "@neuron/shared";

export async function httpExecutor(node: HttpRequestNode) {
    const { url, method, headers, body } = node.config;

    if (!url) {
        throw new Error("HTTP node: URL is required");
    }

    const controller = new AbortController();

    // Optional timeout
    if (node.config.executionConfig?.timeout?.enabled) {
        setTimeout(() => controller.abort(), node.config.executionConfig.timeout.durationMs);
    }

    const res = await fetch(url, {
        method,
        headers,
        body: method !== "GET" ? JSON.stringify(body) : undefined,
        signal: controller.signal
    });

    const contentType = res.headers.get("content-type");

    let data;

    if (contentType?.includes("application/json")) {
        data = await res.json();
    } else {
        data = await res.text();
    }

    return {
        status: res.status,
        data
    };
}