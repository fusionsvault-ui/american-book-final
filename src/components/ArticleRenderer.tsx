import React from "react";
import { Link } from "wouter";
import { Sparkles, Quote, ArrowRight, CheckCircle2 } from "lucide-react";

interface ArticleRendererProps {
  content: string;
}

/**
 * Helper function to parse inline markdown (links [text](url), bold **text**, italic *text*)
 * into interactive React elements.
 */
function renderInlineContent(text: string): React.ReactNode[] {
  // Regex to match links [text](url), bold **text**, or italic *text*
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Add plain text before match
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // It's a markdown link [anchor](url)
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
      // It's bold text **bold**
      elements.push(
        <strong
          key={`b-${match.index}`}
          className="font-bold text-navy tracking-tight"
        >
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // It's italic text *italic*
      elements.push(
        <em key={`i-${match.index}`} className="italic text-gray-700">
          {match[5]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  // Add trailing plain text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
}

/**
 * Generates URL-friendly anchor ID for Table of Contents jump links
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ content }) => {
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <div className="article-body font-sans text-gray-800 leading-relaxed space-y-6">
      {paragraphs.map((block, idx) => {
        const trimmed = block.trim();

        // H2 Heading
        if (trimmed.startsWith("## ")) {
          const headingText = trimmed.replace(/^##\s+/, "");
          const anchorId = slugifyHeading(headingText);
          return (
            <h2
              key={idx}
              id={anchorId}
              className="text-2xl md:text-3xl font-serif font-black text-navy mt-12 mb-4 pt-6 border-t border-gray-150 scroll-mt-28 flex items-baseline gap-2.5"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block flex-shrink-0" />
              <span>{headingText}</span>
            </h2>
          );
        }

        // H3 Subheading
        if (trimmed.startsWith("### ")) {
          const headingText = trimmed.replace(/^###\s+/, "");
          const anchorId = slugifyHeading(headingText);
          return (
            <h3
              key={idx}
              id={anchorId}
              className="text-xl md:text-2xl font-serif font-bold text-navy mt-8 mb-3 scroll-mt-28"
            >
              {headingText}
            </h3>
          );
        }

        // Callout box or Key Takeaway / Pro Tip (> blockquote)
        if (trimmed.startsWith("> ")) {
          const quoteBody = trimmed.replace(/^>\s+/, "");
          const isTakeaway =
            quoteBody.toLowerCase().includes("takeaway") ||
            quoteBody.toLowerCase().includes("pro author tip") ||
            quoteBody.toLowerCase().includes("tip");

          return (
            <div
              key={idx}
              className="my-8 bg-amber-50/70 border-l-4 border-gold rounded-r-xl p-6 shadow-xs relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                {isTakeaway ? (
                  <div className="w-8 h-8 rounded-lg bg-gold/20 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-navy" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Quote className="w-4 h-4 text-navy" />
                  </div>
                )}
                <div className="flex-1 text-sm md:text-base font-normal text-gray-800 leading-relaxed">
                  {renderInlineContent(quoteBody)}
                </div>
              </div>
            </div>
          );
        }

        // Unordered List (- bullet points)
        if (trimmed.startsWith("- ")) {
          const rawItems = trimmed
            .split("\n")
            .filter((line) => line.trim().startsWith("- "))
            .map((line) => line.trim().replace(/^- \s*/, ""));

          return (
            <ul key={idx} className="my-5 space-y-3 pl-2">
              {rawItems.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3 text-base font-normal text-gray-800 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 flex-shrink-0" />
                  <div className="flex-1">{renderInlineContent(item)}</div>
                </li>
              ))}
            </ul>
          );
        }

        // Ordered List (1. 2. 3. steps)
        if (/^\d+\.\s+/.test(trimmed)) {
          const rawItems = trimmed
            .split("\n")
            .filter((line) => /^\d+\.\s+/.test(line.trim()))
            .map((line) => line.trim().replace(/^\d+\.\s+/, ""));

          return (
            <ol key={idx} className="my-6 space-y-3.5 pl-1">
              {rawItems.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-start gap-3.5 text-base font-normal text-gray-800 leading-relaxed"
                >
                  <span className="w-6 h-6 rounded-full bg-navy text-gold font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    {itemIdx + 1}
                  </span>
                  <div className="flex-1">{renderInlineContent(item)}</div>
                </li>
              ))}
            </ol>
          );
        }

        // Regular Paragraph - Notice: strictly font-normal text-gray-800 text-base md:text-lg
        return (
          <p
            key={idx}
            className="text-base md:text-lg font-normal text-gray-800 leading-relaxed mb-5"
          >
            {renderInlineContent(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
