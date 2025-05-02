function EditForm({
    editingJob,
    editCompany,
    editTitle,
    setEditCompany,
    setEditTitle,
    setEditingJob,
    setJobs,
  }) {
    const handleUpdate = (e) => {
      e.preventDefault();
  
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
        .then(() => fetch("http://localhost:8000/jobs"))
        .then((res) => res.json())
        .then((updatedJobs) => {
          setJobs(updatedJobs);
          setEditingJob(null);
          setEditCompany("");
          setEditTitle("");
        })
        .catch((error) => {
          console.error("Error updating job:", error);
        });
    };
  
    return (
      <form onSubmit={handleUpdate}>
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
    );
  }
  
  export default EditForm;
  