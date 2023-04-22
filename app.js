// Import Firebase modules
import { auth, db } from './firebase-config.js';

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyD1PqjsmOknKl2ZuRUORLG-4faiYFiuKA0",
  authDomain: "journai-6b1fe.firebaseapp.com",
  databaseURL: "https://journai-6b1fe-default-rtdb.firebaseio.com",
  projectId: "journai-6b1fe",
  storageBucket: "journai-6b1fe.appspot.com",
  messagingSenderId: "13426463829",
  appId: "1:13426463829:web:fdf1588552513c567f70dc",
  measurementId: "G-60CFJTY6S0"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements

// Note: Define all the DOM elements here
const signInForm = document.getElementById('sign-in-form');
const signInEmail = document.getElementById('sign-in-email');
const signInPassword = document.getElementById('sign-in-password');
const signUpForm = document.getElementById('sign-up-form');
const signUpEmail = document.getElementById('sign-up-email');
const signUpPassword = document.getElementById('sign-up-password');
const authError = document.getElementById('auth-error');
const journalSection = document.getElementById('journal');
const journalForm = document.getElementById('journal-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const signOutButton = document.getElementById('sign-out');
const feedbackSection = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const requestFeedbackButton = document.getElementById('request-feedback');
// Get form elements
// Get sign in and sign up elements
const signInLink = document.getElementById('sign-in-link');
const signUpLink = document.getElementById('sign-up-link');
const signInModal = document.getElementById('sign-in-modal');
const signUpModal = document.getElementById('sign-up-modal');

// Add event listeners for Sign In and Sign Up links
signInLink.addEventListener('click', (event) => {
  event.preventDefault();
  signInModal.style.display = 'block';
});

signUpLink.addEventListener('click', (event) => {
  event.preventDefault();
  signUpModal.style.display = 'block';
});

// Add event listener for Sign Out button
// Get close buttons for sign in and sign up modals
const signInCloseButton = document.querySelector('#sign-in-modal .close');
const signUpCloseButton = document.querySelector('#sign-up-modal .close');

// Add event listeners for closing the modals
signInCloseButton.addEventListener('click', () => {
  signInModal.style.display = 'none';
});

signUpCloseButton.addEventListener('click', () => {
  signUpModal.style.display = 'none';
});

// Store your API key in a variable
const API_KEY = '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';

// Function to request feedback from OpenAI API

// Note: Define the function to request feedback
async function requestFeedback(text) {
  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      prompt: `Generate feedback for the following journal entry: "${text}"`,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Add event listener for Request Feedback button

// Note: Add event listener for Request Feedback button
requestFeedbackButton.addEventListener('click', async () => {
  const selectedEntryContent = contentInput.value;
  const feedback = await requestFeedback(selectedEntryContent);
  feedbackText.textContent = feedback;
});

// Function to save a journal entry

// Note: Define the function to save a journal entry
async function saveJournalEntry(title, content) {
  const userId = auth.currentUser.uid;
  await addDoc(collection(db, 'users', userId, 'journalEntries'), {
    title,
    content,
    createdAt: new Date(),
  });
}

// Function to fetch all journal entries

// Note: Define the function to fetch all journal entries
async function fetchJournalEntries() {
  try {
  const userId = auth.currentUser.uid;
  const querySnapshot = await getDocs(
    collection(db, 'users', userId, 'journalEntries'),
    orderBy('createdAt', 'desc')
  );

  const journalEntries = [];
  querySnapshot.forEach((doc) => {
    journalEntries.push({ id: doc.id, ...doc.data() });
  });

  return journalEntries;
  } catch (error) {
    console.error('Error fetching journal entries:', error);
  }
}

// Function to display journal entries in a table

// Note: Define the function to display journal entries in a table
function displayJournalEntries(journalEntries) {
  const table = document.getElementById('journal-entries-table');
  const select = document.getElementById('journal-entries');

  // Remove any existing rows from the table
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

// Add header row to table
const headerRow = table.insertRow();
const titleHeader = headerRow.insertCell();
titleHeader.textContent = 'Title';
const contentHeader = headerRow.insertCell();
contentHeader.textContent = 'Content';

// Add a row for each journal entry
const userId = auth.currentUser.uid;
const querySnapshot = await getDocs(
  collection(db, 'users', userId, 'journalEntries'),
  orderBy('createdAt', 'desc')
);

querySnapshot.forEach((doc) => {
  const journalEntry = doc.data();
  const row = table.insertRow();
  const titleCell = row.insertCell();
  titleCell.textContent = journalEntry.title;
  const contentCell = row.insertCell();
  contentCell.textContent = journalEntry.content;
});
}

// Add event listener for Save Entry button
journalForm.addEventListener('submit', async (event) => {
event.preventDefault();
const title = titleInput.value;
const content = contentInput.value;

try {
await saveJournalEntry(title, content);
titleInput.value = '';
contentInput.value = '';
saveButton.disabled = true;
} catch (error) {
console.error('Save entry error:', error);
}
});
// Remove any existing options from the select element
  select.innerHTML = '';

  // Add each journal entry to the table and select element
  journalEntries.forEach((entry) => {
    const row = table.insertRow();
    const titleCell = row.insertCell();
    const dateCell = row.insertCell();

    titleCell.textContent = entry.title;
    dateCell.textContent = new Date(entry.createdAt.toDate()).toLocaleString();

    const option = document.createElement('option');
    option.value = entry.id;
    option.textContent = entry.title;
    select.appendChild(option);
  });
} 
const requestFeedbackButton = document.getElementById('request-feedback');
requestFeedbackButton.addEventListener('click', async () => {
  const select = document.getElementById('journal-entries');
  const entryId = select.value;

  // Make a request to the Journai AI API to get feedback for the selected journal entry
  const response = await fetch(`https://your-journai-ai-api.com/feedback?entryId=${entryId}`);

  // Handle the response from the API
  if (response.ok) {
    const feedback = await response.text();
    const feedbackText = document.getElementById('feedback-text');
    feedbackText.textContent = feedback;
  } else {
    const error = await response.text();
    console.error(`Failed to get feedback: ${error}`);
  }
});

// Update user banner when authentication state changes
auth.onAuthStateChanged((user) => {
const userBanner = document.getElementById('user-banner');
const userEmail = document.getElementById('user-email');

if (user) {
// User is signed in, show banner with email and sign-out button
userBanner.style.display = 'block';
userEmail.textContent = user.email;
} else {
// User is signed out, hide banner
userBanner.style.display = 'none';
userEmail.textContent = '';
}
});

// Add event listener for Sign Out button
signOutButton.addEventListener('click', async () => {
try {
await auth.signOut();
} catch (error) {
console.error('Sign out error:', error);
}
});

// Add event listener for Sign In form submission
signInForm.addEventListener('submit', async (event) => {
event.preventDefault();
const email = signInEmail.value;
const password = signInPassword.value;

try {
await signInWithEmailAndPassword(auth, email, password);
signInModal.style.display = 'none';
} catch (error) {
authError.textContent = error.message;
}
});

// Add event listener for Sign Up form submission
signUpForm.addEventListener('submit', async (event) => {
event.preventDefault();
const email = signUpEmail.value;
const password = signUpPassword.value;

try {
await createUserWithEmailAndPassword(auth, email, password);
signUpModal.style.display = 'none';
} catch (error) {
authError.textContent = error.message;
}
});

// Add event listener for Sign In link click
signInLink.addEventListener('click', () => {
signInModal.style.display = 'block';
});

// Add event listener for Sign Up link click
signUpLink.addEventListener('click', () => {
signUpModal.style.display = 'block';
});

// Add event listener for modal close buttons
closeButtons.forEach((button) => {
button.addEventListener('click', () => {
signInModal.style.display = 'none';
signUpModal.style.display = 'none';
});
});

// Add event listener for Save Entry button enable/disable
contentInput.addEventListener('input', () => {
if (contentInput.value.trim() === '') {
saveButton.disabled = true;
} else {
saveButton.disabled = false;
}
});
// Function to sign in user
async function signInUser(email, password) {
try {
await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
console.error('Sign in error:', error);
authError.textContent = error.message;
}
}

// Function to sign up user
async function signUpUser(email, password) {
try {
await createUserWithEmailAndPassword(auth, email, password);
} catch (error) {
console.error('Sign up error:', error);
authError.textContent = error.message;
}
}

// Add event listener for Sign In form submission
signInForm.addEventListener('submit', async (event) => {
event.preventDefault();

const email = signInEmail.value;
const password = signInPassword.value;

await signInUser(email, password);
});

// Add event listener for Sign Up form submission
signUpForm.addEventListener('submit', async (event) => {
event.preventDefault();

const email = signUpEmail.value;
const password = signUpPassword.value;

await signUpUser(email, password);
});

if (user) {
// User is signed in, show banner with email and sign-out button
userBanner.style.display = 'block';
userEmail.textContent = user.email;
signInLink.style.display = 'none';
signUpLink.style.display = 'none';
signOutLink.style.display = 'block';
fetchJournalEntries();
} else {
// User is signed out, hide banner
userBanner.style.display = 'none';
userEmail.textContent = '';
signInLink.style.display = 'block';
signUpLink.style.display = 'block';
signOutLink.style.display = 'none';
journalEntriesTable.innerHTML = '';
}
});

