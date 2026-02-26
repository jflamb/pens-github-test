# FDIC Public Information & Support Center - Design Tokens

Extracted design system from the built site for use in Figma mockups and component library.

## Color Palette

### Primary Brand Colors
- **FDIC Blue 900**: `#003256` - Primary dark blue (headers, buttons)
- **FDIC Blue 800**: `#0d6191` - Secondary blue (links)
- **FDIC Blue 700**: `#0c5a88` - Accent blue (focus states, borders)
- **FDIC Blue 050**: `#f1f5fb` - Light blue background

### Neutral Colors
- **FDIC Gray 900**: `#1b1b1b` - Primary text color
- **FDIC Gray 700**: `#3d4551` - Secondary text, labels
- **FDIC Gray 400**: `#a9aeb1` - Tertiary text
- **FDIC Gray 300**: `#c9cdd1` - Light borders
- **FDIC Gray 200**: `#dfe1e2` - Subtle borders
- **FDIC Gray 100**: `#f0f0f0` - Light background
- **FDIC White**: `#ffffff` - White background
- **FDIC Black 900**: `#1b1d20` - Footer background

### Accent Colors
- **FDIC Gold**: `#7f7141` - Primary accent (buttons, icons)
- **FDIC Brass**: `#a48923` - Hover state for gold
- **FDIC Tan**: `#b7ac83` - Tertiary accent

### Surface & Background Colors
- **Surface Muted**: `#f0f2f5` - Form backgrounds, muted areas
- **Surface Soft**: `#f8fbff` - Soft blue background
- **Surface Soft Hover**: `#eef4fc` - Hover state for soft surface
- **Surface Selected**: `#eef6ff` - Selected state background
- **Border Subtle**: `#dfe1e2` - Subtle borders
- **Border Control**: `#c9cdd1` - Input borders
- **Border Emphasis**: `#b9cbe1` - Emphasized borders

### Status & Semantic Colors
- **Success Green (Primary)**: `#1e5f3f` - Success states, completed items
- **Error Red**: `#a21b1b` - Required field markers, error text
- **Error Red (Dark)**: `#7d1020` - Error links
- **Error Background**: `#fff3f2` - Error alert background
- **Error Border**: `#b50909` - Error border accent

### Utility Colors
- **Radio Button Active**: `#0d7cb8` - Selected radio button
- **Radio Button Border**: `#7b8794` - Radio button border
- **Checkbox Complete Color**: `#1e5f3f` - Completed checkbox
- **Progress Bar Text**: `#1f2934` - Progress tracking text
- **Progress Completed Text**: `#5a6675` - Completed progress text
- **FAQ Hover Border**: `#9db8da` - FAQ summary hover border
- **Sidebar Border**: `#cfdfe9` - Navigation borders
- **Link Underline on Hover**: `#70b6f1` - Selected item highlight

---

## Typography System

### Font Families
- **Serif (Display)**: Merriweather, Merriweather Web, Georgia, Cambria, Times New Roman, Times, serif
  - Used for: h1, h2, h3, labels, breadcrumbs, navigation

- **Sans Serif (Body)**: Open Sans, Source Sans Pro, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif
  - Used for: body text, buttons, secondary labels, footer links

### Headings

#### H1
- **Size**: 2.25rem (36px)
- **Line Height**: 1.25
- **Font Weight**: 400 (regular)
- **Font Family**: Serif
- **Color**: `#1b1b1b` (FDIC Gray 900)
- **Margin**: 0.75rem 0 1.125rem
- **Text Align**: center
- **Use Case**: Page titles

#### H2
- **Size**: 1.5rem (24px)
- **Line Height**: 1.25
- **Font Weight**: 400 (regular)
- **Font Family**: Serif
- **Color**: `#1b1b1b` (FDIC Gray 900)
- **Margin**: 0 0 0.75rem
- **Use Case**: Section headings

#### H3
- **Size**: 1.25rem (20px)
- **Line Height**: 1.4
- **Font Weight**: 400 (regular)
- **Font Family**: Serif
- **Color**: `#1b1b1b` (FDIC Gray 900)
- **Margin**: 0 0 0.55rem
- **Use Case**: Subsection headings, FAQ questions

