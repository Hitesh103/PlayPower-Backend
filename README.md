# PlayPower Backend

# **PlayPower Assignment Backend API Documentation**

Welcome to the PlayPower Assignment Backend API documentation. This API allows you to manage assignments, users, and more in the PlayPower system.

## **Table of Contents**

1. Introduction
2. Authentication
3. Endpoints
    1. Auth
    2. Create Assignment
    3. Delete Assignment
    4. Submit Assignment
    5. Update Assignment
    6. Student Feed
    7. Teacher Feed
    8. Add Score
4. Implement Radis

## **Introduction**

This API is designed to facilitate the management of assignments and user accounts in the PlayPower system. You need to authenticate to access most endpoints, and you'll receive a JSON response with relevant data.

To use this API, you need to pull the Docker image:

```bash

docker pull hitesh103/powerplaybackend
```

## **Authentication**

To access most endpoints, you need to authenticate using a bearer token. The bearer token should be included in the request headers as follows:

```bash

Authorization: Bearer [YOUR_ACCESS_TOKEN]

```

## **Endpoints**

### **Auth User**

- **Method**: POST
- **URL**: **`/api/auth`**
- **Description**: Authenticates a user and returns a bearer token for further authentication.
- **Authentication**: Not required

### Request Example

```json

{
  "username": "hitesh",
  "password": "hitesh112233",
  "role": "0",
  "email": "hp5741609@gmail.com"
}

```

### Response Example

```json

{
  "success": true,
  "data": {
    "token": "YOUR_ACCESS_TOKEN",
    "user_id": "YOUR_USER_ID"
  },
  "message": "You are successfully registered and logged in"
}

```

### **Create Assignment**

- **Method**: POST
- **URL**: **`/api/assignment/create`**
- **Description**: Create a new assignment.
- **Authentication**: Bearer Token required
- **Owner: Only the teacher can create the assignment.**

### Request Example

- Attach a PDF file with the assignment description, publish date, due date, and tagged students.

### Response Example

```json

{
  "message": "Assignment Created Successfully",
  "data": [
    {
      "assignment_id": "b6e7b29e-017a-441d-9dfe-5fde228ab795",
      "description": "Maths - 1 Tutorial 5",
      "published_at": "2023-08-06T06:42:13.000Z",
      "due_date": "2023-09-06T06:42:12.000Z",
      "user_id": "68495d2e-4dcb-4f5f-acb3-c8a76cc23542",
      "subject": null,
      "attachment_id": "de642c0f-551c-4f4e-a342-74183e8e344d"
    }
  ],
  "success": true
}
```

### **Update Assignment**

- **Method**: PUT
- **URL**: **`/api/assignment/update/{assignment_id}`**
- **Description**: Update an existing assignment.
- **Authentication**: Bearer Token required
- **Owner: Only the teacher can update the assignment.**

### Request Example

- Attach a PDF file with the updated assignment description and publish date.

### Response Example

```json

{
  "message": "Assignment updated Successfully",
  "success": true
}

```

### **Delete Assignment**

- **Method**: DELETE
- **URL**: **`/api/assignment/delete`**
- **Description**: Delete an existing assignment.
- **Authentication**: Bearer Token required
- **Owner: Only the teacher can delete the assignment.**

### Request Example

```json

{
  "id": "9568a0c1-f8da-428d-a537-b7103ceaeefc"
}

```

### Response Example

```json

{
  "message": "Assignment not found with this User",
  "data": false,
  "success": false
}

```

### **Submit Assignment**

- **Method**: POST
- **URL**: **`/api/assignment/submit/{assignment_id}`**
- **Description**: Submit an assignment by a student.
- **Authentication**: Bearer Token required
- **Owner: Only the particular student can submit the assignment.**

### Request Example

```json

{
  "id": "a8f3e81e-47fc-41dd-9101-e06fe5584a49"
}

```

### Response Example

```json
{
  "message": "Assignment Submitted Successfully",
  "data": true,
  "success": true
}

```

### **Student Feed**

- **Method**: GET
- **URL**: **`/api/feed/student/{student_id}`**
- **Description**: Get a student feed with a student ID.
- **Authentication**: Bearer Token required
- **Owner: Only the particular student can view his feed.**

### Response Example

```json

{
  "success": true,
  "data": [
    {
      "assignment_id": "b5bf2db1-a3f4-4758-a96c-a8255b4a4691",
      "description": "Maths - 1 Assignment 1",
      "published_at": "2023-06-06T06:42:12.000Z",
      "author": "mitesh"
    }
  ],
  "message": "Feed Fetched Successfully"
}

```

### **Teacher Feed**

- **Method**: GET
- **URL**: **`/api/feed/teacher/{teacher_id}`**
- **Description**: Get teacher feed by a teacher ID.
- **Authentication**: Bearer Token required
- **Owner: Only the particular teacher can view his feed.**

### Response Example

```json

{
  "success": true,
  "data": [
    {
      "assignment_id": "2b96d3f6-5c18-44ac-97a9-7e0c85b94d3a",
      "description": "History Assignment - World War I",
      "published_at": "2023-06-06T06:42:13.000Z",
      "subject": "History"
    }
  ],
  "message": "Feed Fetched Successfully"
}

```

### **Add Score**

- **Method**: POST
- **URL**: **`/api/assignment/score/{student_id}`**
- **Description**: Add a score to a student's assignment.
- **Authentication**: Bearer Token required
- **Owner: Only the teacher can add a score.**

### Request Example

```json

{
  "assignment_id": "6ce308f1-2322-4a99-9307-1c53f53b9e14",
  "score": 95
}
```

### Response Example

```json

{
  "message": "Score added successfully",
  "data": true,
  "success": true
}

```

# Implement Radish

### **Installing Redis Locally**

1. **Linux/Unix (Ubuntu/Debian):**
    - Open a terminal and run the following commands:
    
    ```bash
    sudo apt update
    sudo apt install redis-server
    ```
    
2. **Linux/Unix (CentOS/Fedora):**
    - Use **`yum`** to install Redis:
    
    ```bash
    
    sudo yum install epel-release
    sudo yum install redis
    ```
    
3. **macOS:**
    - You can use Homebrew to install Redis. If you don't have Homebrew installed, you can install it by following the instructions at [https://brew.sh/](https://brew.sh/). Once you have Homebrew, you can install Redis with:
    
    ```bash
    
    brew install redis
    ```
    
4. **Windows:**
    - Redis isn't natively supported on Windows, but you can use the Windows Subsystem for Linux (WSL) or install a Windows port of Redis like [Microsoft's Win-Vector/Redis](https://github.com/Win-Vector/Redis) or [MSOpenTech/redis](https://github.com/MSOpenTech/redis).

### **Starting and Stopping Redis**

After installation, you can start the Redis server with the following commands:

- **Linux/Unix/macOS:**
    
    ```bash
    
    redis-server
    ```
    
- **Windows (using WSL):**
    
    ```bash
    
    redis-server
    
    ```
    

To stop the Redis server, use:

- **Linux/Unix/macOS:**
    
    ```bash
    
    redis-cli shutdown
    ```
    
- **Windows (using WSL):**
    
    ```bash
    
    redis-cli shutdown
    ```
    

### **Verifying Installation**

To verify that Redis is running, you can use the **`redis-cli`** tool to connect to the Redis server:

```bash

redis-cli

```

You should see a prompt indicating you're connected to a Redis server.
