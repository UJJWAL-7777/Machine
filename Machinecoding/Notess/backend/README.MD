JWT Structure

A JWT has 3 parts.

xxxxx.yyyyy.zzzzz

Three parts separated by dots.

Header

.

Payload

.

Signature
Header

Contains

{
    "alg":"HS256",
    "typ":"JWT"
}

Meaning

Algorithm
Token Type
Payload

Stores user information.

Example

{
    "id":"687d6b17af7d..."
}

Very important:

❌ Never store

Password
OTP
Secret information

inside JWT.

JWT payload can be decoded by anyone.

Only store non-sensitive information like the user ID.

Signature

The server creates a signature using the secret key.

Example

JWT_SECRET=mySecretKey

If someone changes the payload,

the signature becomes invalid,

and the server rejects the token.




In one sentence

JWT tells the server who you are on every request without asking for your email and password again. It provides a secure way to authenticate users for protected resources.





DOCKER COMMANDS # Check Docker
docker --version
docker info

# Go to backend
cd C:\WEBpractice\Machinecoding\Notess\backend

# Build image
docker build -t notes-backend .

# Check images
docker images

# Run manually
docker run --env-file .env -p 5000:5000 notes-backend

# Go to project root
cd ..
# or:
cd C:\WEBpractice\Machinecoding\Notess

# Start Compose
docker compose up --build

# In another terminal
docker compose ps

# Check containers
docker ps

# Logs
docker compose logs backend
docker compose logs mongodb

# Volumes
docker volume ls

# Stop
docker compose down