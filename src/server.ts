import express from 'express';
import http from 'http';
import Websocket from './lib/WebSocket';
import { getTextChatHandler } from './routes/textchat.route';
import { enable } from 'colors';
import { connectDB } from './database';
import { getWebRtcHandler } from './routes/webrtc.route';
enable();

const app = express();
const server = new http.Server(app);
const sIo = Websocket.getInstance(server);

server.listen(5000, () => {
    console.log('');
    console.log('PORTALS: WEBSOCKET'.bgMagenta);
    console.log('listening on port: 5000\n'.magenta)
});

connectDB();

sIo.on('connect', (socket) => {
    console.log('asd');
});

const textchathandler = getTextChatHandler(sIo);
sIo.of('/textchat').on('connect', textchathandler);

const webrtchandler = getWebRtcHandler(sIo);
sIo.of('/webrtc').on('connect', webrtchandler);