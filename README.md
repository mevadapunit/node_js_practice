# node_js_practice
Features
Logging: Logging all HTTP requests and application errors.
Error Handling: Proper error handling and graceful shutdown of the server.
HTTP Compression: Compressing HTTP responses to reduce payload size.
Helmet: Adding security headers to protect against various attacks.
IP Restriction: Restricting API access based on allowed IP addresses.
Rate Limiting: Limiting the rate of incoming requests to prevent abuse.
Role-based Access Control (RBAC): Restricting access to certain routes based on user roles.
Environment Variable: Setting the PORT via .env to handle port conflicts.
Migrations & Seeders: Using Sequelize migrations and seeders to manage the database schema and initial data.
Validation: Data validation for user inputs (email, password, etc.).
API Version Control: Handling API versioning (v1, v2, etc.).


http://localhost:4037/health 

{"status":"success","serverMessage":"Server is running correctly.","database":{"status":"success","message":"Database connection established successfully."}}
