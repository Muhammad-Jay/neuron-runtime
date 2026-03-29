import {createClient} from "@supabase/supabase-js";
import {getUserFromRequest} from "../services/supabase/supabase.services";

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY! // backend only
);

export async function authenticate(req: any, res: any, next: any) {
    try {
        req.user = await getUserFromRequest(req);
        return next();
    }catch (e) {
        return res.status(401).json({error: "Unauthorized request"});
    }
}