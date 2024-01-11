import { Socket } from 'socket.io';
import { DefaultEventsMap } from '../../node_modules/socket.io/dist/typed-events';
import Websocket from '../lib/WebSocket';
import { log } from '../lib/Actions';
import { UserDataModel } from '../models/userdata';

type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

interface SocketAuth {
	user: string;
	room: string;
}

export const getWebRtcHandler = (sIo: Websocket) => {
	// sIo of "/webrtc"
	const handler = async (socket: SOCKET) => {
		//@ts-ignore
		const auth: SocketAuth = socket.handshake.auth;
		const user = await UserDataModel.findById(auth.user);
		if (!user || !user.name) {
			socket.disconnect();
			return;
		}
		socket.data = user;
		socket.join(auth.room);
        socket.to(auth.room).emit('user-join', socket.data);

		log(['user connected'.green], 1);
        log(['user:'.blue, user.name.toString()], 2);
		log(['room:'.blue, auth.room], 2);



		socket.on('disconnecting', () => {
			log(['user disconnected'.yellow], 1);
            log(['user:'.red, socket.data.name], 2);
			socket.rooms.forEach((room) => {
				if (room === socket.id) return;
				socket.to(room).emit('user-leave', socket.data);
			});
		});
	};

	return handler;
};
