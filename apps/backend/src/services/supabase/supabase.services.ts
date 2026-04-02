import {supabase} from "../../middleware/supabaseAuth";

export async function getUserFromRequest(req: any): Promise<any> {
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error) throw new Error("Unauthorized request.");

        return data.user;
    }catch(err) {
        console.log(err.message);
        return null;
    }
}


export const workflowBroadcast = (runId: string) => ({

    dispatch: async (type: string, payload: any) => {
        await supabase.channel(`workflow_${runId}`).send({
            type: 'broadcast',
            event: 'workflow_action',
            payload: { type, ...payload }
        });
    }
});