import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  children: string;
  className?: string;
  block?: boolean;
}

/**
 * Component that renders text with inline LaTeX math expressions
 * Only converts fractions to KaTeX, keeps regular text as normal text
 */
export default function MathText({ children, className = '', block = false }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement | HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let html = '';
    const text = children;

    // Pattern to match fractions: simple (1/2) or mixed (2 1/2)
    const fractionRegex = /(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)/g;
    
    let lastIndex = 0;
    let match;

    while ((match = fractionRegex.exec(text)) !== null) {
      // Add text before the match as plain HTML
      html += escapeHtml(text.substring(lastIndex, match.index));
      
      // Render the fraction with KaTeX
      try {
        if (match[1]) {
          // Mixed fraction like "2 1/2"
          const latex = `${match[1]}\\frac{${match[2]}}{${match[3]}}`;
          html += katex.renderToString(latex, {
            displayMode: false,
            throwOnError: false,
            output: 'html',
          });
        } else {
          // Simple fraction like "1/2"
          const latex = `\\frac{${match[4]}}{${match[5]}}`;
          html += katex.renderToString(latex, {
            displayMode: false,
            throwOnError: false,
            output: 'html',
          });
        }
      } catch (e) {
        html += escapeHtml(match[0]);
      }
      
      lastIndex = fractionRegex.lastIndex;
    }
    
    // Add remaining text as plain HTML
    html += escapeHtml(text.substring(lastIndex));

    containerRef.current.innerHTML = html;
  }, [children, block]);

  const Component = block ? 'div' : 'span';
  return <Component ref={containerRef as any} className={className} />;
}

// Helper to escape HTML entities
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
