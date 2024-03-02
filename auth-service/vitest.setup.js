import dotenv from 'dotenv';
import path from 'path';
import getENV from "../auth-service/src/utils/helpers";

let env = getENV()
console.log(`loading environment: ${env}`)
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });
