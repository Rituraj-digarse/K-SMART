import pg from 'pg'; import {env} from './env.js';
export const pool=new pg.Pool({connectionString:env.databaseUrl||undefined, max:20, idleTimeoutMillis:30000});
export async function query<T extends pg.QueryResultRow=any>(text:string,params:any[]=[]){return pool.query<T>(text,params);}
export async function tx<T>(fn:(c:pg.PoolClient)=>Promise<T>){const c=await pool.connect(); try{await c.query('BEGIN'); const r=await fn(c); await c.query('COMMIT'); return r;}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
