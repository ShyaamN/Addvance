import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface DesmosInputProps {
  value: string;
  onChange: (value: string) => void;
}

declare global {
  interface Window {
    Desmos: any;
  }
}

export function DesmosInput({ value, onChange }: DesmosInputProps) {
  const [showPreview, setShowPreview] = useState(true);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.Desmos) {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    return () => {
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy();
        calculatorInstance.current = null;
      }
    };
  }, []);

  // Initialize calculator when preview is shown and Desmos is loaded
  useEffect(() => {
    if (showPreview && isLoaded && calculatorRef.current && !calculatorInstance.current) {
      initializeCalculator();
    }
  }, [showPreview, isLoaded]);

  // Update graph immediately when value changes
  useEffect(() => {
    // Ensure calculator is initialized first
    if (showPreview && isLoaded && calculatorRef.current && !calculatorInstance.current) {
      initializeCalculator();
    }
    
    // Update graph if calculator exists
    if (calculatorInstance.current && showPreview) {
      updateGraph();
    }
  }, [value, showPreview, isLoaded]);

  const initializeCalculator = () => {
    if (calculatorRef.current && window.Desmos && !calculatorInstance.current) {
      try {
        calculatorInstance.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
          keypad: false,
          expressions: false, // Hide expressions list for cleaner view
          settingsMenu: false,
          zoomButtons: true,
          expressionsTopbar: false,
          pointsOfInterest: true,
          trace: true,
          border: true,
          lockViewport: false,
        });

        if (value) {
          updateGraph();
        }
      } catch (error) {
        console.error('Error initializing Desmos calculator:', error);
      }
    }
  };

  const updateGraph = () => {
    if (!calculatorInstance.current) return;

    try {
      // Clear all existing expressions
      calculatorInstance.current.setBlank();
      
      // If no value, just leave it blank
      if (!value || !value.trim()) {
        return;
      }
      
      // Split by semicolons or newlines
      const expressions = value.split(/[;\n]/).filter(e => e.trim());
      
      // Add each expression to the calculator
      expressions.forEach((expr, index) => {
        const trimmedExpr = expr.trim();
        if (trimmedExpr) {
          calculatorInstance.current.setExpression({
            id: `input-${index}`,
            latex: trimmedExpr,
            color: index === 0 ? '#2464b4' : undefined, // Blue for first expression
          });
        }
      });
    } catch (error) {
      console.error('Error updating graph:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          📊 Graph Expression
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Preview
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter equations like: y=x^2 or x^2+y^2=25"
        rows={3}
        className="font-mono text-sm"
      />

      <div className="text-xs text-muted-foreground space-y-1">
        <p>✨ <strong>No LaTeX needed!</strong> Type naturally like in Desmos:</p>
        <ul className="ml-4 space-y-1">
          <li>• <code>y=x^2</code> (powers using ^)</li>
          <li>• <code>y=sin(x)</code> or <code>y=cos(x)</code> (trig functions)</li>
          <li>• <code>y=sqrt(x)</code> (square root)</li>
          <li>• <code>x^2+y^2=25</code> (circles and other equations)</li>
          <li>• <code>y=(x-2)^2+1</code> (transformations)</li>
        </ul>
        <p className="mt-2">💡 Separate multiple equations with semicolons or new lines</p>
      </div>

      {showPreview && value && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="space-y-2">
            <p className="text-sm font-medium">Live Preview:</p>
            {!isLoaded && (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading Desmos...
              </div>
            )}
            <div
              ref={calculatorRef}
              className="border rounded-lg bg-white"
              style={{ width: '100%', height: '300px' }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