// Add event listener for Sign Out button
signOutButton.addEventListener('click', async () => {
try {
await auth.signOut();
} catch (error) {
console.error('Sign out error:', error);
}
});

// Add event listener for Save Entry button
saveButton.addEventListener('click', async (event) => {
event.preventDefault();

const title = titleInput.value.trim();
const content = contentInput.value.trim();

await saveJournalEntry(title, content);

titleInput.value = '';
contentInput.value = '';
saveButton.disabled = true;

fetchJournalEntries();
});

// Add event listener for Request Feedback button
requestFeedbackButton.addEventListener('click', async () => {
const selectedEntryId = journalEntriesSelect.value;
const selectedEntryContent = journalEntries.find(entry => entry.id === selectedEntryId).content;
const feedback = await requestFeedback(selectedEntryContent);
feedbackText.textContent = feedback;
});

// Add event listener for journal entry select
journalEntriesSelect.addEventListener('change', (event) => {
const selectedEntryId = event.target.value;
const selectedEntry = journalEntries.find(entry => entry.id === selectedEntryId);
titleInput.value = selectedEntry.title;
contentInput.value = selectedEntry.content;
saveButton.disabled = false;
});

// Fetch journal entries on page load if user is signed in
if (auth.currentUser) {
fetchJournalEntries();
}

