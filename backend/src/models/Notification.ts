import mongoose, { Schema, Document } from 'mongoose';

export type NotificationCategory = 
  | 'CHAT'
  | 'JOB'
  | 'APPLICATION'
  | 'SHORTLIST'
  | 'HIRED'
  | 'REJECTED'
  | 'PROFILE'
  | 'SYSTEM'
  | 'VERIFICATION'
  | 'PROMOTION';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; // The recipient
  sender?: mongoose.Types.ObjectId; // The user who triggered it (if any)
  category: NotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: any; // e.g. jobId, appId, conversationId
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { 
    type: String, 
    enum: [
      'CHAT', 'JOB', 'APPLICATION', 'SHORTLIST', 'HIRED', 
      'REJECTED', 'PROFILE', 'SYSTEM', 'VERIFICATION', 'PROMOTION'
    ],
    required: true 
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
