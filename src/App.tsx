import { useState, useEffect } from 'react';
import ReCaptchaScreen from './components/ReCaptchaScreen';
import GroupSelect from './components/GroupSelect';
import Quiz from './components/Quiz';
import ImageSelection from './components/ImageSelection';
import SuccessScreen from './components/SuccessScreen';
import { FlowStep, GroupState } from './types';
import { quizData, imageChallenges } from './data/quizData';
import { getGroupState, saveGroupState } from './utils/storage';

function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('recaptcha');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupState, setGroupState] = useState<GroupState | null>(null);

  const groups = import.meta.env.VITE_GROUPS?.split(',') || ['A', 'B', 'C', 'D'];
  const redirectUrl = import.meta.env.VITE_REDIRECT_URL || 'https://example.com/final';

  useEffect(() => {
    if (selectedGroup) {
      const savedState = getGroupState(selectedGroup);
      if (savedState) {
        setGroupState(savedState);

        if (savedState.quizCompleted && savedState.imageSelectCompleted) {
          setCurrentStep('success');
        } else if (savedState.quizCompleted) {
          setCurrentStep('image-select');
        } else {
          setCurrentStep('quiz');
        }
      } else {
        const newState: GroupState = {
          groupId: selectedGroup,
          quizCompleted: false,
          imageSelectCompleted: false,
        };
        setGroupState(newState);
        saveGroupState(newState);
        setCurrentStep('quiz');
      }
    }
  }, [selectedGroup]);

  const handleReCaptchaVerify = () => {
    setCurrentStep('group-select');
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
  };

  const handleQuizComplete = () => {
    if (!groupState) return;

    const updatedState: GroupState = {
      ...groupState,
      quizCompleted: true,
    };
    setGroupState(updatedState);
    saveGroupState(updatedState);
    setCurrentStep('image-select');
  };

  const handleImageSelectComplete = () => {
    if (!groupState) return;

    const updatedState: GroupState = {
      ...groupState,
      imageSelectCompleted: true,
    };
    setGroupState(updatedState);
    saveGroupState(updatedState);
    setCurrentStep('success');
  };

  if (currentStep === 'recaptcha') {
    return <ReCaptchaScreen onVerify={handleReCaptchaVerify} />;
  }

  if (currentStep === 'group-select') {
    return <GroupSelect groups={groups} onSelect={handleGroupSelect} />;
  }

  if (!selectedGroup || !groupState) {
    return <GroupSelect groups={groups} onSelect={handleGroupSelect} />;
  }

  if (currentStep === 'quiz') {
    return (
      <Quiz
        questions={quizData[selectedGroup] || quizData.A}
        groupId={selectedGroup}
        onComplete={handleQuizComplete}
      />
    );
  }

  if (currentStep === 'image-select') {
    return (
      <ImageSelection
        challenge={imageChallenges[selectedGroup] || imageChallenges.A}
        groupId={selectedGroup}
        onComplete={handleImageSelectComplete}
      />
    );
  }

  if (currentStep === 'success') {
    return <SuccessScreen groupId={selectedGroup} redirectUrl={redirectUrl} />;
  }

  return null;
}

export default App;
