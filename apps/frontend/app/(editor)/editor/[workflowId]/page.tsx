"use client";

import {Editor} from "@/components/workflow/editor/Editor";
import {ReactFlowProvider} from "reactflow";
import React from "react";

export default function Page() {

    return (
        <div className={'center container-full'}>
            <ReactFlowProvider>
                <Editor/>
            </ReactFlowProvider>
        </div>
    )
}