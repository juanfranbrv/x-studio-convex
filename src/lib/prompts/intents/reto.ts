export const RETO_DESCRIPTION = 'Challenges, contests, giveaways, brackets, and versus modes.'
export const RETO_EXTENDED_DESCRIPTION = 'Engage the audience with interactive challenges, contests, giveaways, and competitions.'

export const RETO_REQUIRED_FIELDS = ['headline', 'prize', 'cta']

// 1. VS / BATTLE - Split screen, conflict
export const RETO_VS_PROMPT = `
<structural_instruction>
    <composition_type>Versus Battle</composition_type>
    <visual_hierarchy>
        <primary>Dynamic [DIAGONAL_SPLIT] dividing two opponents or options</primary>
        <secondary>Large "VS" badge or lightning bolt in the center intersection</secondary>
        <tertiary>Voting UI elements (poll bars) at bottom</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_left>Contender A (blue/cool tone)</zone_left>
        <zone_right>Contender B (red/warm tone)</zone_right>
        <zone_center>Explosive "VS" typography</zone_center>
    </zoning_guide>
    <style_modifiers>
        <texture>Grunge, halftone, comic book dots</texture>
        <lighting>Clashing colored rim lights (Blue vs Red)</lighting>
        <palette>High contrast complementary colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Peaceful static layout, monochrome, small text</avoid>
    </negative_constraints>
</structural_instruction>
`

// 2. PRIZE HERO - Giveaway focus
export const RETO_GIVEAWAY_PROMPT = `
<structural_instruction>
    <composition_type>Giveaway Hero</composition_type>
    <visual_hierarchy>
        <primary>The [PRIZE_OBJECT] floating in center with magical glow</primary>
        <secondary>"GIVEAWAY" or "WIN" bold 3D typography wrapping around it</secondary>
        <tertiary>Sparkles and gift box elements in background</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_center>The Prize (Hero)</zone_center>
        <zone_surround>Orbiting text and particles</zone_surround>
    </zoning_guide>
    <style_modifiers>
        <texture>Glossy plastic, gold foil, confetti</texture>
        <lighting>Studio jewelry lighting, starburst highlights</lighting>
        <palette>Gold, purple, luxury celebratory tones</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Dark gloomy atmosphere, dirty textures</avoid>
    </negative_constraints>
</structural_instruction>
`

// 3. BRACKET / TOURNAMENT - Structure
export const RETO_BRACKET_PROMPT = `
<structural_instruction>
    <composition_type>Tournament Bracket</composition_type>
    <visual_hierarchy>
        <primary>A stylized [TOURNAMENT_TREE] or bracket structure</primary>
        <secondary>Empty slots ready for avatars or names</secondary>
        <tertiary>Trophy icon at the final convergence point</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_structure>Branching connection lines</zone_structure>
        <zone_slots>Card placeholders for participants</zone_slots>
    </zoning_guide>
    <style_modifiers>
        <texture>Tech grid, blueprint, or sports broadcast graphics</texture>
        <lighting>Uniform informational lighting</lighting>
        <palette>Sports league colors, clean white on dark</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Chaotic random placement, unreadable thin lines</avoid>
    </negative_constraints>
</structural_instruction>
`

// 4. DARE / TYPE - Bold question
export const RETO_DARE_PROMPT = `
<structural_instruction>
    <composition_type>The Dare</composition_type>
    <visual_hierarchy>
        <primary>Aggressive, screen-filling typography asking a [CHALLENGE_QUESTION]</primary>
        <secondary>Gritty texture overlays and distress marks</secondary>
        <tertiary>Small "Accept Challenge" button graphic</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_full>Typography as image</zone_full>
        <zone_accent>Graffiti or sticker elements</zone_accent>
    </zoning_guide>
    <style_modifiers>
        <texture>Street art, torn poster, concrete</texture>
        <lighting>Hard flash photography, vigilant mood</lighting>
        <palette>Black, white, neon yellow or warning orange</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Elegant serif fonts, soft floral patterns</avoid>
    </negative_constraints>
</structural_instruction>
`

// 5. PODIUM / WINNERS - Rank 1, 2, 3
export const RETO_PODIUM_PROMPT = `
<structural_instruction>
    <composition_type>Winner Podium</composition_type>
    <visual_hierarchy>
        <primary>A three-tiered [WINNER_PODIUM] structure</primary>
        <secondary>Spotlights beaming down on the #1 spot</secondary>
        <tertiary>Confetti raining from above</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_bottom>The Podium blocks (1, 2, 3)</zone_bottom>
        <zone_top>Open space for avatars to stand</zone_top>
    </zoning_guide>
    <style_modifiers>
        <texture>Marble, gold plating, velvet carpet</texture>
        <lighting>Stage lighting, volumetric fog</lighting>
        <palette>Gold, Silver, Bronze thematic</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Flat 2D graphics, boring grey boxes</avoid>
    </negative_constraints>
</structural_instruction>
`

// 6. CHECKLIST / RULES - Steps to enter
export const RETO_RULES_PROMPT = `
<structural_instruction>
    <composition_type>Contest Rules</composition_type>
    <visual_hierarchy>
        <primary>Numbered list 1-2-3 with large [NUMERAL_GLYPHS]</primary>
        <secondary>Iconography validating each step (Like, Share, Tag)</secondary>
        <tertiary>Dotted lines connecting the steps</tertiary>
    </visual_hierarchy>
    <zoning_guide>
        <zone_list>Vertical or horizontal flow of steps</zone_list>
        <zone_header>Header "How to Win"</zone_header>
    </zoning_guide>
    <style_modifiers>
        <texture>Clean vector art, soft shadows, rounded UI cards</texture>
        <lighting>Soft even illumination</lighting>
        <palette>Friendly, inviting, trustworthy colors</palette>
    </style_modifiers>
    <negative_constraints>
        <avoid>Wall of text, messy layout, hard to follow path</avoid>
    </negative_constraints>
</structural_instruction>
`
