import Card from "../components/ui/Card";

export default function PlaceholderView({ item }) {
  return (
    <Card title={item.label}>
      <p>{item.desc}.</p>
      <p className="muted" style={{ marginTop: 8 }}>
        This view is built in <strong>Phase {item.phase}</strong>.
      </p>
    </Card>
  );
}