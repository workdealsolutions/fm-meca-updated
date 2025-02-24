import React from 'react';
import './ProjectStepsDisplay.css';

const ProjectStepsDisplay = ({ steps, completedSteps, theme }) => {
    if (!steps || steps.length === 0) {
        return <div className={`steps-display ${theme}`}>No steps defined for this project.</div>;
    }

    return (
        <div className={`steps-display ${theme}`}>
            <h4>Project Steps:</h4>
            <ol className="steps-list">
                {steps.map((step, index) => (
                    <li key={index} className={`step-item ${completedSteps.includes(step.id) ? 'completed' : ''}`}>
                        <span className="step-number">{index + 1}.</span>
                        <span className="step-description">{step.description}</span>
                        <span className={`step-status ${completedSteps.includes(step.id) ? 'completed' : 'pending'}`}>
              {completedSteps.includes(step.id) ? 'Completed' : (step.status.charAt(0).toUpperCase() + step.status.slice(1))}
            </span>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ProjectStepsDisplay;
