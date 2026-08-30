# ÉLAN – Fine Dining, Reimagined

A premium, cinematic luxury fine-dining restaurant website built with React, Tailwind CSS, Framer Motion, and modern web technologies. ÉLAN delivers an immersive digital experience inspired by Michelin-starred restaurants with sophisticated animations, editorial typography, and a dark luxury aesthetic.

**Live Demo:** [http://localhost:5173/](http://localhost:5173/)

---

## ✨ Features

- **Cinematic Hero Section** – Full-screen background with gradient overlay and immersive typography
- **Animated 3D Copper Sculpture** – CSS-based abstract metallic loops with mouse-follow parallax
- **Sticky Navigation** – Transparent hero nav that becomes blurred on scroll; mobile hamburger menu
- **Restaurant Story & Stats** – Animated counter cards for Michelin stars, guest count, signature dishes
- **Interactive Menu** – Elegantly styled course cards with ingredient details
- **Masonry Gallery** – Responsive image grid with hover effects and overlays
- **Reservation Form** – Full validation with success state display
- **Contact & Newsletter** – Complete footer with hours, address, and email subscription
- **Fully Responsive** – Optimized layouts for desktop, tablet, and mobile
- **Accessibility** – Semantic HTML, keyboard navigation, reduced-motion support
- **Performance** – Optimized production build (~104KB gzip)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2.8 |
| **Build Tool** | Vite 8.2.2 |
| **Styling** | CSS3 (custom design system) |
| **Animations** | Framer Motion 11.x |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Playfair Display, Manrope, DM Mono) |
| **Linting** | Oxlint |
| **Package Manager** | npm |

---

## 📁 Project Structure

```
Dine-Luxe/
├── src/
│   ├── App.jsx           # Main restaurant component
│   ├── index.css         # Complete design system & responsive styles
│   ├── main.jsx          # React entry point
│   └── assets/           # Static images (if needed)
├── public/
│   └── favicon.svg
├── index.html            # HTML document with branded title
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── oxlint.json           # Linting configuration
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd Dine-Luxe

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Opens the site at [http://localhost:5173/](http://localhost:5173/) with hot module replacement enabled.

### Production Build

```bash
npm run build
```

Creates an optimized bundle in the `dist/` directory:
- `dist/index.html` – Minified HTML (~0.45 kB)
- `dist/assets/index-*.css` – Minified styles (~3.34 kB gzip)
- `dist/assets/index-*.js` – Minified React bundle (~104 kB gzip)

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🎨 Design System

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Background** | `#121211` | Main dark surface |
| **Text** | `#f0ebe2` | Primary text |
| **Accent (Copper)** | `#c77443` | Interactive elements, highlights |
| **Border** | `#35312c` | Subtle dividers |
| **Muted** | `#8e877e` | Secondary text, metadata |

### Typography

- **Headings:** Playfair Display (serif, 500–600 weight) – elegant and editorial
- **Body:** Manrope (sans-serif, 400–700 weight) – modern and refined
- **Metadata:** DM Mono (monospace, 400 weight) – technical and precise

### Component Styles

- **Buttons:** Rounded pill shape (30px border-radius) with copper backgrounds and hover states
- **Inputs:** Minimal design with transparent background and copper focus state
- **Cards:** Subtle borders, soft shadows, hover scale animations
- **Imagery:** Slight desaturation, gradient overlays, smooth zoom transitions

---

## 🔧 Key Components

### Header/Navigation
- Fixed navbar with ÉLAN branding and "EST. 2012"
- Desktop: Full navigation menu + "Reserve a Table" CTA
- Mobile: Hamburger menu with slide-down drawer
- Scroll state detection for background blur effect

### Hero Section
- Full-viewport background image with dark gradient overlay
- Staggered text reveals (headline, description, CTAs)
- Animated copper sculpture with mouse parallax
- Hero metadata with coordinates and scroll indicator

### Menu Section
- Five-course tasting menu presentation
- Course number, title, and ingredient listing
- Hover effects with arrow icons
- "View Full Menu" CTA button

### Gallery
- 12-column CSS Grid with responsive spans
- 6–8 high-quality restaurant images
- Hover zoom effect with gradient overlays
- Category labels on each image

### Reservation
- Split layout: image on left, form on right
- Form fields: name, email, date, time, guest count
- Form validation and success confirmation state
- Success message appears after submission

### Contact & Social
- Address, phone, opening hours
- Newsletter subscription with email input
- Footer navigation and links
- Social media placeholders

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| **Total Bundle** | ~329 KB (raw) / 104 KB (gzip) |
| **CSS** | ~11 KB (raw) / 3.34 KB (gzip) |
| **First Contentful Paint** | < 1s (dev server) |
| **Images** | 8 external Unsplash images (lazy-loaded) |
| **Build Time** | ~1.9s (production) |

---

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+ (full two-column layouts)
- **Tablet:** 800px–1200px (simplified grids)
- **Mobile:** < 800px (single-column stacked layouts, hamburger menu)

---

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on buttons and form inputs
- Keyboard navigation (Tab, Home, End, Enter)
- `prefers-reduced-motion` media query support
- Alt text on all images
- Color contrast meets WCAG AA standards

---

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint code quality checks |

---

## 🎯 Future Enhancements

- [ ] Full-screen image modal/lightbox for gallery
- [ ] Reservations backend integration
- [ ] Wine pairing recommendations
- [ ] Chef's story video integration
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Analytics and conversion tracking
- [ ] CMS integration for dynamic menu updates

---

## 📄 License

© 2026 ÉLAN. All rights reserved. This project is proprietary and intended for demonstration purposes.

---

## 👨‍💻 Development Notes

### Adding New Sections
1. Create a new `<section>` in [App.jsx](src/App.jsx)
2. Use the `<Reveal>` wrapper for scroll animations
3. Add corresponding CSS rules in [index.css](src/index.css)
4. Test responsive behavior at 390px (mobile) and 1200px (desktop)

### Modifying the Design
- Color palette is defined at the top of [index.css](src/index.css) (CSS variables)
- Typography settings use Google Fonts (imported in [index.css](src/index.css))
- Breakpoint for mobile is set at `@media(max-width:800px)`

### Form Submission
The reservation form currently uses local state. To integrate with a backend:
1. Replace the `onSubmit` handler in [App.jsx](src/App.jsx)
2. Send form data to your API endpoint
3. Handle success/error responses

---

Built with ❤️ for luxury dining experiences.
