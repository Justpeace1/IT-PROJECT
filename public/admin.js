async function loadFeedbacks() {
  const res = await fetch("/api/feedbacks");
  let feedbacks = await res.json();
  const tbody = document.querySelector("#feedbackTable tbody");
  tbody.innerHTML = "";

  if (feedbacks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No feedback yet</td></tr>`;
    return;
  }

  // Newest first
  feedbacks.sort((a, b) => new Date(b.time) - new Date(a.time));

  feedbacks.forEach(fb => {
    const row = document.createElement("tr");
    row.className = fb.read ? "read" : "unread";

    row.innerHTML = `
      <td>${fb.name}</td>
      <td>${fb.email}</td>
      <td>${fb.message.slice(0, 40)}${fb.message.length > 40 ? "..." : ""}</td>
      <td>${fb.subscribed ? "Yes" : "No"}</td>
      <td>${fb.time ? new Date(fb.time).toLocaleString() : "—"}</td>
      <td class="actions">
        <button class="delete-btn" onclick="deleteFeedback('${fb.id}')">Delete</button>
      </td>
    `;

    // ✅ Click row to open full message
    row.addEventListener("click", () => openMessage(fb.id));
    tbody.appendChild(row);
  });
}

async function openMessage(id) {
  const res = await fetch("/api/feedbacks");
  const feedbacks = await res.json();
  const fb = feedbacks.find(f => f.id === id);
  if (!fb) return;

  document.getElementById("modalName").textContent = fb.name;
  document.getElementById("modalEmail").textContent = fb.email;
  document.getElementById("modalSubscribed").textContent = fb.subscribed ? "Yes" : "No";
  document.getElementById("modalTime").textContent = fb.time ? new Date(fb.time).toLocaleString() : "—";
  document.getElementById("modalMessage").textContent = fb.message;

  // Show modal
  document.getElementById("messageModal").style.display = "flex";

  // ✅ Mark as read automatically
  if (!fb.read) {
    await fetch("/api/feedbacks/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    loadFeedbacks();
  }
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("messageModal").style.display = "none";
});

async function deleteFeedback(id) {
  if (!confirm("Delete this feedback?")) return;
  await fetch("/api/feedbacks/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadFeedbacks();
}

loadFeedbacks();
