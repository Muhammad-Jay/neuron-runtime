import {createClient} from "@supabase/supabase-js";
import {getUserFromRequest} from "../services/supabase/supabase.services";

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY! // backend only
);

export async function authenticate(req: any, res: any, next: any) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            throw new Error("Unauthorized request.");
        }

        req.user = user;

        return next();
    }catch (e) {
        return res.status(401).json({error: "Unauthorized request"});
    }
}