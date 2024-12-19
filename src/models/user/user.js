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
    stripe_account_id: {
      type: String,
      default: ''
    },
    stripe_seller: {
      type: Object,
      default: {}
    },
    stripeSession: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
)

// In Next.js for creating models are different. First we check if there is a model already exists in DB. If not then we create a new model by adding || and create a new collection by mongoose and return it to us. We ahve to check both cases.
const UserModel = mongoose.model.User || mongoose.model('User', userSchema)

export default UserModel
