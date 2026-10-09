import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { propsFor, type ElementNode } from "../../app/tree";

interface NavigationState {
  open: boolean;
  toggle: () => void;
  button: React.RefObject<HTMLButtonElement | null>;
}
export const NavigationContext = createContext<NavigationState | null>(null);

export function Navigation({
  node,
  children,
}: {
  node: ElementNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 8);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <NavigationContext.Provider
      value={{ open, toggle: () => setOpen((value) => !value), button }}
    >
      {createElement(
        "header",
        {
          ...propsFor(node),
          className: `${node.attrs.class ?? ""}${scrolled ? " is-scrolled" : ""}`,
        },
        children,
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
