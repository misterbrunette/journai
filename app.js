import { auth, firestore } from "./firebase-config.js";

const signInLink = document.getElementById("sign-in-link");
const signUpLink = document.getElementById("sign-up-link");
const signInModal = document.getElementById("sign-in-modal");
const signUpModal = document.getElementById("sign-up-modal");
const signInForm = document.getElementById("sign-in-form");
const signUpForm = document.getElementById("sign-up-form");
const userBanner = document.getElementById("user-banner");
const userEmail = document.getElementById("user-email");
const signOut = document.getElementById("sign-out");

signInLink.onclick = () => {
  signInModal.style.display = "block";
};

signUpLink.onclick = () => {
  signUpModal.style.display = "block";
};

signInModal.onclick = (event) => {
  if (event.target == signInModal) {
    signInModal.style.display = "none";
  }
};

signUpModal.onclick = (event) => {
  if (event.target == signUpModal) {
    signUpModal.style.display = "none";
  }
};

signInForm.onsubmit = async (event) => {
  event.preventDefault();
  const email = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    signInModal.style.display = "none";
  } catch (error) {
    alert("Error signing in: " + error.message);
  }
};

signUpForm.onsubmit = async (event) => {
  event.preventDefault();
  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    signUpModal.style.display = "none";
  } catch (error) {
    alert("Error signing up: " + error.message);
  }
};

auth.onAuthStateChanged((user) => {
  if (user) {
    signInLink.style.display = "none";
    signUpLink.style.display = "none";
    userBanner.style.display = "block";
    userEmail.textContent = user.email;
  } else {
    signInLink.style.display = "block";
    signUpLink.style.display = "block";
    userBanner.style.display = "none";
  }
});

signOut.onclick = () => {
  auth.signOut();
};
