import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import Card from "./Card";
import Button from "./Button";
import type { PackSchema } from "../utils/schema";

interface SwipeQuizProps {
  pack: PackSchema;
  onComplete: () => void;
}

interface QuizResult {
  questionIndex: number;
  selectedAnswers: string[];
  isCorrect: boolean;
  userSwipe?: "left" | "right";
}

// Dynamic styling configurations for answers
const getAnswerStyle = (
  index: number,
  questionIndex: number,
  isSelected: boolean
) => {
  const styles = [
    // Question 1: Classic rounded buttons with gradients
    {
      base: "w-full text-left justify-center p-4 rounded-2xl border-2",
      selected:
        "bg-gradient-to-r from-blue-500/40 to-purple-500/40 border-blue-400 scale-105 shadow-glow",
      unselected:
        "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30",
    },
    // Question 2: Square cards with neon effects
    {
      base: "w-full text-center p-6 rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20",
      selected:
        "border-cyan-400 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105",
      unselected:
        "hover:border-cyan-400/50 hover:bg-gradient-to-br hover:from-cyan-900/30 hover:to-blue-900/30",
    },
    // Question 3: Pill-shaped with rainbow gradients
    {
      base: "w-full text-left justify-start p-3 rounded-full border-2",
      selected:
        "bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-indigo-500/40 border-pink-400 scale-110 shadow-glow",
      unselected:
        "bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/25",
    },
    // Question 4: Modern glass cards
    {
      base: "w-full text-center p-5 rounded-3xl backdrop-blur-xl border",
      selected:
        "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105",
      unselected:
        "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
    },
    // Question 5: Retro gaming style
    {
      base: "w-full text-left justify-center p-4 rounded-lg border-2 font-mono",
      selected:
        "bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border-yellow-400 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]",
      unselected:
        "bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500",
    },
  ];

  const style = styles[questionIndex % styles.length];
  return clsx(
    style.base,
    "transition-all duration-300 ease-out transform",
    isSelected ? style.selected : style.unselected
  );
};

