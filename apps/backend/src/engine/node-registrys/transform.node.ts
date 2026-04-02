import { NodeVM } from "vm2";
import { TransformNode } from "@neuron/shared";

function normalizeTransformCode(code: string) {
    const trimmed = code.trim();
    if (/return\s+/m.test(trimmed)) return code;
    return `return (${trimmed})`;
}

export const transformNodeExecutor = async ({
                                                node,
                                                inputs
                                            }: {
    node: TransformNode;
    inputs: any;
}) => {
    console.log(`[Executor] Transform Node ${node.id} Input Keys:`, Object.keys(inputs || {}));

    try {
        const vm = new NodeVM({
            console: "redirect",
            sandbox: {
                inputs: Object.freeze(inputs ?? {})
            },
            timeout: 1000,
            eval: false,
            wasm: false,
            require: false,
        });

        const userCode = normalizeTransformCode(node.config.code);

        const wrappedCode = `
            module.exports = (function() {
                "use strict";
                try {
                    const result = (function() {
                        ${userCode}
                    })();

                    return result;
                } catch (e) {
                    return { __is_error: true, message: e.message };
                }
            })();
        `;

        const result = vm.run(wrappedCode, "transform.js");

        if (result && result.__is_error) {
            throw new Error(`User Script Error: ${result.message}`);
        }

        if (result === undefined || result === null) {
            throw new Error("Transform must return a value.");
        }

        if (typeof result !== "object") {
            throw new Error("Transform must return an object.");
        }

        return result;

    } catch (error: any) {
        const message = error.message.includes("Script execution timed out")
            ? "Execution Timeout: Transformation took too long."
            : error.message;

        throw new Error(message);
    }
};