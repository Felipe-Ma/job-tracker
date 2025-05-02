import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import JobCard from './JobCard';

function App() {
  const [jobs, setJobs] = useState([]); // Holds job list
  const [company, setCompany] = useState(""); // Holds company name
  const [title, setTitle] = useState(""); // Holds job title

  function handleSubmit(e) {
    e.preventDefault(); // stops the page from refreshing

    const newJob = {
      company_name: company,
      job_title: title,
      // add more fields here later
    };

    fetch("http://localhost:8000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Job created:", data);

        // Option 1: refetch the full list 
        return fetch("http://localhost:8000/jobs");
      })
      .then((res) => res.json())
      .then((updatedJobs) => {
        setJobs(updatedJobs);
        setCompany(""); // Clear the input field
        setTitle(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error creating job:", error);
      });
  }

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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        
        <button type="submit">Add Job</button>
      </form>

      <p>Showing {jobs.length} job(s): </p>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

    </div>
  );
}

export default App;

