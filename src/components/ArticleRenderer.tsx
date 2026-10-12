import React from "react";
import { Link } from "wouter";
import { Sparkles, Quote, ArrowRight, CheckCircle2 } from "lucide-react";

interface ArticleRendererProps {
  content: string;
}

/**
 * Clean dashes: removes em-dashes (—) and en-dashes (–) and replaces with clean hyphens, colons, or commas
 */
function cleanDashes(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, " - ")
    .replace(/[—–]/g, "-");
}

/**
 * Helper function to parse inline markdown (links [text](url), bold **text**, italic *text*)
 * into interactive React elements.
 */
function renderInlineContent(text: string): React.ReactNode[] {
  const cleaned = cleanDashes(text);
  // Regex to match links [text](url), bold **text**, or italic *text*
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(cleaned)) !== null) {
    // Add plain text before match
    if (match.index > lastIndex) {
      elements.push(cleaned.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Markdown link [anchor](url)
      const anchorText = match[2];
      const url = match[3];
      const isInternal = url.startsWith("/");

      if (isInternal) {
        elements.push(
          <Link
            key={`link-${match.index}`}
            href={url}
            className="text-navy font-semibold underline decoration-gold decoration-2 hover:text-gold hover:decoration-navy transition-colors inline-flex items-center gap-0.5 mx-0.5"
          >
            <span>{anchorText}</span>
          </Link>
        );
      } else {
        elements.push(
          <a
            key={`ext-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy font-semibold underline decoration-gold decoration-2 hover:text-gold transition-colors inline-flex items-center gap-0.5 mx-0.5"
          >
            <span>{anchorText}</span>
          </a>
        );
      }
    } else if (match[4]) {
      // Bold text **bold** - only this specific word/phrase is bold, not the whole paragraph!
      elements.push(
        <strong
          key={`b-${match.index}`}
          className="font-bold text-navy"
        >
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // Italic text *italic*
      elements.push(
        <em key={`i-${match.index}`} className="italic text-gray-700">
          {match[5]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  // Add trailing plain text
  if (lastIndex < cleaned.length) {
    elements.push(cleaned.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [cleaned];
}

/**
 * Generates URL-friendly anchor ID for Table of Contents jump links
 */
export function slugifyHeading(text: string): string {
  return cleanDashes(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

type ContentBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "h4"; text: string; id: string }
  | { type: "callout"; text: string; isTakeaway: boolean }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

/**
 * Line-by-line block parser that guarantees:
 * 1. Headings are strictly one line and never engulf following text
 * 2. Paragraphs are normal weight and never forced into bold headings
 * 3. Lists and callouts are neatly structured
 */
function parseBlocks(rawContent: string): ContentBlock[] {
  const lines = rawContent.split(/\r?\n/);
  const blocks: ContentBlock[] = [];

  let currentPara: string[] = [];
  let currentUl: string[] = [];
  let currentOl: string[] = [];
  let currentCallout: string[] = [];

  const flushPara = () => {
    if (currentPara.length > 0) {
      blocks.push({ type: "p", text: currentPara.join(" ") });
      currentPara = [];
    }
  };

  const flushUl = () => {
    if (currentUl.length > 0) {
      blocks.push({ type: "ul", items: [...currentUl] });
      currentUl = [];
    }
  };

  const flushOl = () => {
    if (currentOl.length > 0) {
      blocks.push({ type: "ol", items: [...currentOl] });
      currentOl = [];
    }
  };

  const flushCallout = () => {
    if (currentCallout.length > 0) {
      const fullText = currentCallout.join(" ");
      const isTakeaway =
        fullText.toLowerCase().includes("takeaway") ||
        fullText.toLowerCase().includes("pro author tip") ||
        fullText.toLowerCase().includes("tip");
      blocks.push({ type: "callout", text: fullText, isTakeaway });
      currentCallout = [];
    }
  };

  const flushAll = () => {
    flushPara();
    flushUl();
    flushOl();
    flushCallout();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line -> flush open blocks
    if (!trimmed) {
      flushAll();
      continue;
    }

    // H2 Heading (## ...)
    if (trimmed.startsWith("## ")) {
      flushAll();
      const text = cleanDashes(trimmed.replace(/^##\s+/, ""));
      blocks.push({ type: "h2", text, id: slugifyHeading(text) });
      continue;
    }

    // H3 Heading (### ...)
    if (trimmed.startsWith("### ")) {
      flushAll();
      const text = cleanDashes(trimmed.replace(/^###\s+/, ""));
      blocks.push({ type: "h3", text, id: slugifyHeading(text) });
      continue;
    }

    // H4 Heading (#### ...)
    if (trimmed.startsWith("#### ")) {
      flushAll();
      const text = cleanDashes(trimmed.replace(/^####\s+/, ""));
      blocks.push({ type: "h4", text, id: slugifyHeading(text) });
      continue;
    }

    // Callout quote (> ...)
    if (trimmed.startsWith("> ")) {
      flushPara();
      flushUl();
      flushOl();
      currentCallout.push(trimmed.replace(/^>\s*/, ""));
      continue;
    }

    // Unordered List (- ... or * ...)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushPara();
      flushOl();
      flushCallout();
      currentUl.push(trimmed.replace(/^[-*]\s*/, ""));
      continue;
    }

    // Ordered List (1. ...)
    if (/^\d+\.\s+/.test(trimmed)) {
      flushPara();
      flushUl();
      flushCallout();
      currentOl.push(trimmed.replace(/^\d+\.\s*/, ""));
      continue;
    }

    // Regular paragraph line
    flushUl();
    flushOl();
    flushCallout();
    currentPara.push(trimmed);
  }

  flushAll();
  return blocks;
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ content }) => {
  const blocks = parseBlocks(content);

  return (
    <div className="article-body font-sans text-gray-800 space-y-6">
      {blocks.map((block, idx) => {
        if (block.type === "h2") {
          return (
            <h2
              key={idx}
              id={block.id}
              className="text-2xl md:text-3xl font-serif font-black text-navy mt-12 mb-4 pt-6 border-t border-gray-150 scroll-mt-28 flex items-baseline gap-2.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block flex-shrink-0" />
              <span>{block.text}</span>
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={idx}
              id={block.id}
              className="text-xl md:text-2xl font-serif font-bold text-navy mt-8 mb-3 scroll-mt-28"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "h4") {
          return (
            <h4
              key={idx}
              id={block.id}
              className="text-lg md:text-xl font-serif font-bold text-navy mt-6 mb-2"
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "callout") {
          return (
            <div
              key={idx}
              className="my-8 bg-amber-50/70 border-l-4 border-gold rounded-r-xl p-6 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                {block.isTakeaway ? (
                  <div className="w-8 h-8 rounded-lg bg-gold/20 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-navy" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Quote className="w-4 h-4 text-navy" />
                  </div>
                )}
                <div className="flex-1 text-sm md:text-base font-normal text-gray-800 leading-relaxed">
                  {renderInlineContent(block.text)}
                </div>
              </div>
            </div>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={idx} className="my-5 space-y-3 pl-2">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 text-base font-normal text-gray-800 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 flex-shrink-0" />
                  <div className="flex-1 font-normal text-gray-800">
                    {renderInlineContent(item)}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={idx} className="my-6 space-y-3.5 pl-1">
              {block.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3.5 text-base font-normal text-gray-800 leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-full bg-navy text-gold font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1 font-normal text-gray-800">
                    {renderInlineContent(item)}
                  </div>
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph: STRICTLY font-normal text-gray-800, never bold!
        return (
          <p
            key={idx}
            className="text-base md:text-lg font-normal text-gray-800 leading-relaxed mb-5"
          >
            {renderInlineContent(block.text)}
          </p>
        );
      })}
    </div>
  );
};
