import { Request, Response } from 'express';
export declare const autocomplete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const reverse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const route: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    autocomplete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    reverse: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    route: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default _default;
//# sourceMappingURL=placesController.d.ts.map