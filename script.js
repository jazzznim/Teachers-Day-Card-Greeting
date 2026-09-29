const flipCard = document.getElementById("flipCard");
const flipButton = document.getElementById("flipButton");
const teacherInput = document.getElementById("teacherInput");
const senderInput = document.getElementById("senderInput");
const messageInput = document.getElementById("messageInput");
const frontTeacher = document.getElementById("frontTeacher");
const backTeacher = document.getElementById("backTeacher");
const cardSender = document.getElementById("cardSender");
const cardMessage = document.getElementById("cardMessage");
const photoInput = document.getElementById("photoInput");
const cardPhoto = document.getElementById("cardPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const audioInput = document.getElementById("audioInput");
const audioPlayer = document.getElementById("audioPlayer");
const audioElement = document.getElementById("audioElement");
const audioToggle = document.getElementById("audioToggle");
const audioName = document.getElementById("audioName");
const audioProgress = document.getElementById("audioProgress");
const colorInput = document.getElementById("colorInput");
const accentInput = document.getElementById("accentInput");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");

function flip() {
  flipCard.classList.toggle("flipped");
}

flipCard.addEventListener("click", (event) => {
  if (!event.target.closest("button")) flip();
});

flipButton.addEventListener("click", (event) => {
  event.stopPropagation();
  flip();
});

flipCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flip();
  }
});

function updateText() {
  const teacher = teacherInput.value.trim() || "An amazing teacher";
  const sender = senderInput.value.trim() || "Your Student";
  const message = messageInput.value.trim() || "Thank you for everything you do.";

  frontTeacher.textContent = `To ${teacher}`;
  backTeacher.textContent = `Dear ${teacher},`;
  cardSender.textContent = sender;
  cardMessage.textContent = message;
}

[teacherInput, senderInput, messageInput].forEach(input => {
  input.addEventListener("input", updateText);
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = event => {
    cardPhoto.src = event.target.result;
    cardPhoto.hidden = false;
    photoPlaceholder.hidden = true;
  };
  reader.readAsDataURL(file);
});

audioInput.addEventListener("change", () => {
  const file = audioInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    alert("Please choose an audio file.");
    audioInput.value = "";
    return;
  }

  audioElement.src = URL.createObjectURL(file);
  audioName.textContent = file.name;
  audioPlayer.hidden = false;
  audioElement.load();
  audioToggle.textContent = "▶";
});

audioToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!audioElement.src) return;

  if (audioElement.paused) {
    audioElement.play();
    audioToggle.textContent = "❚❚";
  } else {
    audioElement.pause();
    audioToggle.textContent = "▶";
  }
});

audioElement.addEventListener("timeupdate", () => {
  const percent = audioElement.duration
    ? (audioElement.currentTime / audioElement.duration) * 100
    : 0;
  audioProgress.style.width = `${percent}%`;
});

audioElement.addEventListener("ended", () => {
  audioToggle.textContent = "▶";
  audioProgress.style.width = "0%";
});

function setColors() {
  document.documentElement.style.setProperty("--green", colorInput.value);
  document.documentElement.style.setProperty("--accent", accentInput.value);
  document.documentElement.style.setProperty("--gold", accentInput.value);
}

[colorInput, accentInput].forEach(input => input.addEventListener("input", setColors));

saveButton.addEventListener("click", () => {
  const settings = {
    teacher: teacherInput.value,
    sender: senderInput.value,
    message: messageInput.value,
    green: colorInput.value,
    accent: accentInput.value
  };

  localStorage.setItem("teachersDayCardSettings", JSON.stringify(settings));

  saveButton.textContent = "✓ Settings Saved";
  setTimeout(() => {
    saveButton.textContent = "Save Card Settings";
  }, 1800);
});

function loadSettings() {
  const saved = localStorage.getItem("teachersDayCardSettings");
  if (!saved) return;

  try {
    const settings = JSON.parse(saved);
    teacherInput.value = settings.teacher || teacherInput.value;
    senderInput.value = settings.sender || senderInput.value;
    messageInput.value = settings.message || messageInput.value;
    colorInput.value = settings.green || colorInput.value;
    accentInput.value = settings.accent || accentInput.value;
    updateText();
    setColors();
  } catch {
    localStorage.removeItem("teachersDayCardSettings");
  }
}

resetButton.addEventListener("click", () => {
  localStorage.removeItem("teachersDayCardSettings");
  teacherInput.value = "An amazing teacher";
  senderInput.value = "Your Student";
  messageInput.value = "Thank you for your patience, guidance, and kindness. Your lessons inspire us to learn, grow, and believe in ourselves. We are grateful for everything you do.";
  colorInput.value = "#174c43";
  accentInput.value = "#d9a441";

  cardPhoto.hidden = true;
  photoPlaceholder.hidden = false;
  cardPhoto.removeAttribute("src");

  audioElement.pause();
  audioElement.removeAttribute("src");
  audioPlayer.hidden = true;
  audioInput.value = "";
  photoInput.value = "";

  updateText();
  setColors();
});

loadSettings();
updateText();
setColors();
