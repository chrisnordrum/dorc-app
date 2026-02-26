import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch "Hello" message
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <main><h1>Home</h1><p className="text-center mt-5">Something went wrong: {error}</p></main>;
  
  return (
    <main>
      <h1 className="text-center mt-10">Welcome to The Daily Quest Tracker</h1>

      <h2 className="mt-5 text-center text-xl font-bold">We don't have a name yet!</h2>
      <p className="font-bold text-center mt-5">Created by:</p>
      <ul className="flex flex-col items-center">
        <li>Chris Nordrum</li>
        <li>Owen Ouyang</li>
        <li>Radzil Bunag</li>
        <li>Diane Schultze</li>
      </ul>
      {data ? <p className="text-center mt-5">{data.message}</p> : <p className="text-center mt-5">Loading...</p>}
    </main>
  );
}