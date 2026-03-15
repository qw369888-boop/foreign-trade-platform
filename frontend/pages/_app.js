import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import { ThemeProvider } from 'next-themes'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from '../components/CustomCursor'
import PageTransition from '../components/PageTransition'
import { CartProvider } from '../contexts/CartContext'
import { AuthProvider } from '../contexts/AuthContext'

function App({ Component, pageProps, router }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <CartProvider>
          <CustomCursor />
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={router.route}>
              <Component {...pageProps} />
            </PageTransition>
          </AnimatePresence>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default appWithTranslation(App)
