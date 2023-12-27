import { Schema, model } from "mongoose";
import { type Server, type Channel, type Message } from "@/lib/Types";

export const MessageSchema = new Schema<Message>({
    content: { type: String, required:true },
    author:{ type: Schema.Types.ObjectId, ref:'UserData' },
    date: { type: Date, required: true },
    from: { type: Schema.Types.ObjectId, ref:'Channels' }
});

export const ChannelSchema = new Schema<Channel>({
    from: { type: Schema.Types.ObjectId, ref:'Servers' },
    name:{ type:String, required:true },
    is: { type: String, enum:[ 'text', 'voice', 'video' ], required:true },
    history: [{ type: Schema.Types.ObjectId, ref:'Messages' }]
});

export const ServerSchema = new Schema<Server>({
    name: { type: String, required:true },
    isPublic: { type: Boolean, required:true },
    key: { type: String , required:false, default: null },
    channels:[{ type:Schema.Types.ObjectId, ref:'Channels' }],
    description: { type:String, required:true, default:'Select a channel to start..'},
    super:{ type:Schema.Types.ObjectId, ref:'UserData' }
});

export const ServerModel = model<Server>('Servers', ServerSchema);
export const ChannelModel = model<Channel>('Channels', ChannelSchema);
export const MessageModel = model<Message>('Messages', MessageSchema);