### Body Text

#### Standard Body
- **Size**: 1rem (16px)
- **Line Height**: 1.5
- **Font Weight**: 400
- **Font Family**: Sans Serif
- **Color**: `#1b1b1b` (FDIC Gray 900)
- **Margin**: 0 0 0.75rem
- **Use Case**: Paragraph text, standard labels

#### Secondary Body
- **Size**: 0.95rem (15.2px)
- **Line Height**: 1.5
- **Font Weight**: 400
- **Font Family**: Sans Serif
- **Color**: `#3d4551` (FDIC Gray 700)
- **Use Case**: Helper text, smaller captions

#### Caption
- **Size**: 0.875rem (14px)
- **Line Height**: 1.3 to 1.5
- **Font Weight**: 400
- **Font Family**: Sans Serif
- **Color**: `#3d4551` (FDIC Gray 700)
- **Use Case**: Breadcrumbs, form hints, small labels
- **Letter Spacing**: normal
- **Text Transform**: uppercase (navigation only)

#### Large Body (Support Intro)
- **Size**: 1.05rem (16.8px)
- **Line Height**: 1.45
- **Text Align**: center

#### FAQ Answer Text
- **Line Height**: 1.65
- **Use Case**: Expanded FAQ content

#### Content Subtitle
- **Font Family**: Serif
- **Size**: 1.25rem (20px)
- **Line Height**: 1.6rem
- **Font Weight**: 300 (light)
- **Color**: `#7f7141` (FDIC Gold)
- **Margin Bottom**: 0.2rem
- **Text Align**: center

### Navigation Links
- **Font Size**: 1.2rem (19.2px)
- **Font Weight**: 400
- **Font Family**: Serif
- **Letter Spacing**: 0.07em
- **Text Transform**: uppercase
- **Color**: `#ffffff` (white)
- **Line Height**: 1.5
- **Padding**: 1rem 1.25rem

### Footer Links
- **Font Size**: 0.875rem (14px)
- **Font Weight**: 600 (bold, for back links)
- **Font Family**: Sans Serif
- **Text Transform**: uppercase
- **Color**: `#ffffff` (white)
- **Line Height**: 1.5

### Report/Form Labels
- **Size**: 1.5rem (24px) for main labels
- **Size**: 0.98rem (15.68px) for compact labels
- **Font Weight**: 400 for main, 700 for compact
- **Font Family**: Serif for main, Sans Serif for compact
- **Line Height**: 1.25 for main, 1.35 for compact
- **Color**: `#1b1b1b` (FDIC Gray 900)
- **Margin Bottom**: 0.4rem for main, 0.35rem for compact

---

## Spacing System

### Space Scale (CSS Variables)
- **Space 1**: 0.5rem (8px)
- **Space 2**: 0.75rem (12px)
- **Space 3**: 1rem (16px)
- **Space 4**: 1.5rem (24px)
- **Space 5**: 2rem (32px)

### Padding
- **Compact**: 0.45rem y-axis, 0.9rem x-axis
- **Standard**: 0.5rem to 1rem
- **Large**: 1rem to 1.5rem
- **Extra Large**: 1.5rem to 2rem
- **Container**: 1rem (grid container)

### Margin
- **Heading Top**: 0.75rem (h1), 0rem (h2/h3)
- **Heading Bottom**: 1.125rem (h1), 0.75rem (h2), 0.55rem (h3)
- **Paragraph Bottom**: 0.75rem
- **List Spacing**: 0.45rem to 0.95rem margins
- **Section Spacing**: 1.75rem top
- **Large Section**: 2.5rem

### Gap Values
- **Minimal**: 0.35rem
- **Small**: 0.6rem to 0.75rem
- **Standard**: 1rem to 1.1rem
- **Large**: 1.8rem to 2rem
- **Grid Gap**: 2rem (layout gaps)

