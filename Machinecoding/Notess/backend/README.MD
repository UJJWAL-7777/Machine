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