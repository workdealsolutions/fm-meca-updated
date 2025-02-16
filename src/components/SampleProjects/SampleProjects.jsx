import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';

export const sampleProjects = [
  {
    id: 1,
    description: "E-commerce Website Development",
    budget: 5000,
    requirements: "- React.js frontend\n- Node.js backend\n- Payment integration\n- Responsive design",
    status: "in_progress",
    client: "any@email.com", // This will match any email
    progress: 65,
    submittedDate: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    description: "Mobile App UI Design",
    budget: 2500,
    requirements: "- Modern minimal design\n- iOS and Android layouts\n- 10 core screens\n- Design system",
    status: "pending_approval",
    client: "user@example.com",
    progress: 0,
    submittedDate: "2024-01-20T15:45:00.000Z"
  },
  {
    id: 3,
    description: "WordPress Blog Migration",
    budget: 800,
    requirements: "- Transfer existing content\n- Maintain SEO rankings\n- Update theme\n- Speed optimization",
    status: "completed",
    client: "user@example.com",
    progress: 100,
    submittedDate: "2023-12-01T09:00:00.000Z",
    projectUrl: "https://example-blog-migration.com", // Add project URL
    projectRepository: "https://github.com/example/blog-migration" // Optional: Add repository URL
  },
  {
    id: 4,
    description: "Logo Design Package",
    budget: 1200,
    requirements: "- 3 concept options\n- Brand colors\n- Vector files\n- Brand guidelines",
    status: "rejected",
    client: "user@example.com",
    progress: 0,
    submittedDate: "2024-01-10T11:20:00.000Z",
    rejectionReason: "Budget too low for the requested deliverables. Minimum budget for this scope should be $2000." // Add rejection reason
  }
];

const SampleProjects = ({ user, getStatusColor, getProgressColor, formatDate }) => {
  const sortProjects = (projects) => {
    return [...projects].sort((a, b) => {
      const statusPriority = {
        in_progress: 1,
        pending_approval: 2,
        completed: 3,
        rejected: 4
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });
  };

  // Remove the email filter to show all projects
  return (
    <div className="projects-list">
      {sortProjects(sampleProjects)
        .map(project => (
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
