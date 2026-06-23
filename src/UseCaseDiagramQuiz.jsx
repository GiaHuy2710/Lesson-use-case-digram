import React, { useState, useEffect } from 'react';
import './UseCaseDiagramQuiz.css';

const ActorIcon = () => (
    <svg width="60" height="100" viewBox="0 0 40 80" stroke="#a3adc2" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="15" r="10" />
        <line x1="20" y1="25" x2="20" y2="50" />
        <line x1="20" y1="35" x2="5" y2="20" />
        <line x1="20" y1="35" x2="35" y2="20" />
        <line x1="20" y1="50" x2="5" y2="75" />
        <line x1="20" y1="50" x2="35" y2="75" />
    </svg>
);

const diagramLevels = [
    {
        title: "ATM System",
        description: "Drag elements to complete the ATM system diagram. Grade your peers' understanding!",
        systemName: "ATM SYSTEM BOUNDARY",
        actor1: "Customer",
        actor2: "Bank Server",
        fixedUseCase: "Print Receipt",
        items: [
            { id: 'uc1', text: 'Withdraw Cash', type: 'usecase' },
            { id: 'uc2', text: 'Authenticate', type: 'usecase' },
            { id: 'rel1', text: '<<include>>', type: 'relation' },
            { id: 'rel2', text: '<<extend>>', type: 'relation' }
        ],
        correct: { slot1: 'uc1', slot2: 'uc2', slot3: 'rel1', slot4: 'rel2' }
    },
    {
        title: "Library System",
        description: "Map out how a member borrows a book and interacts with the system.",
        systemName: "LIBRARY SYSTEM",
        actor1: "Member",
        actor2: "Database",
        fixedUseCase: "Pay Fine",
        items: [
            { id: 'uc1', text: 'Borrow Book', type: 'usecase' },
            { id: 'uc2', text: 'Check Status', type: 'usecase' },
            { id: 'rel1', text: '<<include>>', type: 'relation' },
            { id: 'rel2', text: '<<extend>>', type: 'relation' }
        ],
        correct: { slot1: 'uc1', slot2: 'uc2', slot3: 'rel1', slot4: 'rel2' }
    },
    {
        title: "E-Commerce",
        description: "Arrange the checkout process and payment gateway interaction.",
        systemName: "E-COMMERCE SYSTEM",
        actor1: "Shopper",
        actor2: "Payment GW",
        fixedUseCase: "Apply Coupon",
        items: [
            { id: 'uc1', text: 'Checkout', type: 'usecase' },
            { id: 'uc2', text: 'Process Payment', type: 'usecase' },
            { id: 'rel1', text: '<<include>>', type: 'relation' },
            { id: 'rel2', text: '<<extend>>', type: 'relation' }
        ],
        correct: { slot1: 'uc1', slot2: 'uc2', slot3: 'rel1', slot4: 'rel2' }
    },
    {
        title: "Ride Sharing",
        description: "Connect the rider to the payment and rating system.",
        systemName: "RIDE SHARING APP",
        actor1: "Rider",
        actor2: "Billing System",
        fixedUseCase: "Rate Driver",
        items: [
            { id: 'uc1', text: 'Book Ride', type: 'usecase' },
            { id: 'uc2', text: 'Process Payment', type: 'usecase' },
            { id: 'rel1', text: '<<include>>', type: 'relation' },
            { id: 'rel2', text: '<<extend>>', type: 'relation' }
        ],
        correct: { slot1: 'uc1', slot2: 'uc2', slot3: 'rel1', slot4: 'rel2' }
    },
    {
        title: "Food Delivery",
        description: "Model the food ordering process and exceptions.",
        systemName: "FOOD DELIVERY",
        actor1: "Customer",
        actor2: "Restaurant",
        fixedUseCase: "Cancel Order",
        items: [
            { id: 'uc1', text: 'Place Order', type: 'usecase' },
            { id: 'uc2', text: 'Confirm Order', type: 'usecase' },
            { id: 'rel1', text: '<<include>>', type: 'relation' },
            { id: 'rel2', text: '<<extend>>', type: 'relation' }
        ],
        correct: { slot1: 'uc1', slot2: 'uc2', slot3: 'rel1', slot4: 'rel2' }
    }
];

