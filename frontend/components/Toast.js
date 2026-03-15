'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'

export default function Toast({ show, message, type = 'success', onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[100] glass-strong rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className={`flex items-center gap-3 px-6 py-4 ${
            type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {type === 'success' ? (
                <FiCheck className="w-6 h-6" />
              ) : (
                <FiX className="w-6 h-6" />
              )}
            </div>
            <p className="text-white font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
