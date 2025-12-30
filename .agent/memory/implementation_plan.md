# Refactor Brand Kit UI: Typography Card and Brand Context

## Proposed Changes

### [Component] Typography Card Height
Modify `TypographySection.tsx` to allow the card to grow dynamically based on its content rather than stretching to fill the grid row.

#### [MODIFY] [TypographySection.tsx](file:///f:/_PROYECTOS/x-studio-convex/src/components/brand-dna/TypographySection.tsx)
- Remove `h-full` from the `Card` component.

---

### [Component] Brand Context Extraction
Create a new prominent card for the Brand Context and remove it from existing sections where it is redundant or buried.

#### [NEW] [BrandContextCard.tsx](file:///f:/_PROYECTOS/x-studio-convex/src/components/brand-dna/BrandContextCard.tsx)
- Create a standalone card component for `business_overview`.
- Use a premium design with an icon (e.g., `Sparkles` or `FileText`).
- Support editing with a `textarea`.

#### [MODIFY] [BrandAssets.tsx](file:///f:/_PROYECTOS/x-studio-convex/src/components/brand-dna/BrandAssets.tsx)
- Remove the "Business Overview" card (lines 118-159).

#### [MODIFY] [TextAssetsSection.tsx](file:///f:/_PROYECTOS/x-studio-convex/src/components/brand-dna/TextAssetsSection.tsx)
- Remove the "Brand Context" section (lines 300-343).
- Remove associated states and handlers if no longer needed.

#### [MODIFY] [BrandDNABoard.tsx](file:///f:/_PROYECTOS/x-studio-convex/src/components/brand-dna/BrandDNABoard.tsx)
- Import and integrate `BrandContextCard`.
- Place the new card prominently (e.g., full width between the top visual section and the typography/assets section).

## Verification Plan
### Manual Verification
- Verify that the Typography card no longer shows excessive empty space when few fonts are present.
- Verify that adding fonts makes the card grow.
- Verify that the Brand Context is now displayed in its own dedicated, prominent card.
- Ensure editing the Brand Context in the new card correctly updates the state.
