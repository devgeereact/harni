import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
interface ConsentState {
  open: boolean;
  show: (opener: HTMLElement) => void;
  choose: (value: "accepted" | "rejected") => void;
}
const Context = createContext<ConsentState>({
  open: false,
  show: () => undefined,
  choose: () => undefined,
});
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  function close() {
    setOpen(false);
    opener.current?.focus();
  }
  useEffect(() => {
    if (document.body.dataset.stats !== "on") return;
    let value: string | null = null;
    try {
      value = localStorage.getItem("harni.consent");
    } catch {
      /* Storage is optional. */
    }
    setOpen(value !== "accepted" && value !== "rejected");
  }, []);
  useEffect(() => {
    const banner = document.querySelector<HTMLElement>("[data-consent]");
    if (open && banner)
      document.documentElement.style.setProperty(
        "--consent-h",
        `${banner.offsetHeight}px`,
      );
    else document.documentElement.style.removeProperty("--consent-h");
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) close();
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
      document.documentElement.style.removeProperty("--consent-h");
    };
  }, [open]);
  return (
    <Context.Provider
      value={{
        open,
        show: (element) => {
          opener.current = element;
          setOpen(true);
        },
        choose: (value) => {
          try {
            localStorage.setItem("harni.consent", value);
          } catch {
            /* Page-local choice remains usable. */
          }
          close();
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useConsent() {
  return useContext(Context);
}
