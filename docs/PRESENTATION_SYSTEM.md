# Presentation System Architecture

## Overview

This system processes PPTX presentations and renders them as interactive web-based presentations with animations, transitions, and real-time control capabilities.

## System Architecture

```
┌─────────────────┐
│   Upload PPTX   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Edge Function: process-presentation │
│  - Extract slides                    │
│  - Generate PNG references           │
│  - Extract elements & styles         │
│  - Parse animations                  │
│  - Store in Supabase                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Database (Supabase)              │
│  - presentations                     │
│  - slides                            │
│  - assets                            │
│  - fonts                             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Presentation Viewer                │
│  - AnimatedSlide component           │
│  - GSAP animations                   │
│  - Real-time sync                    │
└──────────────────────────────────────┘
```

## Key Components

### 1. PPTX Processing Pipeline

**Location:** `supabase/functions/process-presentation/`

#### Main Handler (`index.ts`)
- Receives uploaded PPTX file
- Orchestrates the processing pipeline
- Stores results in Supabase

#### PNG Generation (`pptx-to-png.ts`)
```typescript
// Converts PPTX slides to PNG images for reference
export async function generateSlideImages(
  zip: JSZip,
  presentationId: string,
  supabase: SupabaseClient
): Promise<string[]>
```

**Process:**
1. Extracts slide XML files from PPTX
2. Converts each slide to PNG using canvas
3. Uploads PNGs to Supabase Storage (`presentations/{id}/slides/`)
4. Returns array of public URLs

#### Element Extraction (`element-extractor.ts`)

**Key Functions:**

```typescript
// Extract slide dimensions from presentation.xml
export function extractSlideDimensions(
  presentationXml: string
): { width: number; height: number }

// Extract structured elements from slide XML
export function extractElements(
  slideXml: string,
  slideDimensions?: { width: number; height: number }
): PPTXElement[]
```

**Element Types:**
- Text boxes (with full styling)
- Images
- Shapes

**Extracted Properties:**
- Position (x, y in pixels)
- Size (width, height in pixels)
- Text content
- Styles (font, color, alignment, rotation)
- Background colors

**Coordinate Conversion:**
- PPTX uses EMUs (English Metric Units)
- Conversion: `pixels = emu / 12700`
- Default slide dimensions: 960x540px (16:9)

#### PPTX Parser (`pptx-parser.ts`)
```typescript
export interface PPTXElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  content?: string;
  source?: string; // for images
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: string;
    rotation?: number;
    opacity?: number;
  };
}
```

#### Font Extraction (`font-extractor.ts`)
- Extracts embedded TTF fonts from PPTX
- Uploads to Supabase Storage
- Generates CSS `@font-face` rules

### 2. Database Schema

#### Tables

**presentations**
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- event_id: uuid (FK, nullable)
- title: text
- description: text
- source: enum ('upload', 'create', 'import')
- original_format: enum ('pptx', 'pdf', 'ppt')
- aspect_ratio: text (default '16:9')
- total_slides: integer
- published: boolean
- metadata: jsonb
- created_at: timestamp
- updated_at: timestamp
```

**slides**
```sql
- id: uuid (PK)
- presentation_id: uuid (FK)
- slide_number: integer
- title: text
- notes: text
- content: jsonb        -- Raw slide content
- layout: jsonb         -- Layout information
- background: jsonb     -- Background settings + referenceImage URL
- animations: jsonb     -- Animation definitions
- transitions: jsonb    -- Transition effects
- duration: integer     -- Slide duration in seconds
- created_at: timestamp
- updated_at: timestamp
```

**assets**
```sql
- id: uuid (PK)
- presentation_id: uuid (FK)
- name: text
- file_path: text
- mime_type: text
- file_size: bigint
- asset_type: enum ('image', 'video', 'audio', 'font', 'other')
- metadata: jsonb
- created_at: timestamp
```

**fonts**
```sql
- id: uuid (PK)
- asset_id: uuid (FK)
- font_family: text
- font_weight: text
- font_style: text
- ttf_url: text
- woff_url: text
- woff2_url: text
- created_at: timestamp
```

### 3. Frontend Rendering

#### AnimatedSlide Component

**Location:** `src/components/presentation/AnimatedSlide.tsx`

```typescript
interface AnimatedSlideProps {
  slideId: string;
  elements: PPTXElement[];
  animations: AnimationData[];
  transition?: TransitionData;
  isActive: boolean;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  background?: {
    referenceImage?: string;  // PNG reference URL
    color?: string;
    type?: string;
  };
  showReferenceImage?: boolean;
}
```

**Rendering Strategy:**
1. Sets slide background color
2. Renders elements with absolute positioning
3. Applies extracted styles from PPTX
4. Initializes GSAP animations
5. Applies slide transitions

**Element Rendering:**
```typescript
<div
  key={element.id}
  id={element.id}
  data-element-id={element.id}
  className="absolute"
  style={{
    left: `${element.position?.x || 0}px`,
    top: `${element.position?.y || 0}px`,
    width: element.size?.width ? `${element.size.width}px` : 'auto',
    height: element.size?.height ? `${element.size.height}px` : 'auto',
    fontFamily: element.style?.fontFamily,
    fontSize: element.style?.fontSize ? `${element.style.fontSize}pt` : undefined,
    fontWeight: element.style?.fontWeight,
    fontStyle: element.style?.fontStyle,
    color: element.style?.color,
    backgroundColor: element.style?.backgroundColor,
    textAlign: element.style?.textAlign,
    opacity: element.style?.opacity ?? 1,
    transform: element.style?.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
  }}