const UseCaseDiagramQuiz = ({ lessonId, onBack, onComplete }) => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [slots, setSlots] = useState({
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null
    });
    
    const [status, setStatus] = useState('idle'); // idle, correct, incorrect
    const [isFinished, setIsFinished] = useState(false);

    const level = diagramLevels[currentLevelIndex];

    useEffect(() => {
        setSlots({ slot1: null, slot2: null, slot3: null, slot4: null });
        setStatus('idle');
    }, [currentLevelIndex]);

    if (isFinished) {
        return (
            <div className="uc-quiz-wrapper" style={{ justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉 Lesson Completed!</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>You have mastered the Use Case Diagram interactions.</p>
                    <button className="uc-check-btn ready" style={{ background: '#2ecc71', color: 'white' }} onClick={() => onComplete(lessonId)}>
                        Return to Course Menu
                    </button>
                </div>
            </div>
        );
    }

    const handleDragStart = (e, item, sourceSlot) => {
        if (status === 'correct') return;
        e.dataTransfer.setData('itemId', item.id);
        e.dataTransfer.setData('sourceSlot', sourceSlot || 'pool');
    };

    const handleDropOnSlot = (e, slotId, slotType) => {
        e.preventDefault();
        if (status === 'correct') return;

        const itemId = e.dataTransfer.getData('itemId');
        const sourceSlot = e.dataTransfer.getData('sourceSlot');
        const item = level.items.find(i => i.id === itemId);

        if (!item || item.type !== slotType) return;

        const newSlots = { ...slots };
        
        // Remove from source if it was in a slot
        if (sourceSlot !== 'pool') {
            newSlots[sourceSlot] = null;
        }

        // Swap if destination already has an item
        const existingItemId = newSlots[slotId];
        if (existingItemId && sourceSlot !== 'pool') {
            newSlots[sourceSlot] = existingItemId;
        }

        newSlots[slotId] = itemId;
        setSlots(newSlots);
        setStatus('idle');
    };

    const handleDropOnPool = (e) => {
        e.preventDefault();
        if (status === 'correct') return;

        const sourceSlot = e.dataTransfer.getData('sourceSlot');
        if (sourceSlot !== 'pool') {
            setSlots({ ...slots, [sourceSlot]: null });
            setStatus('idle');
        }
    };

    const allFilled = Object.values(slots).every(val => val !== null);

    const handleCheck = () => {
        const isCorrect = 
            slots.slot1 === level.correct.slot1 &&
            slots.slot2 === level.correct.slot2 &&
            slots.slot3 === level.correct.slot3 &&
            slots.slot4 === level.correct.slot4;
        
        setStatus(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
            setTimeout(() => setStatus('idle'), 800);
        }
    };

    const handleNext = () => {
        if (currentLevelIndex < diagramLevels.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const renderDraggable = (itemId, sourceSlot) => {
        if (!itemId) return null;
        const item = level.items.find(i => i.id === itemId);
        return (
            <div 
                className={`uc-draggable ${item.type} ${status === 'correct' ? 'correct-glow' : ''}`}
                draggable={status !== 'correct'}
                onDragStart={e => handleDragStart(e, item, sourceSlot)}
            >
                {item.text}
            </div>
        );
    };

    return (
        <div className="uc-quiz-wrapper">
            <button className="back-nav-btn" onClick={onBack} style={{position: 'absolute', top: 20, left: 20, background: 'transparent', color: 'white', border: '1px solid #333', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', zIndex: 10}}>✖ Exit</button>
            
            {/* Progress Bar similar to LogicQuiz */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: '#2c313d' }}>
                <div style={{ width: `${(currentLevelIndex / diagramLevels.length) * 100}%`, height: '100%', background: '#2ecc71', transition: 'width 0.3s ease' }}></div>
            </div>

            <div className="uc-header">
                <h1>{level.title}</h1>
                <p>{level.description}</p>
            </div>

            <div className={`uc-diagram-box ${status === 'incorrect' ? 'shake' : ''}`}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                    <defs>
                        <marker id="open-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="#a3adc2" strokeWidth="1.5" />
                        </marker>
                    </defs>
                    
                    <rect x="150" y="20" width="600" height="460" fill="rgba(30, 35, 45, 0.5)" stroke="#3a4252" strokeWidth="2" strokeDasharray="8 4" rx="12" />
                    <text x="450" y="50" fill="#6b7280" fontSize="18" fontWeight="600" textAnchor="middle" letterSpacing="2">{level.systemName}</text>

                    {/* Customer to slot1 */}
                    <line x1="90" y1="190" x2="180" y2="150" stroke="#a3adc2" strokeWidth="2" />
                    
                    {/* Bank Server to slot2 */}
                    <line x1="810" y1="190" x2="670" y2="150" stroke="#a3adc2" strokeWidth="2" />

                    {/* slot1 to slot2 */}
                    <line x1="320" y1="150" x2="525" y2="150" stroke="#a3adc2" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#open-arrow)" />

                    {/* Print Receipt to slot1 */}
                    <line x1="250" y1="320" x2="250" y2="185" stroke="#a3adc2" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#open-arrow)" />
                </svg>

                <div className="uc-actor" style={{ left: 30, top: 120 }}>
                    <ActorIcon />
                    <div style={{marginTop: 10}}>{level.actor1}</div>
                </div>

                <div className="uc-actor" style={{ left: 780, top: 120 }}>
                    <ActorIcon />
                    <div style={{marginTop: 10}}>{level.actor2}</div>
                </div>

                {/* Drop Zones */}
                <div 
                    className="uc-drop-zone usecase" 
                    style={{ left: 180, top: 120, width: 140, height: 60, borderRadius: 30 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDropOnSlot(e, 'slot1', 'usecase')}
                >
                    {renderDraggable(slots.slot1, 'slot1')}
                </div>

                <div 
                    className="uc-drop-zone usecase" 
                    style={{ left: 530, top: 120, width: 140, height: 60, borderRadius: 30 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDropOnSlot(e, 'slot2', 'usecase')}
                >
                    {renderDraggable(slots.slot2, 'slot2')}
                </div>

                <div 
                    className="uc-drop-zone relation" 
                    style={{ left: 375, top: 135, width: 100, height: 30 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDropOnSlot(e, 'slot3', 'relation')}
                >
                    {renderDraggable(slots.slot3, 'slot3')}
                </div>

                <div 
                    className="uc-drop-zone relation" 
                    style={{ left: 260, top: 235, width: 100, height: 30 }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDropOnSlot(e, 'slot4', 'relation')}
                >
                    {renderDraggable(slots.slot4, 'slot4')}
                </div>

                {/* Fixed Use Case */}
                <div className="uc-fixed-usecase" style={{ left: 180, top: 320, width: 140, height: 60 }}>
                    {level.fixedUseCase}
                </div>
            </div>

            <div 
                className="uc-pool"
                onDragOver={e => e.preventDefault()}
                onDrop={handleDropOnPool}
            >
                {level.items.map(item => {
                    const isUsed = Object.values(slots).includes(item.id);
                    return (
                        <div key={item.id} className={`uc-pool-item-wrapper ${item.type}`}>
                            {!isUsed && renderDraggable(item.id, 'pool')}
                        </div>
                    );
                })}
            </div>

            {status === 'correct' ? (
                <div style={{marginTop: 30, textAlign: 'center', animation: 'popIn 0.5s ease'}}>
                    <h2 style={{color: '#2ecc71', marginBottom: 15}}>✨ Correct!</h2>
                    <button className="uc-check-btn ready" style={{background: '#2ecc71', color: 'white'}} onClick={handleNext}>
                        {currentLevelIndex < diagramLevels.length - 1 ? 'Next Diagram' : 'Finish Lesson'}
                    </button>
                </div>
            ) : (
                <button 
                    className={`uc-check-btn ${allFilled ? 'ready' : ''}`}
                    onClick={handleCheck}
                >
                    Verify Diagram
                </button>
            )}
        </div>
    );
};

export default UseCaseDiagramQuiz;
