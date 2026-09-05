export type GameStatus = 'ready' | 'running' | 'paused' | 'over';

export type ObstacleKind = 'bench' | 'gull';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Obstacle extends Box {
  kind: ObstacleKind;
}

export interface Collectible extends Box {
  taken: boolean;
  /** Drives the idle bob. */
  phase: number;
  /** Seconds since collection; the pickup flourish fades over ~0.5s. */
  fade: number;
}

export interface Runner {
  x: number;
  y: number;
  vy: number;
  grounded: boolean;
  ducking: boolean;
  /** Seconds since leaving the ground; powers coyote time. */
  airborneFor: number;
  /** Distance run, used to animate the stride. */
  stride: number;
}

export interface World {
  status: GameStatus;
  width: number;
  height: number;
  speed: number;
  distance: number;
  lights: number;
  score: number;
  best: number;
  runner: Runner;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  /** World-space x of the next spawn. */
  nextSpawnAt: number;
  /** Seconds of hit-flash left after a collision. */
  flash: number;
  elapsed: number;
}

export interface Intent {
  jumpHeld: boolean;
  /** Set on the frame a jump is requested; consumed by the buffer. */
  jumpPressed: boolean;
  duck: boolean;
}
