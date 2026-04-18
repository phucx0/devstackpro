// app/api/ai-generate/route.ts
import { xai } from "@ai-sdk/xai";
import { generateText, Output, streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from 'zod'


const CONTENT_SYSTEM_PROMPT = `
    You are a senior technical writer and engineer with 12+ years of real-world experience shipping production systems at companies like Vercel, Stripe, and Anthropic. 
    You write for an audience of senior developers, AI/ML engineers, and tech leaders. Your tone is confident, grounded, slightly opinionated, and practical — never hype-heavy or marketing-like.

    Write a complete, publication-ready blog post in Markdown.

    STRICT STYLE RULES:
    - Write like a seasoned engineer sharing hard-earned lessons, not a hype article. Use direct, concise language. Vary sentence length. Avoid buzzwords: revolutionary, unprecedented, paradigm shift, game-changing, unleash, amplify human potential, symbiotic, blazing, cutting-edge, etc.
    - Be honest about limitations and trade-offs. Include real-world gotchas and implementation challenges.
    - Occasionally weave in phrases that show experience: "In production we've seen...", "One common pitfall is...", "From our benchmarks...", "I recommend prioritizing this when...".

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

    OUTPUT RULES:
    - Markdown text ONLY. No JSON, no preamble, no explanations, no "Here is the article", no notes.
    - Start directly with the first sentence of the blog post.
    - End with a strong, actionable conclusion that includes a clear CTA or practical next step for the reader.
`.trim();

const model = xai("grok-4-1-fast-non-reasoning");

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt?.trim()) {
            return new Response(
                JSON.stringify({ error: "Prompt không được để trống" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

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