export type Role='FARMER'|'PROCUREMENT_OFFICER'|'CENTRE_OPERATOR'|'ADMIN';
export type SlotStatus='ACTIVE'|'CANCELLED'|'EXPIRED'|'COMPLETED';
export type TokenStatus='PENDING'|'APPROVED'|'WAITING_FOR_APPROVAL'|'IN_QUEUE'|'PROCURED'|'CANCELLED'|'EXPIRED';
export type AuthUser={id:string;mobile:string;role:Role};
export type AuthedRequest=import('express').Request & {user?:AuthUser};
export class AppError extends Error{statusCode:number;code:string;details?:unknown;constructor(message:string,statusCode=400,code='BAD_REQUEST',details?:unknown){super(message);this.statusCode=statusCode;this.code=code;this.details=details}}
