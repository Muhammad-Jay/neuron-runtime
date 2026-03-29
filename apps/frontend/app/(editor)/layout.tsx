import React from "react";
import {EditorProvider} from "@/app/(editor)/Provider";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <EditorProvider>
            <div className={"screen center"}>
                {children}
            </div>
        </EditorProvider>
    );
}