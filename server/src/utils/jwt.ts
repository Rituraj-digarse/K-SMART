import crypto from 'node:crypto';
import {env} from '../config/env.js';
import {Role} from '../types/index.js';

type Payload={id:string;mobile:string;role:Role;iat:number;exp:number};
const b64=(v:string|Buffer)=>Buffer.from(v).toString('base64url');
export function signToken(input:{id:string;mobile:string;role:Role}){
  const now=Math.floor(Date.now()/1000), ttl=/^(\d+)([smhd])$/.exec(env.jwtExpiresIn);
  const seconds=ttl?Number(ttl[1])*({s:1,m:60,h:3600,d:86400} as any)[ttl[2]]:604800;
  const header=b64(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const payload=b64(JSON.stringify({...input,iat:now,exp:now+seconds}));
  const sig=crypto.createHmac('sha256',env.jwtSecret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}
export function verifyToken(token:string){
  const [h,p,s]=token.split('.'); if(!h||!p||!s)throw new Error('Invalid token');
  const expected=crypto.createHmac('sha256',env.jwtSecret).update(`${h}.${p}`).digest('base64url');
  if(!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(expected)))throw new Error('Invalid token');
  const payload=JSON.parse(Buffer.from(p,'base64url').toString()) as Payload;
  if(payload.exp<Date.now()/1000)throw new Error('Token expired');
  return {id:payload.id,mobile:payload.mobile,role:payload.role};
}
