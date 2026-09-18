import crypto from 'node:crypto'; import {env} from '../config/env.js';
const store=new Map<string,{hash:string;expires:number}>();
const hash=(otp:string)=>crypto.createHash('sha256').update(otp).digest('hex');
export function issueOtp(mobile:string){const otp=env.nodeEnv==='production'?String(crypto.randomInt(100000,1000000)):'123456'; store.set(mobile,{hash:hash(otp),expires:Date.now()+env.otpExpiryMinutes*60000}); console.log(`[K-SMART OTP] ${mobile}: ${otp}`); return {expiresInSeconds:env.otpExpiryMinutes*60};}
export function verifyOtp(mobile:string,otp:string){const x=store.get(mobile); if(!x||x.expires<Date.now()){store.delete(mobile);return false} const good=x.hash===hash(otp); if(good)store.delete(mobile); return good;}
