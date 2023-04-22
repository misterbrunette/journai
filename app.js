// Import the functions you need from the SDKs you need
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, where, onSnapshot } from 'firebase/firestore';

// DOM elements
const signInLink = document.getElementById('sign-in-link');
const signUpLink = document.getElementById('sign-up-link');
const signOutLink = document.getElementById('sign-out-link');
const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');
const signInForm = document.getElementById('sign-in-form');
const signUpForm = document.getElementById('sign-up-form');
const signInError = document.getElementById('auth-error');
const signUpError = document.getElementById('auth-error');
const closeModalButtons = document.getElementsByClassName('close');
const userBanner = document.getElementById('user-banner');
const userEmailDisplay = document.getElementById('user-email');
const signOutButton = document.getElementById('sign-out');
const journalForm = document.getElementById('journal-form');
const journalTable = document.getElementById('journal-entries-table');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const saveButton = document.getElementById('save-button');
const feedbackForm = document.getElementById('feedback-form');
const feedbackText = document.getElementById('feedback-text');

// Sign in and sign up modal handlers
signInLink.addEventListener('click', () => {
  signInModal.style.display = 'block';
});

signUpLink.addEventListener('click', () => {
  signUpModal.style.display = 'block';
});

Array.from(closeModalButtons).forEach(button => {
  button.addEventListener('click', () => {
    signInModal.style.display = 'none';
    signUpModal.style.display = 'none';
  });
});

window.addEventListener('click', (event) => {
  if (event.target === signInModal || event.target === signUpModal) {
    signInModal.style.display = 'none';
    signUpModal.style.display = 'none';
  }
});

// Authentication handlers
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('sign-in-email').value;
  const password = document.getElementById('sign-in-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    signInModal.style.display = 'none';
  } catch (error) {
    signInError.textContent = error.message;
  }
});

signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    signUpModal.style.display = 'none';
  } catch (error) {
    signUpError.textContent = error.message;
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userBanner.style.display = 'block';
    userEmailDisplay.textContent = user.email;
    signOutButton.addEventListener('click', () => signOut(auth));
  } else {
    userBanner.style.display = 'none';
  }
});

// Journal entry handlers
journalForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value;
  const content = contentInput.value;
  const date = new Date().toISOString().substring(0, 10);
  const userId = auth.currentUser.uid;

  try {
    await addDoc(collection(db, 'journalEntries'), {
      title,
      content,
      date,
      userId
    });
    titleInput.value = '';
    contentInput.value = '';
  } catch (error) {
    console.error('Error adding journal entry:', error);
  }
});

// Update UI
const updateJournalEntriesUI = (querySnapshot) => {
  const userId = auth.currentUser.uid;
  const journalEntries = querySnapshot.docs.filter((doc) => doc.data().userId === userId);
  journalTable.innerHTML = '';
  journalEntries.forEach((doc) => {
    const entry = doc.data();
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.title}</td>
      <td>${entry.content}</td>
    `;
    journalTable.appendChild(tableRow);
  });
};

onSnapshot(query(collection(db, 'journalEntries'), orderBy('date', 'desc')), updateJournalEntriesUI);

// Send feedback to ChatGPT
feedbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const feedback = feedbackText.value;
  if (!feedback) return;

  // Replace 'YOUR_API_KEY' with your actual OpenAI API key
  const apiKey = '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';

  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: feedback,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5
    })
  });

  const data = await response.json();
  const generatedResponse = data.choices[0].text;
  alert(`Assistant's response: ${generatedResponse}`);
  feedbackText.value = '';
});