import { Schema, model } from 'mongoose';
import { type UserData, type Request } from '../lib/Types';

const UserDataSchema = new Schema<UserData>({
	alias: { type: String, required: false },
	imgUrl: { type: String, required: false },
	name: { type: String, required: true, ref: 'AuthLogin' },
	servers: [{ type: Schema.Types.ObjectId, ref: 'Servers' }],
	created: { type: Number, required: true, default: 0 },
	friends: [{ type: Schema.Types.ObjectId, ref: 'UserData' }],
	requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }],
});

const RequestSchema = new Schema<Request>({
	type: { type: String, required: true },
	from: { type: Schema.Types.ObjectId, required: true },
	to: { type: Schema.Types.ObjectId, required: true },
	data: { type: Object, required: false },
});

export const RequestModel = model<Request>('Request', RequestSchema);
export const UserDataModel = model<UserData>('UserData', UserDataSchema);
