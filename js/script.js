// import {
//   getAuth,
//   signInWithEmailAndPassword,
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// function signIn() {
//   const auth = getAuth();

//   const email = prompt("Please enter your email:");
//   const password = prompt("Please enter your password:");

//   if (email && password) {
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         console.log("Signed in as:", userCredential.user.email);
//       })
//       .catch((error) => {
//         console.error("Error signing in:", error);
//       });
//   } else {
//     console.log("Authentication canceled.");
//   }
// }

// document.addEventListener("DOMContentLoaded", signIn);

import {
  getAuth,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

document.getElementById("github-login").addEventListener("click", () => {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      document.getElementById("github-login").style.display = "none";
      document.getElementById("sign-out").style.display = "block";
      document.getElementById("calendar-app").style.display = "block";
      document.getElementById("error-message").textContent = "";
    })
    .catch((error) => {
      console.error("GitHub Authentication Failed:", error);
      document.getElementById("error-message").textContent =
        "Authentication failed. Please try again.";
    });
});

document.getElementById("sign-out").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      document.getElementById("github-login").style.display = "block";
      document.getElementById("sign-out").style.display = "none";
      document.getElementById("calendar-app").style.display = "none";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      // Optionally, display sign-out error message
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in.");
    document.getElementById("github-login").style.display = "none";
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("calendar-app").style.display = "block";
  } else {
    console.log("No user is signed in.");
    document.getElementById("github-login").style.display = "block";
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("calendar-app").style.display = "none";
  }
});

// JavaScript months are 0-indexed

import { database } from "./firebase-init.js";
import {
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar-container");
  const monthYearLabel = document.getElementById("month-year");
  let currentDate = new Date();
  console.log("Now:", currentDate);

  const checkboxLabels = ["Meditate", "Clean", "Dry", "TV8"];

  // Fetch data from Firebase and set checkbox states for a given day
  function checkboxStatesFromFirebase(year, month, day) {
    const dateStr = `${year}-${month}-${day}`;
    const dayRef = ref(database, `CL:2024/${dateStr}`);

    get(dayRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dayData = snapshot.val();
          for (const [label, isChecked] of Object.entries(dayData)) {
            const checkboxId = `checkbox-${dateStr}-${label}`;
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
              checkbox.checked = isChecked;
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data for " + dateStr + ":", error);
      });
  }

  // Updates the state of the checkbox for a given date and label
  function setCheckboxState(date, label) {
    const checkbox = document.getElementById(`checkbox-${date}-${label}`);
    return checkbox ? checkbox.checked : false;
  }

  // Save data function
  function saveData(date) {
    const data = {
      Meditate: setCheckboxState(date, "Meditate"),
      Clean: setCheckboxState(date, "Clean"),
      Dry: setCheckboxState(date, "Dry"),
      TV8: setCheckboxState(date, "TV8"),
    };

    const calendarEntryRef = ref(database, "CL:2024/" + date);

    set(calendarEntryRef, data)
      .then(() => console.log("Data saved for " + date))
      .catch((error) =>
        console.error("Error saving data for " + date + ":", error)
      );
  }

  // Generate calendar
  function generateCalendar(date) {
    calendarContainer.innerHTML = "";
    monthYearLabel.textContent = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // First and last day of the month
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Placeholder divs for days before the first day of the month
    // for (let i = 0; i < firstDay.getDay(); i++) {
    //   calendarContainer.appendChild(document.createElement("div"));
    // }

    // Calendar days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      let dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.id = `day-${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
      // dayDiv.id example: day-2023-12-15
      dayDiv.innerHTML = `<div>${day}</div>`;

      // Checkbox labels
      checkboxLabels.forEach((label) => {
        let checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        // Checkbox inputs
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("day-checkbox");
        checkbox.setAttribute("data-label", label);
        checkbox.id = `checkbox-${date.getFullYear()}-${
          date.getMonth() + 1
        }-${day}-${label}`;

        let labelElement = document.createElement("span");
        labelElement.textContent = label;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(labelElement);
        dayDiv.appendChild(checkboxContainer);
      });

      let saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.onclick = () =>
        saveData(`${date.getFullYear()}-${date.getMonth() + 1}-${day}`);
      dayDiv.appendChild(saveButton);

      calendarContainer.appendChild(dayDiv);

      // Set checkbox states for this day
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      checkboxStatesFromFirebase(year, month, day);
    }
  }

  // Previous and next month buttons
  document.getElementById("prev-month").addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
  });

  //JavaScript's Date object can produce unexpected results when setting a new month. For example, if currentDate is January 31st and you add 1 to the month, JavaScript tries to set the date to February 31st, which doesn't exist. JavaScript then rolls this date over to the next valid date, which would be in March. To prevent this issue, you can adjust the day of currentDate to the first of the month before changing the month. This way, you avoid the edge case of rolling over to a new month with fewer days.
  document.getElementById("next-month").addEventListener("click", function () {
    currentDate.setDate(1); // Set the day to the first of the month
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  });

  generateCalendar(currentDate);
});
