import { useEffect } from "react";
import { Content } from "./Content";
import type { ContentNode } from "./tree";
import { CatalogueProvider } from "../features/catalogue/Catalogue";
import { ConsentProvider } from "../features/consent/Consent";
import { initReveal } from "../lib/reveal";

export function Application({ tree }: { tree: ContentNode[] }) {
  useEffect(() => {
    document
      .getElementById("harni-root")
      ?.setAttribute("data-hydrated", "true");
    const stopReveal = initReveal();
    let disposed = false;
    let stopGame: (() => void) | null = null;
    let stopGlobe: (() => void) | null = null;
    const game = document.querySelector<HTMLElement>("[data-game]");
    const globe = document.querySelector<HTMLElement>("[data-globe-stage]");
    if (game)
      void import("../game/index").then(({ mountGame }) => {
        if (!disposed) stopGame = mountGame(game);
      });
    if (globe)
      void import("../lib/globe").then(({ mountGlobe }) => {
        if (!disposed) stopGlobe = mountGlobe(globe);
      });
    return () => {
      disposed = true;
      stopGame?.();
      stopGlobe?.();
      stopReveal?.();
    };
  }, []);
  return (
    <ConsentProvider>
      <CatalogueProvider>
        <Content nodes={tree} />
      </CatalogueProvider>
    </ConsentProvider>
  );
}
