import Header from '../Header';

export default function HeaderExample() {
  return <Header onHomeClick={() => console.log('Home clicked')} />;
}
