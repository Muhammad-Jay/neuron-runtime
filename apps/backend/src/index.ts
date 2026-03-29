import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your route modules
import testRoute from "./routes/test/test.route";
import workflowRoutes from "./routes/workflow.routes.js";
import authRoutes from "./routes/auth.routes.js";
import secretRoutes from "./routes/vault.route";
import deploymentRoutes from "./routes/deployment.route";
// import slackRoutes from "./routes/slack.route";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount your routes under paths
app.use("/test", testRoute);
app.use("/api/v1/workflows", workflowRoutes);
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/secrets', secretRoutes);
app.use('/api/v1/execute/workflow', deploymentRoutes)
// app.use('/auth/slack', slackRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});