import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useinterview.js'
import { useParams } from 'react-router'
import '../style/interview.scss'

const NAV_ITEMS = [
    {id: 'technical', label: 'Technical Questions',},
    {id: 'behavioral',label: 'Behavioral Questions',},
    {id: 'roadmap', label: 'Road Map',},
]

// Question component
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="question-card">
            <div className="question-row" onClick={() => setOpen(o => !o)}>
                <span className="question-number">Q{index + 1}</span>

                <p className="question-text">{item.question}</p>

                <span className="question-chevron">
                    {open ? '▲' : '▼'}
                </span>
            </div>

            {open && (
                <div className="question-details">
                    <div>
                        <span>Intention</span>
                        <p>{item.intention}</p>
                    </div>

                    <div>
                        <span>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// Roadmap component
const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-heading">
            <span>Day {day.day}</span>
            <h3>{day.focus}</h3>
        </div>

        <ul>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// Main component
const Interview = () => {

    const [downloadError, setDownloadError] = useState("");
    
    const [activeNav, setActiveNav] = useState('technical')
    const {report, getReportById,loading,getResumePdf} = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="interview-loading">
                <div>
                    <span className="loading-spinner" />
                    <h1>Loading your interview plan...</h1>
                </div>
            </main>
        )
    }

    return (
        <div className="interview-page">

            {/* Left Navigation */}
            <nav>
                <p>Sections</p>

                {NAV_ITEMS.map(item => (
                    <button className={activeNav === item.id ? 'active' : ''}
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                    >
                        {item.label}
                    </button>
                ))}

                <button
                    className="download-button"
                    onClick={async () => {
                        setDownloadError("");

                        try {
                            await getResumePdf(interviewId);
                        } catch (error) {
                            setDownloadError(
                                error.response?.data?.message ||
                                "Unable to download the resume. Please try again."
                            );
                        }
                    }}
                >
                    Download Resume
                </button>

            </nav>

            {downloadError && (
                <p className="download-error">
                    {downloadError}
                </p>
            )}

            {/* Main Content */}
            <main>

                {/* Technical Questions */}
                {activeNav === 'technical' && (
                    <section>
                        <div>
                            <h2>Technical Questions</h2>

                            <span>
                                {report.technicalQuestions.length} questions
                            </span>
                        </div>

                        <div>
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Behavioral Questions */}
                {activeNav === 'behavioral' && (
                    <section>
                        <div>
                            <h2>Behavioral Questions</h2>

                            <span>
                                {report.behavioralQuestions.length} questions
                            </span>
                        </div>

                        <div>
                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Roadmap */}
                {activeNav === 'roadmap' && (
                    <section>
                        <div>
                            <h2>Preparation Road Map</h2>

                            <span>
                                {report.preparationPlan.length}-day plan
                            </span>
                        </div>

                        <div>
                            {report.preparationPlan.map(day => (
                                <RoadMapDay
                                    key={day.day}
                                    day={day}
                                />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            {/* Right Sidebar */}
            <aside>

                {/* Match Score */}
                <div>
                    <p>Match Score</p>

                    <span>
                        {report.matchScore}%
                    </span>

                    <p>Strong match for this role</p>
                </div>

                {/* Skill Gaps */}
                <div>
                    <p>Skill Gaps</p>

                    <div>
                        {report.skillGaps.map((gap, i) => (
                            <span key={i}>
                                {gap.skill}
                            </span>
                        ))}
                    </div>
                </div>

            </aside>

        </div>
    )
}

export default Interview