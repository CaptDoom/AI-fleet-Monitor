import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "AI Fleet Manager API is running" });
  });

  // Mock Quota Data Endpoint
  app.get("/api/quotas", (req, res) => {
    // This will eventually fetch from Firestore or actual provider APIs
    const mockQuotas = [
      { id: '1', provider: 'OpenAI', model: 'gpt-4-turbo', useCase: 'General', total: 1000000, used: 850000, costPer1k: 0.01, status: 'Warning' },
      { id: '2', provider: 'Anthropic', model: 'claude-3-opus', useCase: 'Reasoning', total: 500000, used: 100000, costPer1k: 0.015, status: 'Healthy' },
      { id: '3', provider: 'Google', model: 'gemini-pro', useCase: 'Multi-modal', total: 2000000, used: 1950000, costPer1k: 0.0005, status: 'Exhausted' },
      { id: '4', provider: 'Groq', model: 'llama-3-8b', useCase: 'Fast Chat', total: 10000000, used: 2000000, costPer1k: 0.0001, status: 'Healthy' },
    ];
    res.json(mockQuotas);
  });

  // --- Fleet Manager Utilities ---
  const redactPII = (text: string) => {
    let redacted = text;
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
    redacted = redacted.replace(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "[REDACTED_PHONE]");
    redacted = redacted.replace(/\d{4}[\s-]\d{4}[\s-]\d{4}[\s-]\d{4}/g, "[REDACTED_CARD]");
    return redacted;
  };

  // Failover Proxy Endpoint
  app.post("/api/v1/fleet/chat", (req, res) => {
    const { 
      prompt, 
      difficulty = 'simple', 
      forceFailover = false 
    } = req.body;
    
    // 1. Governance: PII Redaction
    const safePrompt = redactPII(prompt);
    const wasRedacted = safePrompt !== prompt;
    
    // 2. Routing Chain Policy (Priority Based)
    const routingChain = [
      { provider: "OpenAI", model: difficulty === "complex" ? "gpt-4o" : "gpt-4o-mini" },
      { provider: "Anthropic", model: difficulty === "complex" ? "claude-3-5-sonnet-20241022" : "claude-3-haiku" },
      { provider: "Google", model: "gemini-1.5-flash" }
    ];

    // If it's complex, we might want Claude as primary instead
    if (difficulty === "complex") {
      // Swap OpenAI and Anthropic for complex tasks in this demo
      [routingChain[0], routingChain[1]] = [routingChain[1], routingChain[0]];
    }

    // 3. Autonomous Execution with Multi-Tier Failover
    const executionLogs: string[] = [];
    const timestamp = () => new Date().toISOString().split('T')[1].split('.')[0];
    
    let finalResponse = "";
    let finalModelUsed = "";
    let finalProviderUsed = "";
    let success = false;

    // Iterate through the chain until success or exhaustion
    for (let i = 0; i < routingChain.length; i++) {
      const tier = routingChain[i];
      const tierName = i === 0 ? "PRIMARY" : i === 1 ? "SECONDARY" : "TERTIARY";
      
      executionLogs.push(`[${timestamp()}] [${tierName}] Attempting route via ${tier.provider} (${tier.model})...`);

      try {
        // Simulate fault check
        // We simulate failure for the first provider if forceFailover is true
        if (forceFailover && i === 0) {
          throw new Error(`Connection Timeout: ${tier.provider} API is non-responsive`);
        }
        
        // Final fallback simulation: 5% random failure chance in production simulation
        if (process.env.NODE_ENV === 'production' && Math.random() < 0.05) {
          throw new Error(`Internal Server Error (500) from ${tier.provider}`);
        }

        // Success Path
        finalResponse = `Successfully processed ${difficulty} task using ${tier.provider}. (Redacted: ${wasRedacted})`;
        finalModelUsed = tier.model;
        finalProviderUsed = tier.provider;
        success = true;
        
        executionLogs.push(`[${timestamp()}] EXECUTION SUCCESS: Response received from ${tier.provider}.`);
        break; // Exit loop on success
      } catch (error: any) {
        executionLogs.push(`[${timestamp()}] FAULT DETECTED: ${error.message}`);
        
        if (i < routingChain.length - 1) {
          executionLogs.push(`[${timestamp()}] AUTONOMOUS ACTION: Initiating failover to tier ${i + 2}.`);
        } else {
          executionLogs.push(`[${timestamp()}] CRITICAL: All providers in fleet exhausted.`);
          finalResponse = `CRITICAL ERROR: Fleet Manager unable to fulfill request. All ${routingChain.length} tiers failed.`;
          finalModelUsed = "None";
          finalProviderUsed = "None";
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
      latency: `${Math.floor(Math.random() * 200) + 100}ms`,
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
