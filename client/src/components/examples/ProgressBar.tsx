import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="p-8 max-w-md">
      <ProgressBar current={7} total={10} />
    </div>
  );
}
