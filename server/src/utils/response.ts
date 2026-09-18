import {Response} from 'express';
export const ok=(res:Response,data:any,message='Success',status=200)=>res.status(status).json({success:true,message,data});
export const fail=(res:Response,message:string,status=400,code='BAD_REQUEST',details?:any)=>res.status(status).json({success:false,error:{code,message,details}});
