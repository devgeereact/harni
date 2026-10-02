# Pier Run character and gameplay rebuild

Owner asked for a more interesting, brighter game with a clean character like a classic platform hero.

Replaced the slim nurse character with an original chunky seaside explorer: yellow sun cap, coral jacket/scarf, teal shorts, large expressive face, gloves, book bag and broad trainers. Existing run/jump/duck/hurt/glide poses, squash/stretch and power effects remain supported. Brightened all four sky palettes.

New mechanics: one air jump is available without a power-up. Landing from above on a beach ball produces an upward bounce, refreshes the air jump and awards a 20-point base bonus through the combo system. The ball is removed. Side or upward collisions retain the normal damage rules. No change to hitbox dimensions, unrelated pages, mail or legal behaviour.

PASS: production build including TypeScript; all 44 Node tests; diff whitespace checks. Added meaningful world-level checks for air jump without power, rejection of a third jump, landing reset, downward ball bounce/removal/scoring, prevention of duplicate reward, and side/rising collisions.

NOT TESTED: visual appearance and actual keyboard/touch gameplay in a browser for this iteration. No connected browser was available in the session. Automated simulation tests do not establish those visual/device results.

Local only. Nothing pushed or deployed. Next check: play the local game on desktop and a real phone, including double jumps, ball bounces and all six character poses.
