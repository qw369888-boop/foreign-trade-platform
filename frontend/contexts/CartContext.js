import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log('📦 Loading cart from localStorage:', parsedCart)
        setCartItems(parsedCart)
      }
    } catch (error) {
      console.error('📦 Error loading cart from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        console.log('📦 Saving cart to localStorage:', cartItems)
        localStorage.setItem('cart', JSON.stringify(cartItems))
      } catch (error) {
        console.error('📦 Error saving cart to localStorage:', error)
      }
    }
  }, [cartItems, isLoaded])

  const addToCart = (product, quantity = 1) => {
    console.log('📦 CartContext.addToCart called:', { product, quantity })
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        const updated = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        console.log('📦 Updated cart (existing item):', updated)
        return updated
      } else {
        // Add new item
        const updated = [...prevItems, { ...product, quantity }]
        console.log('📦 Updated cart (new item):', updated)
        return updated
      }
    })
  }

  const removeFromCart = (productId) => {
    console.log('📦 Removing item from cart:', productId)
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    console.log('📦 Updating quantity:', { productId, quantity })
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    console.log('📦 Clearing cart')
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoaded, // 添加加载状态
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
