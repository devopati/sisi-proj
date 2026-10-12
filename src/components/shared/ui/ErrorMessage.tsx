type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-murram/30 bg-murram/8 px-4 py-3">
      <p className="text-murram">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold text-ink underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