>
  {element.type === 'text' && element.content}
  {element.type === 'image' && element.source && (
    <img src={element.source} alt="" className="w-full h-full object-contain" />
  )}
</div>
```

### 4. Animation System

**Location:** `src/lib/presentation-animations.ts`

#### AnimationMapper Class

Maps PowerPoint-style animations to GSAP tweens:

```typescript
interface AnimationData {
  targetId: string;      // Element ID
  effect: string;        // Animation type
  trigger: string;       // When to trigger
  order: number;         // Sequence order
  duration?: number;     // Duration in seconds
  delay?: number;        // Delay before start
  direction?: string;    // Animation direction
}
```

**Supported Effects:**
- `fade` - Fade in/out
- `flyin` - Fly in from direction
- `wipe` - Wipe reveal
- `zoom` - Scale animation
- `slide` - Slide in/out
- `split` - Split reveal
- `spin` - Rotation

#### SlideTransition Class

Handles transitions between slides:

```typescript
interface TransitionData {
  type: 'fade' | 'push' | 'wipe' | 'zoom' | 'morph';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}
```

### 5. Real-time Control

**Location:** `src/pages/PresentationPresenter.tsx` and `ProducerControl.tsx`

Uses Supabase Realtime to sync presentation state:

```typescript
const channel = supabase
  .channel('presentation-control')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'show_control'
  }, (payload) => {
    // Update current slide
  })
  .subscribe()
```

## Development Setup

### Prerequisites
- Node.js 18+
- Supabase CLI (for local development)
- Bun or npm

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Deploy edge functions
supabase functions deploy process-presentation
```

### Key Dependencies

```json
{
  "jszip": "^3.10.1",           // PPTX file extraction
  "fast-xml-parser": "^5.3.0",  // XML parsing
  "gsap": "^3.13.0",            // Animations
  "opentype.js": "^1.3.4",      // Font handling
  "pdfjs-dist": "^5.4.296",     // PDF processing
  "@supabase/supabase-js": "^2.75.0"
}
```

## File Structure

```
├── supabase/
│   └── functions/
│       └── process-presentation/
│           ├── index.ts              # Main handler
│           ├── pptx-to-png.ts        # PNG generation
│           ├── element-extractor.ts  # Element extraction
│           ├── pptx-parser.ts        # PPTX parsing
│           ├── font-extractor.ts     # Font handling
│           └── validation.ts         # Input validation
│
├── src/
│   ├── components/
│   │   └── presentation/
│   │       ├── AnimatedSlide.tsx     # Slide renderer
│   │       └── PresentationsGallery.tsx
│   │
│   ├── lib/
│   │   ├── presentation-animations.ts # Animation engine
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── PresentationAudience.tsx  # Viewer
│   │   ├── PresentationPresenter.tsx # Presenter view
│   │   └── ProducerControl.tsx       # Control panel
│   │
│   └── hooks/
│       └── use-presentation-animations.tsx
│
└── docs/
    ├── ANIMATION_SYSTEM.md
    └── PDF_RENDERING.md
```

## Processing Flow

### PPTX Upload → Render

1. **Upload**: User uploads PPTX file
2. **Storage**: File stored in Supabase Storage (`presentations/{id}/original/`)
3. **Processing**:
   - Extract ZIP contents
   - Parse presentation.xml for dimensions
   - For each slide:
     - Generate PNG reference image
     - Extract slide XML
     - Parse elements (text, images, shapes)
     - Extract positioning and styles
     - Parse animations (if any)
     - Store slide data in database
4. **Storage**:
   - Slide PNGs: `presentations/{id}/slides/slide_{number}.png`
   - Extracted images: `presentations/{id}/assets/`
   - Fonts: `fonts/{presentation_id}/`
5. **Rendering**:
   - Fetch slide data from database
   - Load custom fonts via CSS
   - Render elements with absolute positioning
   - Initialize GSAP timeline for animations
   - Apply slide transitions

## Debugging

### Edge Function Logs

```bash
# View function logs
supabase functions logs process-presentation
```

### Common Issues

1. **Element positioning off**: Check `extractSlideDimensions` is being used
2. **Fonts not loading**: Verify font URLs in Supabase Storage
3. **Animations not working**: Check GSAP is loaded and timeline is created
4. **Images missing**: Verify image extraction in `element-extractor.ts`

## Performance Considerations

- PNG generation is CPU-intensive (use smaller canvas if needed)
- Large presentations (>50 slides) may take 30-60 seconds to process
- Consider implementing progress updates via Supabase Realtime
- Font loading can be optimized with font-display: swap

## Future Enhancements

- [ ] Video element support
- [ ] Advanced shape rendering (beyond text/images)
- [ ] More animation effects (entrance, emphasis, exit)
- [ ] Chart/diagram parsing
- [ ] Slide notes extraction
- [ ] Master slide/theme support
- [ ] Table rendering
- [ ] SmartArt support

## Testing

```bash
# Test PPTX processing
npm run test:edge-functions

# Test animations
npm run test:animations
```

## Contributing

When adding new features:
1. Add comprehensive JSDoc comments
2. Update this README
3. Test with various PPTX formats
4. Check element positioning accuracy
5. Verify animations work correctly

## License

MIT