# 🚀 Quick Start Guide

## Installation

```bash
# Navigate to frontend directory
cd "/mnt/c/Users/13620/Desktop/新建文件夹 (2)/foreign-trade-platform/frontend/"

# Install all dependencies
npm install

# This will install:
# - Next.js 14
# - React 18
# - Framer Motion 12
# - Tailwind CSS 3.4
# - GSAP 3
# - React Three Fiber
# - next-themes
# - lottie-react
# - And all other dependencies
```

## Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Features to Test

### 1. Custom Cursor
- Move your mouse around - see the dual-ring cursor
- Hover over buttons/links - cursor scales up

### 2. Hero Section
- Watch the typewriter effect on the title
- See the floating particles
- Observe the animated gradient orbs
- Check the stats counter animation

### 3. Dark/Light Mode
- Click the sun/moon icon in header
- Theme persists across page reloads

### 4. Language Toggle
- Click the globe icon to switch EN/ZH

### 5. Scroll Animations
- Scroll down the page
- Watch elements fade in and slide up
- Notice the parallax background effects

### 6. Product Cards
- Hover over product cards
- See the 3D tilt effect
- Watch the glow effect follow your mouse
- Click the heart to like

### 7. Navigation
- Click between pages
- Notice the smooth page transitions

### 8. Mobile Menu
- Resize browser to mobile size
- Click hamburger menu
- See animated mobile menu

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Browser Recommendations

For best experience:
- Chrome/Edge (latest) - Full support
- Firefox (latest) - Full support
- Safari (latest) - Full support

## Performance Tips

- Use Chrome DevTools Performance tab
- Check Lighthouse scores
- Monitor FPS in animations
- Test on mobile devices

## Next Steps

1. ✅ Install dependencies
2. ✅ Run dev server
3. ✅ Test all features
4. ✅ Customize colors/content
5. ✅ Deploy to production

Enjoy your 2025-style website! 🎉
