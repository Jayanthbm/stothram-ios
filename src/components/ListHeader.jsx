import "./ListHeader.css";

export default function ListHeader({ title }) {
  return (
    <div className="list-header">
      <div className="list-header-title">{title}</div>
    </div>
  );
}
