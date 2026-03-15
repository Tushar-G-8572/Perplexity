import dotenv from 'dotenv'
dotenv.config();
import app from './src/app.js';
import { verifyMailServer } from "./src/services/email.service.js";
import { testAI,testMistralAI } from './src/services/ai.service.js';
import {Server} from 'socket.io'

import http from 'http';
import { connectToDb } from './src/config/db.js';

const server = http.createServer(app);

const io = new Server(server);

export {io};

connectToDb();
// testAI();
// testMistralAI();
const port = process.env.PORT
server.listen(port,async()=>{
    console.log(`Server is running on port ${port}`);
    await verifyMailServer();
})