import "./NoDataCard.css";

export default function NoDataCard({
  title = "No data available",
  icon,
  actionLabel = "Clear",
  onActionPress,
  actionColor,
}) {
  return (
    <div className="no-data-card" role="alert" aria-label={title}>
      {/* Icon */}
      {icon && <div className="no-data-card__icon">{icon}</div>}

      {/* Title */}
      <div className="no-data-card__title">{title}</div>

      {/* Action */}
      {onActionPress && (
        <button
          type="button"
          className="no-data-card__action"
          onClick={onActionPress}
          aria-label={actionLabel}
          style={{
            color: actionColor || "var(--primary)",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
