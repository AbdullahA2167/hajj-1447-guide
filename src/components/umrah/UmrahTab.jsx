import React from 'react';
import { useAppState } from '../../store/appStore';

export function UmrahTab() {
  const { umrahSteps } = useAppState();

  return (
    <div className="tab">
      <header className="tab-header">
        <h2>Umrah guide</h2>
        <p>Use this step-by-step overview when you perform Umrah.</p>
      </header>
      <div className="steps-list">
        {umrahSteps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map(step => (
            <div key={step.id} className="step-card">
              <div className="step-order">Step {step.order}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-where">{step.where}</div>
              <div className="step-description">{step.description}</div>
              {step.tips && step.tips.length > 0 && (
                <ul className="step-tips">
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
