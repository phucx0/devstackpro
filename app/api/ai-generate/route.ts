// app/api/ai-generate/route.ts
import { xai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return NextResponse.json({ error: "Prompt không được để trống" }, { status: 400 });
        }

        const systemPrompt = `
            You are a technical content writer. Respond ONLY with a valid JSON object — no markdown, no explanation.

            Schema:
            {"title":"string","description":"string (≤160 chars)","content_md":"string (markdown, ≥500 words)"}

            content_md rules:
            - Markdown only, no HTML
            - Use ##/### headings, bullet points, **bold**
            - Every code block MUST use triple backticks + language tag

            Code format (STRICT):
            \`\`\`js
            code here
            \`\`\`

            Supported tags: js jsx ts tsx bash python css json html sql yaml
            Never write a language name alone on a line. Never use single backticks for multiline code.

            Match the language of the user's input.
        `;
        const result = await generateText({
            model: xai("grok-4-1-fast-reasoning"),
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            temperature: 0.7
        });

        const clean = result.text.replace(/```json|```/g, "").trim();
        const generated = JSON.parse(clean) as {
            title: string;
            description: string;
            content_md: string;
        };
        generated.content_md = fixCodeBlocks(generated.content_md);

        return NextResponse.json({ success: true, data: generated });
    } catch (err) {
        console.error("[ai-generate]", err);
        return NextResponse.json(
            { error: "Không thể tạo bài viết. Vui lòng thử lại." },
            { status: 500 },
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