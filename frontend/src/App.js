import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import JobCard from './JobCard';

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
      <p>Showing {jobs.length} job(s): </p>

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

    </div>
  );
}

export default App;

