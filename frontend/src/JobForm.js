function JobForm({ company, title, location,
    contactInfo, notes, salary,
    setCompany, setTitle, setLocation,
    setContactInfo, setNotes, setSalary,
    resumeFile, setResumeFile,
    handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={((e) => setCompany(e.target.value))}
            />
            <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={((e) => setTitle(e.target.value))}
            />
            <input
                type="text"
                placeholder="Job Location"
                value={location}
                onChange={((e) => setLocation(e.target.value))}
            />
            <input
                type="text"
                placeholder="Contact Info"
                value={contactInfo}
                onChange={((e) => setContactInfo(e.target.value))}
            />
            <input
                type="text"
                placeholder="Notes"
                value={notes}
                onChange={((e) => setNotes(e.target.value))}
            />
            <input
                type="text"
                placeholder="Salary"
                value={salary}
                onChange={((e) => setSalary(e.target.value))}
            />
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
            />

            <button type="submit">➕ Add Job</button>
        </form>
    );
}

export default JobForm;