### Layout Grids
- **Sidebar + Main Grid**: 300px sidebar, 1fr main, 2rem gap (desktop)
- **Sidebar + Main Grid (Tablet)**: 260px sidebar, 1fr main, 1.25rem gap
- **Sidebar + Main Grid (Mobile)**: 1 column
- **Support Layout**: 280px sidebar, 1fr main, 1.8rem gap
- **Report Layout**: 280px sidebar, 1fr main, 1.35rem gap
- **Support Cards (Desktop)**: 3 equal columns, 1.1rem gap
- **Support Cards (Tablet)**: 2 equal columns
- **Support Cards (Mobile)**: 1 column
- **Report Grid**: 2 columns, 0.65rem x gap, 0.85rem y gap
- **Report Inline Grid**: 2 columns, 0.75rem x gap, 0.9rem y gap
- **Report Option Grid**: 2 columns (radio options)

### Responsive Breakpoints
- **Mobile**: Below 600px
- **Tablet**: 600px to 980px
- **Desktop**: 980px and above

---

## Visual Patterns

### Border Styles

#### Standard Borders
- **Subtle Border**: 1px solid `#dfe1e2`
- **Control Border**: 1px solid `#c9cdd1`
- **Emphasis Border**: 1px solid `#b9cbe1`
- **Sidebar Border**: 1px solid `#cfdfe9`
- **Dark Separator**: 1px solid `#0f2442` (header bottom)

#### Border Radius
- **Minimal**: 2px (FAQ summary)
- **Small**: 4px (cards, progress boxes)
- **Large**: 999px (pill buttons, rounded icons)
- **None**: 0 (most inputs and buttons)

#### Accent Borders
- **Selected Item Border**: 4px solid `#0c5a88` (left border)
- **Error Border**: 4px solid `#b50909` (left border)
- **Success Border**: 4px solid `#1e5f3f` (left border)
- **Focus Outline**: 2px solid `#0c5a88` with 2px offset

### Shadow & Elevation

#### Box Shadows
- **Subtle Shadow**: 0 1px 2px rgba(0, 43, 73, 0.08) (progress box)
- **Inset Focus Shadow**: inset 0 0 0 2px `#0c5a88` (focused elements)
- **Header Shadow**: inset 0 7px 0 `#b7ac83` (top tan stripe)

### Button Styles

#### Primary Action Button (USA Button)
- **Background**: `#7f7141` (FDIC Gold)
- **Color**: `#ffffff` (white)
- **Hover Background**: `#a48923` (FDIC Brass)
- **Padding**: 0.45rem y, 0.9rem x
- **Min Height**: 2.6rem (control-height-large)
- **Min Width**: 180px
- **Font Weight**: 700
- **Line Height**: 1.2
- **Border**: none
- **Border Radius**: 0
- **Cursor**: pointer

#### Secondary Button (Step/Next Button)
- **Background**: `#0d6191` (FDIC Blue 800)
- **Color**: `#ffffff` (white)
- **Hover Filter**: brightness(0.97)
- **Disabled Background**: `#8ca7bc`
- **Disabled Color**: `#f3f4f6`
- **Min Height**: 2.25rem (control-height-regular)
- **Padding**: 0.45rem y, 0.7rem x

#### Clear/Secondary Button
- **Background**: `#ffffff` (white)
- **Color**: `#0c5a88` (FDIC Blue 700)
- **Border**: 1px solid `#0c5a88`
- **Hover Background**: `#f1f5fb` (FDIC Blue 050)
- **Padding**: 0.45rem y, 0.75rem x
- **Min Height**: 2.75rem
- **Border Radius**: 0

#### Copy Link Button
- **Background**: `#f8fbff` (surface-soft)
- **Color**: `#0d6191` (FDIC Blue 800)
- **Border**: 1px solid `#b9cbe1` (border-emphasis)
- **Min Height**: 2.25rem
- **Padding**: 0.35rem y, 0.7rem x
- **Font Size**: 0.9rem
- **Border Radius**: 999px (pill)
- **Hover/Focus Background**: `#eef4fc` (surface-soft-hover)
- **Hover/Focus Border**: `#8fb0d8`

### Input Field Styles

#### Text Input/Textarea/Select
- **Border**: 1px solid `#c9cdd1` (border-control)
- **Background**: `#ffffff` (white)
- **Padding**: 0.5rem to 0.7rem
- **Min Height**: 2.6rem (control-height-large)
- **Border Radius**: 0
- **Font**: inherit
- **Line Height**: 1.35 to 1.45

