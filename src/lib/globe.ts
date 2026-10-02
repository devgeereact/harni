// The contact page globe: an orthographic wireframe of the world's countries that turns slowly and
// can be dragged. Same drawing as the 21st.dev "globe-wireframe" block (wireframesolid variant, speed
// 0.45 degrees a frame, stroke 0.6), written without React. The country outlines come from the
// `world-atlas` package and are bundled, so the page makes no request to another site (ADR-011).

import { geoOrthographic, geoPath } from 'd3-geo';
import type { GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** 0.45 degrees a frame at 60 frames a second, so the speed is the same on any screen. */
const DEGREES_PER_SECOND = 27;
const DRAG_SENSITIVITY = 0.5;

export const mountGlobe = (host: HTMLElement): void => {
  const topology = world as unknown as Topology & { objects: { countries: GeometryCollection } };
  const countries = feature(topology, topology.objects.countries).features;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const paths = countries.map(() => {
    const node = document.createElementNS(SVG_NS, 'path');
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'currentColor');
    node.setAttribute('stroke-width', '0.6');
    svg.appendChild(node);
    return node;
  });
  const outline = document.createElementNS(SVG_NS, 'path');
  outline.setAttribute('fill', 'none');
  outline.setAttribute('stroke', 'currentColor');
  outline.setAttribute('stroke-width', '1.5');
  outline.setAttribute('opacity', '0.8');
  svg.appendChild(outline);
  host.appendChild(svg);

  let size = 0;
  let longitude = 0;
  let latitude = 0;
  let visible = false;
  let dragging = false;
  let last: { x: number; y: number } | null = null;
  let frame = 0;
  let previous = 0;

  const draw = (): void => {
    if (size === 0) return;
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    const projection = geoOrthographic()
      .scale((size / 2) * 0.9)
      .translate([size / 2, size / 2])
      .rotate([longitude, latitude])
      .precision(0.1);
    const path = geoPath(projection);
    countries.forEach((country, index) => {
      paths[index]?.setAttribute('d', path(country as GeoPermissibleObjects) ?? '');
    });
    outline.setAttribute('d', path({ type: 'Sphere' }) ?? '');
  };

  const tick = (time: number): void => {
    const elapsed = previous === 0 ? 0 : Math.min(time - previous, 100);
    previous = time;
    longitude = (longitude + (DEGREES_PER_SECOND * elapsed) / 1000) % 360;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const sync = (): void => {
    const shouldTurn = visible && !dragging && !reducedMotion;
    if (shouldTurn && frame === 0) {
      previous = 0;
      frame = requestAnimationFrame(tick);
    } else if (!shouldTurn && frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  new ResizeObserver(() => {
    size = host.offsetWidth;
    draw();
    svg.classList.add('is-ready');
  }).observe(host);

  new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0.1 },
  ).observe(host);

  svg.addEventListener('pointerdown', (event) => {
    dragging = true;
    last = { x: event.clientX, y: event.clientY };
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('is-dragging');
    sync();
  });
  svg.addEventListener('pointermove', (event) => {
    if (!dragging || !last) return;
    longitude += (event.clientX - last.x) * DRAG_SENSITIVITY;
    latitude = Math.max(-90, Math.min(90, latitude - (event.clientY - last.y) * DRAG_SENSITIVITY));
    last = { x: event.clientX, y: event.clientY };
    draw();
  });
  const release = (): void => {
    dragging = false;
    last = null;
    svg.classList.remove('is-dragging');
    sync();
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);
};
