import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: 'https://cuddly-newt-58.clerk.accounts.dev/.well-known/jwks.json',
    cache: true,
    rateLimit: true,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            callback(err);
            return;
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : authHeader;

    jwt.verify(token, getKey, {
        algorithms: ['RS256'],
    }, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        const payload = decoded as jwt.JwtPayload;
        console.log('Decoded token:', payload);
        
        if (!payload || !payload.sub) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
        }

        req.userId = payload.sub as string;
        next();
    });
}