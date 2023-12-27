import { Socket } from 'socket.io';
import Websocket from '../lib/WebSocket';
import { DefaultEventsMap } from '../../node_modules/socket.io/dist/typed-events';
import { log } from '../lib/Actions';
import { UserDataModel } from '../models/userdata';
import { ChannelModel, ServerModel } from '../models/servers';
import { Channel, Server, UserData } from '../lib/Types';

type authData = {
	user: string;
	chan: string;
	serv: string;
};

type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

const doAuths = async (
	socket: SOCKET
): Promise<false | { user: UserData; channel: Channel; server: Server }> => {
	//@ts-ignore
	const data: authData = socket.handshake.auth;
	if (!data.chan || !data.serv || !data.user) {
		return false;
	}
	const user = await UserDataModel.findById(data.user);
	const channel = await ChannelModel.findById(data.chan);
	const server = await ServerModel.findById(data.serv);
	if (!user || !channel || !server) {
		return false;
	}
	return {
		user: user,
		channel: channel,
		server: server,
	};
};

export const getTextChatHandler = (sIo: Websocket) => {
	// sIo of "/textchat"
	const handler = async (socket: SOCKET) => {
		log([socket.handshake.address.bgGreen, 'connected'.green], 1);

		const data = await doAuths(socket);
		if (!data) {
			socket.disconnect();
			return;
		}

		socket.on('disconnecting', (reason) => {
			log(
				[
					socket.handshake.address.bgRed,
					'disconnecting'.red,
					'|'.red,
					reason.yellow,
				],
				1
			);
		});
	};
	return handler;
};
