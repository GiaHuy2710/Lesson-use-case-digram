import React, { useState, useEffect } from 'react';
import './CourseMenu.css';

const courseLessons = [
    { id: 1, title: 'Login Flow', isPremium: false },
    { id: 2, title: 'ATM Withdrawal', isPremium: false },
    { id: 3, title: 'Checkout Process', isPremium: false },
    { id: 4, title: 'Exception Flows', isPremium: true },
    { id: 5, title: 'Peer Review: Diagram', isPremium: false }
];

const CourseMenu = ({ onStart, completedLessons, isPremiumUser, onUpgrade }) => {
    const [activeNode, setActiveNode] = useState(1);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Automatically focus the next unlocked node
    useEffect(() => {
        let maxUnlocked = 1;
        for (let i = 1; i <= courseLessons.length; i++) {
            if (completedLessons.includes(i)) {
                maxUnlocked = i + 1;
            }
        }
        setActiveNode(Math.min(maxUnlocked, courseLessons.length));
    }, [completedLessons]);

    return (
        <div className="course-menu-wrapper">


            <main className="course-content">
                {/* Left Card */}
                <div className="course-info-card">
                    <div className="course-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <polyline points="11 8 11 11 14 14"></polyline>
                        </svg>
                    </div>
                    <h1>Use Case Modeling</h1>
                    <p>Master software requirement engineering by arranging Use Case scenarios logically.</p>
                    <div className="course-stats">
                        <span>📚 12 Scenarios</span>
                        <span>🧩 150 Exercises</span>
                    </div>
                </div>

                {/* Right Path */}
                <div className="course-path">
                    <div className="level-header">
                        <span className="level-badge">CHAPTER 1</span>
                        <h2>Main Success Scenarios</h2>
                    </div>

                    <div className="path-container">
                        {courseLessons.map((lesson, index) => {
                            const isComplete = completedLessons.includes(lesson.id);
                            const isUnlocked = lesson.id === 1 || completedLessons.includes(lesson.id - 1);
                            const isActive = activeNode === lesson.id;
                            
                            // Check if this specific lesson is locked behind premium
                            const requiresPremium = lesson.isPremium && !isPremiumUser;
                            
                            return (
                                <React.Fragment key={lesson.id}>
                                    {/* Node */}
                                    <div className={`path-node ${isActive ? 'active-node' : ''} ${!isUnlocked ? 'locked-node' : ''} ${requiresPremium ? 'premium-locked' : ''}`} onClick={() => setActiveNode(lesson.id)}>
                                        <div className="node-icon-wrapper">
                                            {isUnlocked && !isComplete && <div className="glow-ring"></div>}
                                            <div className={`node-icon ${isComplete ? 'green-icon-solid' : isUnlocked ? 'green-icon' : 'grey-icon'}`}>
                                                {isComplete ? <span className="check-mark">✔</span> : isUnlocked ? <div className="green-icon-inner"></div> : null}
                                            </div>
                                            {requiresPremium && isUnlocked && !isComplete && (
                                                <div className="premium-lock-icon">🔒</div>
                                            )}
                                        </div>
                                        <span className="node-label">
                                            {lesson.title}
                                            {requiresPremium && <span style={{color:'#e1a54a', marginLeft: '5px'}}>★</span>}
                                        </span>
                                        
                                        {/* Popover */}
                                        {isActive && (
                                            <div className={`start-popover ${!isUnlocked ? 'locked-popover' : ''}`}>
                                                <h3>{lesson.title}</h3>
                                                {!isUnlocked ? (
                                                    <p style={{fontSize: '0.9rem', margin: 0}}>Complete previous lessons to unlock.</p>
                                                ) : requiresPremium ? (
                                                    <>
                                                        <p style={{color: '#e1a54a', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold'}}>✨ Premium Required</p>
                                                        <button className="start-btn premium-btn-solid" onClick={() => setShowPremiumModal(true)}>
                                                            Unlock Premium
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {isComplete && <p style={{color: '#2ecc71', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold'}}>✔ Completed</p>}
                                                        <button className="start-btn" onClick={() => onStart(lesson.id)}>
                                                            {isComplete ? 'Practice Again' : 'Start'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Connector (hide on last node) */}
                                    {index < courseLessons.length - 1 && (
                                        <div className={`path-connector ${isUnlocked && isComplete ? 'active-connector' : ''}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
                    <div className="premium-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowPremiumModal(false)}>×</button>
                        <div className="premium-icon">✨</div>
                        <h2>Unlock Brilliant Premium</h2>
                        <p>Get unlimited access to all interactive courses and master math, logic, and computer science.</p>
                        
                        <ul className="premium-features">
                            <li><span className="feat-tick">✔</span> Access to 150+ Exercises</li>
                            <li><span className="feat-tick">✔</span> Exception Flows & Alternate Paths</li>
                            <li><span className="feat-tick">✔</span> Include & Extend Relationships</li>
                            <li><span className="feat-tick">✔</span> Detailed step-by-step explanations</li>
                        </ul>

                        <div className="pricing-options">
                            <div className="pricing-card">
                                <h4>Monthly</h4>
                                <div className="price">$14.99<span>/mo</span></div>
                            </div>
                            <div className="pricing-card best-value" onClick={() => {
                                onUpgrade();
                                setShowPremiumModal(false);
                            }}>
                                <div className="badge">Best Value</div>
                                <h4>Annual</h4>
                                <div className="price">$7.99<span>/mo</span></div>
                                <div className="billed">Billed $95.88 yearly</div>
                            </div>
                        </div>

                        <button className="upgrade-btn" onClick={() => {
                            onUpgrade();
                            setShowPremiumModal(false);
                        }}>
                            Start 7-Day Free Trial
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMenu;
