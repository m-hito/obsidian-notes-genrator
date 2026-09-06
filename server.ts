import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function buildSystemPrompt(preset: string, enrichContext: boolean): string {
  return `You are an elite Computer Science Technical Note Architect specializing in high-yield, perfectly structured Obsidian Markdown (.md) notes for developers and university students.

YOUR ABSOLUTE MANDATE:
1. Output ONLY raw Obsidian-compliant Markdown.
2. The output MUST start directly with the top-level "# Title" on line 1. NEVER include introductory banter ("Here is your note", "Sure!", etc.) and do NOT wrap the entire output in a top-level \`\`\`markdown code block.
3. VISUAL RHYTHM & SCANNABILITY: Bold the first 2-3 words of key bullet points (e.g., "- **Plan before vibe coding:** ...", "- **Requirements gathering:** ...") so the reader can skim instantly.
4. OBSIDIAN ELEMENTS: Use Obsidian Callouts (> [!tip], > [!info], > [!warning], > [!note]) where appropriate, GFM tables for comparisons/commands, and ASCII flowcharts/directory trees in \`\`\`text codeblocks.
5. CODE BLOCKS: Always explicitly tag code blocks with appropriate language identifiers (bash, js, tsx, html, css, python, json, sql, text).
${enrichContext ? "6. ENRICHMENT ON: Automatically clarify and enrich underlying mechanics, CLI flags, configuration parameters, and mental models that the speaker mentioned quickly without losing the core structure." : "6. CONCISE FIDELITY: Stick strictly to what was explained in the transcript without introducing excessive tangential concepts."}

PRESET FORMAT RULES:
${
  preset === "technical"
    ? `PRESET A: TECHNICAL & CODE GUIDE
Structure the note strictly as follows:
- # [Descriptive Topic Title]
- (If source URL / lecture info is provided, include **Source:** bullet list followed by "---")
- # Quick Setup (Commands) or # Core Execution / Implementation (numbered step headings ## 1. ..., ## 2. ... with code blocks and text options)
- # What Each Step Does (detailed explanation of each command/file, explaining flags, packages, mechanics, and example directory trees like "Works/\\n└── tailwind/")
- # Example (clean code example with breakdown of utilities/APIs used)
- # Notes / Pitfalls (crucial caveats, CSS specificity/React rules, debugging tips)`
    : preset === "conceptual"
    ? `PRESET B: CONCEPTUAL & STRATEGIC FRAMEWORK
Structure the note strictly as follows:
- # [Descriptive Concept Title]
- ## Core Idea (1-2 punchy sentences with bold anchor concepts)
- ## Key Concepts (bulleted list where each bullet starts with **Bold Concept Term:** followed by clear explanation)
- ## Framework / Steps (numbered 1. **Step Name** → explanation / arrow flow)
- ## Practical Tips (bullet points with bold takeaway phrases, pitfalls to avoid, and best practices)
- ## What to Remember (workflow summary: **Stage A → Stage B → Stage C**, key mindset shift)
- ## 10-Second Recall (4-6 high-impact bold summary bullet points)`
    : `PRESET C: AUTO-DETECT
Analyze the transcript content:
- If the content is heavily command-driven, code-heavy, installation or API-focused: use the TECHNICAL & CODE GUIDE format (Quick Setup, What Each Step Does, Examples, Caveats).
- If the content is conceptual, system design, architectural, strategy, algorithm theory, or high-level methodology: use the CONCEPTUAL & STRATEGIC FRAMEWORK format (Core Idea, Key Concepts, Framework/Steps, Practical Tips, What to Remember, 10-Second Recall).
- If it is a hybrid: present the Core Idea & Architecture ASCII flow, followed by Quick Setup/Code Blocks, followed by What Each Step Does, and finish with a 10-Second Recall.`
}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API Route: Generate Note
  app.post("/api/generate-note", async (req, res) => {
    try {
      const { transcript, title, sourceUrl, preset = "auto", enrichContext = true } = req.body;

      if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
        return res.status(400).json({ error: "Transcript or notes text is required." });
      }

      const ai = getAiClient();
      const systemInstruction = buildSystemPrompt(preset, Boolean(enrichContext));

      let userPrompt = `TRANSCRIPT / RAW NOTES CONTENT:
"""
${transcript.trim()}
"""`;

      if (title && title.trim()) {
        userPrompt += `\n\nTARGET COURSE / TOPIC TITLE: "${title.trim()}"`;
      }
      if (sourceUrl && sourceUrl.trim()) {
        userPrompt += `\nSOURCE URL: ${sourceUrl.trim()}`;
      }

      userPrompt += `\n\nGenerate the complete, polished Obsidian Markdown note now. Begin directly with "# [Title]".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      let markdown = response.text || "";

      // Cleanup any accidental ```markdown wrapping if present
      markdown = markdown.trim();
      if (markdown.startsWith("```markdown\n")) {
        markdown = markdown.replace(/^```markdown\n/, "").replace(/\n```$/, "");
      } else if (markdown.startsWith("```\n") && markdown.endsWith("\n```")) {
        markdown = markdown.replace(/^```\n/, "").replace(/\n```$/, "");
      }

      return res.json({
        markdown,
        title: title || extractTitleFromMarkdown(markdown),
      });
    } catch (error: any) {
      console.error("Error generating note:", error);
      return res.status(500).json({
        error: error.message || "Failed to generate Obsidian note. Please check your API key or input.",
      });
    }
  });

  // API Route: Refine Note
  app.post("/api/refine-note", async (req, res) => {
    try {
      const { currentMarkdown, action, customPrompt } = req.body;

      if (!currentMarkdown || typeof currentMarkdown !== "string") {
        return res.status(400).json({ error: "Current markdown content is required." });
      }

      const ai = getAiClient();

      let instruction = "";
      switch (action) {
        case "add_ascii_flow":
          instruction =
            "Add or enrich clean ASCII flow diagrams, mental model trees, or pipeline boxes (e.g., using ```text blocks with arrows ↓ → and box outlines) in the most relevant sections of this note. Preserve all existing information and formatting.";
          break;
        case "add_recall":
          instruction =
            "Ensure there is a high-yield '## 10-Second Recall' section at the end with 4-6 ultra-concise, bolded anchor bullet points summarizing the core takeaways. Keep all existing note content.";
          break;
        case "add_comparison_table":
          instruction =
            "Add a clean GitHub Flavored Markdown (GFM) comparison or summary table to the note (e.g. comparing options, commands vs flags, pros vs cons, or before vs after). Preserve the rest of the note.";
          break;
        case "make_concise":
          instruction =
            "Tighten the note to be more concise and punchy without losing technical accuracy, code blocks, commands, or core mechanics. Remove filler phrasing and increase visual density.";
          break;
        case "custom":
          instruction = customPrompt || "Improve and polish the note according to Obsidian best practices.";
          break;
        default:
          instruction = "Refine and polish this Obsidian note according to best practices.";
      }

      const prompt = `You are an elite Computer Science Note Architect. Refine this Obsidian note according to the following specific instruction:

SPECIFIC INSTRUCTION:
${instruction}

CURRENT OBSIDIAN MARKDOWN NOTE:
"""
${currentMarkdown}
"""

CRITICAL RULES:
1. Output ONLY the updated Obsidian Markdown.
2. Start directly with "# [Title]".
3. Do NOT wrap output in a top-level \`\`\`markdown fence.
4. Maintain all code blocks, syntax tags, bold visual rhythm, and clean Obsidian hierarchy.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      let markdown = response.text || "";
      markdown = markdown.trim();
      if (markdown.startsWith("```markdown\n")) {
        markdown = markdown.replace(/^```markdown\n/, "").replace(/\n```$/, "");
      } else if (markdown.startsWith("```\n") && markdown.endsWith("\n```")) {
        markdown = markdown.replace(/^```\n/, "").replace(/\n```$/, "");
      }

      return res.json({
        markdown,
      });
    } catch (error: any) {
      console.error("Error refining note:", error);
      return res.status(500).json({
        error: error.message || "Failed to refine note.",
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware in dev, static files in prod
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

function extractTitleFromMarkdown(md: string): string {
  const match = md.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Obsidian Note";
}

startServer();
