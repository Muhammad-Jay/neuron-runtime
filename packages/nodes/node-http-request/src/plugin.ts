// src/plugin.ts

import { httpTemplate } from "./template";
import { httpExecutor } from "./executor";
import { HttpNodeUI } from "./ui/HttpNodeUI";
import {NodeDefinition} from "@neuron/shared";

export const nodePlugin: NodeDefinition = {
    type: httpTemplate.type,
    executor: httpExecutor as any,
    ui: HttpNodeUI as any,
    defaultConfig: httpTemplate.defaultConfig
};