#### Textarea
- **Min Height**: 220px (standard), 130px (short)
- **Resize**: vertical

#### Select Dropdown
- **Custom Arrow**: SVG background image
- **Arrow Color**: `#3d4551` (FDIC Gray 700)
- **Padding Right**: 2.2rem (for arrow space)

#### Radio Button (Custom Styled)
- **Size**: 1.12rem
- **Border**: 2px solid `#7b8794`
- **Border Radius**: 50%
- **Background**: `#ffffff` (white)
- **Checked State Border**: `#0d7cb8`
- **Inner Circle Size**: 0.53rem
- **Inner Circle Color**: `#0d7cb8`

#### Search Input
- **Height**: 2.75rem
- **Border**: 1px solid `#a9aeb1` (FDIC Gray 400)
- **Padding**: 0.5rem right, 0.65rem left
- **Clear Button Height**: calc(2.75rem - 4px)

### Focus States
- **Outline**: 2px solid `#0c5a88` (FDIC Blue 700)
- **Outline Offset**: 2px (standard), -2px (inset), 1px (input)
- **Transition**: 0 (instant)

### Hover States
- **Subtle Hover**: `#f4f8fc` or `#eef3f8` (light blue)
- **Card Hover**: `#f5f9ff` with inset shadow
- **Navigation Hover**: `#1a3f73` (darker blue)

### Transitions
- **Standard Duration**: 120ms to 150ms
- **Easing**: ease or ease-in-out
- **Prefers Reduced Motion**: disabled for users with that preference

#### Animated Properties
- `background-color` 150ms ease
- `border-color` 150ms ease
- `box-shadow` 150ms ease
- `color` 150ms ease
- `opacity` 120ms ease
- `transform` 120ms ease-in-out

### Alert & Status Boxes

#### Error Summary
- **Border Left**: 4px solid `#b50909`
- **Background**: `#fff3f2`
- **Padding**: 0.7rem 0.9rem
- **Margin Bottom**: 1rem

#### Success/Confirmation Alert
- **Border Left**: 4px solid `#1e5f3f`
- **Border**: 1px solid `#b4d5c0`
- **Background**: `#f3fbf6`
- **Padding**: 0.7rem 0.9rem

#### Progress/Info Box
- **Border**: 1px solid `#b7cde1`
- **Border Left**: 4px solid `#0c5a88`
- **Border Radius**: 4px
- **Background**: linear-gradient(180deg, `#f8fbff` 0%, `#f3f7fb` 100%)
- **Box Shadow**: 0 1px 2px rgba(0, 43, 73, 0.08)
- **Padding**: 0.85rem 0.95rem 0.9rem

#### Legal/Information Note
- **Border**: 1px solid `#dfe1e2`
- **Background**: `#f9fafb`
- **Padding**: 0.8rem 0.95rem
- **Border Radius**: 0
- **Margin**: 0.9rem 0 1rem
- **Max Width**: 68ch (default)

#### Legal Note Full Width
- **Border**: none with 4px left border `#a9aeb1`
- **Background**: transparent
- **Padding**: 0 0 0 1rem
- **Max Width**: none

### Dividers & Separators
- **Standard**: 1px solid `#dfe1e2`
- **Subtle**: 1px solid `#c9cdd1`
- **Header/Footer**: 1px solid `#234e86` (dark blue)
- **Header Top**: 2px solid `#7f7141` (FDIC Gold)

### Header & Footer
- **Header Background**: `#003256` (FDIC Blue 900)
- **Header Min Height**: 72px
- **Header Border Top**: 2px solid `#7f7141` (FDIC Gold)
- **Header Top Padding**: 7px
- **Header Bottom Border**: 1px solid `#0f2442`
- **Footer Primary Background**: `#003256` (FDIC Blue 900) with background image overlay
- **Footer Primary Border**: 1px solid `#234e86`
- **Footer Secondary Background**: `#1b1d20` (FDIC Black 900)
- **Footer Secondary Top Border**: 2px solid `#ffffff`

### Breadcrumb
- **Font Size**: 0.875rem
- **Font Style**: italic
- **Line Height**: 1.3
- **Separator**: "//" with 0.45rem margins
- **Separator Color**: `#3d4551` (FDIC Gray 700)

