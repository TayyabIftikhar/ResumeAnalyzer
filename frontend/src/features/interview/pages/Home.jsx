import React from "react";
import { useInterview } from "../hooks/useinterview.js";
import {useState,useRef} from "react"
import {useNavigate} from "react-router"
import {useAuth} from "../../auth/hooks/useAuth.js"
import "../style/home.scss"


const Home = () => {

    const { generateReport,loading,reports } = useInterview();
    const { handleLogout } = useAuth();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
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
        setIsGenerating(true);
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });
            navigate(`/interview/${data._id}`);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <main className="home-loading">
                <div>
                    <span className="loading-spinner" />
                    <p>{isGenerating ? "Loading your interview plan..." : "Loading your reports..."}</p>
                </div>
            </main>
        );
    }

    return ( 
        <main className = 'home'>
            <button className="logout-button" onClick={handleLogoutClick}>
                Logout
            </button>   
            <header className="home-intro">
                <p className="home-kicker">Your interview preparation desk</p>
                <h1 className="home-title">Turn your experience into confident answers.</h1>
                <p className="home-subtitle">Add a target role, your resume, and a little context. We will shape it into a focused interview plan you can actually use.</p>
            </header>
            <div className = 'left report-prompt'>
                <h2>Start with the role</h2>
                <label htmlFor="jobDescription">Job Description</label>
                <textarea onChange={(e) => setJobDescription(e.target.value)} 
                          name="jobDescription" id="jobDescription"  placeholder="Enter Job Description"></textarea>
            </div>

            <div className = 'right report-details'>
                <h2>Bring your perspective</h2>
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
            
                <div>
                    <h2>My Recent Reports</h2>
                    <p className="reports-caption">Your previous preparation plans, ready to revisit.</p>
                    {reports.length === 0 ? (
                        <p>You don't have any interview reports yet.</p>
                    ) : (
                    <ul>
                        {reports.map((report) => (
                            <li key={report._id} onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || "Untitled Report"}</h3>
                                 <p>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                 <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            

        </main> 
    )
}

export default Home;