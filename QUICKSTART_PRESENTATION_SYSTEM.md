# Quick Start: Presentation System

Get the interactive presentation system running in minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (or use provided credentials)
- Basic knowledge of React/TypeScript

## 1. Installation

```bash
cd /Users/christoffer/presentation-toolkit

# Install Node.js dependencies
npm install
```

## 2. Environment Setup

Your Supabase credentials are already configured in `.env`:

```env
VITE_SUPABASE_URL=https://gsiefiffawsvabrgnmaf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=gsiefiffawsvabrgnmaf
```

## 3. Start Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

## 4. Database Setup (Required)

You need to create the database tables in Supabase. Run these SQL commands in the Supabase SQL Editor:

```sql
-- Create presentations table
CREATE TABLE presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  event_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT CHECK (source IN ('upload', 'create', 'import')),
  original_format TEXT CHECK (original_format IN ('pptx', 'pdf', 'ppt')),
  aspect_ratio TEXT DEFAULT '16:9',
  total_slides INTEGER NOT NULL,
  published BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slides table
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  title TEXT,
  notes TEXT,
  content JSONB NOT NULL,
  layout JSONB,
  background JSONB,
  animations JSONB,
  transitions JSONB,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('image', 'video', 'audio', 'font', 'other')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fonts table
CREATE TABLE fonts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  font_family TEXT NOT NULL,
  font_weight TEXT NOT NULL,
  font_style TEXT NOT NULL,
  ttf_url TEXT NOT NULL,
  woff_url TEXT,
  woff2_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_slides_presentation_id ON slides(presentation_id);
CREATE INDEX idx_slides_slide_number ON slides(slide_number);
CREATE INDEX idx_assets_presentation_id ON assets(presentation_id);
CREATE INDEX idx_fonts_asset_id ON fonts(asset_id);
```

## 5. Storage Setup (Required)

Create a storage bucket in Supabase for presentations:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `presentations`
3. Set it to **Public** (for serving images and fonts)
4. Configure CORS if needed

## 6. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref gsiefiffawsvabrgnmaf

# Deploy the edge function
supabase functions deploy process-presentation
```

## 7. Test the System

### Option 1: Use the Web Interface

1. Open http://localhost:3000
2. Upload a PPTX file
3. Watch it process and render

### Option 2: Test Components Directly

Create a test file `src/pages/PresentationTest.tsx`:

```tsx
import React from 'react'
import AnimatedSlide from '../components/presentation/AnimatedSlide'

const testSlide = {
  id: 'test-1',
  elements: [
    {
      id: 'text-1',
      type: 'text' as const,
      content: 'Hello, World!',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 100 },
      style: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333333'
      }
    }
  ],
  animations: [],
  background: { color: '#ffffff' }
}

export default function PresentationTest() {
  return (
    <div style={{ width: '960px', height: '540px' }}>
      <AnimatedSlide
        slideId={testSlide.id}
        elements={testSlide.elements}
        animations={testSlide.animations}
        isActive={true}
        background={testSlide.background}
      />
    </div>
  )
}
```

## 8. Project Structure

```
presentation-toolkit/
├── src/
│   ├── components/
│   │   └── presentation/
│   │       └── AnimatedSlide.tsx      # Slide renderer
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client
│   │   └── presentation-animations.ts  # Animation engine
│   ├── pages/
│   │   └── PresentationPresenter.tsx  # Presenter view
│   └── hooks/
│       └── use-presentation-animations.tsx
├── supabase/
│   └── functions/
│       └── process-presentation/      # Edge function
├── .env                               # Your credentials
├── package.json
└── vite.config.ts
```

## 9. Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type check
npm run type-check

# Deploy edge function
supabase functions deploy process-presentation
```

## 10. Next Steps

1. **Upload a PPTX** - Test the full pipeline
2. **Customize animations** - Edit `src/lib/presentation-animations.ts`
3. **Add new features** - Extend the components
4. **Deploy to production** - Build and host on Vercel/Netlify

## Troubleshooting

### "Missing environment variables"
- Check that `.env` file exists
- Verify Supabase URL and key are correct
- Restart dev server after changing `.env`

### "Cannot connect to Supabase"
- Verify Supabase project is active
- Check database tables are created
- Verify storage bucket exists

### "Animations not working"
- Ensure GSAP is installed: `npm install gsap`
- Check browser console for errors
- Verify element IDs match animation targets

### "Edge function fails"
- Check function logs: `supabase functions logs process-presentation`
- Verify PPTX file is valid
- Check Supabase storage permissions

## Documentation

- **Full Architecture**: `docs/PRESENTATION_SYSTEM.md`
- **Animation System**: See `src/lib/presentation-animations.ts`
- **API Reference**: Check Supabase dashboard

## Support

For issues or questions:
1. Check the full documentation in `docs/PRESENTATION_SYSTEM.md`
2. Review component JSDoc comments
3. Check Supabase logs and browser console

---

**You're all set!** 🚀 The presentation system is ready to transform PPTX files into interactive web presentations.
