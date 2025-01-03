import localFont from 'next/font/local'
import { ToastContainer } from './clientToastContainer.js'
import AuthProvider from '@/context/AuthProvider.jsx'
import Script from 'next/script.js'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

export const metadata = {
  title: 'E-Learning Marketplace',
  description: 'Become a instructor and sell your courses on our marketplace.'
}

const poppinsELi = localFont({
  src: './assets/fonts/poppinsELi.ttf',
  variable: '--font-poppins--extra-light',
  weight: '200'
})

const poppinsLi = localFont({
  src: './assets/fonts/poppinsLi.ttf',
  variable: '--font-poppins-light',
  weight: '300'
})

const poppinsRg = localFont({
  src: './assets/fonts/poppinsRg.ttf',
  variable: '--font-poppins-rg',
  weight: '400'
})

const poppinsMd = localFont({
  src: './assets/fonts/poppinsMd.ttf',
  variable: '--font-poppins-md',
  weight: '500'
})

const poppinsSb = localFont({
  src: './assets/fonts/poppinsSb.ttf',
  variable: '--font-poppins-sb',
  weight: '600'
})

const poppinsBo = localFont({
  src: './assets/fonts/poppinsBo.ttf',
  variable: '--font-poppins-bold',
  weight: '700'
})

const poppinsBl = localFont({
  src: './assets/fonts/poppinsBl.ttf',
  variable: '--font-poppins-black',
  weight: '900'
})

export default function RootLayout({ children }) {
  return (
    <>
      <html lang='en'>
        <body
          className={`${poppinsRg.variable} ${poppinsMd.variable} ${poppinsBl.variable} ${poppinsBo.variable} ${poppinsLi.variable} ${poppinsELi.variable} ${poppinsSb.variable} antialiased`}
        >
          <AuthProvider>
            {children}
            <ToastContainer
              position='top-right'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='light'
            />
          </AuthProvider>
        </body>
      </html>
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
    </>
  )
}
