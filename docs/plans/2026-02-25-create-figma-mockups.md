# Figma Design System & Mockups Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a comprehensive Figma file with reusable component library and full-page mockups of all FDIC support center pages.

**Architecture:** Single Figma file with organized pages: Cover/Navigation, Component Library (organized by type with variants), then full-page mockups (7 pages total), followed by documentation and annotations.

**Tech Stack:** Figma (web app), CSS inspection of built site, Color/typography extraction from styles.css and HTML

---

## Pre-Implementation Setup

**Check existing built site:**
- Verify all 7 pages are accessible and load correctly
- View each page in browser to understand current visual state
- Note any responsive behaviors or special interactions

---

## Task 1: Extract Design System from Built Site

**Files to inspect:**
- `/sites/fdic-public-information-faq/styles.css` - all styles
- `/sites/fdic-public-information-faq/index.html` - structure and classes
- Each HTML page - structure and content

**Step 1: Document color palette**

Extract all colors used in the site from styles.css. Look for:
- Color variables (if defined)
- Background colors
- Text colors
- Border colors
- Accent/highlight colors

Create a document listing all unique colors with hex values.

**Step 2: Document typography**

From styles.css and HTML, identify:
- Font families used (currently: Merriweather, Open Sans, Source Sans Pro)
- Font sizes for headings (h1, h2, h3)
- Font sizes for body text and labels
- Font weights used
- Line heights for each text type

Document in format: `Heading 1: Merriweather 300/400/700, 32px, line-height 1.4`

**Step 3: Document spacing system**

Identify standard spacing/padding values:
- Form field margins
- Section padding
- Grid gaps
- Button padding
- Component spacing

**Step 4: Note visual patterns**

Identify and document:
- Border radius used
- Shadow/elevation styles
- Button styles
- Input field styles
- Card/container styles

**Step 5: Create design tokens document**

Save to: `/docs/design-tokens-extracted.md`

Format should be organized by category (colors, typography, spacing) with specific values ready to input into Figma.

---

## Task 2: Create Figma File and Cover Page

**Step 1: Create new Figma file**

- File name: "FDIC Public Information FAQ - Design System & Pages"
- Create at the team's Figma workspace
- Set up standard frame sizes (Desktop: 1280x800, Tablet: 768x1024, Mobile: 375x812)

**Step 2: Create cover/title page**

- Frame: Desktop size (1280x800)
- Add title: "FDIC Public Information & Support Center"
- Subtitle: "Design System & Page Documentation"
- Add navigation list linking to each section:
  - Component Library
  - Landing/Intake Page
  - FAQ Page
  - Report Problem - Step 1
  - Report Problem - Step 2
  - Review Submission
  - Submission Confirmation
  - View Cases
  - Documentation

**Step 3: Create typography styles in Figma**

Using design tokens extracted in Task 1:
- Create Figma text styles for each typography type (H1, H2, H3, Body, Label, Helper, Error)
- Match exact font, size, weight, line height

**Step 4: Create color styles in Figma**

- Add all extracted colors as Figma color styles
- Organize by category (Primary, Secondary, Neutrals, Status, etc.)
- Use consistent naming

**Step 5: Commit design token document**

```bash
git add docs/design-tokens-extracted.md
git commit -m "docs: extract and document design tokens from built site"
```

---

## Task 3: Build Component Library - Form Inputs

**Step 1: Create "Component Library" page in Figma**

- Add new page called "Components"
- Create section header: "Form Inputs"

**Step 2: Create Text Input component**

Build a component showing:
- **Default state**: Empty field with placeholder
- **Focused state**: Field with border highlight and cursor
- **Filled state**: Field with user input text
- **Error state**: Field with red border and error icon
- **Disabled state**: Grayed out, no interaction

Include label, help text, and error message variants.

**Step 3: Create Email Input component**

Same states as text input, specific to email validation appearance.

**Step 4: Create Textarea component**

- Default, focused, filled, error, disabled states
- Two heights (normal and short variants based on actual site use)
- Include label and help text

**Step 5: Create Select/Dropdown component**

- Default state (closed)
- Open state (showing options)
- Focused state
- Disabled state
- Selected state

**Step 6: Commit**

```bash
git commit -m "figma: add text input, email, textarea, and select components with all states"
```

---

## Task 4: Build Component Library - Buttons & Choice Groups

**Step 1: Create Button component**

Show all variants:
- **Primary button** (main action style)
  - Default, hover, focus, active, disabled states
- **Secondary button** (alternative action)
  - Default, hover, focus, active, disabled states
- **Step action button** (previous/next style)
  - Default, hover, focus, disabled states

Include different sizes if used in site.

**Step 2: Create Radio Button Group component**

- Individual radio button: unselected, selected, focused, disabled
- Radio group layout showing multiple options
- Error state

**Step 3: Create Checkbox Group component**

- Individual checkbox: unchecked, checked, indeterminate, focused, disabled
- Checkbox group layout
- Error state

**Step 4: Create Legal/Notice Box component**

- Privacy notice box style
- Submission disclosure box style
- Error summary box style
- Include all variants/purposes used in site

**Step 5: Commit**

```bash
git commit -m "figma: add button, radio/checkbox, and notice box components"
```

---

## Task 5: Build Component Library - Navigation & Typography

**Step 1: Create Breadcrumb component**

- Show typical breadcrumb trail: Home > Information and Support Center
- With different link states (default, hover, current page)

**Step 2: Create Progress Tracker component**

- Show step-by-step progress indicator as used in form
- States: upcoming, current, completed
- Include labels if shown in site

**Step 3: Create Navigation Sidebar component**

- Support navigation links
- Active/inactive states
- Hover states

**Step 4: Create Step Actions bar component**

- Previous/Next button layout
- Help text layout
- Different configurations based on form position

**Step 5: Create Typography reference section**

- Display all text styles (H1, H2, H3, Body, Label, Helper, Error)
- Show actual usage examples from site
- Include sizes and colors

**Step 6: Commit**

```bash
git commit -m "figma: add navigation components and typography reference"
```

---

## Task 6: Create Page Mockup - Landing/Intake Page

**Step 1: Create new page in Figma: "01-Landing-Intake"**

- Frame size: Desktop 1280x1200+ (full page height)
- Reference: `/sites/fdic-public-information-faq/index.html`

**Step 2: Add header section**

- Site header/logo
- Breadcrumb trail
- Page title: "Information and Support Center"
- Intro text
- Share bar (if present)

**Step 3: Add sidebar**

- Support navigation with current page highlighted
- Progress tracker (if visible on this page)

**Step 4: Add main form section**

- "Start your request" heading
- Initial choice group (intent selection)
- Topic selection section (initially hidden, show as visible for documentation)
- Contextual FAQ section (if relevant)
- Details textarea section
- Outcome selection section
- Contact information section
- Mailing address section
- Resolution textarea section
- Submission disclosure notice
- Step actions (buttons)

**Step 5: Add annotations**

- Add notes explaining conditional visibility
- Label which sections are hidden initially
- Note form logic and progression

**Step 6: Add footer**

**Step 7: Commit**

```bash
git commit -m "figma: create landing/intake page mockup with annotations"
```

---

## Task 7: Create Page Mockup - FAQ Page

**Step 1: Create new page in Figma: "02-FAQ"**

- Frame size: Desktop 1280x1200+
- Reference: `/sites/fdic-public-information-faq/faq.html`

**Step 2: Add header section**

- Header/navigation
- Breadcrumb
- Page title: "Frequently Asked Questions"
- Search functionality (if present)

**Step 3: Add FAQ content**

- Show FAQ layout as it appears (accordion, list, or other format)
- Include 3-5 example FAQs with question and answer expanded
- Category filtering if present

**Step 4: Add annotations**

- Note interaction patterns (expand/collapse, search filtering)
- Link back to components used

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create FAQ page mockup"
```

---

## Task 8: Create Page Mockup - Report Problem Step 1

**Step 1: Create new page in Figma: "03-Report-Problem-Step1"**

- Frame size: Desktop 1280x1200+
- Reference: `/sites/fdic-public-information-faq/report-problem.html`

**Step 2: Add header and sidebar**

- Site header
- Breadcrumb (updated for this page)
- Progress tracker showing step 1
- Navigation sidebar

**Step 3: Add form content**

- Form heading for step 1
- Form fields specific to step 1
- Conditional sections if logic applies
- Step actions (Previous/Next buttons)

**Step 4: Add annotations**

- Note conditional field visibility
- Explain form progression to step 2

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create report problem step 1 mockup"
```

---

## Task 9: Create Page Mockup - Report Problem Step 2

**Step 1: Create new page in Figma: "04-Report-Problem-Step2"**

- Frame size: Desktop 1280x1200+
- Reference: `/sites/fdic-public-information-faq/report-problem-step-2.html`

**Step 2: Add page structure**

- Header, sidebar with progress at step 2
- Form content for step 2
- Different fields/sections than step 1

**Step 3: Add form interactions**

- Show conditional sections expanded if relevant
- Progress tracker showing step 2 active

**Step 4: Add annotations**

- Note progression to next step
- Link to relevant components

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create report problem step 2 mockup"
```

---

## Task 10: Create Page Mockup - Review Submission

**Step 1: Create new page in Figma: "05-Review-Submission"**

- Frame size: Desktop 1280x1200+
- Reference: `/sites/fdic-public-information-faq/review-submission.html`

**Step 2: Add page structure**

- Header, breadcrumb
- Page title: "Review Your Submission"
- Summary section showing all submitted information

**Step 3: Add interactive elements**

- Edit links/buttons for each section
- Confirmation notice
- Final submit button
- Legal/disclosure notice

**Step 4: Add annotations**

- Note edit functionality
- Explain what happens on submit

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create review submission page mockup"
```

---

## Task 11: Create Page Mockup - Submission Confirmation

**Step 1: Create new page in Figma: "06-Submission-Confirmation"**

- Frame size: Desktop 1280x800+
- Reference: `/sites/fdic-public-information-faq/submission-confirmation.html`

**Step 2: Add success message section**

- Success icon/heading
- Confirmation message
- Case/submission reference number
- Next steps information

**Step 3: Add supporting content**

- What to expect next
- Contact information
- Link back to support center

**Step 4: Add annotations**

- Note key information shown to user

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create submission confirmation page mockup"
```

---

## Task 12: Create Page Mockup - View Cases

**Step 1: Create new page in Figma: "07-View-Cases"**

- Frame size: Desktop 1280x1200+
- Reference: `/sites/fdic-public-information-faq/view-cases.html`

**Step 2: Add page structure**

- Header, sidebar
- Page title: "Your Cases" or similar
- Case list/table view

**Step 3: Add content**

- Show 3-5 example cases in list format
- Case statuses and information displayed
- Filtering/sorting controls if present
- Case detail view (if separate state)

**Step 4: Add annotations**

- Note filtering behavior
- Explain case status indicators
- Link to relevant components

**Step 5: Add footer**

**Step 6: Commit**

```bash
git commit -m "figma: create view cases page mockup"
```

---

## Task 13: Final Documentation & Annotations Pass

**Step 1: Add master documentation page**

- Create new page: "Documentation"
- Add design system overview
- Color palette reference
- Typography scale
- Spacing guidelines
- Component usage guide

**Step 2: Review and enhance all page annotations**

- Ensure each page has clear notes about:
  - Component usage
  - Conditional visibility
  - Interaction patterns
  - Responsive behavior
  - Form logic flow

**Step 3: Add design decision notes**

- Create page: "Design Notes"
- Document key decisions
- Explain interaction patterns
- Note accessibility considerations

**Step 4: Create sharing settings**

- Ensure file is accessible to team
- Set view/edit permissions as appropriate
- Create link to share with team

**Step 5: Commit final state**

```bash
git add docs/plans/2026-02-25-create-figma-mockups.md
git commit -m "figma: complete design system and page mockups

- Full component library with all states and variants
- 7 complete page mockups with current visual styling
- Design tokens and spacing system documented
- Annotations explaining form logic and interactions
- Ready for team review and component reuse"
```

---

## Validation Checklist

Before claiming completion:
- [ ] Component library has all form inputs with default/focus/error/disabled states
- [ ] Button components show all variants
- [ ] All 7 page mockups created and match current site styling
- [ ] Colors match extracted palette
- [ ] Typography matches extracted system
- [ ] Annotations explain conditional visibility and form flow
- [ ] Navigation page links to all sections
- [ ] File is shared and accessible to team
- [ ] Design tokens document is saved and committed

---

## Notes

- Figma file is the output artifact; git commits track planning and documentation
- Extract design tokens first (Task 1) to ensure consistency across all components
- Use Figma components for each element to enable future design reuse
- Annotations should explain "why" for design decisions, not just "what"
- Reference actual HTML/CSS during mockup creation for pixel-perfect accuracy
