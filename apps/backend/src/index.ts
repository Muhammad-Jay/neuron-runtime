import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';

import testRoute from "./routes/test/test.route";
import workflowRoutes from "./routes/workflow.routes.js";
import authRoutes from "./routes/auth.routes.js";
import secretRoutes from "./routes/vault.route";
import deploymentRoutes from "./routes/deployment.route";
import executionRoute from "./routes/execution.route";
import workspaceRoute from "./routes/workspace.route";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*", // Development
}));
app.use(express.json());

const saveLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: { error: "Too many save requests. Please wait a moment." }
});

app.use('/api/v1/workflows/:id/graph', saveLimiter);

// Mount your routes under paths
app.use("/test", testRoute);
app.use("/api/v1/workflows", workflowRoutes);
app.use('/api/v1/workspaces',workspaceRoute);
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/secrets', secretRoutes);
app.use('/api/v1/execute/workflow', deploymentRoutes);
app.use('/api/v1/executions', executionRoute);
// app.use('/auth/slack', slackRoutes);


app.use((err: any, req: any, res: any, next: any) => {
    console.error(`[Global Error]: ${err.message}`);

    // Default to 500 if no status is set
    const status = err.status || 500;

    res.status(status).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : "An unexpected error occurred."
    });
});

// Health check
app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application continues running instead of crashing
});

process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);

    // orchestrator restart a "clean" instance.
    // process.exit(1);
});