import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { propsFor, type ElementNode } from "../../app/tree";

interface FormState {
  pending: boolean;
  status: string;
}
const Context = createContext<FormState | null>(null);
export function useMailForm() {
  return useContext(Context);
}

/** Browser validation is repeated by the unchanged PHP endpoint. Personal data is JSON POST only. */
export function MailForm({
  node,
  children,
}: {
  node: ElementNode;
  children: ReactNode;
}) {
  const [state, setState] = useState<FormState>({ pending: false, status: "" });
  const pending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (pending.current || !form.reportValidity()) return;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const payload =
      "data-join-form" in node.attrs
        ? {
            kind: "subscribe",
            email: text("email"),
            consent: data.get("consent") === "on",
            website: text("website"),
          }
        : {
            kind: "contact",
            name: text("name"),
            email: text("email"),
            subject: text("subject"),
            message: text("message"),
            acknowledgement: data.get("acknowledgement") === "on",
            website: text("website"),
          };
    pending.current = true;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 20000);
    setState({ pending: true, status: "Sending your request…" });
    try {
      const response = await fetch("/api/message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abort.signal,
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        reference?: string;
        copyAccepted?: boolean;
      };
      if (!response.ok || result.ok !== true) {
        setState({
          pending: false,
          status:
            typeof result.message === "string"
              ? result.message
              : "Sending is unavailable. Please use the email address shown on this page.",
        });
        return;
      }
      const copy = result.copyAccepted
        ? "A copy has been sent to your email address for your records. Check your inbox and spam folder."
        : "Your copy could not be sent. Please keep this reference and email me if you need one. Do not submit the same request again.";
      setState({
        pending: false,
        status:
          payload.kind === "subscribe"
            ? "Thank you for joining my mailing list!"
            : `Thank you. Your message was sent. Reference: ${result.reference ?? "see your email"}. ${copy}`,
      });
      form.reset();
    } catch {
      setState({
        pending: false,
        status:
          "We could not confirm whether your request was accepted. Your details are still here. Check your inbox before retrying, or email us directly.",
      });
    } finally {
      clearTimeout(timeout);
      pending.current = false;
      controller.current = null;
    }
  }
  return (
    <Context.Provider value={state}>
      {createElement(
        "form",
        {
          ...propsFor(node),
          onSubmit: submit,
          "aria-busy": state.pending ? true : undefined,
        },
        children,
      )}
    </Context.Provider>
  );
}
