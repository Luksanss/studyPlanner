# TODO: Mobile & Responsiveness

## Core Tasks
- [ ] **Mobile Touch Support**
  - Implement tap-to-trigger for all statistics tooltips (Total Credits, Semester Hours, Credit Distribution).
  - Ensure subject "KOS Link" and "Delete" icons are easily tappable on small screens.
- [ ] **Mobile-First Layout**
  - Redesign the "Semester Board" for small screens (currently a 2-4 column grid).
  - Implement a stacked or horizontal scroll view for semesters on mobile.
  - Optimize the "Subject Bank" for mobile (maybe a bottom drawer or collapsible section).
- [ ] **Modal Optimization**
  - Make the "Add/Edit Subject" form more compact on mobile (stacking 4-column inputs like school hours).
- [ ] **Mobile Drag & Drop**
  - Test/verify if HTML5 Drag and Drop works on touch devices (might need "Tap to select, Tap to move" as a fallback).

## Design Details
- [ ] Use larger touch targets (min 44x44px).
- [ ] Add subtle feedback animations for touch events.
- [ ] Adjust glassmorphism effects for better performance on mobile GPUs.
