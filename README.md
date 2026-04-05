# Finance Data Processing and Access Control Backend

## Project Overview
This backend provides APIs for a finance dashboard system. It supports user management, role-based permissions, financial record management, and summary endpoints for dashboard reporting. The goal is to make finance data accessible while enforcing access control and validation.

## Tech Stack
- Node.js
- Express
- MongoDB via Mongoose
- JSON Web Tokens for authentication
- dotenv for environment configuration

## Features
- User & Role Management
  - Roles: Viewer, Analyst, Admin
  - Login and authenticated access
- Financial Records Management
  - Create, read, update, delete financial records
  - Record operations are separated from dashboard summaries
- Dashboard Summary APIs
  - A Single endpoint consisting total summary of income, expenses, and trends
- Access Control
  - Role-based middleware restricts actions by user role
- Validation & Error Handling
  - Input validation and consistent HTTP status codes
  - Error responses for invalid requests, authentication, and authorization

## API Design Explanation
Routes are organized by concern:
- `/auth` handles login and authentication  
  The auth section includes only the login route, as admin users are the only ones who can create new users. Public registration is not allowed per the assignment requirements.
- `/users` handles user operations and role management  
  Each route explicitly specifies the roles that can access it.
- `/records` handles financial record CRUD operations  
  Each record includes an adminId (the admin who created the record), assuming records are created on behalf of the company rather than individual users. Users are not permitted to create records, and it is more logical for admins to maintain company-wide financial records rather than per-user entries.
- `/dashboard` handles aggregated summary requests  
  The dashboard API consists of a single endpoint that returns all necessary details for the dashboard view. These summaries are generated from company financial records, which aligns with the assumption that records represent company data rather than individual user data.

This separation keeps the API clear and maintainable. Filters belong in query parameters because they refine the returned data without changing resource structure. Role-based middleware is used so permission checks happen once and apply consistently across protected routes.

## Role-Based Access Control
- Viewer
  - Can read dashboard summaries
- Analyst
  - Can read and manage financial records
  - Can access summary data for analysis
- Admin
  - Full access to users, roles, and record operations
  - Can manage roles and application data

## Database Design (High Level)
- User model
  - Stores authentication data, role, and user profile details
  - Role defines permitted actions in the system
- Record model
  - Stores financial entries such as income and expenses
  - Includes fields for amount, date, category, and notes

## Assumptions Made
- Authentication is handled with tokens and protected routes
- Users have exactly one role from Viewer, Analyst, or Admin
- Dashboard summaries are served separately from record CRUD
- Data persistence is handled by MongoDB

## Error Handling & Validation
- Invalid input uses appropriate HTTP status codes such as `400 Bad Request`
- Authorization failures return `401 Unauthorized` or `403 Forbidden`
- Missing resources return `404 Not Found`
- Validation issues are returned in a structured error message

## Setup Instructions
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with database and token settings
4. Start the server with `node server.js`

## Main API Endpoints
- `POST /auth/login`
- `POST /users/create`
- `GET /users/getUsers`
- `POST /records/create`
- `GET /records/getRecords`
- `PUT /records/:id`
- `DELETE /records/:id`
- `GET /dashboard/summary`

## Optional Enhancements
- Authentication is implemented with JWT
- Routes are organized for separation of concerns
- Validation and centralized error handling improve maintainability
- Soft Delete is used so that the records are not permanently deleted as we may need to restore it.


## Conclusion
This README focuses on clear API design and maintainable backend structure so the finance dashboard logic is easy to understand and extend.