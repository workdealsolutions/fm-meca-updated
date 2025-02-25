import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ProjectStepsDisplay.css';

<<<<<<< HEAD
const ProjectStepsDisplay = ({ steps, completedSteps, isLastProject }) => {
  const { isDark } = useTheme();
  const progress = steps ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  const getProgressGradient = () => {
    const successColor = isDark ? '#2f855a' : '#48bb78';
    const bgColor = isDark ? '#4a5568' : '#e2e8f0';
    return `linear-gradient(90deg, ${successColor} ${progress}%, ${bgColor} ${progress}%)`;
  };

  return (
    <>
      <div className="steps-display">
        <h4>Project Steps</h4>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`,
              background: getProgressGradient()
            }} 
          />
          <span className="progress-text">{progress}% Complete</span>
        </div>
        <ol className="steps-list">
          {steps && steps.map((step, index) => (
            <li 
              key={index} 
              className={`step-item ${completedSteps.includes(step.id) ? 'completed' : ''}`}
              style={{"--index": index}}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-description">{step.description}</span>
              <span className={`step-status ${completedSteps.includes(step.id) ? 'completed' : 'pending'}`}>
                {completedSteps.includes(step.id) ? 'Completed' : 'In Progress'}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {!isLastProject && <div className="project-separator" />}
    </>
  );
=======
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
>>>>>>> cf6d65c27f3ff2eb03eaa3207fec06cd90ed5f1b
};

export default ProjectStepsDisplay;
