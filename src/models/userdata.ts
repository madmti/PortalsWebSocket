import { Schema, model } from "mongoose";
import { type UserData } from "@/lib/Types";


const UserDataSchema = new Schema<UserData>({
    alias: { type: String, required:false },
    imgUrl: { type: String, required:false },
    name: { type: String, required: true, ref:'AuthLogin' },
    servers: [{ type: Schema.Types.ObjectId, ref:'Servers' }],
    created: { type:Number, required:true, default:0 }
});

export const UserDataModel = model<UserData>('UserData', UserDataSchema);