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
      document.getElementById("messages").textContent = "";
    })
    .catch((error) => {
      console.error("GitHub Authentication Failed:", error);
      document.getElementById("messages").textContent =
        "Authentication failed. Please try again.";
    });
});

document.getElementById("sign-out").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      document.getElementById("github-login").style.display = "block";
      document.getElementById("sign-out").style.display = "none";
      document.getElementById("calendar-app").style.display = "none";
      document.getElementById("messages").textContent = "User signed out.";
      setTimeout(function () {
        document.getElementById("messages").textContent = "";
      }, 2000);
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      document.getElementById("messages").textContent =
        "Error. Please try again.";
      setTimeout(function () {
        document.getElementById("messages").textContent = "";
      }, 2000);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("github-login").style.display = "none";
    document.getElementById("sign-out").style.display = "block";
    document.getElementById("calendar-app").style.display = "block";
    document.getElementById("messages").textContent = "User is signed in.";
    setTimeout(function () {
      document.getElementById("messages").textContent = "";
    }, 2000);
  } else {
    document.getElementById("github-login").style.display = "block";
    document.getElementById("sign-out").style.display = "none";
    document.getElementById("calendar-app").style.display = "none";
    document.getElementById("messages").textContent = "No user is signed in.";
  }
});

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
      .then(() => {
        console.log("Data saved for " + date);
        document.getElementById("messages").textContent = "Data saved.";
        setTimeout(function () {
          document.getElementById("messages").textContent = "";
        }, 2000);
      })
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

    // Calendar days
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
        let checkboxId = `checkbox-${date.getFullYear()}-${
          date.getMonth() + 1
        }-${day}-${label}`;
        checkbox.id = checkboxId;

        let checkboxLabel = document.createElement("label");
        checkboxLabel.setAttribute("for", checkboxId);
        checkboxLabel.textContent = "form label";

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

  document.getElementById("next-month").addEventListener("click", function () {
    currentDate.setDate(1); // Set the day to the first of the month
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  });

  generateCalendar(currentDate);
});
