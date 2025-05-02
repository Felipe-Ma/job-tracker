function JobCard({ job, onDelete, onEdit }) {
    return (
        <div className="job-card">
            <h2>{job.job_title}</h2>
            <h3>{job.company_name}</h3>
            <p><strong>Role:</strong> {job.job_title}</p>
            <p><strong>Stage:</strong> {job.stage}</p>
            <p><strong>Date Applied:</strong> {job.date_applied}</p>

            <button onClick={() => onDelete(job.id)}>🗑 Delete</button>
            <button onClick={() => onEdit(job.id)}>✏️ Edit</button>
        </div>
    );
}

export default JobCard;