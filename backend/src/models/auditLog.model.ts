import mongoose, { Document, Schema } from 'mongoose';

// AuditLog interface
export interface IAuditLog extends Document {
  action: string;
  performed_by: mongoose.Types.ObjectId;
  target_id?: mongoose.Types.ObjectId;
  collection_name?: string;
  timestamp: Date;
}

// AuditLog schema
const auditLogSchema = new Schema<IAuditLog>({
  action: {
    type: String,
    required: [true, 'Please specify action'],
    trim: true
  },
  performed_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target_id: {
    type: Schema.Types.ObjectId,
    default: null
  },
  collection_name: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog; 