# Figma Design System & Page Documentation

**Date**: February 25, 2026
**Project**: FDIC Public Information FAQ Micro-site
**Purpose**: Design documentation and reusable component library for team collaboration

## Overview

A comprehensive Figma file capturing the current visual styling and interactive components of the FDIC Public Information FAQ micro-site. The file serves two purposes:
1. **Design Documentation** — Full-page mockups of all key pages for stakeholder review and team reference
2. **Reusable Component Library** — UI components with interactive states and variants for future design work

## File Structure

**File Name**: "FDIC Public Information FAQ - Design System & Pages"

### Sections

#### 1. Cover Page
- Project title and overview
- Navigation guide to other sections
- Design system quick reference

#### 2. Component Library
Organized into logical groups with full variants and interactive states:

**Form Inputs**
- Text input (default, focus, error, filled, disabled)
- Email input (with validation states)
- Textarea (default, focus, error, filled)
- Select/dropdown (default, focus, open, disabled)

**Buttons & Actions**
- Primary buttons (default, hover, focus, active, disabled)
- Secondary buttons (same state variants)
- Step action buttons (previous/next navigation style)

**Choice Groups**
- Radio button groups (selected, unselected, error states)
- Checkbox groups (checked, unchecked, indeterminate)

**Cards & Containers**
- Section containers with padding/spacing
- Info/legal notice boxes
- Error summary containers
- Contextual FAQ suggestion cards

**Navigation Components**
- Breadcrumb trail
- Progress tracker (with step indicators)
- Support navigation sidebar
- Step actions bar

**Typography Styles**
- Heading 1, 2, 3
- Body text
- Label text
- Helper text
- Error messages

**Alerts & Status Messages**
- Error summary alert
- Success message
- Info notice
- Warning/legal notice boxes

**Layout Patterns**
- Two-column layout (main content + sidebar)
- Form field grid system
- Spacing/margin utilities

**Visual System**
- Color palette (all colors used in site)
- Typography scale (fonts, sizes, weights, line heights)
- Spacing system (padding, margins, gaps)
- Border styles and shadows

#### 3. Page Mockups
Full-page designs for each key page, maintaining actual visual styling:

1. **Landing/Intake Page** (index.html)
   - Header and breadcrumb
   - Main heading and intro copy
   - Multi-step form with conditional sections
   - Sidebar with navigation and progress tracker
   - Legal/privacy notices
   - Submit button and actions

2. **FAQ Page** (faq.html)
   - Header and breadcrumb
   - Search functionality
   - FAQ accordion/list layout
   - Category filtering if present
   - Pagination or load more

3. **Report Problem - Step 1** (report-problem.html)
   - Form header
   - Initial problem selection
   - Conditional sections based on selection
   - Navigation buttons

4. **Report Problem - Step 2** (report-problem-step-2.html)
   - Continued form flow
   - Additional detail sections
   - Progress indicator update
   - Next/previous navigation

5. **Review Submission** (review-submission.html)
   - Summary of submitted information
   - Edit functionality
   - Confirmation notice
   - Final submission action

6. **Submission Confirmation** (submission-confirmation.html)
   - Success message
   - Confirmation details
   - Next steps guidance
   - Contact information or case reference

7. **View Cases** (view-cases.html)
   - Case list/table view
   - Filtering and sorting
   - Case detail view
   - Status indicators

#### 4. Annotations & Documentation
- Design decision notes
- Component usage guides
- Responsive behavior notes
- Accessibility considerations
- Color and typography specifications

## Component Variants & States

All components include:
- **Default state** — Normal appearance
- **Hover state** — Mouse over interaction
- **Focus state** — Keyboard focus / active element
- **Filled/Selected state** — When element has user input or is active
- **Error state** — Validation failure appearance
- **Disabled state** — When element is not interactive
- **Loading/Processing state** — For async operations (if applicable)

## Design Tokens Documented

- **Colors**: All hex values, RGB, and color names used
- **Typography**: Font families, sizes, weights, line heights for each type
- **Spacing**: Standard padding, margin, and gap values
- **Borders**: Border radius, width, and style specifications
- **Shadows**: Drop shadow and elevation specifications

## Workflow & Interaction Notes

Documentation will include:
- Form validation and error display flow
- Conditional field visibility logic (which fields appear when)
- Progress tracking through multi-step form
- FAQ contextual suggestions during form flow
- Case filtering and sorting behavior
- Responsive layout changes for mobile/tablet

## Success Criteria

- ✓ All 7 key pages captured as full-page mockups
- ✓ All UI components extracted and organized with variants
- ✓ Interactive states documented for each component
- ✓ Actual visual styling captured from built site
- ✓ Components ready for reuse in future designs
- ✓ File is accessible and navigable for team members
- ✓ Design system documented and explained

## Next Steps

1. Extract actual colors, typography, and spacing from built site
2. Create component library page with all variants
3. Create full-page mockups for each of the 7 pages
4. Add annotations and documentation
5. Share with team for review and feedback
