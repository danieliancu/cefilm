
import React, { useState, useEffect } from 'react';
import { QuizCategory, Language } from '../types';
import { Button } from './Button';
import { getTranslation } from '../translations';

interface QuizProps {
  category: QuizCategory;
  lang: Language;
  onComplete: (answers: { question: string; answer: string }[]) => void;
  onCancel: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ category, lang, onComplete, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  
  // State for options
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  // State for custom text input
  const [customText, setCustomText] = useState<string>('');

  const currentQuestion = category.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === category.questions.length - 1;

  // Reset inputs when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setCustomText('');
  }, [currentQuestionIndex]);

  const handleOptionSelect = (id: string) => {
    setSelectedOptionId(id);
    setCustomText(''); // Clear text input if option is selected
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
    setSelectedOptionId(null); // Deselect options if typing text
  };

  const handleNext = () => {
    // Determine the final answer
    let finalAnswer = '';
    
    if (selectedOptionId) {
        const selectedOption = currentQuestion.options.find(opt => opt.id === selectedOptionId);
        finalAnswer = selectedOption?.text || '';
    } else if (customText.trim()) {
        finalAnswer = customText.trim();
    } else {
        return; // Should not happen due to disabled button
    }

    const newAnswers = [
      ...answers, 
      { 
        question: currentQuestion.text, 
        answer: finalAnswer
      }
    ];

    setAnswers(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const hasAnswer = selectedOptionId !== null || customText.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>

      <div className="relative bg-zinc-900/80 border border-zinc-800 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-1 mb-8 rounded-full overflow-hidden">
          <div 
            className="bg-red-700 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / category.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="mb-2 text-amber-600 uppercase tracking-widest text-xs font-bold">
          {getTranslation('quiz_scene', lang)} {currentQuestionIndex + 1} / {category.questions.length}
        </div>
        
        <h2 className="text-2xl md:text-3xl text-white mb-8 cinema-font leading-relaxed">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full text-left p-4 rounded border transition-all duration-200 group relative overflow-hidden ${
                selectedOptionId === option.id
                  ? 'border-amber-500 bg-amber-900/20 text-amber-100'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span className={`inline-block w-6 h-6 rounded-full border mr-3 text-center text-sm leading-5 transition-colors ${
                selectedOptionId === option.id ? 'bg-amber-600 border-amber-600 text-black' : 'border-zinc-600 text-zinc-600 group-hover:border-zinc-400'
              }`}>
                {option.id.toUpperCase()}
              </span>
              {option.text}
            </button>
          ))}
          
          {/* Custom Input Field */}
          <div className="pt-4 mt-2 border-t border-zinc-800/50">
            <label className="block text-amber-400 font-bold text-sm uppercase tracking-widest mb-3 drop-shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                {getTranslation('quiz_custom_label', lang)}
            </label>
            <textarea
                value={customText}
                onChange={handleCustomTextChange}
                placeholder={getTranslation('quiz_custom_placeholder', lang)}
                className={`w-full bg-zinc-950 p-4 rounded border text-zinc-200 focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${
                    customText.trim().length > 0 
                    ? 'border-amber-500 ring-amber-500/50' 
                    : 'border-zinc-800 focus:border-zinc-600'
                }`}
                rows={2}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-col justify-between items-center mt-8 pt-6 border-t border-zinc-800 gap-4">
          <Button 
            onClick={handleNext} 
            disabled={!hasAnswer}
            variant="secondary"
            fullWidth
            className="w-full relative z-10"
          >
            {isLastQuestion ? getTranslation('quiz_finish', lang) : getTranslation('quiz_next', lang)}
          </Button>
          
          <button 
            onClick={onCancel}
            className="text-zinc-500 hover:text-white text-sm uppercase tracking-wider transition-colors w-full py-3"
          >
            {getTranslation('quiz_cancel', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
