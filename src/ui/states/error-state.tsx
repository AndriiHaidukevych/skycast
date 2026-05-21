interface Props {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel = "Try again" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-stack-sm text-center px-container-padding-mobile">
      <span className="material-symbols-outlined text-error text-[48px]">cloud_off</span>
      <p className="font-headline-md text-headline-md text-error">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-label-caps text-label-caps text-primary hover:underline"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
