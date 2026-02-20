import { Link } from "react-router";
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Sorry, that page doesn't exist.</p>
      <Link to="/">← Back to Home</Link>
    </main>
  );
}