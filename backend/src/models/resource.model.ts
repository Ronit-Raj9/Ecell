import mongoose, { Document, Schema } from 'mongoose';

// Resource interface
export interface IResource extends Document {
  title: string;
  file_url: string;
  description: string;
  uploaded_by: mongoose.Types.ObjectId;
  uploaded_at: Date;
  category: 'guide' | 'checklist' | 'meeting_notes';
  visibility: 'public' | 'members-only';
}

// Resource schema
const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: [true, 'Please enter resource title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    file_url: {
      type: String,
      required: [true, 'Please upload a file']
    },
    description: {
      type: String,
      required: [true, 'Please enter resource description'],
      trim: true
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: {
        values: ['guide', 'checklist', 'meeting_notes'],
        message: 'Category must be either guide, checklist, or meeting_notes'
      },
      required: [true, 'Please specify resource category']
    },
    visibility: {
      type: String,
      enum: {
        values: ['public', 'members-only'],
        message: 'Visibility must be either public or members-only'
      },
      required: [true, 'Please specify resource visibility'],
      default: 'members-only'
    }
  },
  {
    timestamps: true
  }
);

const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource; 