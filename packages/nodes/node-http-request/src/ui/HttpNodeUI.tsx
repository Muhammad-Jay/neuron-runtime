// src/ui/HttpNodeUI.tsx

import React from "react";

export const HttpNodeUI = ({ data }: any) => {
    return (
        <div className="p-2 text-xs text-white">
            <div>{data.config.method}</div>
            <div className="truncate opacity-60">{data.config.url || "No URL"}</div>
        </div>
    );
};