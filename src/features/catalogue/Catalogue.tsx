import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export interface CatalogueState {
  group: string | null;
  setGroup: (value: string | null) => void;
}
const Context = createContext<CatalogueState>({
  group: null,
  setGroup: () => undefined,
});
export function CatalogueProvider({ children }: { children: ReactNode }) {
  const [group, setGroup] = useState<string | null>(null);
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (document.querySelector(`.chip[data-group="${CSS.escape(fromHash)}"]`))
      setGroup(fromHash);
  }, []);
  return (
    <Context.Provider value={{ group, setGroup }}>{children}</Context.Provider>
  );
}
export function useCatalogue() {
  return useContext(Context);
}
