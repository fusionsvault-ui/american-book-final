import React from "react";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  light?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  light = false,
  className = "",
}) => {
  // Build Schema.org BreadcrumbList structured data for search crawlers
  const schemaItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://beyondbookpublishing.com/",
    },
    ...items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: item.label,
      item: item.href
        ? `https://beyondbookpublishing.com${item.href}`
        : undefined,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  const textColor = light ? "text-gray-300" : "text-gray-600";
  const hoverColor = light ? "hover:text-gold" : "hover:text-gold";
  const activeColor = light ? "text-gold font-semibold" : "text-navy font-bold";
  const separatorColor = light ? "text-gray-400" : "text-gray-400";

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center flex-wrap gap-1.5 text-xs md:text-sm py-2 ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Home crumb */}
      <Link
        href="/"
        className={`inline-flex items-center gap-1.5 ${textColor} ${hoverColor} transition-colors group`}
        title="Go to Homepage"
      >
        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform flex-shrink-0" />
        <span>Home</span>
      </Link>

      {/* Dynamic crumbs */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className={`w-3.5 h-3.5 ${separatorColor} flex-shrink-0`} />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={`${textColor} ${hoverColor} transition-colors line-clamp-1 max-w-[200px] md:max-w-none`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${activeColor} truncate max-w-[240px] md:max-w-[420px]`}
                aria-current={isLast ? "page" : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