export default function SwipeQuiz({ pack, onComplete }: SwipeQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string[]>
  >({});
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const currentItem = pack.items[currentIndex];
  const isLastQuestion = currentIndex >= pack.items.length - 1;

  const handleAnswerSelect = (answerId: string) => {
    if (!currentItem || isAnimating) return;

    const newAnswers = { ...selectedAnswers };

    if (currentItem.type === "single") {
      newAnswers[currentIndex] = [answerId];
      setSelectedAnswers(newAnswers);

      // Auto-swipe for single choice after selection with enhanced animation
      const selectedOption = currentItem.options?.find(
        (opt) => opt.id === answerId
      );
      if (selectedOption) {
        setTimeout(() => {
          handleAutoSwipe(selectedOption.correct);
        }, 800); // Longer delay to show selection animation
      }
    } else if (currentItem.type === "multi") {
      const currentAnswers = newAnswers[currentIndex] || [];
      if (currentAnswers.includes(answerId)) {
        newAnswers[currentIndex] = currentAnswers.filter(
          (id) => id !== answerId
        );
      } else {
        newAnswers[currentIndex] = [...currentAnswers, answerId];
      }
      setSelectedAnswers(newAnswers);
    }
  };

  const handleAutoSwipe = (isCorrect: boolean) => {
    if (isAnimating) return;

    const direction = isCorrect ? "right" : "left";
    setSwipeDirection(direction);

    // Record the result
    const newResults = [...results];
    newResults[currentIndex] = {
      questionIndex: currentIndex,
      selectedAnswers: selectedAnswers[currentIndex] || [],
      isCorrect,
      userSwipe: direction,
    };
    setResults(newResults);

    // Enhanced swipe animation
    setIsAnimating(true);
    setTimeout(() => {
      setSwipeDirection(null);
      if (currentIndex < pack.items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResults(true);
      }
      setIsAnimating(false);
    }, 900); // Longer animation duration
  };

  const handleManualSwipe = (direction: "left" | "right") => {
    if (!currentItem || currentItem.type !== "text" || isAnimating) return;

    const isCorrect = direction === "right";
    setSwipeDirection(direction);

    const newResults = [...results];
    newResults[currentIndex] = {
      questionIndex: currentIndex,
      selectedAnswers: [direction],
      isCorrect,
      userSwipe: direction,
    };
    setResults(newResults);

    setIsAnimating(true);
    setTimeout(() => {
      setSwipeDirection(null);
      if (currentIndex < pack.items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResults(true);
      }
      setIsAnimating(false);
    }, 900);
  };

  const handleMultiChoiceSubmit = () => {
    if (!currentItem || currentItem.type !== "multi" || isAnimating) return;

    const userAnswers = selectedAnswers[currentIndex] || [];
    const correctOptions =
      currentItem.options?.filter((opt) => opt.correct) || [];

    const isCorrect =
      correctOptions.length === userAnswers.length &&
      correctOptions.every((opt) => userAnswers.includes(opt.id));

    handleAutoSwipe(isCorrect);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setResults([]);
    setShowResults(false);
    setIsAnimating(false);
    setSwipeDirection(null);
  };

  const score = results.filter((r) => r.isCorrect).length;
  const total = results.length;

  if (showResults) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Enhanced Results Header */}
        <Card glass="strong" glow className="p-8 text-center animate-bounce-in">
          <div className="text-6xl mb-4 animate-pulse">
            {score === total ? "🎉" : score >= total * 0.7 ? "🎊" : "📚"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quiz beendet!
          </h2>
          <div className="text-lg text-white/80 mb-4">
            Du hast{" "}
            <span className="font-bold text-cyan-300 text-xl">{score}</span> von{" "}
            <span className="font-bold text-xl">{total}</span> Fragen richtig
            beantwortet
          </div>
          <div className="flex justify-center mb-6">
            <div
              className={clsx(
                "px-8 py-4 rounded-3xl font-bold text-white backdrop-blur-sm text-xl",
                "transform hover:scale-110 transition-all duration-300",
                score === total
                  ? "bg-gradient-to-r from-green-500/80 to-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  : score >= total * 0.7
                  ? "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                  : "bg-gradient-to-r from-orange-500/80 to-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              )}
            >
              {Math.round((score / total) * 100)}% korrekt
            </div>
          </div>
          <Button
            variant="glass"
            glow
            onClick={resetQuiz}
            className="text-lg px-8 py-4"
          >
            🔄 Nochmal versuchen
          </Button>
        </Card>

        {/* Enhanced Detailed Results */}
        <Card glass="medium" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            📊 Detaillierte Ergebnisse
          </h3>
          <div className="space-y-4">
            {results.map((result, index) => {
              const question = pack.items[result.questionIndex];
              return (
                <div
                  key={index}
                  className={clsx(
                    "bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-l-4 transform hover:scale-105 transition-all duration-300",
                    result.isCorrect
                      ? "border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]"
                      : "border-red-400 hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]"
                  )}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">
                      {result.isCorrect ? "✅" : "❌"}
                    </span>
                    <span className="text-lg font-medium text-white/60">
                      Frage {index + 1}
                    </span>
                  </div>
                  <p className="font-medium text-white mb-3 text-lg">
                    {question.text}
                  </p>
                  {result.selectedAnswers.length > 0 && (
                    <p className="text-sm text-white/70 mb-3">
                      <span className="font-medium text-cyan-300">
                        Deine Antwort:
                      </span>{" "}
                      {question.options
                        ?.filter((opt) =>
                          result.selectedAnswers.includes(opt.id)
                        )
                        .map((opt) => opt.text)
                        .join(", ") || result.selectedAnswers.join(", ")}
                    </p>
                  )}
                  {question.explanation && (
                    <div className="mt-4 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                      <p className="text-sm text-blue-200">
                        <span className="font-medium text-blue-300">
                          💡 Erklärung:
                        </span>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <Card glass="medium" className="p-8 text-center">
        <div className="text-4xl mb-4 animate-bounce">🎉</div>
        <h3 className="text-lg font-medium text-white mb-2">
          Quiz abgeschlossen!
        </h3>
        <Button variant="glass" onClick={onComplete}>
          Zurück zur Demo
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Bar */}
      <Card
        glass="medium"
        className="p-4 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-cyan-300">
            🎯 Fortschritt
          </span>
          <span className="text-sm font-medium text-white/60">
            {currentIndex + 1} / {pack.items.length}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={clsx(
              "h-3 rounded-full transition-all duration-700 ease-out",
              "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400",
              "animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            )}
            style={{
              width: `${((currentIndex + 1) / pack.items.length) * 100}%`,
            }}
          />
        </div>
      </Card>

      {/* Enhanced Card Stack with Improved Animations */}
      <div className="relative h-[500px] overflow-hidden perspective-1000">
        {pack.items
          .slice(currentIndex, currentIndex + 3)
          .map((item, stackIndex) => {
            const actualIndex = currentIndex + stackIndex;
            const isActive = stackIndex === 0;
            const zIndex = 10 - stackIndex;

            return (
              <Card
                key={`${item.id}-${actualIndex}`}
                glass={isActive ? "strong" : "medium"}
                glow={isActive}
                className={clsx(
                  "absolute inset-0 p-6 transition-all duration-700 ease-out",
                  "transform-gpu",
                  isActive &&
                    swipeDirection && [
                      swipeDirection === "right" &&
                        "translate-x-full rotate-12 opacity-0",
                      swipeDirection === "left" &&
                        "-translate-x-full -rotate-12 opacity-0",
                    ],
                  !isActive && "pointer-events-none"
                )}
                style={{
                  zIndex,
                  transform: `
                    translateY(${stackIndex * 8}px) 
                    translateZ(${-stackIndex * 100}px)
                    scale(${1 - stackIndex * 0.05}) 
                    rotateX(${stackIndex * 2}deg)
                  `,
                  opacity: stackIndex === 0 ? 1 : 0.7 - stackIndex * 0.2,
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Enhanced Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-medium text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full backdrop-blur">
                      Frage {actualIndex + 1} von {pack.items.length}
                    </span>
                    <span
                      className={clsx(
                        "text-sm font-medium px-3 py-1 rounded-full capitalize backdrop-blur",
                        item.type === "single" &&
                          "text-blue-300 bg-blue-500/20",
                        item.type === "multi" &&
                          "text-purple-300 bg-purple-500/20",
                        item.type === "text" && "text-green-300 bg-green-500/20"
                      )}
                    >
                      {item.type === "single"
                        ? "🎯 Single"
                        : item.type === "multi"
                        ? "✨ Multi"
                        : "📝 Text"}
                    </span>
                  </div>

                  {/* Enhanced Question Title */}
                  <h2 className="text-2xl font-bold text-white mb-8 leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text">
                    {item.text}
                  </h2>

                  {/* Dynamic Answer Buttons */}
                  <div className="flex-1 space-y-4">
                    {item.options?.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[actualIndex]?.includes(
                        option.id
                      );
                      return (
                        <button
                          key={option.id}
                          className={getAnswerStyle(
                            optionIndex,
                            actualIndex,
                            isSelected
                          )}
                          onClick={() =>
                            isActive && handleAnswerSelect(option.id)
                          }
                          disabled={!isActive || isAnimating}
                        >
                          <span className="relative z-10 text-white font-medium">
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Enhanced Controls */}
                  {isActive && (
                    <div className="mt-8">
                      {item.type === "single" && (
                        <div className="text-center text-white/60 text-sm bg-white/5 p-3 rounded-xl backdrop-blur">
                          ⚡ Wähle eine Antwort - automatisches Swiping
                        </div>
                      )}

                      {item.type === "multi" && (
                        <div className="space-y-4">
                          <div className="text-center text-white/60 text-sm bg-white/5 p-3 rounded-xl backdrop-blur">
                            ✨ Wähle alle richtigen Antworten
                          </div>
                          <Button
                            variant="glass"
                            glow
                            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50"
                            onClick={handleMultiChoiceSubmit}
                            disabled={
                              !selectedAnswers[currentIndex]?.length ||
                              isAnimating
                            }
                          >
                            🚀 Antworten bestätigen
                          </Button>
                        </div>
                      )}

                      {item.type === "text" && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-sm text-white/60 mb-2">
                              Swipe oder klicke für deine Bewertung
                            </div>
                            <div className="flex items-center justify-center space-x-3 text-xs text-white/40 mb-4">
                              <span>👈</span>
                              <span className="text-red-300">Falsch</span>
                              <span>•</span>
                              <span className="text-green-300">Richtig</span>
                              <span>👉</span>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              variant="glass"
                              onClick={() => handleManualSwipe("left")}
                              className="flex-1 py-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 hover:from-red-500/30 hover:to-pink-500/30"
                              disabled={isAnimating}
                            >
                              <span className="text-2xl mr-2">❌</span>
                              <span className="font-semibold">Falsch</span>
                            </Button>
                            <Button
                              variant="glass"
                              onClick={() => handleManualSwipe("right")}
                              className="flex-1 py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 hover:from-green-500/30 hover:to-emerald-500/30"
                              disabled={isAnimating}
                            >
                              <span className="text-2xl mr-2">✅</span>
                              <span className="font-semibold">Richtig</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
      </div>

      {/* Enhanced Instructions - Only show for first question */}
      {currentIndex === 0 && (
        <Card
          glass="weak"
          className="p-5 animate-fade-in hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-cyan-300 text-2xl animate-pulse">💡</span>
            <span className="font-semibold text-white text-lg">
              So funktioniert's:
            </span>
          </div>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-center space-x-2">
              <span>🎯</span>
              <span>
                <strong className="text-blue-300">Single Choice:</strong> Wähle
                eine Antwort → automatisches Swiping
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span>✨</span>
              <span>
                <strong className="text-purple-300">Multiple Choice:</strong>{" "}
                Wähle alle richtigen → bestätige mit Button
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <span>📝</span>
              <span>
                <strong className="text-green-300">Text-Fragen:</strong> Swipe
                links (falsch) oder rechts (richtig)
              </span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
