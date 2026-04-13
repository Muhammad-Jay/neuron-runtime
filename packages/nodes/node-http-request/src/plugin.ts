// src/plugin.ts

import { httpTemplate } from "./template";
import { httpExecutor } from "./executor";
import { HttpNodeUI } from "./ui/HttpNodeUI";

export const nodePlugin = {
    type: "httpNode",
    template: httpTemplate,
    executor: httpExecutor,
    ui: HttpNodeUI
};