┌─────────────────┐
│  Register Page  │
└────────┬────────┘
         │
         │ POST /api/auth/register
         ▼
┌─────────────────┐
│    Backend      │
│ Hash Password   │
│ Save User       │
└────────┬────────┘
         │
         ▼
   User Created


┌─────────────────┐
│   Login Page    │
└────────┬────────┘
         │
         │ POST /api/auth/login
         ▼
┌─────────────────┐
│    Backend      │
│ Check Email     │
│ Compare Password│
│ Generate JWT    │
└────────┬────────┘
         │
         ▼
{
  token: "eyJ..."
}

         │
         ▼
┌─────────────────┐
│ localStorage    │
│ token = eyJ...  │
└────────┬────────┘
         │
         ▼
 navigate("/dashboard")


┌─────────────────┐
│   Dashboard     │
└────────┬────────┘
         │
         │ localStorage.getItem("token")
         ▼
┌─────────────────┐
│ Axios Request   │
└────────┬────────┘
         │
         │ Authorization:
         │ Bearer eyJ...
         ▼
┌─────────────────┐
│ authMiddleware  │
└────────┬────────┘
         │
         │ jwt.verify(token)
         ▼
┌─────────────────┐
│ req.user.id     │
│ = User ID       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Todo Routes     │
└────────┬────────┘
         │
         ├── POST /api/todos
         │      Add Todo
         │
         ├── GET /api/todos
         │      Fetch Todos
         │
         └── DELETE /api/todos/:id
                Delete Todo
         │
         ▼
┌─────────────────┐
│   MongoDB       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Data     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Updates   │
│ UI Re-renders   │
└─────────────────┘