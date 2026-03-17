import dotenv from 'dotenv'
dotenv.config();
import app from './src/app.js';
import { verifyMailServer } from "./src/services/email.service.js";
import { initSocket } from './src/socket/server.socket.js';

import http from 'http';
import { connectToDb } from './src/config/db.js';

const httpServer = http.createServer(app);

initSocket(httpServer)

connectToDb();

const port = process.env.PORT
httpServer.listen(port,async()=>{
    console.log(`Server is running on port ${port}`);
    await verifyMailServer();
})