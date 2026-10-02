# Pier Run refresh, 1 October 2026

> SUPERSEDED on 2026-10-01 by `qa/PIER-RUN-REBUILD-2026-10-01.md` (ADR-025). The dusk scene, the collapsed-settings layout and the evidence below describe the earlier refresh, not the current game. Kept for history.

Owner requested a clean, user-friendly, screen-fitting game with minimal text and the existing design guide.

Changed the standalone page to shared white/coral tokens and Inter. Removed the full-screen photograph, parallax, long guide and large footer. Retained the dusk game scene and existing physics/input. Added viewport-height sizing, a short-landscape rule, brief input-specific controls, collapsed optional score settings and a state-aware Pause/Resume button. Normal document scrolling is allowed for expanded settings, zoom and very small viewports.

PASS: production build and TypeScript, 12 existing Node tests including score storage, diff whitespace checks, built page single h1, required game hooks, initial disabled Pause button, unchecked score saving, closed settings and internal link targets. Built page has 103 text words including hidden hints/settings and metadata title.

BLOCKED: visual viewport and interactive gameplay review. Computer-use browser inventory is empty. Static sizing rules and markup checks do not establish actual screen fit or gameplay behaviour on devices. No new gameplay-runtime claim is made.

No push or deployment. Next: review the local `/play/` page at desktop, phone and short landscape sizes, including start, pause/resume, game over, touch gestures and score settings.
