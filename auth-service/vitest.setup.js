import dotenv from 'dotenv';
import path from 'path';
console.log("loading",process.env.NODE_ENV )
const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });
