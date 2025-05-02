import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import JobCard from './JobCard';

function App() {
  const [jobs, setJobs] = useState([]); // Holds job list
  const [company, setCompany] = useState(""); // Holds company name
  const [title, setTitle] = useState(""); // Holds job title
  const [editingJob, setEditingJob] = useState(null); // Holds job being edited
  const [editCompany, setEditCompany] = useState(""); // Holds company name for editing
  const [editTitle, setEditTitle] = useState(""); // Holds job title for editing

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

  function handleDelete(id) {
    fetch(`http://localhost:8000/jobs/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove the delete job from the UI
        const updatedJobs = jobs.filter((job) => job.id !== id);
        setJobs(updatedJobs);
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  }

  function handleEdit(job) {
    setEditingJob(job);
    setEditCompany(job.company_name);
    setEditTitle(job.job_title);
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
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <button type="submit">Add Job</button>
      </form>
      {editingJob && (
        <form onSubmit={(e) => {
          
            e.preventDefault(); // stops the page from refreshing

            const updatedJob = {
              company_name: editCompany,
              job_title: editTitle,
            };

            fetch(`http://localhost:8000/jobs/${editingJob.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedJob),
            })
              .then((res) => res.json())
              .then(() => {
                // Refresh job list
                return fetch("http://localhost:8000/jobs");
              })
              .then((res) => res.json())
              .then((updatedJobs) => {
                setJobs(updatedJobs);
                setEditingJob(null); // exit edit mode
                setEditCompany("");
                setEditTitle("");
              })
              .catch((error) => {
                console.error("Error updating job:", error);
              });
          }}
        >
          <h2>✏️ Editing Job ID {editingJob.id}</h2>
          <input
            type="text"
            placeholder="Company Name"
            value={editCompany}
            onChange={(e) => setEditCompany(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button type="submit">Update Job</button>
          <button
            type="button"
            onClick={() => {
              setEditingJob(null);
              setEditCompany("");
              setEditTitle("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <p>Showing {jobs.length} job(s): </p>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={handleDelete} onEdit={() => handleEdit(job)} />
      ))}

    </div>
  );
}

export default App;

