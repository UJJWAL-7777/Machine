# Application Flow

```text
User
 │
 ▼
Register
 │
 ▼
POST /api/auth/register
 │
 ▼
Hash Password (bcrypt)
 │
 ▼
Store User in MongoDB
 │
 ▼
Login
 │
 ▼
POST /api/auth/login
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT Token
 │
 ▼
Store Token in Local Storage
 │
 ▼
Dashboard
 │
 ▼
Axios API Requests
 │
 ▼
Authorization: Bearer <JWT_TOKEN>
 │
 ▼
JWT Middleware
 │
 ▼
Token Verification
 │
 ▼
Extract User ID
 │
 ▼
Todo Routes
 ├── POST   /api/todos
 ├── GET    /api/todos
 └── DELETE /api/todos/:id
 │
 ▼
MongoDB
 │
 ▼
Return Response
 │
 ▼
Update React State
 │
 ▼
Re-render UI
```
