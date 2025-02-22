import React, { useState } from 'react';

const ProjectSteps = ({ theme, onSaveSteps, coworkers }) => {
  const [steps, setSteps] = useState([{ description: '', status: 'pending' }]);
  const [selectedCoworker, setSelectedCoworker] = useState('');
  const [deadline, setDeadline] = useState('');

  const addStep = () => {
    setSteps([...steps, { description: '', status: 'pending' }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const updateStep = (index, description) => {
    const newSteps = steps.map((step, i) => 
      i === index ? { ...step, description } : step
    );
    setSteps(newSteps);
  };

  const handleSave = () => {
    if (steps.some(step => !step.description.trim())) {
      alert('Please fill in all step descriptions');
      return;
    }
    if (!selectedCoworker) {
      alert('Please select a coworker');
      return;
    }
    if (!deadline) {
      alert('Please set a deadline');
      return;
    }
    onSaveSteps({
      steps,
      coworkerId: selectedCoworker,
      deadline
    });
  };

  return (
    <div className={`project-steps ${theme}`}>
      <h3>Project Steps</h3>
      {steps.map((step, index) => (
        <div key={index} className="step-item">
          <textarea
            placeholder={`Step ${index + 1} description`}
            value={step.description}
            onChange={(e) => updateStep(index, e.target.value)}
            className={theme}
          />
          <button 
            className={`remove-step ${theme}`}
            onClick={() => removeStep(index)}
          >
            Remove
          </button>
        </div>
      ))}
      
      <div className="assignment-details">
        <h4>Assignment Details</h4>
        <div className="select-wrapper">
          <label>Select Coworker</label>
          <select 
            value={selectedCoworker}
            onChange={(e) => setSelectedCoworker(e.target.value)}
            className={`select-coworker ${theme}`}
          >
            <option value="">Choose a coworker</option>
            {coworkers.map(coworker => (
              <option key={coworker.id} value={coworker.id}>
                {coworker.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="deadline-wrapper">
          <label>Set Deadline</label>
          <input 
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`deadline-input ${theme}`}
          />
        </div>
      </div>

      <div className="step-actions">
        <button className={`add-step ${theme}`} onClick={addStep}>
          Add Step
        </button>
        <button 
          className={`save-steps ${theme}`} 
          onClick={handleSave}
          disabled={!selectedCoworker || !deadline || steps.some(step => !step.description.trim())}
        >
          Assign Project
        </button>
      </div>
    </div>
  );
};

export default ProjectSteps;
