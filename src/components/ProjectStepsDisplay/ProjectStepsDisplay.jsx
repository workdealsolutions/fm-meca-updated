import React from 'react';
import './ProjectStepsDisplay.css';

const ProjectStepsDisplay = ({ steps, completedSteps, theme }) => {
  return (
    <div className={`steps-display ${theme}`}>
      <h4>Project Steps:</h4>
      <ol className="steps-list">
        {steps && steps.map((step, index) => (
          <li key={index} className={`step-item ${completedSteps.includes(step.id) ? 'completed' : ''}`}>
            <span className="step-number">{index + 1}.</span>
            <span className="step-description">{step.description}</span>
            <span className={`step-status ${completedSteps.includes(step.id) ? 'completed' : 'pending'}`}>
              {completedSteps.includes(step.id) ? 'Completed' : 'Pending'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProjectStepsDisplay;
