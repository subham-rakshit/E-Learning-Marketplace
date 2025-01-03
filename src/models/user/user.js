import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      default: '/avatar.png'
    },
    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin']
    },
    is_email_verified: {
      type: Boolean,
      default: false
    },
    email_verification_code: {
      type: String
    },
    email_verification_code_expiry: {
      type: Date
    },
    password_reset_code: {
      type: String
    },
    password_reset_code_expiry: {
      type: Date
    },
    stripe_account_id: {
      type: String
    },
    stripe_seller_info: {
      type: Object
    },
    stripe_session: {
      type: Object
    }
  },
  { timestamps: true }
)

// In Next.js for creating models are different. First we check if there is a model already exists in DB. If not then we create a new model by adding || and create a new collection by mongoose and return it to us. We ahve to check both cases.
const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel
