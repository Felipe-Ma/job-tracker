import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import JobCard from './JobCard';
import JobForm from './JobForm';
import EditForm from './EditForm';


function App() {
  const [jobs, setJobs] = useState([]); // Holds job list
  const [company, setCompany] = useState(""); // Holds company name
  const [title, setTitle] = useState(""); // Holds job title
  const [location, setLocation] = useState(""); // Holds job location
  const [contactInfo, setContactInfo] = useState(""); // Holds contact info
  const [notes, setNotes] = useState(""); // Holds notes
  const [salary, setSalary] = useState(""); // Holds salary
  const [editingJob, setEditingJob] = useState(null); // Holds job being edited
  const [editCompany, setEditCompany] = useState(""); // Holds company name for editing
  const [editTitle, setEditTitle] = useState(""); // Holds job title for editing
  const [resumeFile, setResumeFile] = useState(null); // Holds resume file

  function handleSubmit(e) {
    e.preventDefault();
  
    const newJob = {
      company_name: company,
      job_title: title,
      location: location,
      contact_info: contactInfo || null,
      notes: notes || null,
      salary: salary ? parseInt(salary, 10) : null,
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
  
        if (resumeFile && data.id) {
          const formData = new FormData();
          formData.append("file", resumeFile);
  
          return fetch(`http://localhost:8000/jobs/${data.id}/upload_resume`, {
            method: "POST",
            body: formData,
          })
            .then((res) => {
              if (!res.ok) throw new Error(`Resume upload failed: ${res.status}`);
              return res.json();
            })
            .then(() => data) // Pass original job data to the next then
            .catch((err) => {
              console.error("Upload error:", err);
              return data; // Still continue the flow
            });
        }
  
        return data; // No resume, continue with job data
      })
      .then(() => {
        return fetch("http://localhost:8000/jobs");
      })
      .then((res) => res.json())
      .then((updatedJobs) => {
        setJobs(updatedJobs);
        setCompany("");
        setTitle("");
        setLocation("");
        setContactInfo("");
        setNotes("");
        setSalary("");
        setResumeFile(null);
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

      <JobForm
        company={company}
        title={title}
        location={location}
        contactInfo={contactInfo}
        notes={notes}
        salary={salary}
        setCompany={setCompany}
        setTitle={setTitle}
        setLocation={setLocation}
        setContactInfo={setContactInfo}
        setNotes={setNotes}
        setSalary={setSalary}
        resumeFile={resumeFile}
        setResumeFile={setResumeFile}
        handleSubmit={handleSubmit}
      />

      {editingJob && (
        <EditForm
          editingJob={editingJob}
          editCompany={editCompany}
          editTitle={editTitle}
          setEditCompany={setEditCompany}
          setEditTitle={setEditTitle}
          setEditingJob={setEditingJob}
          setJobs={setJobs}
        />
      )}


      <p>Showing {jobs.length} job(s): </p>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={handleDelete} onEdit={() => handleEdit(job)} />
      ))}

    </div>
  );
}

export default App;

