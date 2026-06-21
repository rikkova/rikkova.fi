# V-OS Network Terminal v2.0

A retro terminal-based portfolio showcasing network engineering expertise with an interactive command-line interface.

## 📁 Project Structure

```
hermes/
├── index.html      # Main HTML structure (clean, semantic markup)
├── styles.css      # All CSS styling (separated from HTML)
├── app.js          # Application logic (modular JavaScript)
└── README.md       # This documentation file
```

## ✨ Improvements Made

### 1. **Separation of Concerns**
- ✅ Split single-file monolith into three distinct files: `index.html`, `styles.css`, and `app.js`
- ✅ Each file has a clear, singular responsibility
- ✅ Easier to maintain, debug, and extend

### 2. **CSS Improvements**
- ✅ All inline styles extracted to CSS classes
- ✅ Used CSS custom properties (variables) for theming
- ✅ Added proper responsive design with media queries
- ✅ Improved accessibility with `prefers-reduced-motion` support
- ✅ Better organized code structure with clear sections

### 3. **JavaScript Refactoring**
- ✅ Wrapped in IIFE to prevent global variable pollution
- ✅ Modular organization with clear sections (Configuration, Utilities, App State)
- ✅ Added comprehensive JSDoc comments
- ✅ Fixed incomplete code from original file
- ✅ Improved event handling with proper delegation
- ✅ Better state management within `app` object

### 4. **HTML Improvements**
- ✅ Removed inline styles and scripts
- ✅ Proper semantic structure
- ✅ External CSS and JS references
- ✅ SVG element for topology background (ready for enhancement)

### 5. **Code Quality**
- ✅ Consistent naming conventions
- ✅ DRY principles applied (reusable functions)
- ✅ Better error handling
- ✅ Improved code readability
- ✅ Fixed the truncated/incomplete original file

## 🎮 Features

### Commands Available:
- `help` - List all available commands
- `show architecture` - View CI/CD automation & TIG observability stack
- `show dwdm` - View active DWDM / 400G DCI transport diagram
- `show bgp sum` - View routing, switching & optical expertise
- `show incidents` - View incident index with details
- `show topology` - Interactive network topology (click nodes!)
- `whoami` - Display profile information
- `theme [color]` - Change terminal color theme

### Special Features:
- **Interactive Topology** - Click on network nodes to view configurations
- **Command History** - Use ↑/↓ arrow keys to navigate previous commands
- **Tab Completion** - Auto-complete commands with Tab key
- **Fuzzy Search** - Get suggestions for misspelled commands
- **Sudo Access** - Type `sudo` before any command to escalate privileges

## 🎨 Themes Available:
- `default` (green) - Classic terminal look
- `amber` - Retro amber phosphor
- `cyan` - Cyberpunk aesthetic
- `hacker` - Matrix-style red
- `google` - Google colors
- `bmw` - Monochrome white

## 🚀 How to Use

1. Open `index.html` in a web browser
2. Wait for the boot sequence animation
3. Type commands and press Enter
4. Click on topology nodes to explore configurations
5. Try different themes with the `theme` command

## 💡 Technical Highlights

### Architecture Pattern:
- **MVC-inspired**: HTML (View), CSS (Style), JS (Controller/Model)
- **Event-driven**: All user interactions handled via event listeners
- **State management**: Centralized app state in `app` object

### Performance Optimizations:
- Event delegation on terminal body instead of individual elements
- Efficient DOM manipulation with batched updates
- Async typing effects for realistic terminal feel

### Accessibility:
- Reduced motion support for users who prefer it
- Proper ARIA semantics (can be enhanced further)
- Keyboard navigation throughout

## 📝 Future Enhancement Ideas

1. **Add more interactive topology visualizations** using D3.js or similar
2. **Implement real file system simulation** with `ls`, `cd`, etc.
3. **Add animations library** like GSAP for smoother effects
4. **Create configuration files** (config.json) for easy customization
5. **Add unit tests** to verify command handling
6. **Implement PWA features** for offline usage
7. **Add more commands** showcasing specific projects

## 🛠️ Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Older browsers may lack CSS Grid/Flexbox support

## 📄 License

Personal portfolio project - all rights reserved.

---

**Author**: Väinö Rikkonen  
**Version**: 2.0  
**Last Updated**: June 2026
