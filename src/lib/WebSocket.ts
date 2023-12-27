import { Server } from 'socket.io';

const WEBSOCKET_CORS = {
   origin: "*",
   methods: ["GET", "POST"]
}

class Websocket extends Server {

   private static io: Websocket;
    //@ts-ignore
   constructor(httpServer ) {
       super(httpServer, {
           cors: WEBSOCKET_CORS
       });
   }
   //@ts-ignore
   public static getInstance(httpServer?): Websocket {

       if (!Websocket.io) {
           Websocket.io = new Websocket(httpServer);
       }

       return Websocket.io;

   }
}

export default Websocket;