// export * from "./types/node-sdk.types";
import {getAllNodes, loadNodes} from "./registry/node.registry";

export * from "./registry/node.registry";
export * from "./adapters/templates.adapter";

console.log("loading nodes...");
loadNodes();

const nodes = getAllNodes();

console.log(nodes);