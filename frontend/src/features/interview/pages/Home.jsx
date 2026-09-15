import React from "react";
import { useInterview } from "../hooks/useinterview.js";
import {useState,useRef} from "react"
import {useNavigate} from "react-router"
import {useAuth} from "../../auth/hooks/useAuth.js"


const Home = () => {

    const { generateReport,loading,reports } = useInterview();
    const { handleLogout } = useAuth();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef(null);

    const navigate = useNavigate();

    
    
    const handleLogoutClick = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    const handleGenerateReport = async (e) => {
        e.preventDefault();
        const resumeFile = resumeInputRef.current.files[0];
        const data =await generateReport({ jobDescription, selfDescription, resumeFile });  
        navigate(`/interview/${data._id}`);
    };

    if (loading) {
        return <main><div>Loading your interview plan ... </div></main>;
    }

    return ( 
        <main className = 'home'>
            <button onClick={handleLogoutClick}>
                Logout
            </button>   
            <div className = 'left'>
                <label htmlFor="jobDescription">Job Description</label>
                <textarea onChange={(e) => setJobDescription(e.target.value)} 
                          name="jobDescription" id="jobDescription"  placeholder="Enter Job Description"></textarea>
            </div>

            <div className = 'right'>
                <div className = 'input-group'>
                    <p>Resume (Use Resume and Self description for best results)</p>
                    <label htmlFor="resume">Upload Resume</label>
                    <input ref = {resumeInputRef} 
                           type="file" name="resume" id="resume" accept=".pdf" />
                </div>
                <div className = 'input-group'>
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea onChange={(e) => setSelfDescription(e.target.value)} 
                              name="selfDescription" id="selfDescription" placeholder="Describe yourself"></textarea>
                </div>
                <button onClick={handleGenerateReport}
                         className="generate-btn" type="submit">Generate Interview Report</button>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <div className="recent-reports">
                    <h2>My Recent Reports</h2>
                    <ul>
                        {reports.map((report) => (
                            <li key={report._id} onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || "Untitled Report"}</h3>
                                 <p>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                 <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </main> 
    )
}

export default Home;