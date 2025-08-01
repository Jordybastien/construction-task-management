# 🏗️ Construction Task Manager

> **Offline-first construction task management on interactive floor plans. Built with React, RxDB, and LeafletJS.**

## 🎯 The Problem

Construction teams need to manage tasks spatially on floor plans while working in environments with poor connectivity. Current solutions either lack spatial context or fail offline, creating friction in construction workflows.

## DB Diagram

[Link to DB Diagram](https://dbdiagram.io/d/Construction-task-manager-6889d82fcca18e685c695e73)


## Task board

[Link to Task board](https://www.notion.so/240f42bdb99b806da52dd6773bad6f66?v=240f42bdb99b80bb84fc000c22add8f6&source=copy_link)


## Low fidelity mockups/wireframes

[Link to Low-fidelity Wireframes](https://www.figma.com/design/BfzXWo0SkqSPBBD3YVK0Mc/Construction-Task-Manager?node-id=2-4&t=Zv0hfFTogTUmfkRc-1)


## 🔍 Solution Analysis

| Approach | Performance | Scalability | Precision | Development Time | Verdict |
|----------|-------------|-------------|-----------|------------------|---------|
| **Generic Task Apps** | Good for simple lists | Limited spatial context | No coordinate mapping | Fast | ❌ Wrong domain |
| **CAD Software (AutoCAD Web)** | Excellent precision | Enterprise scale | Professional grade | Very slow | ❌ Overkill complexity |
| **Static Image + SVG Overlay** | Poor with 100+ elements | Limited by DOM manipulation | Pixel-level only | Fast | ❌ Not scalable |
| **Static Image + Absolute Positioned Markers** | Degrades with complex interactions | Poor memory management | Basic pixel positioning | Very fast | ❌ No real coordinates |
| **HTML5 Canvas (Custom)** | Excellent with hardware acceleration | Handles thousands efficiently | Pixel-perfect control | Very slow | ⚠️ Reinventing wheels |
| **React-Konva** | Very good React integration | Good with layer management | Sub-pixel precision | Medium | ✅ **Strong contender** |
| **FabricJS** | Excellent interactive graphics | Good object management | High precision vector graphics | Medium | ✅ **Strong contender** |
| **Paper.js** | Excellent vector animations | Good for illustrations | Mathematical vector precision | Medium | ⚠️ Creative-focused |
| **PixiJS (Game Engine)** | Exceptional WebGL performance | Excellent with GPU acceleration | High precision coordinates | Slow | ⚠️ Overkill for 2D |
| **LeafletJS + Canvas Overlay** | Optimized for mapping data | Enterprise GIS scale | Professional coordinate systems | Medium-Slow | ✅ **Selected** |
| **OpenLayers** | Superior GIS performance | Handles massive datasets | Advanced CRS support | Slow | ⚠️ Over-engineered |
| **D3.js + SVG** | Good for data visualization | Limited by SVG performance | Vector precision | Medium | ⚠️ Visualization-focused |

## 🗺️ Why LeafletJS + Canvas Overlay?

**Professional foundation**: LeafletJS handles coordinate systems, zoom/pan, and layer management - exactly what construction mapping needs.

**Performance at scale**: Canvas overlays provide hardware-accelerated rendering for drawing tools while maintaining 60fps with hundreds of tasks.

**Real-world precision**: Custom CRS (Coordinate Reference System) enables millimeter-accurate positioning and measurements.

**Offline-ready**: Tile caching and offline-first architecture work seamlessly with construction site realities.

## 🎯 Implementation Plan

### 📐 Low-Fidelity Wireframes

**Desktop Layout**: Three-panel interface with task list (left), interactive floor plan (center), and task details (right). Toolbar with drawing tools overlays the floor plan.

**Mobile Layout**: Single-screen navigation with collapsible panels and touch-optimized floor plan interactions.

**Key Components**: Task markers on floor plan, filterable task board, detailed checklist interface, drawing/annotation tools.

### 🔴 Phase 1: Core Foundation (Days 1-3)
**Critical MVP features**

- **Project Setup** (TBD) - React + TypeScript + LeafletJS + RxDB
- **Low-Fi Wireframes** (TBD) - User flow and layout planning
- **Floor Plan System** (TBD) - Image overlay with custom CRS  
- **User Auth** (TBD) - Simple login with data isolation
- **Task Creation & Board** (TBD) - Create task board
- **Advanced Checklists** (TBD) - 5-status system with progress tracking
- **Internalization** Multi language support
- **Offline Database** (TBD) - RxDB with IndexedDB persistence

**Target: Working offline task management on floor plans**

### 🟡 Phase 2: Professional Features (Days 4-5)  
**Construction-specific capabilities**

- **Interactive Floor Plans** (TBD) Smooth zoom/pan with performance optimization
- **Task Management UI** (TBD) Kanban board, list views, search and filtering
- **Drawing Tools** (TBD) Canvas-based annotations and markup
- **Professional UI** (TBD) Construction industry design patterns
- **Comprehensive Testing** (TBD) Unit, integration, and E2E tests
- **Storybook Setup** (TBD) - Component documentation and isolated development


**Target: Production-ready construction tool**

### 🟢 Phase 3: Advanced Features (Days 6-7)
**Enterprise enhancements**

- **Bundle Optimization** (TBD) - Code splitting, tree shaking, dynamic imports
- **Documentation** (TBD) - Technical docs and demo video
- **Accessibility** (TBD) - WCAG 2.1 AA compliance
- **Performance Monitoring** (TBD) - User behavior tracking and metrics with Microsoft clarity

**Target: Enterprise-grade solution with documentation**

## 🎨 Tech Stack

```typescript
Frontend:     React 18 + TypeScript (would've preferred Next.js😅)
Mapping:      LeafletJS + Custom CRS
State:        Zustand + RxDB
Offline:      IndexedDB + Service Worker(not yet sure)  
Styling:      Tailwind CSS
Testing:      Vitest + React Testing Library
Build:        Vite
```

## 🚀 Future Enhancements(if time was not a problem)

- **Setup CI/CD** With the help of github actions
- **Real-time Collaboration** WebSocket-based multi-user editing
- **Mobile App** React Native or Flutter with offline sync
- **Advanced Measurements** Area calculations, angle measurements
- **Room Boundaries** Spatial task organization by building zones
- **Export Features** PDF reports, CAD file integration
- **3D Multi-Floor Visualization** Three.js integration for complex buildings
- **OAuth Single sign on** Using Popular social auth
