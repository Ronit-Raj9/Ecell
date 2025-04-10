import mongoose, { Document, Schema } from 'mongoose';

// Meeting interface
export interface IMeeting extends Document {
  date: Date;
  title: string;
  agenda: string;
  notes_url: string;
  attended_by: mongoose.Types.ObjectId[];
  created_at: Date;
}

// Meeting schema
const meetingSchema = new Schema<IMeeting>(
  {
    date: {
      type: Date,
      required: [true, 'Please enter meeting date']
    },
    title: {
      type: String,
      required: [true, 'Please enter meeting title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    agenda: {
      type: String,
      required: [true, 'Please enter meeting agenda'],
      trim: true
    },
    notes_url: {
      type: String,
      required: [true, 'Please provide meeting notes link']
    },
    attended_by: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);

export default Meeting; 