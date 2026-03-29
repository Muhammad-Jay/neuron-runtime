import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    // Mocking a successful API response
    return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        data: {
            id: "test-execution-001",
            status: "completed",
            payload: {
                user: {
                    name: "Muhammad Ahmad",
                    role: "Software Engineer",
                    permissions: ["read", "write", "execute"]
                },
                metrics: {
                    latency: "24ms",
                    uptime: "99.9%"
                }
            },
            message: "HTTP Node trigger successful"
        }
    });
});

router.post("/", (req, res) => {
    const { title, userId, metadata } = req.body;

    // 1. Basic validation check to simulate a real API error
    if (!title || !userId) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields: title and userId are required.",
            received: req.body
        });
    }

    // 2. Return a success response mirroring the input
    return res.status(201).json({
        success: true,
        message: "Resource created successfully",
        requestContext: {
            method: req.method,
            contentType: req.headers["content-type"],
        },
        data: {
            id: `res_${Math.floor(Math.random() * 10000)}`,
            title: title,
            ownerId: userId,
            processedAt: new Date().toISOString(),
            // Echoing back the metadata you sent
            meta: metadata || {},
            internalFlags: ["verified", "node-trigger-active"]
        }
    });
});

export default router;