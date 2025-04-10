import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface GalleryOccasionDocument extends Document {
  title: string;
  description: string;
  date: Date;
  category: 'events' | 'workshops' | 'competitions' | 'activities';
  cover_image?: string;
  created_by: IUser['_id'];
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

const galleryOccasionSchema = new Schema<GalleryOccasionDocument>(
  {
    title: {
      type: String,
      required: [true, 'Gallery occasion title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Gallery occasion description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Gallery occasion date is required'],
    },
    category: {
      type: String,
      required: [true, 'Gallery occasion category is required'],
      enum: {
        values: ['events', 'workshops', 'competitions', 'activities'],
        message: '{VALUE} is not a valid category',
      },
    },
    cover_image: {
      type: String,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
    is_published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const GalleryOccasion = mongoose.model<GalleryOccasionDocument>('GalleryOccasion', galleryOccasionSchema);

export default GalleryOccasion; 