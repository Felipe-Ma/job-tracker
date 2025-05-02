function JobForm({ company, title, setCompany, setTitle, handleSubmit }) {
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
            <button type="submit">➕ Add Job</button>
        </form>
    );
}

export default JobForm;