// Add event listener for Sign In link
signInLink.addEventListener('click', () => {
signInModal.style.display = 'block';
});

// Add event listener for Close button on Sign In modal
signInModalClose.addEventListener('click', () => {
signInModal.style.display = 'none';
});

// Add event listener for Sign Up link
signUpLink.addEventListener('click', () => {
signUpModal.style.display = 'block';
});

// Add event listener for Close button on Sign Up modal
signUpModalClose.addEventListener('click', () => {
signUpModal.style.display = 'none';
});

// Add event listener for Sign In form submit
signInForm.addEventListener('submit', async (event) => {
event.preventDefault();
const email = signInEmail.value;
const password = signInPassword.value;
try {
await signInWithEmailAndPassword(auth, email, password);
signInModal.style.display = 'none';
} catch (error) {
console.error('Sign in error:', error);
authError.textContent = error.message;
}
});

// Add event listener for Sign Up form submit
signUpForm.addEventListener('submit', async (event) => {
event.preventDefault();
const email = signUpEmail.value;
const password = signUpPassword.value;
try {
await createUserWithEmailAndPassword(auth, email, password);
signUpModal.style.display = 'none';
} catch (error) {
console.error('Sign up error:', error);
authError.textContent = error.message;
}
});

// Update user banner when authentication state changes
auth.onAuthStateChanged((user) => {
const userBanner = document.getElementById('user-banner');
const userEmail = document.getElementById('user-email');

if (user) {
// User is signed in, show banner with email and sign-out button
userBanner.style.display = 'block';
userEmail.textContent = user.email;

// Show Sign Out link and hide Sign In/Sign Up links
signInLink.style.display = 'none';
signUpLink.style.display = 'none';
signOutLink.style.display = 'block';

// Fetch journal entries on page load if user is signed in
fetchJournalEntries();

} else {
// User is signed out, hide banner and Sign Out link
userBanner.style.display = 'none';
userEmail.textContent = '';
signOutLink.style.display = 'none';

// Show Sign In/Sign Up links
signInLink.style.display = 'block';
signUpLink.style.display = 'block';

}
});

