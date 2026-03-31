<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# Project rules for Feldenkrais Body Awareness MVP

## Product scope
- This project is a tightly scoped web MVP
- Only build the flow: select body region -> find practice -> view details -> submit feedback -> view records
- Do not add AI agents, RAG, recommendations, dashboards, or complex admin systems
- Do not expand the scope beyond the MVP unless explicitly requested

## Engineering rules
- Keep the current project structure unless a change is necessary
- Make only small, incremental changes
- Do not combine multiple roadmap steps in one pass
- Prefer readability over abstraction
- Do not introduce large refactors unless explicitly requested

## Documentation rules
- Every code task must include documentation updates
- Update the development log after each completed step
- If routes, data models, or components change, explain what changed and why

## Body region rules
- body_region_code is the single source of truth
- Reuse the same codes across database, types, SVG ids, and filtering logic
- Do not introduce alternate naming schemes
- Keep the first version at the large body-region level only