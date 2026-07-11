import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastActivity: Date;
  lastSender?: mongoose.Types.ObjectId;
  unreadCount: Map<string, number>;
  muted: Map<string, boolean>;
  archived: Map<string, boolean>;
  blocked: boolean;
  deletedForUser: mongoose.Types.ObjectId[];
  pinned: Map<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  lastActivity: { type: Date, default: Date.now },
  lastSender: { type: Schema.Types.ObjectId, ref: 'User' },
  unreadCount: { type: Map, of: Number, default: {} },
  muted: { type: Map, of: Boolean, default: {} },
  archived: { type: Map, of: Boolean, default: {} },
  blocked: { type: Boolean, default: false },
  deletedForUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  pinned: { type: Map, of: Boolean, default: {} }
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastActivity: -1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
