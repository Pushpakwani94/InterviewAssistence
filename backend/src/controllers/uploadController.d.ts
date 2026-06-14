import { Request, Response } from 'express';
import multer from 'multer';
export declare const upload: multer.Multer;
export declare const uploadQuestions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=uploadController.d.ts.map