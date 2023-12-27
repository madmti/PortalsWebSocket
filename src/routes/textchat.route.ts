import { Socket } from 'socket.io';
import Websocket from '../lib/WebSocket';
import { DefaultEventsMap } from '../../node_modules/socket.io/dist/typed-events';
import { EasyTryCatch, log } from '../lib/Actions';
import { UserDataModel } from '../models/userdata';
import { ChannelModel, MessageModel, ServerModel } from '../models/servers';
import { Channel, Message, Server, UserData } from '../lib/Types';
import { isValidObjectId } from 'mongoose';

type authData = {
	user: string;
	chan: string;
	serv: string;
};

type SOCKET = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type SocketData = { user: UserData; channel: Channel; server: Server };

const doAuths = async (socket: SOCKET): Promise<false | SocketData> => {
	//@ts-ignore
	const data: authData = socket.handshake.auth;
	if (
		!data.chan ||
		!data.serv ||
		!data.user ||
		!isValidObjectId(data.chan) ||
		!isValidObjectId(data.serv) ||
		!isValidObjectId(data.user)
	) {
		socket.disconnect();
		log(
			[
				socket.handshake.address.bgRed,
				'disconnecting'.red,
				'|'.red,
				'invalid auth'.yellow,
			],
			1
		);
		return false;
	}
	const user = await UserDataModel.findById(data.user);
	const channel = await ChannelModel.findById(data.chan).populate({
		path: 'history',
		populate: {
			path: 'author',
			model: 'UserData',
		},
	});
	const server = await ServerModel.findById(data.serv);
	if (!user || !channel || !server) {
		socket.disconnect();
		log(
			[
				socket.handshake.address.bgRed,
				'disconnecting'.red,
				'|'.red,
				'invalid auth'.yellow,
			],
			0
		);
		return false;
	}
	return {
		user: user,
		channel: channel,
		server: server,
	};
};

const addMsg = async (
	msg: string,
	data: SocketData,
	date: Date
): Promise<Message | null> => {
	return await EasyTryCatch(async () => {
		const message = await MessageModel.create({
			from: data.channel,
			content: msg,
			author: data.user,
			date: date,
		});
		await message.save();
		if (data.channel.history === null) {
			data.channel.history = [];
		}
		data.channel.history.push(message);
		//@ts-ignore
		await data.channel.save();
		const pop = (await message.populate('author')).depopulate('from');
		return pop;
	});
};

export const getTextChatHandler = (sIo: Websocket) => {
	// sIo of "/textchat"
	const handler = async (socket: SOCKET) => {
		log([socket.handshake.address.bgGreen, 'connected'.green], 0);
		const data = await doAuths(socket);
		if (!data) return;

		socket.data = data;
		socket.join(data.channel._id.toString());
		socket.to(data.channel._id.toString()).emit('joined', data.user);
		socket.emit('history', data.channel.history);
		const users = (
			await sIo.of('/textchat').in(data.channel._id.toString()).fetchSockets()
		).map((sock) => sock.data.user);
		socket.emit('users on', users);

		socket.on('msg', async (msg: string, date: Date) => {
			const res = await addMsg(msg, socket.data, date);
			if (res === null) {
				log(
					[socket.handshake.address.bgBlue, 'error creating message'.yellow],
					0
				);
				return;
			}
			log(
				[
					socket.handshake.address.bgBlue,
					'send message to'.blue,
					res.from.toString().magenta,
				],
				0
			);
			socket.to(res.from.toString()).emit('msg', res);
			socket.emit('msg', res);
		});

		socket.on('disconnecting', (reason) => {
			log(
				[
					socket.handshake.address.bgRed,
					'disconnecting'.red,
					'|'.red,
					reason.yellow,
				],
				0
			);
			socket.rooms.forEach((room) => {
				if (room === socket.id) return;
				socket.to(room).emit('leave', socket.data.user);
				socket.leave(room);
			});
		});
	};
	return handler;
};
