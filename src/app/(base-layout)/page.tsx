import Link from 'next/link';

export const metadata = {
  title: 'Home | Tech Starter Kit',
};

export default function Page() {
  return (
    <>
      <h3>Choose your preferred template:</h3>

      <ul>
        <li>
          <Link href="/basic">Basic:</Link> <span>Simpler code, great to start exploring</span>
        </li>
        <li>
          <Link href="/real-time-updates">Real-time Updates:</Link>{' '}
          <span>
            Slightly more complex code, but content updates in real-time when Draft Mode is on
          </span>
        </li>
      </ul>
    </>
  );
}
