function DashboardErrorState({ message, onRetry }) {
  return (
    <div className="error-panel">
      <div className="max-w-md space-y-4">
        <h2 className="section-title !text-[var(--error)]">
          We couldn’t load your lists
        </h2>
        <p>{message}</p>
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default DashboardErrorState;