import { Box, Database, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JsonRenderer } from "@/components/JsonRenederer";

export function ExecutionDataInspector({ selectedLog }: { selectedLog: any }) {
    return (
        <Tabs defaultValue="output" className="w-full">
            <TabsList className="bg-neutral-900 border border-neutral-800 p-0.5 mb-4 w-fit">
                <TabsTrigger value="input" className="text-[10px] uppercase tracking-widest py-1.5 px-4 data-[state=active]:bg-white/10">
                    <Box className="w-3 h-3 mr-2" /> Input
                </TabsTrigger>
                <TabsTrigger value="output" className="text-[10px] uppercase tracking-widest py-1.5 px-4 data-[state=active]:bg-white/10">
                    <Database className="w-3 h-3 mr-2 text-emerald-500" /> Output
                </TabsTrigger>
                {selectedLog.error && (
                    <TabsTrigger value="error" className="text-[10px] uppercase tracking-widest py-1.5 px-4 text-red-400">
                        <AlertCircle className="w-3 h-3 mr-2" /> Error
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="input" className="mt-0">
                <div className="rounded-xl overflow-hidden">
                    <JsonRenderer
                        data={selectedLog.input || {}}
                        maxHeight="max-h-[300px]"
                        className="max-w-full overflow-x-auto min-h-[150px] bg-transparent! border-0! m-0! max-h-[500px] text-[11px] no-scrollbar"
                    />
                </div>
            </TabsContent>

            <TabsContent value="output" className="mt-0">
                <div className="rounded-xl bg-neutral-950 border border-white/5 p-2 overflow-hidden">
                    <JsonRenderer
                        data={selectedLog.output || {}}
                        maxHeight="max-h-[300px]"
                        className="max-w-full overflow-x-auto h-fit! max-h-[500px]  text-[11px] no-scrollbar"
                    />
                </div>
            </TabsContent>

            {selectedLog.error && (
                <TabsContent value="error" className="mt-0">
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 font-mono text-[11px] text-red-400 leading-relaxed">
                        <JsonRenderer
                            data={selectedLog?.error || {}}
                            maxHeight="max-h-[300px]"
                            className="max-w-full overflow-x-auto h-fit max-h-[500px]!  text-[11px] no-scrollbar"
                        />
                    </div>
                </TabsContent>
            )}
        </Tabs>
    );
}