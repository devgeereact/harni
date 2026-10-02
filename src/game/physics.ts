import { PHYSICS } from './config.ts';
import type { Intent, Player } from './types.ts';

export const createPlayer = (): Player => ({
  y: 0, vy: 0, grounded: true, ducking: false, coyote: PHYSICS.coyote, buffer: 0, airJumps: 0, squash: 0, hurt: 0,
});

export interface Abilities {
  /** Allows one second jump in mid-air. Enabled throughout Pier Run. */
  doubleJump: boolean;
  glide: boolean;
}

export interface PlayerResult {
  jumped: 'ground' | 'air' | null;
  landed: boolean;
}

/** Advances the runner by `dt`. Consumes `intent.jumpPressed`. */
export const stepPlayer = (p: Player, intent: Intent, dt: number, can: Abilities): PlayerResult => {
  const result: PlayerResult = { jumped: null, landed: false };

  if (intent.jumpPressed) {
    p.buffer = PHYSICS.buffer;
    intent.jumpPressed = false;
  }
  p.buffer = Math.max(0, p.buffer - dt);
  p.coyote = p.grounded ? PHYSICS.coyote : Math.max(0, p.coyote - dt);
  p.squash = Math.max(0, p.squash - dt);
  p.hurt = Math.max(0, p.hurt - dt);
  p.ducking = intent.duck && p.grounded;

  if (p.buffer > 0) {
    if (p.grounded || p.coyote > 0) {
      p.vy = PHYSICS.jumpVelocity;
      p.grounded = false;
      p.coyote = 0;
      p.buffer = 0;
      p.airJumps = 0;
      p.ducking = false;
      result.jumped = 'ground';
    } else if (can.doubleJump && p.airJumps < 1 && p.y > PHYSICS.airJumpMinHeight) {
      p.vy = PHYSICS.airJumpVelocity;
      p.airJumps += 1;
      p.buffer = 0;
      result.jumped = 'air';
    }
  }

  if (!p.grounded) {
    const rising = p.vy > 0;
    let gravity: number = rising ? (intent.jumpHeld ? PHYSICS.gravityUp : PHYSICS.cutGravity) : PHYSICS.gravityDown;
    let maxFall: number = PHYSICS.maxFall;
    if (!rising && can.glide && intent.jumpHeld && !intent.duck) {
      gravity = PHYSICS.glideGravity;
      maxFall = PHYSICS.glideMaxFall;
    } else if (intent.duck) {
      gravity = Math.max(gravity, PHYSICS.fastFallGravity);
    }
    p.vy = Math.max(-maxFall, p.vy - gravity * dt);
    p.y += p.vy * dt;
    if (p.y <= 0) {
      result.landed = p.vy < -240;
      p.y = 0;
      p.vy = 0;
      p.grounded = true;
      p.airJumps = 0;
      if (result.landed) p.squash = PHYSICS.landSquash;
    }
  }
  return result;
};
