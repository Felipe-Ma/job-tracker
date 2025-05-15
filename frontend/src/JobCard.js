function JobCard({ job, onDelete, onEdit }) {
    return (
        <div className="job-card">
            <h2>{job.job_title}</h2>
            <h3>{job.company_name}</h3>
            <p><strong>Stage:</strong> {job.stage}</p>
            <p><strong>Date Applied:</strong> {job.date_applied}</p>
            <p><strong>Pay:</strong> {job.pay}</p>
            <p><strong>Skills:</strong> {job.skills}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Notes:</strong> {job.notes}</p>

            {/* ✅ Resume Link */}
            {job.resume_used && (
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={`http://localhost:8000/uploads/${job.resume_used}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 View Resume
                </a>
              </p>
            )}

            <button onClick={() => onDelete(job.id)}>🗑 Delete</button>
            <button onClick={() => onEdit(job.id)}>✏️ Edit</button>
        </div>
    );
}

export default JobCard;