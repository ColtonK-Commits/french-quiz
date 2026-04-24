// Shared data store using localStorage
// All pages read and write through these functions

export function saveQuizState(data) {
  localStorage.setItem('frenchQuizState', JSON.stringify(data));
}

export function loadQuizState() {
  try {
    const saved = localStorage.getItem('frenchQuizState');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export function clearQuizState() {
  localStorage.removeItem('frenchQuizState');
}

export function saveResults(data) {
  localStorage.setItem('frenchQuizResults', JSON.stringify(data));
}

export function loadResults() {
  try {
    const saved = localStorage.getItem('frenchQuizResults');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export function clearResults() {
  localStorage.removeItem('frenchQuizResults');
}