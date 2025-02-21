import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';

const SampleProjects = ({ user, projects = [], getStatusColor, getProgressColor, formatDate }) => {
  const sortProjects = (projectsList) => {
    return [...projectsList].sort((a, b) => {
      const statusPriority = {
        in_progress: 1,
        pending_approval: 2,
        completed: 3,
        rejected: 4
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  if (!projects || projects.length === 0) {
    return <div className="no-projects-message">No project available</div>;
  }

  const sortedProjects = sortProjects(projects);

  return (
      <div className="projects-list">
        {sortedProjects.map(project => (
            <ProjectCard
                key={project.id}
                project={project}
                getStatusColor={getStatusColor}
                getProgressColor={getProgressColor}
                formatDate={formatDate}
            />
        ))}
      </div>
  );
};

export default SampleProjects;
