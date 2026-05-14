export declare const register: (name: string, email: string, password: string) => Promise<{
    user: any;
    token: string;
}>;
export declare const login: (email: string, password: string) => Promise<{
    user: {
        id: any;
        name: any;
        email: any;
    };
    token: string;
}>;
export declare const getUserById: (id: string) => Promise<any>;
//# sourceMappingURL=authService.d.ts.map