import React, { useState, useEffect, useRef, useMemo } from 'react';
import './CoordinateQuiz.css';

const getInstructionText = (type, x, y) => {
    if (x === 0 && y === 0) {
        if (type === 'select') return <>Select the point <strong>at the origin</strong>.</>;
        if (type === 'move') return <>Leave the point <strong>at the origin</strong>.</>;
    }
    
    let parts = [];
    if (x > 0) parts.push(<span key="x"><strong>{x} grid step{x !== 1 ? 's' : ''} right</strong></span>);
    if (y > 0) parts.push(<span key="y"><strong>{y} grid step{y !== 1 ? 's' : ''} up</strong></span>);
    
    let directionStr;
    if (parts.length === 2) {
        directionStr = <>{parts[0]} and {parts[1]}</>;
    } else {
        directionStr = parts[0];
    }

    if (type === 'select') {
        return <>Select the point that is {directionStr} from the origin.</>;
    } else {
        return <>Move the point {directionStr} from the origin.</>;
    }
};

const generateQuestions = (lessonId, count) => {
    const questions = [];
    for (let i = 0; i < count; i++) {
        let type = Math.random() > 0.5 ? 'select' : 'move';
        let x, y;
        
        // Custom logic for different lessons to make them feel unique
        if (lessonId === 2) {
            // Axes: one axis is 0
            if (Math.random() > 0.5) {
                x = 0;
                y = Math.floor(Math.random() * 6) + 1; // 1-6
            } else {
                x = Math.floor(Math.random() * 6) + 1; // 1-6
                y = 0;
            }
        } else if (lessonId === 4) {
            // Quadrant 1 Mastery: large numbers, mostly move
            type = 'move';
            x = Math.floor(Math.random() * 3) + 4; // 4 to 6
            y = Math.floor(Math.random() * 3) + 4; // 4 to 6
        } else if (lessonId === 5) {
            // Plotting Points: all select, many available choices
            type = 'select';
            x = Math.floor(Math.random() * 7);
            y = Math.floor(Math.random() * 7);
        } else {
            // Generic 0-6
            x = Math.floor(Math.random() * 7);
            y = Math.floor(Math.random() * 7);
        }

        const correctPoint = { x, y };
        const availablePoints = [correctPoint];
        
        if (type === 'select') {
            const extraPointsCount = lessonId === 5 ? 7 : 4;
            while(availablePoints.length < extraPointsCount + 1) {
                const rx = Math.floor(Math.random() * 7);
                const ry = Math.floor(Math.random() * 7);
                if (!availablePoints.find(p => p.x === rx && p.y === ry)) {
                    availablePoints.push({ x: rx, y: ry });
                }
            }
            availablePoints.sort(() => Math.random() - 0.5); // Shuffle
        }

        questions.push({
            id: `l${lessonId}-q${i}-${Date.now()}`,
            type,
            instructionText: getInstructionText(type, x, y),
            correctPoint,
            availablePoints,
            startPoint: { x: 0, y: 0 }
        });
    }
    return questions;
};

