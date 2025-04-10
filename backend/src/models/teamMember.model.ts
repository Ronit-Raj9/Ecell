import mongoose, { Document, Schema } from 'mongoose';

// TeamMember interface
export interface ITeamMember extends Document {
  name: string;
  email?: string;
  roll_no: string;
  branch: string;
  year: number;
  profile_pic_url?: string;
  position: string;
  team_type: 'core' | 'member';
  department: string;
  batch_year: number;
  order: number;
  is_active: boolean;
  added_by: mongoose.Types.ObjectId;
  added_at: Date;
}

// TeamMember schema
const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Please enter team member name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    roll_no: {
      type: String,
      required: [true, 'Please enter roll number'],
      trim: true
    },
    branch: {
      type: String,
      required: [true, 'Please enter branch'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Please enter year'],
      min: 1,
      max: 5
    },
    profile_pic_url: {
      type: String,
      default: null
    },
    position: {
      type: String,
      required: [true, 'Please enter position'],
      trim: true
    },
    team_type: {
      type: String,
      enum: {
        values: ['core', 'member'],
        message: 'Team type must be either core or member'
      },
      required: [true, 'Please specify team type']
    },
    department: {
      type: String,
      required: [true, 'Please enter department'],
      trim: true
    },
    batch_year: {
      type: Number,
      required: [true, 'Please enter batch year']
    },
    order: {
      type: Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true
    },
    added_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    added_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);

export default TeamMember; 