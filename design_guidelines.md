# Design Guidelines: Designer Data Dashboard Tool

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Linear (clean productivity UI), Notion (flexible components), and Observable (data visualization focus) to create a designer-friendly data tool that balances utility with visual sophistication.

**Key Principles**:
1. **Designer-First Aesthetic**: Every element should feel polished and intentional
2. **Information Clarity**: Complex data presented with visual hierarchy
3. **Fluid Interaction**: Smooth transitions between querying and visualization
4. **Professional Restraint**: Sophisticated without being distracting

---

## Typography

**Font System**:
- Primary: Inter (via Google Fonts) - for UI elements, labels, data tables
- Accent: Space Grotesk (via Google Fonts) - for headings, dashboard titles
- Monospace: JetBrains Mono - for SQL queries and technical content

**Hierarchy**:
- Dashboard Titles: Space Grotesk, 32px (text-3xl), semibold (font-semibold)
- Section Headers: Space Grotesk, 24px (text-2xl), medium (font-medium)
- Chart Titles: Inter, 18px (text-lg), semibold
- Body Text: Inter, 14px (text-sm), regular
- Data Labels/Metrics: Inter, 12px (text-xs), medium
- SQL Editor: JetBrains Mono, 14px (text-sm), regular

---

## Layout System

**Spacing Units**: Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm

**Grid Structure**:
- App uses a sidebar + main content layout (not viewport-locked, scrollable content)
- Sidebar: Fixed 280px width (w-70 equivalent)
- Main Content: Fluid with max-w-7xl container
- Dashboard Grid: 12-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)

**Component Spacing**:
- Section padding: py-8 px-6 (desktop), py-6 px-4 (mobile)
- Card spacing: gap-6 between cards
- Widget padding: p-6 for dashboard widgets
- Form elements: space-y-4

---

## Component Library

### Navigation & Layout

**Sidebar (Primary Navigation)**:
- Persistent left sidebar with shadow-lg
- Sections: Dashboard list, Saved Queries, Data Sources, Settings
- Logo/Brand at top (h-16)
- Active state: subtle accent with left border (border-l-4)
- Icons from Heroicons (outline style)
- Collapsible on mobile with hamburger menu

**Top Bar**:
- Height: h-16
- Contains: Current dashboard title, breadcrumb navigation, action buttons (Save, Share, Export)
- Right side: User profile, notifications icon
- Subtle bottom border for separation

### Query Interface

**Natural Language Input Box**:
- Large, prominent text area (min-h-32)
- Placeholder: "Ask a question about your data in plain English..."
- Submit button: Primary CTA with icon (Heroicons arrow-right)
- Positioned above SQL editor, takes visual priority

**SQL Query Editor**:
- Syntax-highlighted code editor with line numbers
- Toggle between "Natural Language" and "SQL" views
- Action buttons: Run Query, Save, Clear
- Results preview below with loading states
- Use subtle rounded corners (rounded-lg)

### Dashboard Builder

**Widget Canvas**:
- Drag-and-drop grid layout
- Empty state: Dashed border placeholder with "Add Widget" CTAs
- Widget toolbar: Floating controls for edit/delete/resize
- Snap-to-grid alignment for precision

**Widget Types** (Each as distinct card component):

1. **Chart Widget**:
   - Chart type selector: Bar, Line, Pie, Area (icon buttons)
   - Chart area with responsive sizing
   - Legend placement options
   - Data label toggles
   - Export to PNG/SVG option

2. **Metric/KPI Widget**:
   - Large number display (text-4xl to text-6xl)
   - Label underneath (text-sm)
   - Optional trend indicator (up/down arrow with percentage)
   - Compact, single-metric focus

3. **Data Table Widget**:
   - Sortable column headers
   - Pagination controls
   - Row hover states
   - Fixed header on scroll for tall tables

4. **Text/Notes Widget**:
   - Rich text editing capability
   - For annotations and insights
   - Minimal borders, focus on content

**Add Widget Modal**:
- Grid of widget type cards (2 columns on mobile, 4 on desktop)
- Each card: Icon, title, short description
- Hover state with subtle elevation
- Quick configuration form after selection

### Data Management

**Data Source Cards**:
- Grid layout showing connected databases/CSV files
- Card displays: Source name, connection status (dot indicator), row count
- Actions: Edit, Disconnect, Refresh
- "Add New Source" card with dashed border and plus icon

**CSV Upload Zone**:
- Large dropzone with dashed border (border-dashed)
- Drag-and-drop with file icon
- Alternative: Click to browse button
- Progress bar during upload
- Preview table after successful upload

### Forms & Inputs

**Input Fields**:
- Height: h-10 for standard inputs
- Border: 1px with rounded-md
- Focus state: ring with offset
- Labels: text-sm, font-medium, mb-2

**Buttons**:
- Primary CTA: Prominent, medium size (px-6 py-2.5)
- Secondary: Outlined variant
- Icon buttons: w-10 h-10, rounded-md
- Disabled state: reduced opacity (opacity-50)

**Dropdowns/Select Menus**:
- Custom styled with Heroicons chevron-down
- Options with hover states
- Multi-select with checkboxes where applicable

### Feedback Elements

**Empty States**:
- Centered icon (w-16 h-16, Heroicons outline)
- Heading: "No dashboards yet"
- Description: Helpful next step
- Primary CTA button

**Loading States**:
- Skeleton loaders for data tables and charts
- Spinner for query execution
- Progress bars for uploads

**Toasts/Notifications**:
- Top-right positioned (fixed, top-4, right-4)
- Icon + message + dismiss button
- Auto-dismiss after 5 seconds
- Success, error, info variants

---

## Animations

**Minimal, Purposeful Motion**:
- Sidebar collapse: 200ms ease
- Widget drag-and-drop: Smooth transform
- Chart data transitions: 300ms ease when updating
- Modal fade-in: 150ms
- Hover elevations: Subtle 2px translate-y
- **No scroll-triggered animations**

---

## Images

**No hero images required** - This is a productivity tool, not a marketing page. Focus remains on functional interface elements.

**Icons Only**: Heroicons library via CDN for all interface icons (data, chart, table, user, settings, etc.)

---

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation for dashboard widgets (tab, arrow keys)
- Focus indicators on all focusable elements (ring with offset)
- Sufficient contrast ratios for text on all backgrounds
- Form validation with clear error messages
- Screen reader announcements for dynamic content updates