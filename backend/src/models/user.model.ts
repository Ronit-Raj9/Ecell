import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Valid branch codes
const VALID_BRANCHES = ['EEE', 'BMS', 'BCS', 'IMG', 'IMT'];

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  roll_no: string;
  branch: string;
  year: number;
  profile_pic_url?: string;
  bio?: string;
  role: 'member' | 'admin' | 'superadmin';
  is_active: boolean;
  created_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password_hash: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't return password in queries
    },
    roll_no: {
      type: String,
      required: [true, 'Please enter your roll number'],
      trim: true,
      unique: true,
      match: [
        /^(20\d{2})(EEE|BMS|BCS|IMG|IMT)-(\d{3})$/,
        'Roll number must be in format YYYYBBB-NNN where BBB is one of: EEE, BMS, BCS, IMG, IMT'
      ]
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: {
        values: VALID_BRANCHES,
        message: 'Branch must be one of: EEE, BMS, BCS, IMG, IMT'
      },
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1,
      max: 5
    },
    profile_pic_url: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [200, 'Bio cannot exceed 200 characters']
    },
    role: {
      type: String,
      enum: {
        values: ['member', 'admin', 'superadmin'],
        message: 'Role must be either member, admin, or superadmin'
      },
      default: 'member'
    },
    is_active: {
      type: Boolean,
      default: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password_hash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User; 