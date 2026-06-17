## Precision App
An immersive automotive showcase website built to present Porsche models with cinematic visuals and smooth interactions.

## Tech Stack
HTML5: Semantic structure, multi-page architecture, and accessible form markup.

CSS3: Responsive design, CSS Grid & Flexbox for layout, CSS 3D Transforms for the cover flow carousel, custom animations, and a dark luxury UI.

JavaScript (Vanilla): Modular interaction logic split across dedicated files - carousel, navigation, form validation, scroll reveals, and per-model detail pages.

## Project Structure
```
├── 📁 Assets                                             Images, favicons, and per-model photo galleries.
│   ├── 📁 favicon
│   └── 📁 images
│       ├── 📁 2024_Porsche_Taycan_Turbo_S_2024
│       └── 📁 2025_Porsche_Panamera_Turbo_S_E-Hybrid
├── 📁 Car_Models                                         Individual model detail pages.
│   ├── 🌐 panamera-turbo-s-e-hybrid.html
│   └── 🌐 taycan-turbo-s.html
├── 📁 css
│   ├── 🎨 style.css                                      Global styles, layout, animations, and form components.
│   ├── 🎨 car_models.css                                 Styles for model detail pages (hero, specs, gallery, lightbox).
│   └── 🎨 car_models_resolution.css                      Responsive overrides for model pages across all breakpoints.
├── 📁 js
│   ├── 📄 carousel.js                                    3D cover flow carousel with touch, keyboard, and pagination support.
│   ├── 📄 form.js                                        Booking form validation and submission handling.
│   ├── 📄 modal.js                                       Model detail modal logic.
│   ├── 📄 navigation.js                                  Sticky navbar, hamburger menu, and active link tracking.
│   ├── 📄 reveal.js                                      Scroll-triggered entrance animations via IntersectionObserver.
│   ├── 📄 panamera-turbo-s-e-hybrid.js                   Image slider, lightbox, and specs for the Panamera page.
│   └── 📄 taycan-turbo-s.js                              Image slider, lightbox, and specs for the Taycan page.
├── ⚙️ .gitignore
└── 🌐 index.html                                         Main entry point - hero, models, performance, heritage, gallery, contact.
```