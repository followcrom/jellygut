document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar-container");
  const monthYearLabel = document.getElementById("month-year");
  let currentDate = new Date();

  // Define the labels for the checkboxes
  const checkboxLabels = ["Med", "Clean", "Exercise", "Read"]; // Add more labels as needed

  function generateCalendar(date) {
    calendarContainer.innerHTML = "";
    monthYearLabel.textContent = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarContainer.appendChild(document.createElement("div")); // Placeholder for empty grid cells
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      let dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.innerHTML = `<div>${day}</div>`;

      // Add checkboxes with specific labels
      for (let i = 0; i < checkboxLabels.length; i++) {
        let checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");

        let label = document.createElement("span");
        label.classList.add("checkbox-label");
        label.textContent = checkboxLabels[i];

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${date.getFullYear()}-${
          date.getMonth() + 1
        }-${day}-${i + 1}`;
        checkbox.name = `checkbox-${day}-${i + 1}`;

        checkboxContainer.appendChild(label);
        checkboxContainer.appendChild(checkbox);
        dayDiv.appendChild(checkboxContainer);
      }

      calendarContainer.appendChild(dayDiv);
    }
  }

  document.getElementById("prev-month").addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
  });

  document.getElementById("next-month").addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
  });

  generateCalendar(currentDate);
});
