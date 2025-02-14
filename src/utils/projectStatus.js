export const PROJECT_STATUS = {
  PENDING: 'pending',
  ADMIN_APPROVED: 'admin-approved',
  DECLINED: 'declined',
  IN_PROGRESS: 'in-progress',
  COMPLETED_PENDING_REVIEW: 'completed-pending-review',
  COMPLETED: 'completed',
  REVISION_NEEDED: 'revision-needed'
};

export const getStatusLabel = (status) => {
  const labels = {
    [PROJECT_STATUS.PENDING]: 'Pending Review',
    [PROJECT_STATUS.ADMIN_APPROVED]: 'Approved - Pending Assignment',
    [PROJECT_STATUS.DECLINED]: 'Declined',
    [PROJECT_STATUS.IN_PROGRESS]: 'In Progress',
    [PROJECT_STATUS.COMPLETED_PENDING_REVIEW]: 'Awaiting Final Review',
    [PROJECT_STATUS.COMPLETED]: 'Completed',
    [PROJECT_STATUS.REVISION_NEEDED]: 'Needs Revision'
  };
  return labels[status] || status;
};
