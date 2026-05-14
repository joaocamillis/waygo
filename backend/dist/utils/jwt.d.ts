import jwt from 'jsonwebtoken';
export declare const signJwt: (payload: object, options?: jwt.SignOptions) => string;
export declare const verifyJwt: (token: string) => string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map