### Share Bar
- **Margin**: 2.5rem 0
- **Padding**: 0.75rem 0
- **Border Top/Bottom**: 1px solid `#e6e6e6`
- **Background**: linear-gradient(to right, `#ffffff`, `#f7f7f3`, `#ffffff`)
- **Gap**: 0.35rem

### Share Icon
- **Size**: 30px
- **Border Radius**: 50%
- **Background**: `#7f7141` (FDIC Gold)
- **Color**: `#ffffff` (white)
- **Font Size**: 16px
- **Hover Background**: `#a48923` (FDIC Brass)

---

## Component-Specific Patterns

### FAQ Item (Details/Summary)
- **Padding**: 1.05rem 1.125rem 0.9rem (summary)
- **Border Bottom**: 1px solid `#dfe1e2`
- **Border Left**: 3px solid transparent (becomes `#0c5a88` on focus/expand)
- **Border Radius**: 2px
- **Hover Background**: `#f4f8fc`
- **Transition**: 150ms ease for background, border, shadow

#### FAQ Answer
- **Border Top**: 1px solid `#dfe1e2`
- **Padding**: 1rem 1.125rem 1.35rem
- **Line Height**: 1.65

### Category/Navigation Row
- **Min Height**: 2.75rem
- **Padding**: 0.625rem 1rem
- **Border Bottom**: 1px solid `#cfdfe9`
- **Font Size**: 1rem
- **Line Height**: 1.5
- **Selected Border Left**: 4px solid `#0c5a88`
- **Selected Font Weight**: 600
- **Hover Background**: `#eef3f8`

### Support Card
- **Border**: 1px solid `#cfdfe9`
- **Border Radius**: 4px
- **Padding**: 1rem 1.1rem 1.15rem
- **Hover Background**: `#f5f9ff`
- **Hover Box Shadow**: inset 0 0 0 2px `#c2d6ee`
- **Transition**: 150ms ease

### Report Form Controls
- **Control Height Compact**: 2rem
- **Control Height Regular**: 2.25rem
- **Control Height Large**: 2.6rem
- **Control Pad Y**: 0.45rem
- **Control Pad X**: 0.9rem

---

## Gradients

### Linear Gradients
1. **Share Bar**: `linear-gradient(to right, #ffffff, #f7f7f3, #ffffff)`
2. **Progress Box**: `linear-gradient(180deg, #f8fbff 0%, #f3f7fb 100%)`

### Patterns
- **FAQ Clear Button**: SVG background with cross pattern (2 diagonal lines)
  - Pattern Color: `#35567f`
  - Background Color: `#f3f7fc`
  - Pattern Size: 14px × 14px

---

## Accessible Focus Indicators
- **Style**: 2px solid `#0c5a88` (FDIC Blue 700)
- **Offset**: Typically 2px outward
- **Exception**: 1px offset for form inputs (to maintain spacing)
- **Inset Option**: -2px offset for search clear button
- **Always Applied To**:
  - All interactive elements (buttons, links, inputs)
  - Category rows and navigation items
  - FAQ summaries
  - Support cards

---

## Notes for Figma Implementation

1. **CSS Variables Available**: Use the `:root` variables for scalability
2. **Responsive Design**: Multiple breakpoints (mobile, tablet, desktop)
3. **Motion**: Some elements use transitions; respect prefers-reduced-motion
4. **Typography Stack**: Serif (Merriweather) for display, Sans Serif (Open Sans) for body
5. **Spacing Consistency**: Use the 8px base unit for all spacing
6. **Color System**: Well-organized color palette with semantic naming
7. **Component States**: Hover, focus, active, disabled, and loading states documented
8. **Accessibility**: All interactive elements have visible focus indicators

---

## Design Tokens Export Summary

- **35+ Color Tokens**
- **8 Font Scale Steps** with line height and weight variations
- **5 Core Spacing Units**
- **4+ Border Radius Options**
- **Multiple Button Variants** with states
- **Complete Form Control Styles**
- **Transition & Animation Standards**
- **Accessible Focus State Patterns**
- **Status & Alert Color Schemes**
