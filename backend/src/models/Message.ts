import mongoose, { Schema, Document } from 'mongoose';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'retry';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'video' | 'audio';
  status: MessageStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;
  deletedForUser: mongoose.Types.ObjectId[];
  replyTo?: mongoose.Types.ObjectId;
  forwarded: boolean;
  reactions: Map<string, string>; // userId -> reaction emoji
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'document', 'video', 'audio'] },
  status: { type: String, enum: ['sending', 'sent', 'delivered', 'read', 'failed', 'retry'], default: 'sent' },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  readAt: { type: Date },
  failedAt: { type: Date },
  deletedForUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  forwarded: { type: Boolean, default: false },
  reactions: { type: Map, of: String, default: {} }
}, { timestamps: true });

MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, receiver: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
