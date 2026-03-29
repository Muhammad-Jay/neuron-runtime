'use client';

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Node, NodeProps} from "reactflow";

export default function TriggerNode(node : NodeProps) {

    return (
        <Card
            className="hover:shadow-lg group justify-between flex-col h-[150px] w-[200px] transition p-3 pb-3 bg-neutral-800/20 backdrop-blur-sm border-0 rounded-xl">
            <Card className={'justify-between container-full card-surface flex-col rounded-xl border-0'}>
                <CardHeader>
                    {/*<CardTitle className={'text-xs'}>{id}</CardTitle>*/}
                </CardHeader>

                <CardContent>
                    {/*<p className="text-xs text-muted-foreground flex-col gap-1.5">*/}
                    {/*    Created at: {new Date(workflow.createdAt).toLocaleDateString()}*/}
                    {/*</p>*/}
                    {/*<div className={cn('center h-10 w-full')}>*/}

                    {/*</div>*/}
                </CardContent>

                <CardFooter className="flex justify-between">
                    {/*<Button*/}
                    {/*    type="button"*/}
                    {/*    className={cn('h-7 text-xs')}*/}
                    {/*    variant="outline">*/}
                    {/*    Open*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    type="button"*/}
                    {/*    variant="outline"*/}
                    {/*    onClick={handleDelete}*/}
                    {/*    className={cn('h-7 text-xs')}*/}
                    {/*    disabled={isDeleting}*/}
                    {/*>*/}
                    {/*    {isDeleting ? "Deleting..." : "Delete"}*/}
                    {/*</Button>*/}
                </CardFooter>
            </Card>
        </Card>
    );
}