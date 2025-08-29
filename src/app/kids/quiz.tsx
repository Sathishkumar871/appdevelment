import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Quiz Data (Example for Kids' Quiz) ---
const quizData = [
  {
    id: 1,
    question: 'What is the color of a banana?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correctAnswer: 'Yellow',
  },
  {
    id: 2,
    question: 'How many legs does a dog have?',
    options: ['2', '4', '6', '8'],
    correctAnswer: '4',
  },
  {
    id: 3,
    question: 'Which animal says "Moo"?',
    options: ['Cow', 'Cat', 'Duck', 'Frog'],
    correctAnswer: 'Cow',
  },
];

const QuizScreen = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];
  const isQuizComplete = currentQuestionIndex >= quizData.length;

  const handleAnswer = (selectedOption: string) => {
    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore(score + 1);
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz is over
        setCurrentQuestionIndex(quizData.length);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFeedback(false);
  };

  const getBackgroundColor = () => {
    if (showFeedback) {
      return isCorrect ? '#2ecc71' : '#e74c3c';
    }
    return '#34495e';
  };

  const getFeedbackText = () => {
    if (isQuizComplete) {
      return `Quiz Over! You scored ${score} out of ${quizData.length}.`;
    }
    if (showFeedback) {
      return isCorrect ? 'Correct! 🎉' : 'Incorrect. 😕';
    }
    return '';
  };

  const getFeedbackStyle = () => {
    if (isQuizComplete) {
      return styles.resultText;
    }
    return isCorrect ? styles.correctText : styles.incorrectText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getBackgroundColor()} />
      <LinearGradient
        colors={['#34495e', '#2c3e50']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Laugh & Learn Quiz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.quizCard, { backgroundColor: getBackgroundColor() }]}>
          {isQuizComplete ? (
            <View style={styles.quizComplete}>
              <Text style={getFeedbackStyle()}>{getFeedbackText()}</Text>
              <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
                <Text style={styles.restartButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.questionText}>Question {currentQuestionIndex + 1}:</Text>
              <Text style={styles.questionTitle}>{currentQuestion.question}</Text>

              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              {showFeedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={getFeedbackStyle()}>{getFeedbackText()}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quizCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    opacity: 0.8,
  },
  questionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#34495e',
    fontWeight: 'bold',
    fontSize: 18,
  },
  feedbackContainer: {
    marginTop: 10,
  },
  correctText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  incorrectText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quizComplete: {
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  restartButtonText: {
    color: '#34495e',
    fontWeight: 'bold',
  },
});

export default QuizScreen;