import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useinterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    {id: 'technical', label: 'Technical Questions',},
    {id: 'behavioral',label: 'Behavioral Questions',},
    {id: 'roadmap', label: 'Road Map',},
]

// Question component
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <div onClick={() => setOpen(o => !o)}>
                <span>Q{index + 1}</span>

                <p>{item.question}</p>

                <span>
                    {open ? '▲' : '▼'}
                </span>
            </div>

            {open && (
                <div>
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
    <div>
        <div>
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
            <main>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    return (
        <div>

            {/* Left Navigation */}
            <nav>
                <p>Sections</p>

                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                    >
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={() => {
                        getResumePdf(interviewId)
                    }}
                >
                    Download Resume
                </button>
            </nav>

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