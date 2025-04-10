import mongoose, { Document, Schema } from 'mongoose';

// Event interface
export interface IEvent extends Document {
  title: string;
  description: string;
  short_description: string;
  poster_url: string;
  thumbnail_url: string;
  date: Date;
  end_date?: Date;
  time: string;
  location: string;
  venue?: string;
  registration_link?: string;
  form_clicks?: number;
  event_type: 'upcoming' | 'past';
  is_featured: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_limited_seats: boolean;
  is_team_event: boolean;
  max_participants?: number;
  current_participants?: number;
  show_participant_count: boolean;
  category: string;
  outcomes?: string;
  tags: string[];
  winners?: {
    name: string;
    position: string;
    prize: string;
    photo_url?: string;
    role?: string;
  }[];
  highlights?: {
    title: string;
    description: string;
    image_url?: string;
  }[];
  gallery?: {
    url: string;
    caption?: string;
  }[];
  event_highlights?: string;
  rules?: string;
  participation_stats?: {
    views: number;
    form_clicks: number;
    join_count: number;
  };
  is_published: boolean;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

// Event schema
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please enter event title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please enter event description'],
      trim: true
    },
    short_description: {
      type: String,
      required: [true, 'Please enter a short description'],
      trim: true,
      maxlength: [150, 'Short description cannot exceed 150 characters']
    },
    poster_url: {
      type: String,
      required: [true, 'Please upload event poster']
    },
    thumbnail_url: {
      type: String,
      required: [true, 'Please upload event thumbnail']
    },
    date: {
      type: Date,
      required: [true, 'Please enter event date']
    },
    end_date: {
      type: Date
    },
    time: {
      type: String,
      required: [true, 'Please enter event time'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please enter event location'],
      trim: true
    },
    venue: {
      type: String,
      trim: true
    },
    registration_link: {
      type: String,
      trim: true
    },
    form_clicks: {
      type: Number,
      default: 0
    },
    event_type: {
      type: String,
      enum: {
        values: ['upcoming', 'past'],
        message: 'Event type must be either upcoming or past'
      },
      required: [true, 'Please specify event type']
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    is_new: {
      type: Boolean,
      default: false
    },
    is_popular: {
      type: Boolean,
      default: false
    },
    is_limited_seats: {
      type: Boolean,
      default: false
    },
    is_team_event: {
      type: Boolean,
      default: false
    },
    max_participants: {
      type: Number
    },
    current_participants: {
      type: Number,
      default: 0
    },
    show_participant_count: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true
    },
    outcomes: {
      type: String,
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    winners: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        position: {
          type: String,
          required: true,
          trim: true
        },
        prize: {
          type: String,
          required: true,
          trim: true
        },
        photo_url: {
          type: String
        },
        role: {
          type: String,
          trim: true
        }
      }
    ],
    highlights: [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
        description: {
          type: String,
          required: true,
          trim: true
        },
        image_url: {
          type: String
        }
      }
    ],
    gallery: [
      {
        url: {
          type: String,
          required: true
        },
        caption: {
          type: String,
          trim: true
        }
      }
    ],
    event_highlights: {
      type: String,
      trim: true
    },
    rules: {
      type: String,
      trim: true
    },
    participation_stats: {
      views: {
        type: Number,
        default: 0
      },
      form_clicks: {
        type: Number,
        default: 0
      },
      join_count: {
        type: Number,
        default: 0
      }
    },
    is_published: {
      type: Boolean,
      default: false
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
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Create index for searching
eventSchema.index({ 
  title: 'text', 
  description: 'text', 
  short_description: 'text',
  tags: 'text',
  category: 'text'
});

// Update event type automatically based on date
eventSchema.pre('save', function(next) {
  const currentDate = new Date();
  const eventDate = new Date(this.date);
  
  if (eventDate > currentDate) {
    this.event_type = 'upcoming';
  } else {
    this.event_type = 'past';
  }
  
  next();
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event; 