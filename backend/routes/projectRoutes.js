// apiRoutes.js
const express = require('express');
const db = require('../db'); // Adjust the path to your DB connection file
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

/**
 * 1. Client Submits a Project Request
 *    POST /api/projects
 */
router.post(
    '/projects',
    authenticateToken,
    authorizeRole('client'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
        body('requirements').notEmpty().withMessage('Requirements are required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, description, budget, requirements } = req.body;
        try {
            await db.query(
                `INSERT INTO project_requests
                 (client_id, title, description, budget, requirements, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [req.user.id, title, description, budget, requirements, 'pending']
            );
            res.status(201).json({ message: 'Project request submitted successfully' });
        } catch (err) {
            console.error('Error submitting project request:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 2. Admin Initial Review (Approve/Decline)
 *    PATCH /api/projects/:id/review
 */
router.patch(
    '/projects/:id/review',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('status')
            .isIn(['admin-approved', 'declined'])
            .withMessage('Status must be either "admin-approved" or "declined"'),
        // adminFeedback is optional
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const { status, adminFeedback } = req.body;
        const projectId = req.params.id;
        try {
            await db.query(
                'UPDATE project_requests SET status = ?, adminFeedback = ?, reviewDate = NOW() WHERE id = ?',
                [status, adminFeedback, projectId]
            );
            const [updatedProject] = await db.query('SELECT * FROM project_requests WHERE id = ?', [projectId]);
            res.json(updatedProject[0]);
        } catch (err) {
            console.error('Error updating project review status:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 3. Admin Final Review (Mark as Completed or Revision Needed)
 *    PATCH /api/projects/:id/final-review
 */
router.patch(
    '/projects/:id/final-review',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('status')
            .isIn(['completed', 'revision-needed'])
            .withMessage('Status must be either "completed" or "revision-needed"'),
        // adminFeedback is optional
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const { status, adminFeedback } = req.body;
        const projectId = req.params.id;
        try {
            await db.query(
                'UPDATE project_requests SET status = ?, adminFeedback = ?, reviewDate = NOW() WHERE id = ?',
                [status, adminFeedback, projectId]
            );
            const [updatedProject] = await db.query('SELECT * FROM project_requests WHERE id = ?', [projectId]);
            res.json(updatedProject[0]);
        } catch (err) {
            console.error('Error updating project final review:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 4. Admin Assigns a Project with Steps
 *    PATCH /api/projects/:id/steps
 *    Stores the steps as JSON in the project_requests table along with assignment details.
 */
router.patch(
    '/projects/:id/steps',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('steps').isArray().withMessage('Steps must be an array'),
        body('coworkerId').notEmpty().withMessage('Coworker ID is required'),
        body('deadline').notEmpty().withMessage('Deadline is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const { steps, coworkerId, deadline } = req.body;
        const projectId = req.params.id;
        try {
            await db.query(
                `UPDATE project_requests
                 SET steps = ?, status = ?, assignedTo = ?, deadline = ?, assignedDate = NOW()
                 WHERE id = ?`,
                [JSON.stringify(steps), 'in-progress', coworkerId, deadline, projectId]
            );
            const [updatedProject] = await db.query('SELECT * FROM project_requests WHERE id = ?', [projectId]);
            res.json(updatedProject[0]);
        } catch (err) {
            console.error('Error updating project steps and assignment:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 5. Admin Views All Projects
 *    GET /api/projects
 */
router.get(
    '/projects',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const [projects] = await db.query('SELECT * FROM project_requests');
            res.json({ projects });
        } catch (err) {
            console.error('Error fetching project requests:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 6. Coworker Views Assigned Projects
 *    GET /api/projects/assigned
 */
router.get(
    '/projects/assigned',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
        try {
            const [projects] = await db.query(
                `SELECT pr.id, pr.title, pr.description, pr.budget, pr.requirements, pr.status, pr.created_at,
                        pr.deadline, pr.assignedBy, pr.assignedDate, pr.steps
                 FROM project_requests pr
                 WHERE pr.assignedTo = ?`,
                [req.user.id]
            );
            res.json({ projects });
        } catch (err) {
            console.error('Error fetching assigned projects:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 7. Client Views Their Own Project Requests
 *    GET /api/projects/my-requests
 */
router.get(
    '/projects/my-requests',
    authenticateToken,
    authorizeRole('client'),
    async (req, res) => {
        try {
            const [projects] = await db.query(
                `SELECT * FROM project_requests
                 WHERE client_id = ?`,
                [req.user.id]
            );
            res.json({ projects });
        } catch (err) {
            console.error('Error fetching client projects:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 8. Client Tracks Progress for All Their Projects
 *    GET /api/projects/my-progress
 *    Returns all projects (with steps stored as JSON) for the client.
 */
router.get(
    '/projects/my-progress',
    authenticateToken,
    authorizeRole('client'),
    async (req, res) => {
        try {
            const clientId = req.user.id;
            const [projects] = await db.query(
                `SELECT * FROM project_requests
                 WHERE client_id = ?
                 ORDER BY created_at`,
                [clientId]
            );
            // Optionally, you can parse the steps JSON before sending, but many clients can parse JSON.
            res.json({ projects });
        } catch (err) {
            console.error('Error fetching projects with progress:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 9. Coworker Submits a Step for Approval
 *    PUT /api/projects/:id/steps/:stepNumber
 *    Updates the steps JSON in project_requests by modifying the step with the given stepNumber.
 */
router.put(
    '/projects/:id/steps/:stepNumber',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
        const { id, stepNumber } = req.params;
        const { content, projectUrl } = req.body;
        try {
            // Fetch the project
            const [rows] = await db.query('SELECT steps FROM project_requests WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            let steps = [];
            if (rows[0].steps) {
                try {
                    steps = JSON.parse(rows[0].steps);
                } catch (parseErr) {
                    console.error('Error parsing steps JSON:', parseErr);
                    return res.status(500).json({ error: 'Error parsing steps data' });
                }
            }
            // Find the step by step_number (assuming step_number is 1-indexed)
            const stepIndex = steps.findIndex(step => step.step_number === parseInt(stepNumber, 10));
            if (stepIndex === -1) {
                return res.status(404).json({ error: 'Step not found' });
            }
            // Only update if current status is not already pending-review or approved
            if (steps[stepIndex].status === 'pending-review' || steps[stepIndex].status === 'approved') {
                return res.status(400).json({ error: 'Step already submitted or approved' });
            }
            // Update the step details
            steps[stepIndex].status = 'pending-review';
            steps[stepIndex].description = content; // update description with submitted content
            steps[stepIndex].projectUrl = projectUrl;
            // Update the project row with the new steps JSON
            await db.query(
                'UPDATE project_requests SET steps = ? WHERE id = ?',
                [JSON.stringify(steps), id]
            );
            res.json({ message: `Step ${stepNumber} submitted for review` });
        } catch (err) {
            console.error('Error submitting step for review:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 10. Admin Approves a Step
 *     PUT /api/projects/:id/steps/:stepNumber/approve
 *     Updates the corresponding step's status to 'approved'. If this is the final step, update project status to 'completed'.
 */
router.put(
    '/projects/:id/steps/:stepNumber/approve',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        const { id, stepNumber } = req.params;
        try {
            // Fetch the project
            const [rows] = await db.query('SELECT steps FROM project_requests WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            let steps = [];
            if (rows[0].steps) {
                try {
                    steps = JSON.parse(rows[0].steps);
                } catch (parseErr) {
                    console.error('Error parsing steps JSON:', parseErr);
                    return res.status(500).json({ error: 'Error parsing steps data' });
                }
            }
            const stepIndex = steps.findIndex(step => step.step_number === parseInt(stepNumber, 10));
            if (stepIndex === -1) {
                return res.status(404).json({ error: 'Step not found' });
            }
            if (steps[stepIndex].status === 'approved') {
                return res.status(400).json({ error: 'Step already approved' });
            }
            steps[stepIndex].status = 'approved';
            // Update the project row with the new steps JSON
            await db.query(
                'UPDATE project_requests SET steps = ? WHERE id = ?',
                [JSON.stringify(steps), id]
            );
            // Optionally, if this is the final step (e.g., step_number equals the number of steps),
            // update the project status to 'completed'.
            if (parseInt(stepNumber, 10) === steps.length) {
                await db.query(
                    'UPDATE project_requests SET status = ? WHERE id = ?',
                    ['completed', id]
                );
            }
            res.json({ message: `Step ${stepNumber} approved` });
        } catch (err) {
            console.error('Error approving step:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);
/**
 * 13. Fetch All Coworkers (Admin Only)
 *     GET /api/coworkers
 */
router.get(
    '/coworkers',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const [coworkers] = await db.query('SELECT * FROM users WHERE role = ?', ['coworker']);
            res.json({ coworkers });
        } catch (err) {
            console.error('Error fetching coworkers:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 14. Fetch All Clients (Admin Only)
 *     GET /api/clients
 */
router.get(
    '/clients',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const [clients] = await db.query('SELECT * FROM users WHERE role = ?', ['client']);
            res.json({ clients });
        } catch (err) {
            console.error('Error fetching clients:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);


module.exports = router;
