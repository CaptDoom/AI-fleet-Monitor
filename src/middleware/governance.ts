import type { Request, Response, NextFunction } from 'express';

export const governanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.body && req.body.prompt) {
    const originalPrompt = req.body.prompt;
    const { redactedPrompt, wasRedacted, redactedEntities } = scanAndRedact(originalPrompt);
    
    // Inject redacted prompt back into body for downstream handlers
    req.body.prompt = redactedPrompt;
    req.body.governance = {
      wasRedacted,
      redactedEntities,
      originalLength: originalPrompt.length,
      redactedLength: redactedPrompt.length
    };
  }
  next();
};

const scanAndRedact = (text: string) => {
  let redacted = text;
  const entities: string[] = [];

  const patterns = [
    { 
      name: 'EMAIL',
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 
      replacement: '[REDACTED_EMAIL]' 
    },
    { 
      name: 'PHONE',
      regex: /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, 
      replacement: '[REDACTED_PHONE]' 
    },
    { 
      name: 'CREDIT_CARD',
      regex: /\b(?:\d[ -]*?){13,16}\b/g, 
      replacement: '[REDACTED_CARD]' 
    },
    { 
      name: 'SSN',
      regex: /\b\d{3}-\d{2}-\d{4}\b/g, 
      replacement: '[REDACTED_SSN]' 
    },
    {
      name: 'IPV4',
      regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      replacement: '[REDACTED_IP]'
    }
  ];

  patterns.forEach(p => {
    if (p.regex.test(redacted)) {
      entities.push(p.name);
      redacted = redacted.replace(p.regex, p.replacement);
    }
  });

  return {
    redactedPrompt: redacted,
    wasRedacted: entities.length > 0,
    redactedEntities: entities
  };
};
