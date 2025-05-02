function JobCard({ job }) {
    return (
        <div style={{border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <h3>{job.company_name}</h3>
            <p><strong>Role:</strong> {job.job_title}</p>
            <p><strong>Stage:</strong> {job.stage}</p>
            <p><strong>Date Applied:</strong> {job.date_applied}</p>
        </div>
    );
}

export default JobCard;