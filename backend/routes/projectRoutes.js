const express = require('express');
const db = require('../db');  // Adjust the path to your DB connection file
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// **1. Client Submits a Project Request**
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
          'INSERT INTO project_requests (client_id, title, description, budget, requirements) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, title, description, budget, requirements]
        );
  
        res.status(201).json({ message: 'Project request submitted successfully' });
      } catch (err) {
        console.error('Error submitting project request:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
  

// **2. Admin Approves or Declines a Project Request**
router.put(
    '/projects/:id/status',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('status').isIn(['approved', 'declined']).withMessage('Invalid status'),
    ],
    async (req, res) => {
        const { status } = req.body;
        const projectId = req.params.id;

        try {
            const [project] = await db.query('SELECT * FROM project_requests WHERE id = ?', [projectId]);
            if (project.length === 0) {
                return res.status(404).json({ error: 'Project request not found' });
            }

            await db.query('UPDATE project_requests SET status = ? WHERE id = ?', [status, projectId]);

            res.json({ message: `Project request ${status}` });
        } catch (err) {
            console.error('Error updating project status:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// **3. Admin Assigns a Project to a Coworker**
router.post(
    '/projects/:id/assign',
    authenticateToken,
    authorizeRole('admin'),
    [
        body('coworker_id').notEmpty().withMessage('Coworker ID is required'),
    ],
    async (req, res) => {
        const { coworker_id } = req.body;
        const projectId = req.params.id;

        try {
            const [project] = await db.query('SELECT * FROM project_requests WHERE id = ?', [projectId]);
            if (project.length === 0 || project[0].status !== 'approved') {
                return res.status(400).json({ error: 'Project must be approved before assignment' });
            }

            await db.query(
                'INSERT INTO project_assignments (project_id, coworker_id) VALUES (?, ?)',
                [projectId, coworker_id]
            );

            res.json({ message: 'Project assigned to coworker successfully' });
        } catch (err) {
            console.error('Error assigning project:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
);
// **4. admin Views Projects**
router.get('/projects', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
      const [projects] = await db.query('SELECT * FROM project_requests');
      res.json({ projects });
    } catch (err) {
      console.error('Error fetching project requests:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// **5. Coworker Views Assigned Projects**
router.get(
    '/projects/assigned',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
      try {
        const [projects] = await db.query(
          `SELECT pr.id, pr.title, pr.description, pr.budget, pr.requirements, pr.status, pr.created_at
           FROM project_requests pr
           JOIN project_assignments pa ON pr.id = pa.project_id
           WHERE pa.coworker_id = ?`,
          [req.user.id]
        );
  
        res.json({ projects });
      } catch (err) {
        console.error('Error fetching assigned projects:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
  //**6 */ Client views their own project requests
router.get(
    '/projects/my-requests',
    authenticateToken,
    authorizeRole('client'),
    async (req, res) => {
      try {
        // Fetch projects submitted by the logged-in client
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
  router.put(
    '/projects/:id/steps/:stepNumber',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
      const { id, stepNumber } = req.params;
  
      try {
        // Check if the step exists and is assigned to this coworker
        const [step] = await db.query(
          `SELECT ps.status FROM project_steps ps 
           JOIN project_assignments pa ON ps.project_id = pa.project_id
           WHERE ps.project_id = ? AND ps.step_number = ? 
           AND pa.coworker_id = ?`,
          [id, stepNumber, req.user.id]
        );
  
        if (step.length === 0) {
          return res.status(404).json({ error: 'Step not found or not assigned to you' });
        }
  
        if (step[0].status !== 'pending') {
          return res.status(400).json({ error: 'Step already completed or approved' });
        }
  
        // Mark step as "pending approval"
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
  router.put(
    '/projects/:id/steps/:stepNumber/approve',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
      const { id, stepNumber } = req.params;
  
      try {
        // Check if the step exists
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
  
        // Approve the current step
        await db.query(
          `UPDATE project_steps SET status = 'approved' WHERE project_id = ? AND step_number = ?`,
          [id, stepNumber]
        );
  
        // If this is the final step (5), mark project as complete
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
  router.get(
    '/projects/:id/steps',
    authenticateToken,
    authorizeRole('coworker'),
    async (req, res) => {
      const { id } = req.params;
  
      try {
        // Retrieve all steps for the project assigned to this coworker
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
  router.get(
    '/projects/pending-steps',
    authenticateToken,
    authorizeRole('admin'),
    async (req, res) => {
      try {
        // Get all steps awaiting approval
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
  // Client views the status of each step of their project
router.get(
    '/projects/:id/steps/client-view',
    authenticateToken,
    authorizeRole('client'),
    async (req, res) => {
      const { id } = req.params;
  
      try {
        // Check if the project belongs to the client
        const [project] = await db.query(
          `SELECT * FROM project_requests WHERE id = ? AND client_id = ?`,
          [id, req.user.id]
        );
  
        if (project.length === 0) {
          return res.status(404).json({ error: 'Project not found or not assigned to you' });
        }
  
        // Retrieve all steps for the project
        const [steps] = await db.query(
          `SELECT step_number, status 
           FROM project_steps
           WHERE project_id = ?
           ORDER BY step_number ASC`,
          [id]
        );
  
        // Determine the step being worked on
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
          currentStep: currentStep ? `Step ${currentStep} is in progress` : 'Project completed',
        });
      } catch (err) {
        console.error('Error fetching project steps for client:', err);
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
  
        

module.exports = router;
