// app/api/ai-generate/route.ts
import { xai } from "@ai-sdk/xai";
import { generateText, Output, streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from 'zod'

/**
 * 
 * Hãy tìm hiểu một chủ đề đang trending về AI thời gian gần đây, phạm vi 1 tuần đổ lại đây. Dựa trên những bài báo uy tín để tham khảo. 
 */

const CONTENT_SYSTEM_PROMPT = `
    You are a senior technical writer and engineer with 12+ years of real-world experience shipping production systems at companies like Vercel, Stripe, and Anthropic. 
    You write for an audience of senior developers, AI/ML engineers, and tech leaders. Your tone is confident, grounded, slightly opinionated, and practical — never hype-heavy or marketing-like.

    Write a complete, publication-ready blog post in Markdown.

    STRUCTURE RULES:
    - Start directly with a strong hook: a provocative question, surprising but believable statistic, or bold but grounded claim. No "Introduction" heading.
    - Use ## for H2 headings, ### for H3 sub-headings.
    - Use bullet points (-) and numbered lists (1.) only when they improve clarity. Prefer flowing paragraphs for analysis.
    - Use **bold** sparingly for key concepts. Use *italic* for subtle emphasis.
    - Include at least one comparison table when discussing tools, approaches, or trade-offs.
    - For every code example: Use fenced code blocks with the language tag on the SAME line as the opening backticks. Example:
      \`\`\`typescript
      // your code here
      \`\`\`
      Never put the language name on its own line. Never add "Copy", "Copied!", or any extra text. Never use plain \`\`\` without a language.

    CONTENT QUALITY:
    - Target 950–1100 words. Every sentence must add value — no padding, no filler, no generic statements.
    - Provide real-world examples, concrete use cases, and implementation details. For every major claim or trend, include:
      • Why it matters in practice
      • Technical trade-offs or limitations
      • At least one specific gotcha or lesson learned
    - Weave the target keyword/phrase naturally into the first paragraph, at least one H2 section, and the conclusion.
    - Vary vocabulary and sentence structure heavily to sound human and engaging.

    STRICT STYLE RULES:
    - Write like a seasoned engineer sharing hard-earned lessons, not a hype article.
    - Use direct, concise language. Vary sentence length.
    - Avoid buzzwords such as: revolutionary, unprecedented, paradigm shift, game-changing, unleash, amplify human potential, symbiotic, blazing, cutting-edge.
    - Be honest about limitations, trade-offs, and real-world constraints.
    - Use experience-based framing when relevant (e.g. "In production we've seen...", "One common pitfall is...", "From our benchmarks...").

    - DO NOT use any emojis, emoticons, or decorative symbols.
    - DO NOT use visual icons or symbolic markers (e.g. ✔ ❌ ❗ 👉 🚀 ✨).
    - Use plain Markdown only.

    STRUCTURE RULES:
    - Start directly with a strong hook. No "Introduction" heading.
    - Use ## for H2, ### for H3.
    - Use bullet points only when necessary. Prefer paragraphs for explanations.
    - Use only "-" for bullet points. Do not use other bullet styles.
    - Use **bold** sparingly and *italic* only for subtle emphasis.
    - Include at least one comparison table when relevant.

    STRICT FACTUALITY RULES:
    - Do NOT invent facts, benchmarks, adoption claims, or company usage details.
    - Do NOT make strong macro claims without clear, widely established grounding.
    - Avoid speculative or absolute statements such as "always", "never", "guaranteed".

    - When discussing trends:
    - Use neutral phrasing such as "reports suggest", "observations indicate", or "some engineering teams report".
    - If evidence is unclear, explicitly state uncertainty (e.g. "there is no widely agreed consensus").

    SOURCE HANDLING RULES:
    - You do NOT have access to external sources.
    - Do NOT fabricate citations or reference specific articles.
    - You may refer generically to reputable publications (e.g. MIT Technology Review, Wired, Bloomberg) only as context categories, not as exact sources.

    OUTPUT RULES:
    - Markdown ONLY.
    - No preamble, no explanations, no metadata.
    - Do NOT include any emojis, icons, or decorative formatting.
    - Start directly with the blog content.
    - End with a practical, actionable conclusion.
`.trim();

const model = xai("grok-4-1-fast-non-reasoning");

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
        console.log()
        // === 1. Tạo Metadata (title, description, slug) ===
        const metadataResult = await generateText({
            model,
            system: CONTENT_SYSTEM_PROMPT,    
            prompt: prompt,
            output: Output.object({
                schema: z.object({
                title: z.string().max(70).describe("SEO-friendly title, under 70 chars, attractive and contains main keyword"),
                description: z.string().max(160).describe("Compelling meta description ≤ 160 chars"),
                slug: z.string()
                    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
                    .describe("URL slug: lowercase, hyphens only, no spaces or special characters"),
                }),
            }),
            temperature: 0.6,
            maxOutputTokens: 300,
        });

        const meta = metadataResult.output;

        // === 2. Stream nội dung bài viết ===
        const stream = streamText({
            model,
            system: CONTENT_SYSTEM_PROMPT,
            prompt: `Write a complete, high-quality blog post in markdown format.

                Title: ${meta.title}
                Description: ${meta.description}
                Slug: ${meta.slug}

                Topic: ${prompt}

                Make sure the content is professional, well-structured, SEO-friendly, and matches the title and description above.`,
            temperature: 0.65,
            maxOutputTokens: 4500,        // Tăng lên vì nội dung dài
        });

        // Trả về stream + gửi metadata qua header
        const response = stream.toTextStreamResponse({
        headers: {
            "X-Blog-Meta": JSON.stringify(meta),   // Frontend có thể đọc header này
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

function fixCodeBlocks(md: string): string {
    const supportedLangs = new Set([
        "js", "jsx", "ts", "tsx", "bash", "python",
        "css", "json", "html", "sql", "yaml", "shell"
    ]);

    const lines = md.split("\n");
    const result: string[] = [];
    let insideBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect existing opening/closing backtick fences
        if (line.trimStart().startsWith("```")) {
        insideBlock = !insideBlock;
        result.push(line);
        continue;
        }

        // If NOT inside a block, check if this line is a bare language name
        if (!insideBlock) {
        const trimmed = line.trim();
        if (supportedLangs.has(trimmed)) {
            // Collect all following lines until empty line or next lang keyword
            const codeLines: string[] = [];
            let j = i + 1;
            while (j < lines.length && lines[j].trim() !== "" && !supportedLangs.has(lines[j].trim())) {
            codeLines.push(lines[j]);
            j++;
            }

            if (codeLines.length > 0) {
            result.push(`\`\`\`${trimmed}`);
            result.push(...codeLines);
            result.push("```");
            i = j - 1; // skip processed lines
            continue;
            }
        }
        }

        result.push(line);
    }

    return result.join("\n");
}