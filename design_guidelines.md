# Design Guidelines: GreenMove Sustainability Ecosystem

## Design Approach

**Reference-Based Approach**: Drawing inspiration from eco-conscious apps like Oroeco, JouleBug, and modern sustainability platforms to create a vibrant, hopeful interface that motivates environmental action through beautiful design and gamification.

**Key Principles**:
1. **Optimistic Sustainability**: Use vibrant greens and earth tones to inspire action, not guilt
2. **Data-Driven Transparency**: Clear visualizations showing impact and progress
3. **Gamified Engagement**: Rewards, achievements, and progress tracking feel rewarding
4. **Accessible Information**: Complex environmental data made simple and beautiful

---

## Color Palette

**Primary Colors** (Earth & Growth):
- Forest Green: `142 70% 35%` - Primary actions, representing growth and nature
- Leaf Green: `142 65% 45%` - Secondary actions, lighter nature touch
- Sky Blue: `200 85% 48%` - Information, water, clean energy
- Sunshine Yellow: `45 95% 60%` - Rewards, achievements, solar energy

**Neutral Colors**:
- Background Light: `140 15% 98%` - Main background with subtle green tint
- Background Dark: `140 10% 8%` - Dark mode background
- Card Light: `140 10% 96%` - Elevated surfaces
- Card Dark: `140 8% 10%` - Dark mode cards

**Semantic Colors**:
- Success Green: `142 70% 45%` - Positive environmental impact
- Warning Amber: `30 95% 55%` - Moderate impact/attention needed
- Danger Red: `0 70% 50%` - High carbon footprint/negative impact
- Info Blue: `200 85% 48%` - Educational content

---

## Typography

**Font System**:
- Primary: Inter - Clean, modern readability for all UI elements
- Heading: Space Grotesk - Bold, distinctive headings that command attention
- Mono: JetBrains Mono - Data displays, carbon calculations

**Hierarchy**:
- Hero Titles: Space Grotesk, 48px (text-5xl), bold - Dashboard titles
- Section Headers: Space Grotesk, 32px (text-3xl), semibold - Major sections
- Card Titles: Space Grotesk, 24px (text-2xl), medium - Widget headers
- Body Text: Inter, 16px (text-base), regular - Main content
- Data Values: Inter, 20-32px (text-xl to text-3xl), semibold - Metrics, carbon savings
- Labels: Inter, 14px (text-sm), medium - Form labels, chart labels
- Captions: Inter, 12px (text-xs), regular - Timestamps, metadata

---

## Layout System

**Spacing Units**: Use Tailwind's 4, 6, 8, 12, 16, 24 for eco-friendly breathing room

**Grid Structure**:
- App uses sidebar navigation (280px) + main content area
- Dashboard: Responsive grid (1 col mobile, 2 cols tablet, 3-4 cols desktop)
- Cards have generous padding (p-6) to feel spacious and uncluttered

**Component Spacing**:
- Between major sections: mb-12 or space-y-12
- Between cards in grid: gap-6
- Inside cards: p-6
- Form elements: space-y-4

---

## Component Library

### Navigation

**Sidebar (Primary Navigation)**:
- Fixed left sidebar with sustainability-themed icons
- Sections:
  - Dashboard (Home icon)
  - Carbon Tracker (Leaf icon)
  - Activities (Activity icon)
  - Eco Coach (MessageCircle icon)
  - Rewards (Trophy icon)
  - Analytics (BarChart icon)
  - Map (Map icon)
- Active state: bg-sidebar-accent with left border accent (border-l-4 border-primary)
- Logo area at top with leaf/plant icon

**Top Bar**:
- Height: h-16
- Left: Sidebar toggle, breadcrumbs
- Right: User points/tokens display, notifications, profile
- Sticky positioning with subtle shadow

### Dashboard Widgets

**Carbon Footprint Card**:
- Large, prominent card showing total CO2 saved
- Circular progress indicator or large numerical display
- Color-coded: Green for low/good, yellow for moderate, red for high
- Comparison metrics (vs. last week, vs. average user)

**Activity Cards**:
- Icon + title (e.g., bike icon + "Biked 5 miles")
- Carbon saved amount in green badge
- Points earned in gold/yellow badge
- Timestamp in muted text
- Hover effect with subtle elevation

**Weather Widget**:
- Current temperature and conditions with icon
- 5-day forecast in horizontal scrollable row
- Air quality index with color coding
- Powered by Open-Meteo (subtle attribution)

