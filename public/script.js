// ========== DOM ELEMENTS ==========
const form = document.getElementById("feedbackForm");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const messageEl = document.getElementById("message");
const successBox = document.getElementById("successBox");
const previewMeta = document.getElementById("previewMeta");
const previewMessage = document.getElementById("previewMessage");
const switchEl = document.getElementById("switch");
const clearBtn = document.getElementById("clearBtn");

// ========== HELPERS ==========
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updatePreview() {
  const nm = nameEl.value.trim() || "—";
  const em = emailEl.value.trim() || "—";
  const sub = switchEl.classList.contains("on") ? "Yes" : "No";
  previewMeta.textContent = `${nm} — ${em} — Subscribed: ${sub}`;
  previewMessage.textContent =
    messageEl.value.trim() || "Your message will appear here as you type.";
}

// ========== EVENT LISTENERS ==========
// Live preview
[nameEl, emailEl, messageEl].forEach((el) =>
  el.addEventListener("input", updatePreview)
);

// Toggle subscribe switch
function toggleSwitch() {
  const on = switchEl.classList.toggle("on");
  switchEl.setAttribute("aria-checked", on ? "true" : "false");
  updatePreview();
}
switchEl.addEventListener("click", toggleSwitch);
switchEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleSwitch();
  }
});

// Clear button
clearBtn.addEventListener("click", () => {
  form.reset();
  switchEl.classList.remove("on");
  switchEl.setAttribute("aria-checked", "false");
  updatePreview();
  successBox.style.display = "none";
  ["nameError", "emailError", "messageError"].forEach(
    (id) => (document.getElementById(id).textContent = "")
  );
});

// ========== FORM SUBMIT ==========
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear errors
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("messageError").textContent = "";

  // Grab values
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const message = messageEl.value.trim();
  const subscribed = switchEl.classList.contains("on");

  // Validation
  let ok = true;
  if (!name) {
    document.getElementById("nameError").textContent = "Please enter your name.";
    ok = false;
  }
  if (!email || !validEmail(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email.";
    ok = false;
  }
  if (!message) {
    document.getElementById("messageError").textContent = "Please type a message.";
    ok = false;
  }
  if (!ok) return;

  try {
    const res = await fetch("http://localhost:3000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, subscribed }),
    });

    if (res.ok) {
      successBox.style.display = "block";
      successBox.textContent = "Thanks — your feedback was saved!";
      e.target.reset();
      switchEl.classList.remove("on");
      switchEl.setAttribute("aria-checked", "false");
      updatePreview();

      setTimeout(() => (successBox.style.display = "none"), 3000);
    } else {
      alert("Failed to submit feedback");
    }
  } catch (err) {
    alert("Error submitting feedback: " + err.message);
  }
});

// Initialize preview on page load
updatePreview();