// Add event listener for Sign Out button
signOutButton.addEventListener('click', async () => {
try {
await auth.signOut();
} catch (error) {
console.error('Sign out error:', error);
}
});

// Add event listener for Request Feedback button
requestFeedbackButton.addEventListener('click', async () => {
const selectedEntryContent = contentInput.value;
const feedback = await requestFeedback(selectedEntryContent);
feedbackText.textContent = feedback;
});

// Add event listener for Save Entry button
saveButton.addEventListener('click', async () => {
const title = titleInput.value;
const content = contentInput.value;
await saveJournalEntry(title, content);
titleInput.value = '';
contentInput.value = '';
saveButton.disabled = true;
});

// Add event listener for Save Entry button enable/disable
contentInput.addEventListener('input', () => {
if (contentInput.value.trim() === '') {
saveButton.disabled = true;
} else {
saveButton.disabled = false;
}
});

// Add event listener for journal entries dropdown
journalEntriesSelect.addEventListener('change', async () => {
const selectedEntryId = journalEntriesSelect.value;
const selected

// Get the selected journal entry from Firestore
const docRef = collection(db, 'users', auth.currentUser.uid, 'journalEntries', selectedEntryId);
const docSnapshot = await getDoc(docRef);
const selectedEntry = docSnapshot.data();

// Update form with selected journal entry
titleInput.value = selectedEntry.title;
contentInput.value = selectedEntry.content;
saveButton.textContent = 'Update Entry';
selectedJournalEntryId = selectedEntryId;
});

// Add event listener for Delete Entry button
deleteButton.addEventListener('click', async () => {
// Delete selected journal entry from Firestore
if (selectedJournalEntryId) {
const docRef = collection(db, 'users', auth.currentUser.uid, 'journalEntries', selectedJournalEntryId);
await deleteDoc(docRef);

// Clear form and fetch updated journal entries
titleInput.value = '';
contentInput.value = '';
saveButton.textContent = 'Save Entry';
selectedJournalEntryId = null;
}
});

// Add event listener for Save Entry button
journalForm.addEventListener('submit', async (event) => {
event.preventDefault();

const title = titleInput.value.trim();
const content = contentInput.value.trim();

if (selectedJournalEntryId) {
// Update existing journal entry in Firestore
const docRef = collection(db, 'users', auth.currentUser.uid, 'journalEntries', selectedJournalEntryId);
await updateDoc(docRef, { title, content });

// Clear form and fetch updated journal entries
titleInput.value = '';
contentInput.value = '';
saveButton.textContent = 'Save Entry';
selectedJournalEntryId = null;
fetchJournalEntries();
} else {
// Save new journal entry to Firestore
await saveJournalEntry(title, content);

// Clear form and fetch updated journal entries
titleInput.value = '';
contentInput.value = '';
contentInput.dispatchEvent(new Event('input')); // Trigger input event to disable Save button
fetchJournalEntries();
}
});

// Update user banner when authentication state changes
auth.onAuthStateChanged((user) => {
const userBanner = document.getElementById('user-banner');
const userEmail = document.getElementById('user-email');

if (user) {
// User is signed in, show banner with email and sign-out button
userBanner.style.display = 'block';
userEmail.textContent = user.email;
} else {
// User is signed out, hide banner
userBanner.style.display = 'none';
userEmail.textContent = '';
}
});

// Add event listener for Sign Out button
signOutButton.addEventListener('click', async () => {
try {
await auth.signOut();
} catch (error) {
console.error('Sign out error:', error);
}
});