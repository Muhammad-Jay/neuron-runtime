/**
 * Middleware to enforce Neuron Platform API Key authentication.
 * For route that requires a deployed workflow execution.
 */
export const requireKey = (req: any, res: any, next: any) => {
    const apiKey = req.headers.get('x-neuron-key');

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: "Authentication Required",
            message: "Missing 'X-Neuron-Key' header. Please provide a valid deployment secret."
        });
    }

    // Ensures the key looks like a Neuron Live key before hitting the DB
    if (!apiKey.startsWith('nrn_live_')) {
        return res.status(403).json({
            success: false,
            error: "Invalid Identity",
            message: "The provided key does not match the Neuron protocol format."
        });
    }

    // This allows your Drizzle query to easily find the specific workflow
    req.workflowKey = apiKey;

    next();
};