import React, { useState, useEffect } from 'react';
import './LogicQuiz.css';

const lessonsData = {
    1: [ // Login Flow
        {
            robots: ['A', 'B', 'C'],
            robotLabels: { A: 'Enter Password', B: 'Enter Username', C: 'Click Login' },
            clues: [
                { text: "**B** and **A** must be done before **C**." },
                { text: "**A** cannot be the first step." }
            ],
            correctOrder: ['B', 'A', 'C']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'System Validates', B: 'Enter Credentials', C: 'Click Login', D: 'Access Dashboard' },
            clues: [
                { text: "**C** happens right before **A**." },
                { text: "**D** is the final step." },
                { text: "**B** is the first step." }
            ],
            correctOrder: ['B', 'C', 'A', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Generate Token', B: 'System checks DB', C: 'DB replies OK', D: 'Return 200 OK' },
            clues: [
                { text: "**A** happens after **C**." },
                { text: "**B** is the very first step." },
                { text: "**D** is the final step." }
            ],
            correctOrder: ['B', 'C', 'A', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'User receives Token', B: 'Browser stores Token', C: 'User redirects', D: 'Dashboard fetches data' },
            clues: [
                { text: "**C** happens after **B**." },
                { text: "**A** is the first step." },
                { text: "**D** is the last step." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D', 'E'],
            robotLabels: { A: 'Receive Link', B: 'Click Forgot', C: 'Set New Password', D: 'Enter Email', E: 'Login Again' },
            isFinalChallenge: true,
            businessRequirement: "Final Challenge: Implement the Forgot Password flow. The user starts by clicking forgot password, provides their email, receives a reset link, sets a new password, and finally logs in again.",
            clues: [],
            correctOrder: ['B', 'D', 'A', 'C', 'E']
        }
    ],
    2: [ // ATM Withdrawal
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Select Amount', B: 'Insert Card', C: 'Enter PIN', D: 'Dispense Cash' },
            clues: [
                { text: "**C** happens right after **B**." },
                { text: "**D** is the last step." },
                { text: "**A** happens before **D** but after **C**." }
            ],
            correctOrder: ['B', 'C', 'A', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Card Validated', B: 'Account Selected', C: 'Balance Checked', D: 'Transaction Logged' },
            clues: [
                { text: "**B** is right after **A**." },
                { text: "**D** is the last step." },
                { text: "**C** happens before **D** but after **B**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'System Dispenses Cash', B: 'User Takes Cash', C: 'System Ejects Card', D: 'User Takes Card' },
            clues: [
                { text: "**B** happens after **A**." },
                { text: "**D** is the final step." },
                { text: "**C** happens before **D** but after **B**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: "Select 'Other Amount'", B: 'Types Amount', C: 'User Confirms', D: 'System Checks Limit' },
            clues: [
                { text: "**A** is the first step." },
                { text: "**D** is the last step." },
                { text: "**B** happens right before **C**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Cannot Dispense', B: 'Shows Error', C: 'Asks for New Amount', D: 'User Enters New Amount' },
            isFinalChallenge: true,
            businessRequirement: "Final Challenge: Handle the ATM Insufficient Funds scenario. The user requests cash, the system detects it cannot dispense it due to limits, it shows an error, and finally asks the user for a new amount.",
            clues: [],
            correctOrder: ['A', 'B', 'C', 'D']
        }
    ],
    3: [ // Checkout Process
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Review Cart', B: 'Enter Shipping', C: 'Payment', D: 'Confirm Order' },
            clues: [
                { text: "**A** and **B** are both before **C**." },
                { text: "**D** is the final step." },
                { text: "**A** is the very first step." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: "Clicks 'Buy Now'", B: 'Skip Cart', C: 'Go to Shipping', D: 'Go to Payment' },
            clues: [
                { text: "**A** is the first step." },
                { text: "**D** is the last step." },
                { text: "**B** happens before **C**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Applies Discount', B: 'Calculates Tax', C: 'Shows Total', D: 'User Pays' },
            clues: [
                { text: "**B** is right after **A**." },
                { text: "**D** is the final step." },
                { text: "**C** happens before **D**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Card Auth', B: 'Bank Approves', C: 'Order Created', D: 'Email Sent' },
            clues: [
                { text: "**A** is sent to **B**." },
                { text: "**D** is the last step." },
                { text: "**C** happens right after **B**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Selects Address', B: 'Validates Address', C: 'Address OK', D: 'Proceed Next Step' },
            isFinalChallenge: true,
            businessRequirement: "Final Challenge: Design the shipping address validation logic. The user selects an address, the system validates it against its database, determines the address is OK, and allows the user to proceed.",
            clues: [],
            correctOrder: ['A', 'B', 'C', 'D']
        }
    ],
    4: [ // Exception Flows
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Enter Username', B: 'Wrong Password', C: 'System Validates', D: 'Show Error Message' },
            clues: [
                { text: "**B** happens after **A**." },
                { text: "**D** is the final step." },
                { text: "**C** happens before **D** but after **B**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Check Balance', B: 'Balance Too Low', C: "Show 'Not Enough Money'", D: 'Ask for New Amount' },
            clues: [
                { text: "**B** triggers **C**." },
                { text: "**D** is the final step." },
                { text: "**A** is the very first step." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Enter Card', B: 'Gateway Reject', C: "Show 'Card Declined'", D: 'Prompt New Card' },
            clues: [
                { text: "**B** happens right after **A**." },
                { text: "**D** is the last step." },
                { text: "**C** happens before **D**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Calls Third Party', B: 'Third Party Timeout', C: 'Returns 504 Error', D: "Show 'Try Again Later'" },
            clues: [
                { text: "**B** follows **A**." },
                { text: "**D** is the final step." },
                { text: "**C** happens before **D**." }
            ],
            correctOrder: ['A', 'B', 'C', 'D']
        },
        {
            robots: ['A', 'B', 'C', 'D'],
            robotLabels: { A: 'Save Data', B: 'Cannot Connect DB', C: 'Throw Exception', D: 'Log Error' },
            isFinalChallenge: true,
            businessRequirement: "Final Challenge: Database Connection Failure. The application attempts to save user data, encounters a DB connection failure, throws a system exception, and properly logs the error.",
            clues: [],
            correctOrder: ['A', 'B', 'C', 'D']
        }
    ]
};

const introData = {
    1: { title: 'Login Flow', subtitle: 'Arrange the steps for a standard login use case.', theory: 'A standard login flow ensures secure access. It starts with user inputs, proceeds to validation against a database, and concludes with granting access or returning an error.' },
    2: { title: 'ATM Withdrawal', subtitle: 'Define the main success scenario for an ATM.', theory: 'ATM transactions require strict sequential steps: authentication, amount selection, system validation, and physical cash/card dispensation.' },
    3: { title: 'Checkout Process', subtitle: 'Map out the e-commerce checkout flow.', theory: 'E-commerce checkouts follow a funnel: reviewing cart, entering shipping details, processing payment, and order confirmation.' },
    4: { title: 'Exception Flows', subtitle: 'Handle edge cases and system errors gracefully.', theory: 'Exception flows handle deviations from the happy path. Always validate inputs, handle timeouts, and provide clear feedback to the user.' }
};

const LogicQuiz = ({ lessonId = 1, onBack, onComplete }) => {
    const questions = lessonsData[lessonId] || lessonsData[1];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showIntro, setShowIntro] = useState(true);
    const [showTheory, setShowTheory] = useState(false);
    
    const currentLevel = questions[currentQuestionIndex];

    const [slots, setSlots] = useState([]);
    const [status, setStatus] = useState('idle');
    const [simulationIndex, setSimulationIndex] = useState(-1);
    const [hintMessage, setHintMessage] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!currentLevel) return;
        setSlots(Array(currentLevel.robots.length).fill(null));
        setStatus('idle');
        setSimulationIndex(-1);
        setHintMessage('');
        setShowTheory(false);
    }, [currentLevel, currentQuestionIndex]);

    if (showIntro) {
        return (
            <div className="logic-quiz-wrapper">
                <button className="back-nav-btn" onClick={onBack}>← Back</button>
                <div className="logic-container intro-container">
                    <div className="robots-intro-img">
                        <span style={{fontSize:'5rem'}}>👤 ➡️ ⚙️ ➡️ 📄</span>
                    </div>
                    <h1 className="intro-title">{introData[lessonId]?.title || 'Use Case Flow'}</h1>
                    <p className="intro-subtitle">{introData[lessonId]?.subtitle || 'Line up the scenario steps.'}</p>
                    <div className="action-area" style={{marginTop:'40px', background: 'transparent'}}>
                        <button className="check-btn-white active" onClick={() => setShowIntro(false)}>Continue</button>
                    </div>
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="logic-quiz-wrapper">
                <div className="logic-container intro-container">
                    <h1 className="intro-title">🎉 Lesson Completed!</h1>
                    <p className="intro-subtitle">Great job! You've mastered this logic puzzle.</p>
                    <div className="action-area" style={{marginTop:'40px', background: 'transparent'}}>
                        <button className="check-btn-white active" onClick={() => onComplete(lessonId)}>Continue to Course</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentLevel) return null;

    const handleDragStart = (e, robotId, sourceIndex) => {
        if (status === 'correct' || status === 'simulating') return;
        e.dataTransfer.setData('robotId', robotId);
        e.dataTransfer.setData('sourceIndex', sourceIndex !== undefined ? sourceIndex : 'pool');
    };

    const handleDropOnSlot = (e, slotIndex) => {
        e.preventDefault();
        if (status === 'correct' || status === 'simulating') return;

        const robotId = e.dataTransfer.getData('robotId');
        const sourceIndex = e.dataTransfer.getData('sourceIndex');
        if (!robotId) return;

        const newSlots = [...slots];
        if (sourceIndex !== 'pool') {
            newSlots[parseInt(sourceIndex)] = null;
        }

        const existingRobot = newSlots[slotIndex];
        if (existingRobot && sourceIndex !== 'pool') {
             newSlots[parseInt(sourceIndex)] = existingRobot;
        }

        newSlots[slotIndex] = robotId;
        setSlots(newSlots);
        setStatus('idle');
        setHintMessage('');
    };

    const handleDropOnPool = (e) => {
        e.preventDefault();
        if (status === 'correct' || status === 'simulating') return;

        const sourceIndex = e.dataTransfer.getData('sourceIndex');
        if (sourceIndex !== 'pool') {
            const newSlots = [...slots];
            newSlots[parseInt(sourceIndex)] = null;
            setSlots(newSlots);
            setStatus('idle');
            setHintMessage('');
        }
    };

    const isAllFilled = slots.every(s => s !== null);

    const handleCheck = () => {
        if (!isAllFilled || status === 'simulating') return;
        setStatus('simulating');
        setSimulationIndex(-1);
        setHintMessage('');

        let i = 0;
        const interval = setInterval(() => {
            if (i >= currentLevel.correctOrder.length) {
                clearInterval(interval);
                setStatus('correct');
                setSimulationIndex(-1);
                return;
            }

            setSimulationIndex(i);
            if (slots[i] !== currentLevel.correctOrder[i]) {
                clearInterval(interval);
                setTimeout(() => {
                    setStatus('incorrect');
                    setSimulationIndex(-1);
                    setHintMessage(`Hold on! Step ${i + 1} (${slots[i]}) seems incorrect in this context. Review the logic flow and try again.`);
                }, 600);
                return;
            }
            i++;
        }, 800);
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    return (
        <div className="logic-quiz-wrapper">
             <button className="back-nav-btn" onClick={onBack}>✖</button>
             
             {/* Progress Bar */}
             <div className="logic-progress-bar">
                 <div className="logic-progress-fill" style={{width: `${((currentQuestionIndex) / questions.length) * 100}%`}}></div>
             </div>

             <div className="logic-container">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                     <h2 className="quiz-prompt" style={{ margin: 0 }}>
                        {currentLevel.isFinalChallenge ? "Final Challenge" : "Line up the Use Case steps in the proper order."}
                     </h2>
                     <button className="theory-toggle-btn" onClick={() => setShowTheory(!showTheory)}>
                         💡 Theory
                     </button>
                 </div>

                 {showTheory && (
                     <div className="theory-card">
                         <h4>Knowledge Card</h4>
                         <p>{introData[lessonId]?.theory}</p>
                     </div>
                 )}

                 {currentLevel.isFinalChallenge ? (
                     <div className="business-requirement-card">
                         <p>{currentLevel.businessRequirement}</p>
                     </div>
                 ) : (
                     <div className="clues-list">
                        {currentLevel.clues.map((clue, i) => (
                            <div key={i} className="clue-item">
                               <span className="clue-check">
                                   {status === 'correct' ? <span style={{color:'#2ecc71'}}>✔</span> : '→'}
                               </span>
                               <span dangerouslySetInnerHTML={{__html: clue.text.replace(/\*(.*?)\*/g, '<em>$1</em>')}}></span>
                            </div>
                        ))}
                     </div>
                 )}

                 <div className="slots-container">
                    {slots.map((robotId, i) => (
                        <div key={i} className="slot-wrapper">
                            <div className="slot-number">{i + 1}</div>
                            <div 
                                className={`slot ${robotId ? 'filled' : ''} ${status === 'correct' ? 'slot-correct' : ''} ${simulationIndex === i && slots[i] === currentLevel.correctOrder[i] ? 'slot-simulating-correct' : ''} ${simulationIndex === i && slots[i] !== currentLevel.correctOrder[i] ? 'slot-simulating-error' : ''}`}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => handleDropOnSlot(e, i)}
                            >
                                {robotId && (
                                    <div 
                                        className={`robot-card ${status === 'correct' ? 'correct-glow' : ''} ${status === 'simulating' && simulationIndex === i ? 'simulating' : ''}`}
                                        data-id={robotId}
                                        draggable={status !== 'correct' && status !== 'simulating'}
                                        onDragStart={e => handleDragStart(e, robotId, i)}
                                    >
                                        <div className="robot-letter">{robotId}</div>
                                        <div className="robot-label">{currentLevel.robotLabels[robotId]}</div>
                                        <div className="robot-icon">📄</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                 </div>

                 <div 
                    className="pool-container"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDropOnPool}
                 >
                    {currentLevel.robots.map(robotId => {
                        if (slots.includes(robotId)) {
                            return <div key={robotId} className="robot-placeholder">
                                <div className="robot-letter-ghost">{robotId}</div>
                            </div>;
                        }
                        return (
                            <div 
                                key={robotId} 
                                className="robot-card in-pool"
                                data-id={robotId}
                                draggable={status !== 'correct' && status !== 'simulating'}
                                onDragStart={e => handleDragStart(e, robotId, 'pool')}
                            >
                                <div className="robot-letter">{robotId}</div>
                                <div className="robot-label">{currentLevel.robotLabels[robotId]}</div>
                                <div className="robot-icon">📄</div>
                            </div>
                        );
                    })}
                 </div>

                 <div className="action-area">
                     {status === 'correct' ? (
                         <div className="success-banner-container">
                             <div className="success-feedback">That's it!</div>
                             <div className="success-banner">
                                 <div className="success-text">System executed successfully</div>
                                 <button className="continue-btn-green" onClick={handleContinue}>Continue</button>
                             </div>
                         </div>
                     ) : (
                         <div className="check-action-container">
                             {status === 'incorrect' && hintMessage && (
                                 <div className="hint-message">{hintMessage}</div>
                             )}
                             <button 
                                 className={`check-btn-white ${isAllFilled ? 'active' : ''} ${status === 'incorrect' ? 'shake' : ''}`}
                                 onClick={handleCheck}
                                 disabled={!isAllFilled || status === 'simulating'}
                             >
                                 {status === 'simulating' ? 'Running Simulation...' : (currentLevel.isFinalChallenge ? 'Run Test' : 'Check')}
                             </button>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default LogicQuiz;

