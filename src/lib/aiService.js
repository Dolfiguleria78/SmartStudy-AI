// AI Service connected with Google Gemini API & fallback engine

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const getStoredApiKey = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('GEMINI_API_KEY') || DEFAULT_API_KEY;
  }

  return DEFAULT_API_KEY;
};

export const setStoredApiKey = (key) => {
  if (typeof localStorage !== 'undefined') {
    if (key) {
      localStorage.setItem('GEMINI_API_KEY', key.trim());
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  }
};

/**
 * Clean JSON string returned by AI (strips markdown code blocks)
 */
const cleanJsonString = (str) => {
  if (!str) return '';
  let cleaned = str.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBracket = cleaned.indexOf('[');
  const firstBrace = cleaned.indexOf('{');
  
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket !== -1) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }
  return cleaned;
};

/**
 * Call Gemini REST API directly
 */
export const callGeminiApi = async (prompt, systemInstruction = '', jsonMode = false) => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  // Use gemini-flash-latest which resolves to active supported model
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const contents = [];
  
  if (systemInstruction) {
    contents.push({
      role: 'user',
      parts: [{ text: `System Instruction: ${systemInstruction}\n\nTask Instructions:\n${prompt}` }]
    });
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  const body = {
    contents,
    generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('No output text returned from Gemini API');
  }

  return candidateText;
};

/**
 * Smart Fallback response generator
 */
export const generateSmartFallback = async (taskType, inputData) => {
  await new Promise((res) => setTimeout(res, 600));

  switch (taskType) {
    case 'resume': {
      const { name, contact, education, skills, experience, objective } = inputData;
      return `# ${name || 'Alex Morgan'}
**Email/Contact:** ${contact || 'alex.morgan@email.com | (555) 234-5678'}

---

## 🎯 Professional Objective
${objective || 'Enthusiastic and results-driven student seeking an entry-level position in web development.'}

## 🎓 Education
- **${education || 'B.S. in Computer Science - Tech University (2022 - 2026)'}**

## 🛠 Skills & Competencies
- **Technical Skills:** ${skills || 'JavaScript, React, HTML5, CSS3, Python, Node.js'}

## 💼 Experience & Projects
${experience ? experience.split('\n').map(l => `- ${l}`).join('\n') : `- **Student Web Developer**\n  - Built modern web applications connected to third-party APIs.`}
`;
    }

    case 'notes': {
      const text = inputData.text || 'Artificial Intelligence';
      return `# 📚 Summary & Study Notes: ${text.slice(0, 35)}...

## Key Takeaways
- **Core Concept:** Understanding the fundamentals of the subject matter.
- **Main Objectives:** Enhance retention, highlight key terms, and streamline revision.

## 📌 Bullet Points Breakdown
- High-level overview of key topics covered in the text.
- Essential formulas, dates, or terminology to memorize.
`;
    }

    case 'presentation': {
      const topic = inputData.topic || 'Artificial Intelligence';
      return JSON.stringify([
        {
          slideNumber: 1,
          title: `Introduction to ${topic}`,
          bullets: [`Overview of ${topic}`, "Key historical milestones", "Modern industry impact"],
          speakerNotes: "Welcome everyone to today's topic overview."
        },
        {
          slideNumber: 2,
          title: "Core Concepts & Fundamentals",
          bullets: ["Key building blocks", "Data flow & architecture", "Performance metrics"],
          speakerNotes: "Let's explore how the core concepts connect."
        }
      ]);
    }

    default:
      return "Processed successfully.";
  }
};

/**
 * Unified AI Task runner with live API priority
 */
export const runAiTask = async (taskType, prompt, inputData, systemInstruction = '', jsonMode = false) => {
  const apiKey = getStoredApiKey();
  
  if (apiKey) {
    try {
      const responseText = await callGeminiApi(prompt, systemInstruction, jsonMode);
      if (jsonMode) {
        const cleaned = cleanJsonString(responseText);
        return JSON.parse(cleaned);
      }
      return responseText;
    } catch (err) {
      console.warn('Live Gemini API call error, using fallback:', err.message);
      const fallback = await generateSmartFallback(taskType, inputData);
      if (jsonMode && typeof fallback === 'string') {
        return JSON.parse(cleanJsonString(fallback));
      }
      return fallback;
    }
  } else {
    const fallback = await generateSmartFallback(taskType, inputData);
    if (jsonMode && typeof fallback === 'string') {
      return JSON.parse(cleanJsonString(fallback));
    }
    return fallback;
  }
};
