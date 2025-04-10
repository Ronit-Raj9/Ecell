import mongoose, { Document, Schema } from 'mongoose';

// Announcement interface
export interface IAnnouncement extends Document {
  title: string;
  content: string;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  visible_to: 'public' | 'members';
}

// Announcement schema
const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Please enter announcement title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please enter announcement content'],
      trim: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    visible_to: {
      type: String,
      enum: {
        values: ['public', 'members'],
        message: 'Visibility must be either public or members'
      },
      required: [true, 'Please specify announcement visibility'],
      default: 'members'
    }
  },
  {
    timestamps: true
  }
);

const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);

export default Announcement; 