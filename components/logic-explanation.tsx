'use client';

import { Card } from '@/components/ui/card';
import { LogicExplanation } from '@/types/metrics';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface LogicExplanationProps {
  logic: LogicExplanation;
}

export function LogicExplanationSection({ logic }: LogicExplanationProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const sections = [
    { id: 'summary', title: 'Code Summary', content: logic.summary },
    { id: 'purpose', title: 'Purpose', content: logic.purpose },
    { id: 'complexity', title: 'Complexity Analysis', content: logic.complexity },
    { id: 'patterns', title: 'Design Patterns', content: logic.patterns.join(', ') },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Code Logic Explanation</h2>

      {/* Quick Overview */}
      <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-300 mb-1">Time Complexity</p>
            <p className="text-sm font-medium text-cyan-400">{logic.timeComplexity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Space Complexity</p>
            <p className="text-sm font-medium text-cyan-400">{logic.spaceComplexity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Code Complexity</p>
            <p className="text-sm font-medium text-indigo-400">{logic.complexity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-300 mb-1">Patterns Found</p>
            <p className="text-sm font-medium text-purple-400">{logic.patterns.length}</p>
          </div>
        </div>
      </Card>

      {/* Main Sections */}
      <div className="space-y-3">
        {sections.map(section => (
          <Card
            key={section.id}
            className="p-4 border-indigo-500/20 bg-slate-900/60 cursor-pointer transition-all hover:border-indigo-500/40"
            onClick={() =>
              setExpandedSection(expandedSection === section.id ? null : section.id)
            }
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">{section.title}</h4>
              {expandedSection === section.id ? (
                <ChevronUp className="h-5 w-5 text-indigo-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </div>

            {expandedSection === section.id && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                {section.id === 'patterns' ? (
                  <ul className="space-y-2">
                    {logic.patterns.map((pattern, idx) => (
                      <li key={idx} className="flex gap-2 text-slate-200">
                        <span className="text-cyan-400">•</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-200 text-sm">{section.content}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Inputs and Outputs */}
      <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
        <h3 className="text-lg font-semibold text-white mb-4">Data Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-emerald-400 mb-3">Inputs</h4>
            <ul className="space-y-2">
              {logic.inputs.map((input, idx) => (
                <li key={idx} className="flex gap-2 text-slate-200 text-sm">
                  <span className="text-emerald-400">↓</span>
                  <span>{input}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-3">Outputs</h4>
            <ul className="space-y-2">
              {logic.outputs.map((output, idx) => (
                <li key={idx} className="flex gap-2 text-slate-200 text-sm">
                  <span className="text-blue-400">↑</span>
                  <span>{output}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Execution Flow */}
      <Card className="p-6 border-indigo-500/20 bg-slate-900/60">
        <h3 className="text-lg font-semibold text-white mb-4">Execution Flow</h3>
        <div className="space-y-3">
          {logic.mainFlow.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-slate-200 text-sm pt-1">{step}</p>
              </div>
              {idx < logic.mainFlow.length - 1 && (
                <div className="absolute left-4 h-4 w-0.5 bg-indigo-500/20 ml-3" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
