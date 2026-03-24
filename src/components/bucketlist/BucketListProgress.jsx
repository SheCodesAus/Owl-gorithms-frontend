export default function BucketListProgress({ completed, total, progress }) {
  return (
    <section className="bucketlist-progress-card">
      <div className="bucketlist-progress-top">
        <span className="bucketlist-progress-label">Progress</span>
        <span className="bucketlist-progress-count">
          {completed}
          <span className="bucketlist-progress-total">/{total}</span>
        </span>
      </div>

      <div
        className="bucketlist-progress-bar"
        aria-label={`Progress: ${progress}% complete`}
      >
        <div
          className="bucketlist-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="bucketlist-progress-text">{progress}% complete</p>
    </section>
  );
}