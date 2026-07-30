/**
 * @file WorkflowSteps.tsx
 * 8-Step Study Workflow navigation component
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { STUDY_STEPS } from '../../constants/theme';
import { StatusBadge } from '../common/StatusBadge';
import { StepStatus } from '../../types/typeApproval';

export const WorkflowSteps: React.FC = () => {
  const { activeStep, setActiveStep, currentRequest } = useApp();

  const getStepStatus = (stepId: number): StepStatus => {
    const key = `step${stepId}` as keyof typeof currentRequest.stepStatuses;
    return currentRequest.stepStatuses[key] || 'لم_تبدأ';
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-x-auto">
      <div className="grid grid-flow-col auto-cols-max lg:auto-cols-fr min-w-full divide-x divide-x-reverse divide-slate-100 dark:divide-slate-800">
        {STUDY_STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const status = getStepStatus(step.id);

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-1.5 py-2 px-2 text-right transition border-b-2 min-w-[125px] lg:min-w-0 ${
                isActive
                  ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-bold'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-[11px] font-extrabold font-mono flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {step.id}
              </span>

              <div className="flex flex-col min-w-0 flex-1 leading-tight text-right">
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                  {step.title}
                </span>
                <div className="mt-0.5">
                  <StatusBadge status={status} size="sm" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
