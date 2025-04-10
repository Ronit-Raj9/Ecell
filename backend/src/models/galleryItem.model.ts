import mongoose, { Document, Schema } from 'mongoose';

// GalleryItem interface
export interface IGalleryItem extends Document {
  event_id: mongoose.Types.ObjectId;
  image_url: string;
  caption: string;
  uploaded_by: mongoose.Types.ObjectId;
  uploaded_at: Date;
  is_approved: boolean;
  likes: number;
}

// GalleryItem schema
const galleryItemSchema = new Schema<IGalleryItem>(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Please provide the associated event']
    },
    image_url: {
      type: String,
      required: [true, 'Please upload an image']
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Caption cannot exceed 200 characters']
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
    is_approved: {
      type: Boolean,
      default: false
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const GalleryItem = mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);

export default GalleryItem; 