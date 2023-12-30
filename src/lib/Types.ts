import { type ObjectId } from 'mongoose';

export type UserLock = {
	_id: ObjectId;
	name: String;
	email: String;
	password: String;
	isSuper: boolean;
	ref: ObjectId | UserData;
};

export type Message = {
	_id: ObjectId;
	from: ObjectId;
	author: Author;
	content: String;
	date: Date;
};

export type Author = {
	_id: ObjectId;
	alias: String | null;
	name: String;
};

export type Channel = {
	_id: ObjectId;
	from: ObjectId;
	name: String;
	is: 'text' | 'voice' | 'video';
	history: Message[] | null;
};

export type Server = {
	_id: ObjectId;
	isPublic: boolean;
	key: string | null;
	name: String;
	channels: Channel[] | null;
	description: string | null;
	super: UserData | ObjectId | null;
};

export type UserData = {
	_id: ObjectId;
	alias: String | null;
	name: String | null;
	imgUrl: String | null;
	servers: Server[] | null;
	created: Number;
	friends: String[] | UserData[] | null;
};

export type RequestType =
	| 'friend'
	| 'bridge'
	| 'serverjoin'
	| 'eventjoin'
	| 'musicgroupjoin';

export type Request = {
	_id: ObjectId;
	type: RequestType;
	from: ObjectId;
	to: ObjectId;
	data?: Object;
};