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
                'INSERT INTO project_requests (client_id, title, description, budget, requirements, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
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
            .isIn(['approved', 'declined'])
            .withMessage('Status must be either "approved" or "declined"'),
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
 * 3. Admin Final Review (Approve or Request Revision)
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
 *    Here, we update the project with assignment details and store steps (as JSON)
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
                'UPDATE project_requests SET steps = ?, status = ?, assignedTo = ?, deadline = ?, assignedDate = NOW() WHERE id = ?',
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
                        pr.deadline, pr.assignedBy, pr.assignedDate
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
                `SELECT id, title, description, budget, requirements, status, created_at
                 FROM project_requests
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
 * 8. Coworker Submits a Step for Approval
 *    PUT /api/projects/:id/steps/:stepNumber
 */
router.put(
    '/projects/:id/steps/:stepNumber',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
        const { id, stepNumber } = req.params;
        try {
            const [step] = await db.query(
                `SELECT ps.status FROM project_steps ps
                                           JOIN project_assignments pa ON ps.project_id = pa.project_id
                 WHERE ps.project_id = ? AND ps.step_number = ? AND pa.coworker_id = ?`,
                [id, stepNumber, req.user.id]
            );
            if (step.length === 0) {
                return res.status(404).json({ error: 'Step not found or not assigned to you' });
            }
            if (step[0].status !== 'pending') {
                return res.status(400).json({ error: 'Step already completed or submitted' });
            }
            await db.query(
                `UPDATE project_steps SET status = 'pending' WHERE project_id = ? AND step_number = ?`,
                [id, stepNumber]
            );
            res.json({ message: `Step ${stepNumber} submitted for admin approval` });
        } catch (err) {
            console.error('Error updating step:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 9. Admin Approves a Step
 *    PUT /api/projects/:id/steps/:stepNumber/approve
 */
router.put(
    '/projects/:id/steps/:stepNumber/approve',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        const { id, stepNumber } = req.params;
        try {
            const [step] = await db.query(
                `SELECT * FROM project_steps WHERE project_id = ? AND step_number = ?`,
                [id, stepNumber]
            );
            if (step.length === 0) {
                return res.status(404).json({ error: 'Step not found' });
            }
            if (step[0].status === 'approved') {
                return res.status(400).json({ error: 'Step already approved' });
            }
            await db.query(
                `UPDATE project_steps SET status = 'approved' WHERE project_id = ? AND step_number = ?`,
                [id, stepNumber]
            );
            if (parseInt(stepNumber) === 5) {
                await db.query(
                    `UPDATE project_requests SET status = 'completed' WHERE id = ?`,
                    [id]
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
 * 10. Coworker Views Steps for a Project
 *     GET /api/projects/:id/steps
 */
router.get(
    '/projects/:id/steps',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const [steps] = await db.query(
                `SELECT ps.step_number, ps.status
                 FROM project_steps ps
                          JOIN project_assignments pa ON ps.project_id = pa.project_id
                 WHERE ps.project_id = ? AND pa.coworker_id = ?`,
                [id, req.user.id]
            );
            res.json({ steps });
        } catch (err) {
            console.error('Error fetching project steps:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 11. Admin Views Pending Steps
 *     GET /api/projects/pending-steps
 */
router.get(
    '/projects/pending-steps',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
        try {
            const [pendingSteps] = await db.query(
                `SELECT ps.id, ps.project_id, ps.step_number, ps.status,
                        pr.title AS project_title, u.username AS coworker_name
                 FROM project_steps ps
                          JOIN project_requests pr ON ps.project_id = pr.id
                          JOIN project_assignments pa ON ps.project_id = pa.project_id
                          JOIN users u ON pa.coworker_id = u.id
                 WHERE ps.status = 'pending'`
            );
            res.json({ pendingSteps });
        } catch (err) {
            console.error('Error fetching pending steps:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

/**
 * 12. Client Views Steps for Their Project
 *     GET /api/projects/:id/steps/client-view
 */
router.get(
    '/projects/:id/steps/client-view',
    authenticateToken,
    authorizeRole('client'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const [project] = await db.query(
                `SELECT * FROM project_requests WHERE id = ? AND client_id = ?`,
                [id, req.user.id]
            );
            if (project.length === 0) {
                return res.status(404).json({ error: 'Project not found or not assigned to you' });
            }
            const [steps] = await db.query(
                `SELECT step_number, status 
         FROM project_steps
         WHERE project_id = ?
         ORDER BY step_number ASC`,
                [id]
            );
            let currentStep = null;
            for (let step of steps) {
                if (step.status === 'pending') {
                    currentStep = step.step_number;
                    break;
                }
            }
            res.json({
                project_id: id,
                title: project[0].title,
                status: project[0].status,
                steps,
                currentStep: currentStep ? `Step ${currentStep} is in progress` : 'Project completed'
            });
        } catch (err) {
            console.error('Error fetching project steps for client:', err);
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
