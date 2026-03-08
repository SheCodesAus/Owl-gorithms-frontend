function DashboardEmptyState() {
  return (
    <div className="state-panel">
      <div className="max-w-md space-y-4">
        <h2 className="section-title">No bucket lists yet</h2>
        <p className="body-muted">
          Create your first list and start planning something exciting together.
        </p>
        <button type="button" className="btn-primary">
          New List
        </button>
      </div>
    </div>
  );
}

export default DashboardEmptyState;