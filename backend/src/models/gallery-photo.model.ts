import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
import { GalleryOccasionDocument } from './gallery-occasion.model';

export interface GalleryPhotoDocument extends Document {
  occasion_id: GalleryOccasionDocument['_id'];
  image_url: string;
  public_id?: string; // Cloudinary public_id
  caption: string;
  uploaded_by: IUser['_id'];
  is_approved: boolean;
  likes: number;
  created_at: Date;
  updated_at: Date;
}

const galleryPhotoSchema = new Schema<GalleryPhotoDocument>(
  {
    occasion_id: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryOccasion',
      required: [true, 'Gallery occasion ID is required'],
    },
    image_url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    public_id: {
      type: String,
      description: 'Cloudinary public ID for the image',
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by user is required'],
    },
    is_approved: {
      type: Boolean,
      default: true, // Auto-approve admin uploads, require approval for regular members
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Index for faster queries
galleryPhotoSchema.index({ occasion_id: 1 });
galleryPhotoSchema.index({ public_id: 1 }, { sparse: true });

const GalleryPhoto = mongoose.model<GalleryPhotoDocument>('GalleryPhoto', galleryPhotoSchema);

export default GalleryPhoto; 