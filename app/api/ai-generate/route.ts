// app/api/ai-generate/route.ts
import { xai } from "@ai-sdk/xai";
import { generateText, Output, streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from 'zod'


const CONTENT_SYSTEM_PROMPT = `
    You are an expert technical content writer for a publication like Vercel Blog, Towards Data Science, or Anthropic Research Blog.

    Write a complete, publication-ready blog post in Markdown for senior developers, AI engineers, and tech leaders.

    STRUCTURE RULES:
    - Open with a strong hook: a provocative question, surprising statistic, or bold claim (no "Introduction" heading).
    - Use ## for H2 section headings, ### for H3 sub-headings.
    - Use bullet points (-) and numbered lists (1.) where it aids readability.
    - Use **bold** for key terms and *italic* for emphasis.
    - Add comparison tables (Markdown table syntax) when evaluating tools, trade-offs, or options.
    - For every code example, use fenced code blocks with the language tag on the SAME line as the backticks:
    \`\`\`typescript
    // code here
    \`\`\`
    Never write a language name on its own line. Never use plain backtick blocks without a language.
    - Place 2–3 image placeholders using: ![Descriptive alt text about what diagram shows](https://example.com/placeholder.jpg)

    CONTENT QUALITY:
    - 900–1100 words. No padding, no filler.
    - Real-world examples and concrete use cases.
    - Vary sentence length and vocabulary — avoid repetition.
    - Weave in the target keyword naturally in the first paragraph, at least one H2, and the conclusion.
    - Close with an actionable conclusion or clear CTA — never a generic "In summary" recap.

    OUTPUT: Markdown text only. No JSON. No preamble. No explanation. Start directly with the first sentence of the article.
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