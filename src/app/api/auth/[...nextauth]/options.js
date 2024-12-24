import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/db/dbConnection'
import UserModel from '@/models/user/user'
import { loginSchema } from '@/lib/schemas/authSchemas/loginSchema'
import { comparePassword } from '@/utils/auth'
import { cookies } from 'next/headers'

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          lable: 'Email',
          type: 'email',
          placeholder: 'example@example.com'
        },
        password: {
          lable: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        const email = credentials.identifier
        const password = credentials.password

        const validateFields = loginSchema.safeParse({
          email,
          password
        })

        if (!validateFields.success) {
          throw new Error('Invalid credentials')
        }

        await dbConnect()

        try {
          const dbUser = await UserModel.findOne({ email })

          if (!dbUser) {
            throw new Error('User not found')
          }

          const matchedPassword = await comparePassword(
            password,
            dbUser.password
          )

          if (!matchedPassword) {
            throw new Error('Password incorrect')
          }

          return dbUser
        } catch (error) {
          throw new Error(error)
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString()
        token.username = user.username
        token.role = user.role[0]
        token.picture = user.picture
        token.stripe_account_id = user.stripe_account_id
          ? user.stripe_account_id
          : ''
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.name = token.username
        session.user.role = token.role
        session.user.image = token.picture
        session.user.stripe_account_id = token.stripe_account_id
          ? token.stripe_account_id
          : ''
      }

      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