**Rewards Display**:
- Total points/eco-tokens prominently displayed
- Recent achievements with icons and animations
- Progress bars toward next rewards
- Leaderboard position (optional)

**Map Component**:
- Full-width Leaflet map with OpenStreetMap tiles
- Markers for eco-friendly locations (recycling centers, bike lanes, charging stations)
- User's tracked activities shown as route polylines
- Layer controls for different activity types
- Legend with color-coded categories

**Eco Coach Chat**:
- Chat bubble interface with distinct user/bot styling
- Bot messages in card with green accent border
- User messages in secondary color
- Suggested quick-reply buttons below bot messages
- Input field with send button at bottom
- Loading animation when bot is "thinking"

**Analytics Charts**:
- Line chart: Carbon savings over time
- Bar chart: Activity breakdown by type
- Pie chart: Impact categories (transport, energy, waste, etc.)
- Use earth tones for chart colors (greens, blues, browns)
- Tooltips on hover with detailed breakdowns
- Responsive: Stack vertically on mobile

**Climate Data Visualizations**:
- Global temperature trends (NASA data)
- CO2 concentration charts
- Ice coverage maps
- Data source attribution (NASA DEMO_KEY)
- Educational tooltips explaining the data

### Forms & Inputs

**Activity Logger Form**:
- Activity type dropdown (Transport, Energy, Waste, Water, etc.)
- Specific action dropdown (e.g., for Transport: Bike, Walk, Public Transit, Carpool)
- Quantity input (miles, kWh, gallons, etc.) with unit selector
- Date/time picker
- Location input (optional, for map integration)
- Notes text area
- Submit button: Large, green, prominent "Log Activity"

**Input Styling**:
- Height: h-10 for all text inputs
- Border: 1px with focus ring in primary green
- Labels: text-sm font-medium mb-2
- Helper text below inputs in muted color

**Buttons**:
- Primary (green): For main actions (Log Activity, Save, Confirm)
- Secondary (outline): For cancel/back actions
- Icon buttons: For maps, filters, menu toggles
- Success state: Brief checkmark animation

### Feedback Elements

**Empty States**:
- Large leaf/plant illustration (can use Lucide icon styled large)
- Heading: "Start Your Green Journey"
- Description: Encouraging message about taking first steps
- Primary CTA: "Log Your First Activity"

**Loading States**:
- Skeleton loaders for cards and charts
- Spinner for data fetching (green animated circle)
- Progress bars for calculations

**Success Toasts**:
- Green background with checkmark icon
- Messages: "Activity logged! +15 points earned"
- Auto-dismiss after 4 seconds

**Achievement Unlocks**:
- Modal or full-screen celebration animation
- Trophy/badge icon
- Achievement name and description
- Points earned
- Share button (optional)

---

## Animations

**Purposeful, Eco-Themed Motion**:
- Card hover: Subtle lift (translate-y-1) with shadow increase
- Points counter: Count-up animation when new points earned
- Achievement unlock: Scale + fade in with confetti effect
- Chart data: Smooth transitions when data updates (300ms ease)
- Progress bars: Animated fill from 0 to target value
- Activity cards: Fade in as they're added to list
- No heavy animations - keep it smooth and performant

---

## Icons

**Lucide React Icons**:
- Home, Leaf, Activity, MessageCircle, Trophy, BarChart, Map for navigation
- Bike, Car, Bus, Zap (energy), Droplet (water), Trash (waste) for activity types
- TrendingUp/Down for analytics
- Award, Star for achievements
- MapPin for locations
- Cloud, Sun, CloudRain for weather

**Sustainability Icons**:
- Use Leaf as primary brand icon
- Recycle symbol for waste activities
- Sprout for growth/progress
- Tree for carbon offset

---

## Accessibility

- All interactive elements have focus states with visible rings
- Color is never the only indicator (use icons + text)
- Sufficient contrast ratios (WCAG AA minimum)
- ARIA labels on icon buttons
- Keyboard navigation throughout
- Screen reader friendly chart descriptions
- Form validation with clear error messages

---

## Dark Mode

- Full dark mode support with earthy dark backgrounds
- Dark mode still uses green accents (slightly brighter for contrast)
- Charts use lighter colors in dark mode for visibility
- Maps use dark-themed OpenStreetMap tiles in dark mode
- All text maintains proper contrast ratios
