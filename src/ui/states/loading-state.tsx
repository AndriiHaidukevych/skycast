interface Props {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = "Loading…", fullPage = true }: Props) {
  return (
    <div
      className={`flex items-center gap-3 ${
        fullPage ? "justify-center min-h-[60vh]" : "py-stack-lg"
      }`}
    >
      <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
      <span className="font-body-md text-on-surface-variant">{message}</span>
    </div>
  );
}