const CoordinateQuiz = ({ lessonId = 1, onBack, onComplete }) => {
    // Grid configuration
    const svgSize = 300;
    const gridSteps = 6;
    const stepSize = svgSize / gridSteps;
    const originY = 300;

    const svgRef = useRef(null);

    // Dynamic Questions Generation (6 questions per lesson)
    const [quizSeed, setQuizSeed] = useState(0);
    const lessonQuestions = useMemo(() => generateQuestions(lessonId, 6), [lessonId, quizSeed]);

    // Component state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [movePoint, setMovePoint] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'incorrect'
    const [showCorrection, setShowCorrection] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQ = lessonQuestions[currentQuestionIndex];

    // Reset state when question changes
    useEffect(() => {
        if (!currentQ) return;
        setSelectedPoint(null);
        setMovePoint(currentQ.type === 'move' ? currentQ.startPoint : null);
        setStatus('idle');
        setShowCorrection(false);
        setIsDragging(false);
    }, [currentQuestionIndex, currentQ]);

    // Calculate logical grid coordinates from mouse/touch pixel coordinates
    const getLogicalCoords = (clientX, clientY) => {
        if (!svgRef.current) return null;
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
        
        let gridX = Math.round(svgP.x / stepSize);
        let gridY = Math.round((originY - svgP.y) / stepSize);
        
        gridX = Math.max(0, Math.min(gridSteps, gridX));
        gridY = Math.max(0, Math.min(gridSteps, gridY));
        
        return { x: gridX, y: gridY };
    };

    // --- Event Handlers for 'Select' Type ---
    const handlePointClick = (pt) => {
        if (status !== 'idle' || isFinished) return;
        setSelectedPoint(pt);
    };

    // --- Event Handlers for 'Move' Type ---
    const handleSvgPointerDown = (e) => {
        if (status !== 'idle' || isFinished) return;
        const coords = getLogicalCoords(e.clientX, e.clientY);
        if (coords) {
            setMovePoint(coords);
            setIsDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    const handleSvgPointerMove = (e) => {
        if (!isDragging || status !== 'idle' || isFinished) return;
        const coords = getLogicalCoords(e.clientX, e.clientY);
        if (coords && (coords.x !== movePoint.x || coords.y !== movePoint.y)) {
            setMovePoint(coords);
        }
    };

    const handleSvgPointerUp = (e) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    // --- Logic Controls ---
    const handleCheck = () => {
        if (status !== 'idle') return;

        let isCorrect = false;
        
        if (currentQ.type === 'select') {
            if (!selectedPoint) return;
            isCorrect = selectedPoint.x === currentQ.correctPoint.x && selectedPoint.y === currentQ.correctPoint.y;
        } else if (currentQ.type === 'move') {
            if (!movePoint) return;
            isCorrect = movePoint.x === currentQ.correctPoint.x && movePoint.y === currentQ.correctPoint.y;
        }

        if (isCorrect) {
            setStatus('correct');
        } else {
            setStatus('incorrect');
            setTimeout(() => setShowCorrection(true), 500);
        }
    };

    const handleReset = () => {
        setSelectedPoint(null);
        setMovePoint(currentQ.type === 'move' ? currentQ.startPoint : null);
        setStatus('idle');
        setShowCorrection(false);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < lessonQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestionIndex(0);
        setIsFinished(false);
        setQuizSeed(s => s + 1); // Generates new random questions
        handleReset();
    };

    // --- Rendering Helpers ---
    const renderGridLines = () => {
        const lines = [];
        for (let i = 1; i <= gridSteps; i++) {
            const pos = i * stepSize;
            lines.push(
                <line key={`v-${i}`} x1={pos} y1={0} x2={pos} y2={300} className="grid-line" />
            );
            lines.push(
                <line key={`h-${i}`} x1={0} y1={300 - pos} x2={300} y2={300 - pos} className="grid-line" />
            );
        }
        return lines;
    };

    const renderLabels = () => {
        const labels = [];
        for (let i = 1; i <= gridSteps; i++) {
            const pos = i * stepSize;
            labels.push(
                <text key={`lx-${i}`} x={pos} y={320} className="axis-label">{i}</text>
            );
            labels.push(
                <text key={`ly-${i}`} x={-15} y={300 - pos} className="axis-label">{i}</text>
            );
        }
        labels.push(<text key="origin" x={-10} y={315} className="axis-label">0</text>);
        return labels;
    };

    if (isFinished) {
        return (
            <div className="quiz-wrapper">
                <div className="quiz-container finish-container">
                    <h2 className="finish-title">🎉 Lesson Completed!</h2>
                    <p className="finish-subtitle">Great job! You've mastered this topic.</p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="check-btn" style={{ width: 'auto' }} onClick={handleRestartQuiz}>Practice Again</button>
                        <button className="check-btn active action-pulse" style={{ width: 'auto' }} onClick={() => onComplete(lessonId)}>Continue to Course</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQ) return null;

    const isCheckDisabled = currentQ.type === 'select' ? !selectedPoint : false;

    return (
        <div className="quiz-wrapper">
            <button className="back-nav-btn" onClick={onBack}>
                ← Back to Courses
            </button>

            {/* Progress Bar Header */}
            <div className="progress-header">
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${(currentQuestionIndex / lessonQuestions.length) * 100}%` }}
                    ></div>
                </div>
                <div className="progress-text">
                    {currentQuestionIndex + 1} / {lessonQuestions.length}
                </div>
            </div>

            <div className="quiz-container">
                <div className="question-text">
                    {currentQ.instructionText}
                </div>

                <div className="coordinate-system">
                    <svg 
                        ref={svgRef}
                        viewBox="-30 -30 360 360"
                        onPointerDown={currentQ.type === 'move' ? handleSvgPointerDown : undefined}
                        onPointerMove={currentQ.type === 'move' ? handleSvgPointerMove : undefined}
                        onPointerUp={currentQ.type === 'move' ? handleSvgPointerUp : undefined}
                        onPointerCancel={currentQ.type === 'move' ? handleSvgPointerUp : undefined}
                        style={{ touchAction: currentQ.type === 'move' ? 'none' : 'auto', cursor: currentQ.type === 'move' ? 'pointer' : 'default' }}
                    >
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
                            </marker>
                        </defs>

                        {/* Grid Lines */}
                        <g id="grid-lines">{renderGridLines()}</g>

                        {/* Axes */}
                        <line x1="0" y1="300" x2="0" y2="-20" className="axis" markerEnd="url(#arrow)" />
                        <line x1="0" y1="300" x2="320" y2="300" className="axis" markerEnd="url(#arrow)" />

                        {/* Labels */}
                        <g id="labels">{renderLabels()}</g>

                        {/* --- SELECT TYPE POINTS --- */}
                        {currentQ.type === 'select' && (
                            <g id="select-points">
                                {currentQ.availablePoints.map((pt, index) => {
                                    const cx = pt.x * stepSize;
                                    const cy = originY - pt.y * stepSize;
                                    
                                    const isSelected = selectedPoint && selectedPoint.x === pt.x && selectedPoint.y === pt.y;
                                    const isCorrectAns = pt.x === currentQ.correctPoint.x && pt.y === currentQ.correctPoint.y;
                                    
                                    let pointClass = "point";
                                    if (isSelected) {
                                        pointClass += " selected";
                                        if (status === 'correct') pointClass += " correct";
                                        if (status === 'incorrect') pointClass += " incorrect";
                                    } else if (showCorrection && isCorrectAns) {
                                        pointClass += " correct";
                                    }

                                    return (
                                        <g key={index} className={pointClass} onClick={() => handlePointClick(pt)}>
                                            <circle className="point-halo" cx={cx} cy={cy} />
                                            <circle className="point-core" cx={cx} cy={cy} />
                                        </g>
                                    );
                                })}
                            </g>
                        )}

                        {/* --- MOVE TYPE POINTS --- */}
                        {currentQ.type === 'move' && movePoint && (
                            <g id="move-points">
                                {/* Ghost correct point shown upon failure */}
                                {showCorrection && status === 'incorrect' && (
                                    <g className="point movable correct ghost">
                                        <circle className="point-halo" cx={currentQ.correctPoint.x * stepSize} cy={originY - currentQ.correctPoint.y * stepSize} />
                                        <circle className="point-core" cx={currentQ.correctPoint.x * stepSize} cy={originY - currentQ.correctPoint.y * stepSize} />
                                    </g>
                                )}

                                {/* Interactive Move Point */}
                                <g className={`point movable ${isDragging ? 'dragging' : ''} ${status !== 'idle' ? status : ''}`}>
                                    <circle className="point-halo" cx={movePoint.x * stepSize} cy={originY - movePoint.y * stepSize} />
                                    <circle className="point-core" cx={movePoint.x * stepSize} cy={originY - movePoint.y * stepSize} />
                                </g>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Dynamic Button Controls */}
                {status === 'idle' && (
                    <button 
                        className={`check-btn ${!isCheckDisabled ? 'active' : ''}`}
                        disabled={isCheckDisabled}
                        onClick={handleCheck}
                    >
                        Check
                    </button>
                )}

                {status === 'correct' && (
                    <button className="check-btn state-correct action-pulse" onClick={handleNextQuestion}>
                        {currentQuestionIndex < lessonQuestions.length - 1 ? 'Correct! Continue ➔' : 'Correct! Finish ➔'}
                    </button>
                )}

                {status === 'incorrect' && (
                    <div className="incorrect-actions">
                        <button className="check-btn state-incorrect">Incorrect</button>
                        <button className="reset-btn visible" onClick={handleReset}>Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoordinateQuiz;
