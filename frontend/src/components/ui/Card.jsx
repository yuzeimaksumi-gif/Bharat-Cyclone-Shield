export default function Card({ title, right, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || right) && (
        <div className="card-head">
          <h3>{title}</h3>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}