-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS dc_mecaa;
USE dc_mecaa;

-- Step 2: Create the Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(191) UNIQUE NOT NULL,  -- Limited to 191 characters for index compatibility
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'admin', 'coworker') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create the Project Requests Table
CREATE TABLE IF NOT EXISTS project_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  requirements TEXT NOT NULL,
  status ENUM('pending', 'approved', 'declined', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Create the Project Assignments Table
CREATE TABLE IF NOT EXISTS project_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  coworker_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (coworker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 5: Create the Project Steps Table
CREATE TABLE IF NOT EXISTS project_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  step_number INT NOT NULL CHECK (step_number BETWEEN 1 AND 5),
  status ENUM('pending', 'approved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE
);

-- Step 6: Trigger to Auto-generate 5 Steps When a Project is Assigned
DELIMITER //
CREATE TRIGGER after_project_assignment
AFTER INSERT ON project_assignments
FOR EACH ROW
BEGIN
  INSERT INTO project_steps (project_id, step_number) VALUES 
    (NEW.project_id, 1),
    (NEW.project_id, 2),
    (NEW.project_id, 3),
    (NEW.project_id, 4),
    (NEW.project_id, 5);
END;
//
DELIMITER ;

-- Step 7: Insert Sample Users
INSERT INTO users (username, email, password, role) VALUES
('admin_user', 'admin@company.com', 'hashed_password', 'admin'),
('client_user', 'client@company.com', 'hashed_password', 'client'),
('coworker_user', 'coworker@company.com', 'hashed_password', 'coworker');

-- Step 8: Insert a Sample Project Request
INSERT INTO project_requests (client_id, title, description, budget, requirements, status) VALUES
(2, 'Website Redesign', 'Revamp the entire corporate website.', 5000.00, 'Modern UI, SEO optimization, fast loading', 'pending');

-- Step 9: Assign Project to a Coworker
INSERT INTO project_assignments (project_id, coworker_id) VALUES (1, 3);
