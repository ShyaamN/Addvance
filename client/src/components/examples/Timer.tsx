import Timer from '../Timer';

export default function TimerExample() {
  return (
    <div className="p-8 space-y-4">
      <Timer timeRemaining={180} />
      <Timer timeRemaining={90} />
      <Timer timeRemaining={20} />
    </div>
  );
}
