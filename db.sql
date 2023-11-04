-- Create the User table
-- CREATE DATABASE AssignmentsFeeds;

-- USE sql12659254;

CREATE TABLE Users (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('0', '1') NOT NULL,
    email VARCHAR(255) NOT NULL
);


CREATE TABLE Attachments (
    attachment_id VARCHAR(255) PRIMARY KEY,
    attachment_type VARCHAR(255) NOT NULL,
    attachment_data VARCHAR(255)
);

CREATE TABLE Assignments (
    assignment_id VARCHAR(255)  PRIMARY KEY,
    description TEXT,
    published_at DATETIME,
    due_date DATETIME,
    user_id VARCHAR(255),
    subject VARCHAR(50),
    attachment_id VARCHAR(255),
    FOREIGN KEY (attachment_id) REFERENCES Attachments(attachment_id)
);

CREATE TABLE AssignmentStudentTag (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id VARCHAR(255),
    student_id VARCHAR(255),
    scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id)
);


CREATE TABLE SubmitedAssignmets (
    id INT PRIMARY KEY,
    assignment_id VARCHAR(255),
    student_id VARCHAR(255),
    score INT,
    description TEXT,
    submited_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id)
);

--zwof wbik uxma gouc