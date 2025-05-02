import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [jobs, setJobs] = useState([]); // Holds job list

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched jobs:", data);
        setJobs(data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  return (
    <div>
      <h1>🎯 Job Tracker</h1>
      <p>Welcome! This will show your job applications soon.</p>
      <p> Fetched {jobs.length} jobs (check console)</p>
    </div>
  );
}

export default App;

