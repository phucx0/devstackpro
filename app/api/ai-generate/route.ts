// app/api/ai-generate/route.ts
import { webSearch, xai } from "@ai-sdk/xai";
import { generateText, Output, streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from 'zod'

const METADATA_SYSTEM_PROMPT = `
  You are an SEO specialist. Given a blog topic, output ONLY a JSON object with:
  - title: SEO-friendly, under 70 chars
  - description: compelling meta description, under 160 chars  
  - slug: lowercase, hyphens only
  Output nothing else.
`.trim();

const CONTENT_SYSTEM_PROMPT = `
You are a senior technical writer and engineer with 12+ years of real-world experience shipping production systems at companies like Vercel, Stripe, and Anthropic. 
You write for an audience of senior developers, AI/ML engineers, and tech leaders. 
Your tone is confident, grounded, slightly opinionated, and deeply practical — never hype-heavy or marketing-like.

**Task:**
Write a complete, publication-ready blog post in Markdown.

**Target Topic:** {{TOPIC}}
**Primary Keyword:** {{TARGET_KEYWORD}}  
(Weave this keyword naturally into the first paragraph, at least one H2 section, and the conclusion.)

**STRUCTURE RULES:**
- Start directly with a strong hook: a provocative question, surprising but believable claim, or bold grounded statement. Do not use any "Introduction" heading.
- Use ## for H2 headings and ### for H3 sub-headings.
- Prefer flowing paragraphs for analysis. Use bullet points (-) only when they clearly improve clarity.
- Include at least one comparison table when discussing tools, approaches, or trade-offs.
- For code blocks: Always put the language tag on the same line as the opening backticks:
  \`\`\`typescript
  // code here
  \`\`\`

**CONTENT QUALITY:**
- Target length: 950–1200 words. Every sentence must add real value — no filler or generic statements.
- For every major claim or trend, cover:
  • Why it matters in practice
  • Technical trade-offs and limitations
  • At least one specific gotcha or lesson learned
- Vary vocabulary and sentence structure to sound human and engaging.

**STRICT STYLE RULES:**
- Write like a seasoned engineer sharing hard-earned lessons.
- Use direct, concise language with varied sentence length.
- Strictly avoid buzzwords: revolutionary, unprecedented, paradigm shift, game-changing, unleash, amplify, symbiotic, blazing, cutting-edge, transformative.
- Be honest about limitations and real-world constraints. State flaws plainly when they exist.
- Do NOT use first-person production claims ("In our production...", "I've seen..."). Use neutral third-person framing instead: "In practice, many teams report...", "A common pattern in production systems is...".

**CODE RULES:**
- Only include a code block when prose cannot clearly explain the concept.
- Keep code minimal — show only the essential part (prefer pseudocode or simplified sketches).
- Never use code to pad word count.

**FACTUALITY & SOURCE RULES:**
- Do NOT invent facts, benchmarks, statistics, or company-specific claims.
- Do NOT make absolute statements ("always", "never", "guaranteed").
- When discussing trends, use cautious language: "some teams report", "observations suggest", "there is no strong consensus".
- You have been given pre-researched notes and a verified source list.
  Base all factual claims strictly on those notes — do not invent or extrapolate beyond them.
- If a claim cannot be supported by the provided research, drop it or frame it as general engineering knowledge.
- Citations are NOT required in the output. Do not use footnotes ([^1]), inline links, or reference markers.
  The research notes serve as internal verification only — they ground your writing, not decorate it.
  Readers trust the content because it is well-reasoned, not because it is heavily cited.

**OUTPUT RULES:**
- Output **Markdown ONLY**. No preamble, no explanations, no metadata, no emojis.
- No footnotes, no citation markers, no reference links anywhere in the output.
- Start directly with the blog content.
- End with a practical, actionable conclusion.

**Self-Check (perform internally before outputting):**
Verify the post satisfies:
- Strong opening hook
- Natural keyword integration
- At least one comparison table
- Honest discussion of trade-offs and gotchas
- No forbidden buzzwords
- No footnotes or citation markers
- Correct code block format
- Word count is STRICTLY between 950–1200 words — recount if unsure, trim if over

**WORD COUNT ENFORCEMENT:**
- Target: 950–1200 words. This is a hard limit, not a suggestion.
- Before outputting, mentally count sections: aim for 3–4 H2 sections, each 150–250 words.
- If a section runs long, cut the weakest sentences first — never pad to fill space.
- Stop writing when you hit 1200 words, even if the conclusion feels incomplete.
  A tight ending beats an overlong one.

Now, write the blog post.
`.trim();
// ==================== MODEL CONFIGURATION ====================

/**
 * Research & Reasoning Model
 * - Dùng cho việc tìm kiếm trending topic, nghiên cứu thông tin
 * - Hỗ trợ tool calling mạnh (web_search, browse_page, ...)
 * - Reasoning depth cao hơn
 */
const researchModel = xai.responses("grok-4-1-fast-reasoning");

/**
 * Fast Chat / Writing Model  
 * - Dùng cho việc tạo metadata (title, description, slug)
 * - Dùng cho stream nội dung bài viết (khi không cần search thêm)
 * - Tốc độ nhanh, chi phí thấp hơn
 * - Không cần tool calling
 */
const writingModel = xai("grok-4-1-fast-non-reasoning");

export async function POST(req: NextRequest) {
    try {
        const { prompt, userId } = await req.json();
        if(userId !== "9d0db667-9e8c-4dda-b514-ed92e2404afa") {
            return new Response(
                JSON.stringify({ error: "You are not allowed to perform this action" }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }
        if (!prompt?.trim()) {
            return new Response(
                JSON.stringify({ error: "Prompt is required!" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        // === 1. Research phase — dùng web_search để gather sources trước ===
        const researchResult = await generateText({
        model: researchModel,
        tools: {
            web_search: xai.tools.webSearch({
                allowedDomains: [
                    "arxiv.org",
                    "technologyreview.com",
                    "techcrunch.com",
                    "theverge.com",
                    "wired.com",
                ],
            }),
        },
        system: `You are a research assistant. Search the web for recent, credible information about the given topic.
            Focus on articles from the last 7 days. Return a structured research summary including:
            - Key findings with source URLs
            - Relevant quotes with exact URLs
            - Current trends and developments
            Do NOT write a blog post — only return raw research notes.`,
        prompt: `Research this topic thoroughly: ${prompt}`,
        temperature: 0.3,
        maxOutputTokens: 2000,
        });

        const researchNotes = researchResult.text;
        const sources = researchResult.sources ?? [];
        // Narrow type — chỉ lấy source có URL
        const urlSources = sources.filter(
            (s): s is Extract<typeof s, { sourceType: "url" }> => s.sourceType === "url"
        );
        const sourceList = urlSources
        .map((s, i) => `[${i + 1}] ${s.url}${s.title ? ` — ${s.title}` : ""}`)
        .join("\n");

        // === 1. Tạo Metadata (title, description, slug) ===
        const metadataResult = await generateText({
            model: writingModel,
            system: METADATA_SYSTEM_PROMPT,    
            prompt: `Topic: ${prompt}\n\nResearch summary:\n${researchNotes}`,
            output: Output.object({
                schema: z.object({
                title: z.string().max(70).describe("SEO-friendly title, under 70 chars, attractive and contains main keyword"),
                description: z.string().max(160).describe("Compelling meta description ≤ 160 chars"),
                slug: z.string()
                    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
                    .describe("URL slug: lowercase, hyphens only"),
                keyword: z.string().max(60).describe("Primary SEO keyword or phrase"),
                }),
            }),
            temperature: 0.6,
            maxOutputTokens: 300,
        });

        const meta = metadataResult.output;

        const filledSystemPrompt = CONTENT_SYSTEM_PROMPT
            .replace("{{TOPIC}}", meta.title)
            .replace("{{TARGET_KEYWORD}}", meta.keyword);
        // === 4. Stream bài viết — dùng research notes làm context ===
        const stream = streamText({
            model: writingModel,
            system: filledSystemPrompt,
            prompt: `Using the research notes below, write the complete blog post.
                
                RESEARCH NOTES:
                ${researchNotes}

                VERIFIED SOURCES (use these URLs when citing):
                ${sourceList || "No sources found — do not cite any URLs."}

                Guidelines:
                - Only cite URLs from the VERIFIED SOURCES list above
                - Do not invent statistics — use only what appears in the research notes
                - Citations are for direct quotes and specific data points only — not general statements`,
            temperature: 0.65,
            maxOutputTokens: 3000,
        });

        // Trả về stream + gửi metadata qua header
        const response = stream.toTextStreamResponse({
            headers: {
                "X-Blog-Meta": encodeURIComponent(JSON.stringify(meta)),
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
        return response;
    } catch (err) {
        console.error("[ai-generate]", err);
        return new Response(
            JSON.stringify({ error: "Không thể tạo bài viết. Vui lòng thử lại." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}