import React, { useState } from 'react';
import CourseMenu from './CourseMenu';
import LogicQuiz from './LogicQuiz';
import UseCaseDiagramQuiz from './UseCaseDiagramQuiz';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [activeLesson, setActiveLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const handleStartQuiz = (lessonId) => {
    setActiveLesson(lessonId);
    setCurrentView('quiz');
  };

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    setCurrentView('menu');
  };

  return (
    <>
      {currentView === 'menu' ? (
        <CourseMenu 
          completedLessons={completedLessons}
          onStart={handleStartQuiz} 
          isPremiumUser={isPremiumUser}
          onUpgrade={() => setIsPremiumUser(true)}
        />
      ) : activeLesson === 5 ? (
        <UseCaseDiagramQuiz 
          lessonId={activeLesson}
          onBack={() => setCurrentView('menu')} 
          onComplete={handleCompleteLesson}
        />
      ) : (
        <LogicQuiz 
          lessonId={activeLesson}
          onBack={() => setCurrentView('menu')} 
          onComplete={handleCompleteLesson}
        />
      )}
    </>
  );
}

export default App;
