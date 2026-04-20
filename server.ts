import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { governanceMiddleware } from "./src/middleware/governance.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin securely
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is missing. Server-side Firebase Admin features will be restricted.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }

  app.use(express.json());
  
  // Apply Enterprise Governance Middleware to all API routes
  app.use("/api", governanceMiddleware);

  // Fleet Proxy with Multi-Tier Failover
  app.post("/api/v1/fleet/chat", async (req, res) => {
    const { 
      prompt, // Already redacted by middleware
      difficulty = 'simple', 
      forceFailover = false,
      governance // Metatdata from middleware
    } = req.body;
    
    const wasRedacted = governance?.wasRedacted || false;
    const redactedEntities = governance?.redactedEntities || [];
    
    // Routing Chain Policy
    const routingChain = [
      { provider: "OpenAI", model: difficulty === "complex" ? "gpt-4o" : "gpt-4o-mini" },
      { provider: "Anthropic", model: difficulty === "complex" ? "claude-3-5-sonnet-20241022" : "claude-3-haiku" },
      { provider: "Google", model: "gemini-1.5-flash" }
    ];

    if (difficulty === "complex") {
      [routingChain[0], routingChain[1]] = [routingChain[1], routingChain[0]];
    }

    const executionLogs: string[] = [];
    const timestamp = () => new Date().toISOString().split('T')[1].split('.')[0];
    
    if (wasRedacted) {
      executionLogs.push(`[${timestamp()}] [GOVERNANCE] ALERT: Sensitive data detected. Redacted entities: ${redactedEntities.join(', ')}`);
    }

    let finalResponse = "";
    let finalModelUsed = "";
    let finalProviderUsed = "";
    let success = false;

    for (let i = 0; i < routingChain.length; i++) {
      const tier = routingChain[i];
      const tierName = i === 0 ? "PRIMARY" : i === 1 ? "SECONDARY" : "TERTIARY";
      
      executionLogs.push(`[${timestamp()}] [${tierName}] Routing via SECURE GATEWAY: ${tier.provider} (${tier.model})...`);

      try {
        if (forceFailover && i === 0) {
          throw new Error(`Simulation: ${tier.provider} API returned 429 Rate Limit Exceeded`);
        }
        
        // Mock successful API response
        // In real prod, this is where you'd use your secrets to call the provider SDKs
        await new Promise(r => setTimeout(r, 400));
        
        finalResponse = `Response processed via high-privileged server gateway for ${difficulty} intent. Governance check verified. (PII Redacted: ${wasRedacted})`;
        finalModelUsed = tier.model;
        finalProviderUsed = tier.provider;
        success = true;
        
        executionLogs.push(`[${timestamp()}] EXECUTION SUCCESS: Verified response received.`);
        break; 
      } catch (error: any) {
        executionLogs.push(`[${timestamp()}] SECURE HANDLER FAULT: ${error.message}`);
        if (i < routingChain.length - 1) {
          executionLogs.push(`[${timestamp()}] AUTONOMOUS ACTION: Initiating fallback to ${routingChain[i+1].provider}.`);
        }
      }
    }

    res.json({
      success,
      provider: finalProviderUsed,
      model: finalModelUsed,
      content: finalResponse,
      wasRedacted,
      logs: executionLogs,
      latency: `${Math.floor(Math.random() * 200) + 400}ms`,
      cost: difficulty === 'complex' ? 0.005 : 0.0002
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
