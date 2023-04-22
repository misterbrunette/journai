import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, getDocs, query, orderBy, doc } from 'firebase/firestore';

const firebaseConfig = {
  // Add your firebase configuration object here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to display journal entries in a table
function displayJournalEntries(journalEntries) {
  const table = document.getElementById('journal-entries-table');

  // Remove any existing rows from the table
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  // Add headers to the table
  const header = table.createTHead();
  const row = header.insertRow();
  const titleHeader = row.insertCell();
  const contentHeader = row.insertCell();
  const actionsHeader = row.insertCell();
  titleHeader.textContent = 'Title';
  contentHeader.textContent = 'Content';
  actionsHeader.textContent = 'Actions';

  // Add each journal entry to the table
  journalEntries.forEach((entry) => {
    const row = table.insertRow();
    const titleCell = row.insertCell();
    const contentCell = row.insertCell();
    const actionsCell = row.insertCell();
    titleCell.textContent = entry.title;
    contentCell.textContent = entry.content;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteJournalEntry(entry.id);
    });
    actionsCell.appendChild(deleteButton);
  });
}

// Function to add a journal entry to the server
async function addJournalEntryToServer(journalEntry) {
  try {
    const userId = auth.currentUser.uid;
    const docRef = await addDoc(collection(db, 'users', userId, 'journalEntries'), {
      title: journalEntry.title,
      content: journalEntry.content,
      createdAt: serverTimestamp()
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

// Function to display journal entries in a table
async function displayJournalEntries() {
  const table = document.getElementById('journal-entries-table');

  // Remove any existing rows from the table
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  try {
    const userId = auth.currentUser.uid;
    const querySnapshot = await getDocs(
      query(collection(db, 'users', userId, 'journalEntries'), orderBy('createdAt', 'desc'))
    );

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = table.insertRow(1);
      const titleCell = row.insertCell(0);
      const contentCell = row.insertCell(1);
      const dateCell = row.insertCell(2);

      titleCell.innerText = data.title;
      contentCell.innerText = data.content;
      dateCell.innerText = new Date(data.createdAt.toMillis()).toLocaleString();
    });
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to request feedback for a journal entry
async function requestFeedback() {
  const feedbackText = document.getElementById('feedback-text');
  feedbackText.innerText = 'Loading...';

  const journalEntriesSelect = document.getElementById('journal-entries');
  const selectedEntryId = journalEntriesSelect.value;

  try {
    const userId = auth.currentUser.uid;
    const journalEntryDocRef = doc(db, 'users', userId, 'journalEntries', selectedEntryId);
    const journalEntryDoc = await getDoc(journalEntryDocRef);

    if (journalEntryDoc.exists()) {
      const journalEntryData = journalEntryDoc.data();
      const feedback = await generateFeedback(journalEntryData.title, journalEntryData.content);
      feedbackText.innerText = feedback;
    } else {
      console.error('Journal entry document does not exist.');
    }
  } catch (error) {
    console.error('Error requesting feedback: ', error);
    feedbackText.innerText = 'Error requesting feedback. Please try again later.';
  }
}

// Function to generate feedback for a journal entry using OpenAI's GPT-3 API
async function generateFeedback(title, content) {
  try {
    const response = await fetch('/generate-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, content: content })
    });

    const data = await response.json();
    return data.feedback;
  } catch (error) {
    console.error('Error generating feedback: ', error);
    return 'Error generating feedback. Please try again later.';
  }
}

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = getAuth();

// Add event listeners to buttons
document.getElementById('save-button').addEventListener('click', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  addJournalEntryToServer({ title: title, content: content });
});

document.getElementById('request-feedback').
// Add event listeners to buttons
const signInLink = document.getElementById('sign-in-link');
const signUpLink = document.getElementById('sign-up-link');
const signOutLink = document.getElementById('sign-out-link');
const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');
const closeSignInModal = document.querySelector('#sign-in-modal .close');
const closeSignUpModal = document.querySelector('#sign-up-modal .close');
const journalForm = document.getElementById('journal-form');
const saveButton = document.getElementById('save-button');
const requestFeedbackButton = document.getElementById('request-feedback');
const feedbackText = document.getElementById('feedback-text');
const userBanner = document.getElementById('user-banner');
const userEmail = document.getElementById('user-email');
const signOutButton = document.getElementById('sign-out');

signInLink.addEventListener('click', openSignInModal);
signUpLink.addEventListener('click', openSignUpModal);
signOutLink.addEventListener('click', signOut);
closeSignInModal.addEventListener('click', closeSignIn);
closeSignUpModal.addEventListener('click', closeSignUp);
journalForm.addEventListener('submit', addJournalEntry);
saveButton.addEventListener('click', addJournalEntry);
requestFeedbackButton.addEventListener('click', requestFeedback);

// Function to open the sign in modal
function openSignInModal() {
  signInModal.style.display = 'block';
}

// Function to close the sign in modal
function closeSignIn() {
  signInModal.style.display = 'none';
}

// Function to open the sign up modal
function openSignUpModal() {
  signUpModal.style.display = 'block';
}

// Function to close the sign up modal
function closeSignUp() {
  signUpModal.style.display = 'none';
}

// Function to add a journal entry to the server
async function addJournalEntry(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const createdAt = new Date().toISOString();

  const journalEntry = {
    title,
    content,
    createdAt,
  };

  const userId = auth.currentUser.uid;
  const docRef = await addDoc(
    collection(db, 'users', userId, 'journalEntries'),
    journalEntry
  );
  console.log('Document written with ID: ', docRef.id);

  // Clear form fields and disable save button
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  saveButton.disabled = true;

  // Refresh journal entries table
  displayJournalEntries();
}

// Function to request feedback on a journal entry
async function requestFeedback() {
  const selectedEntryId = document.getElementById('journal-entries').value;
  if (!selectedEntryId) {
    return;
  }

  const userId = auth.currentUser.uid;
  const journalEntryRef = doc(db, 'users', userId, 'journalEntries', selectedEntryId);
  const journalEntryDoc = await getDoc(journalEntryRef);

  if (journalEntryDoc.exists()) {
    const journalEntry = journalEntryDoc.data();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        prompt: `Analyze the following journal entry: "${journalEntry.title} - ${journalEntry.content}"`,
        temperature: 0.5,
        max_tokens: 60,
      }),
    });

    if (response.ok) {
      const { choices } = await response.json();
      const feedback = choices[0].text.trim();
      feedbackText.textContent = feedback;
    } else {
      feedbackText.textContent = 'Error: Failed to request feedback
// Add event listeners to buttons
document.getElementById('save-button').addEventListener('click', saveJournalEntry);
document.getElementById('request-feedback').addEventListener('click', requestFeedback);
document.getElementById('sign-in-link').addEventListener('click', openSignInModal);
document.getElementById('sign-up-link').addEventListener('click', openSignUpModal);
document.getElementById('sign-in-form').addEventListener('submit', signIn);
document.getElementById('sign-up-form').addEventListener('submit', signUp);
document.getElementById('sign-out-link').addEventListener('click', signOut);

// Initialize the app
initApp();
