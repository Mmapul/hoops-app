# Basketball Workout App - Design Guidelines

## Architecture Decisions

### Authentication
**No Backend Authentication Required**
- This is a single-user, local-first workout tracking app
- All data (workout history, progress, custom workouts) stored locally on device
- Include Profile/Settings screen with:
  - User-customizable avatar (generate 3 basketball-themed preset avatars: a player silhouette dunking, a player shooting, a player dribbling)
  - Display name field (default: "Player")
  - App preferences: theme toggle (light/dark), sound effects on/off, imperial/metric units
  - About section with app version

### Navigation Structure
**Tab Bar Navigation** (4 tabs + floating action button)
- **Workouts Tab**: Browse workout library filtered by skill level and category
- **Session Tab**: Active workout in progress with drill instructions and timers
- **Progress Tab**: Statistics dashboard and workout history
- **Profile Tab**: User settings and preferences
- **Floating Action Button (FAB)**: "Start Workout" - positioned bottom-right, always visible, primary brand color with white icon

Information Architecture:
- Workouts → Workout Details → Start Session
- Session → Complete → Summary (modal)
- Progress → Workout History → Session Details
- Profile → Settings → nested preferences

## Screen Specifications

### 1. Workouts Library (Home)
**Purpose**: Browse and filter available workout programs

**Layout**:
- Header: Default navigation header, transparent background
  - Title: "Workouts"
  - Right button: Filter icon (opens filter modal)
- Main content: Scrollable view
  - Skill level pills (Beginner, Intermediate, Advanced) - horizontal scroll
  - Category sections (Shooting, Dribbling, Defense, Conditioning)
  - Workout cards displaying: name, duration, drill count, difficulty badge
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**: Horizontal pill selector, sectioned list with cards, filter modal

### 2. Workout Details
**Purpose**: View drill breakdown before starting session

**Layout**:
- Header: Stack navigation header
  - Left: Back button
  - Title: Workout name
  - Right: Bookmark icon (save to favorites)
- Main content: Scrollable view
  - Workout overview card (total time, drill count, equipment needed)
  - Drill list with expandable rows showing sets/reps
  - Bottom sticky button: "Start Workout" (primary CTA)
- Safe area insets: top = Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**: Stats card, expandable list items, sticky bottom button

### 3. Active Session
**Purpose**: Guide user through workout with timers and rep counters

**Layout**:
- Header: Custom header, semi-transparent dark overlay
  - Left: Pause icon
  - Center: Session timer (MM:SS)
  - Right: End session icon
- Main content: Non-scrollable fixed layout
  - Current drill name (large, centered)
  - Rep/set counter (huge typography, center screen)
  - Rest timer (circular progress indicator when active)
  - Navigation: Previous/Next drill buttons
  - Progress bar showing X of Y drills completed
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**: Custom timer display, circular progress, increment/decrement buttons, progress bar

### 4. Session Complete (Modal)
**Purpose**: Show workout summary and log completion

**Layout**:
- Native modal presentation (slides up from bottom)
- Header: No navigation header
- Content: Scrollable form
  - Celebration graphic/icon
  - Session stats: total time, drills completed, calories estimate
  - Notes field (optional reflection)
  - Difficulty rating (1-5 stars)
  - Submit button: "Save Workout"
  - Text button: "Discard" (confirmation alert)
- Safe area insets: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**: Success state graphic, stat cards, text input, star rating, form buttons

### 5. Progress Dashboard
**Purpose**: View workout history and performance metrics

**Layout**:
- Header: Default navigation header, transparent
  - Title: "Progress"
  - Right: Calendar icon (date range picker)
- Main content: Scrollable view
  - Stats overview cards: total workouts, consistency streak, total minutes
  - Chart showing workouts per week (bar chart)
  - Recent sessions list (grouped by date)
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**: Stat cards with icons, simple bar chart, grouped list

### 6. Workout History Detail
**Purpose**: Review past session details

**Layout**:
- Header: Stack navigation header
  - Left: Back button
  - Title: Date of session
- Main content: Scrollable view
  - Session summary card
  - Completed drills list with checkmarks
  - User notes (if provided)
- Safe area insets: top = Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**: Summary card, checklist items

### 7. Profile & Settings
**Purpose**: Manage user preferences and app settings

**Layout**:
- Header: Default navigation header, transparent
  - Title: "Profile"
- Main content: Scrollable form
  - User avatar (tappable to change)
  - Display name field
  - Settings sections: Preferences, About, Support
  - Each setting row navigates to detail screen or toggle
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**: Avatar picker, text input, settings list with disclosure indicators

## Design System

### Color Palette
**Primary Brand Colors**:
- Primary Orange: #FF6B2C (basketball energy)
- Dark Charcoal: #1A1A1A (text, backgrounds in dark mode)
- Court Green: #2D5016 (accent for success states)

**Neutrals**:
- White: #FFFFFF
- Light Gray: #F5F5F5 (backgrounds)
- Medium Gray: #9E9E9E (secondary text)
- Border Gray: #E0E0E0

**Semantic Colors**:
- Success: Court Green #2D5016
- Warning: #FFA726
- Error: #E53935

### Typography
- **Display**: System Bold, 34pt (workout names on session screen)
- **Headline**: System Semibold, 24pt (screen titles)
- **Body**: System Regular, 16pt (drill instructions)
- **Caption**: System Regular, 14pt (metadata, timestamps)
- **Button**: System Semibold, 16pt

### Spacing
- xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32

### Component Specifications

**Workout Cards**:
- White background with subtle border (1px, Border Gray)
- Corner radius: 12
- Padding: Spacing.lg
- NO drop shadow
- Active state: scale(0.98)

**Floating Action Button**:
- Size: 64×64
- Corner radius: 32 (fully rounded)
- Background: Primary Orange
- Icon: Plus or Play (white)
- Position: bottom-right, 16pt from edges
- **Shadow** (EXACT specifications):
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2

**Primary Buttons**:
- Height: 48
- Corner radius: 8
- Background: Primary Orange
- Text: White, System Semibold 16pt
- Press state: opacity 0.8

**Stat Cards**:
- Background: Light Gray
- Corner radius: 12
- Padding: Spacing.lg
- Icon + label + value layout
- NO drop shadow

### Icons
- Use Feather icons from @expo/vector-icons
- Standard actions: ChevronLeft, ChevronRight, Play, Pause, X, Filter, Calendar, Settings
- Never use emojis

### Critical Assets
1. **Player Avatars** (3 variations):
   - Avatar 1: Silhouette dunking (orange & black)
   - Avatar 2: Silhouette shooting (orange & black)
   - Avatar 3: Silhouette dribbling (orange & black)
2. **Session Complete Graphic**: Trophy or checkmark badge (orange accent)

### Accessibility
- Minimum touch targets: 44×44
- Color contrast: 4.5:1 for body text, 3:1 for large text
- Timer displays must be large and high contrast
- All interactive elements have accessible labels