import { useEffect, useRef } from 'react';

interface DesmosGraphProps {
  expression: string;
  width?: number;
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    Desmos: any;
  }
}

export function DesmosGraph({ expression, width = 400, height = 300, className = '' }: DesmosGraphProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);

  useEffect(() => {
    // Load Desmos API script if not already loaded
    if (!window.Desmos) {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = initializeCalculator;
      document.body.appendChild(script);
    } else {
      initializeCalculator();
    }

    return () => {
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (calculatorInstance.current && expression) {
      // Clear previous expressions
      calculatorInstance.current.setBlank();
      
      // Parse and add expressions (support multiple separated by semicolons or newlines)
      const expressions = expression.split(/[;\n]/).filter(e => e.trim());
      expressions.forEach((expr, index) => {
        const trimmedExpr = expr.trim();
        calculatorInstance.current.setExpression({
          id: `graph-${index}`,
          latex: trimmedExpr, // Desmos accepts both LaTeX and plain text like y=x^2
        });
      });
    }
  }, [expression]);

  const initializeCalculator = () => {
    if (calculatorRef.current && window.Desmos) {
      calculatorInstance.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        zoomButtons: false,
        expressionsTopbar: false,
        pointsOfInterest: true,
        trace: false,
        border: false,
        lockViewport: false,
      });

      if (expression) {
        const expressions = expression.split(/[;\n]/).filter(e => e.trim());
        expressions.forEach((expr, index) => {
          calculatorInstance.current.setExpression({
            id: `graph-${index}`,
            latex: expr.trim(), // Desmos handles both LaTeX and plain text
          });
        });
      }
    }
  };

  return (
    <div className={className}>
      <div
        ref={calculatorRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="border rounded-lg"
      />
    </div>
  );
}
