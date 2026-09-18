import {Response,NextFunction} from 'express'; import {AuthedRequest,Role,AppError} from '../types/index.js';
export const roles=(...allowed:Role[])=>(req:AuthedRequest,_res:Response,next:NextFunction)=>{if(!req.user||!allowed.includes(req.user.role))return next(new AppError('Insufficient permissions',403,'FORBIDDEN'));next()};
