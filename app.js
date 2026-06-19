const fallbackData = window.USIM_CALENDAR_DATA || null;

const i18n = {
  ms: {
    centre: "Pusat Tamhidi",
    appTitle: "Takwim Akademik USIM",
    sessionText: "Sesi Akademik 2026/2027",
    controls: "Kawalan",
    reset: "Reset",
    session: "Sesi Akademik",
    semester: "Semester",
    category: "Kategori",
    nextEvent: "Acara Seterusnya",
    daysRemaining: "hari lagi",
    print: "Cetak",
    printFull: "Tahun Penuh",
    calendar: "Kalendar",
    agenda: "Agenda",
    timeline: "Timeline",
    table: "Jadual",
    official: "Rasmi",
    monthView: "Paparan Bulanan",
    today: "Hari ini",
    timelineTitle: "Timeline / Gantt",
    activity: "Aktiviti",
    cat: "Kategori",
    date: "Tarikh",
    duration: "Tempoh",
    remainingDays: "Baki hari sesi",
    totalEvents: "Aktiviti aktif",
    lectureDays: "Hari kuliah",
    examDays: "Hari peperiksaan",
    upcomingExam: "Peperiksaan terdekat",
    noUpcoming: "Tiada acara akan datang"
  },
  en: {
    centre: "Tamhidi Centre",
    appTitle: "USIM Academic Calendar",
    sessionText: "Academic Session 2026/2027",
    controls: "Controls",
    reset: "Reset",
    session: "Academic Session",
    semester: "Semester",
    category: "Category",
    nextEvent: "Next Event",
    daysRemaining: "days remaining",
    print: "Print",
    printFull: "Full Year",
    calendar: "Calendar",
    agenda: "Agenda",
    timeline: "Timeline",
    table: "Table",
    official: "Official",
    monthView: "Month View",
    today: "Today",
    timelineTitle: "Timeline / Gantt",
    activity: "Activity",
    cat: "Category",
    date: "Date",
    duration: "Duration",
    remainingDays: "Session days left",
    totalEvents: "Active events",
    lectureDays: "Lecture days",
    examDays: "Exam days",
    upcomingExam: "Upcoming exam",
    noUpcoming: "No upcoming events"
  }
};

const categories = {
  registration: { ms: "Pendaftaran", en: "Registration", color: "#2f6f90" },
  lecture: { ms: "Kuliah", en: "Lecture", color: "#006c45" },
  revision: { ms: "Ulang Kaji", en: "Revision", color: "#7c4d00" },
  exam: { ms: "Peperiksaan", en: "Exam", color: "#b42318" },
  semesterBreak: { ms: "Cuti Semester", en: "Semester Break", color: "#6b3fa0" },
  publicHoliday: { ms: "Cuti Umum", en: "Public Holiday", color: "#c2410c" }
};

const state = {
  data: { sessions: [], events: [] },
  lang: localStorage.getItem("lang") || "ms",
  theme: localStorage.getItem("theme") || "light",
  session: "2026-2027",
  semesters: new Set(["1", "2"]),
  categories: new Set(Object.keys(categories)),
  month: new Date(2026, 5, 1),
  printSemester: "all"
};

const $ = (selector) => document.querySelector(selector);

function locale() {
  return state.lang === "ms" ? "ms-MY" : "en-GB";
}

function fmtDate() {
  return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short", year: "numeric" });
}

function fmtMonth() {
  return new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" });
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysInclusive(event) {
  return Math.round((parseDate(event.end) - parseDate(event.start)) / 86400000) + 1;
}

function title(event) {
  return event.title[state.lang] || event.title.ms;
}

function categoryLabel(category) {
  return categories[category][state.lang] || categories[category].ms;
}

function dateRange(event) {
  const start = parseDate(event.start);
  const end = parseDate(event.end);
  return sameDay(start, end) ? fmtDate().format(start) : `${fmtDate().format(start)} - ${fmtDate().format(end)}`;
}

function activeEvents() {
  return state.data.events
    .filter((event) => event.session === state.session)
    .filter((event) => state.semesters.has(String(event.semester)))
    .filter((event) => state.categories.has(event.category))
    .filter((event) => state.printSemester === "all" || String(event.semester) === state.printSemester)
    .sort((a, b) => parseDate(a.start) - parseDate(b.start));
}

async function loadData() {
  if (fallbackData) {
    state.data = fallbackData;
  } else {
    const response = await fetch("events.json", { cache: "no-store" });
    state.data = await response.json();
  }
  state.session = state.data.sessions[0]?.id || "2026-2027";
}

function renderI18n() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = i18n[state.lang][el.dataset.i18n] || el.textContent;
  });
  $("#langBtn").textContent = state.lang === "ms" ? "EN" : "BM";
}

function renderControls() {
  $("#sessionSelect").innerHTML = state.data.sessions.map((session) => `<option value="${session.id}">${session.label}</option>`).join("");
  $("#sessionSelect").value = state.session;
  $("#categoryFilters").innerHTML = Object.entries(categories).map(([key, meta]) => `
    <label>
      <input type="checkbox" class="category-filter" value="${key}" ${state.categories.has(key) ? "checked" : ""} />
      <span class="swatch" style="background:${meta.color}"></span>
      ${meta[state.lang]}
    </label>
  `).join("");
}

function renderDashboard(events) {
  const session = state.data.sessions.find((item) => item.id === state.session);
  const now = new Date();
  const remaining = session ? Math.max(0, Math.ceil((parseDate(session.end) - now) / 86400000)) : 0;
  const lectureDays = events.filter((event) => event.category === "lecture").reduce((sum, event) => sum + daysInclusive(event), 0);
  const examDays = events.filter((event) => event.category === "exam").reduce((sum, event) => sum + daysInclusive(event), 0);
  const nextExam = events.find((event) => event.category === "exam" && parseDate(event.end) >= now);
  const cards = [
    [remaining, i18n[state.lang].remainingDays],
    [events.length, i18n[state.lang].totalEvents],
    [lectureDays, i18n[state.lang].lectureDays],
    [examDays, i18n[state.lang].examDays],
    [nextExam ? fmtDate().format(parseDate(nextExam.start)) : "-", i18n[state.lang].upcomingExam]
  ];
  $("#dashboard").innerHTML = cards.map(([value, label]) => `<article class="metric"><strong>${value}</strong><span>${label}</span></article>`).join("");
}

function renderCountdown(events) {
  const now = new Date();
  const next = events.find((event) => parseDate(event.end) >= now);
  $("#nextTitle").textContent = next ? title(next) : i18n[state.lang].noUpcoming;
  $("#nextDate").textContent = next ? dateRange(next) : "-";
  $("#countdownDays").textContent = next ? Math.max(0, Math.ceil((parseDate(next.start) - now) / 86400000)) : 0;
}

function eventsForDay(events, day) {
  return events.filter((event) => parseDate(event.start) <= day && parseDate(event.end) >= day);
}

function renderCalendar(events) {
  $("#monthLabel").textContent = fmtMonth().format(state.month);
  const start = new Date(state.month.getFullYear(), state.month.getMonth(), 1);
  const end = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 0);
  const offset = (start.getDay() + 6) % 7;
  const gridStart = addDays(start, -offset);
  const cells = Math.ceil((offset + end.getDate()) / 7) * 7;
  const today = new Date();
  const html = [];

  for (let index = 0; index < cells; index += 1) {
    const day = addDays(gridStart, index);
    const matches = eventsForDay(events, day);
    html.push(`<article class="day-cell ${day.getMonth() !== state.month.getMonth() ? "muted" : ""} ${sameDay(day, today) ? "today" : ""}">
      <div class="day-number">${day.getDate()}</div>
      <div class="chips">
        ${matches.slice(0, 3).map((event) => `<button class="chip ${event.category}" data-id="${event.id}" type="button">${title(event)}</button>`).join("")}
        ${matches.length > 3 ? `<span class="more">+${matches.length - 3}</span>` : ""}
      </div>
    </article>`);
  }

  $("#calendarGrid").innerHTML = html.join("");
  document.querySelectorAll(".chip").forEach((chip) => chip.addEventListener("click", () => openEvent(chip.dataset.id)));
}

function renderAgenda(events) {
  $("#agendaList").innerHTML = events.map((event) => `<article class="agenda-item" style="border-left-color:${categories[event.category].color}">
    <div><strong>${dateRange(event)}</strong><span>Semester ${event.semester}</span></div>
    <div><strong>${title(event)}</strong><span>${categoryLabel(event.category)} - ${daysInclusive(event)} ${state.lang === "ms" ? "hari" : "days"}</span></div>
  </article>`).join("");
}

function renderTimeline(events) {
  const start = parseDate("2026-06-01");
  const end = parseDate("2027-06-30");
  const total = end - start;
  $("#timelineRange").textContent = "Jun 2026 - Jun 2027";
  $("#timelineScale").innerHTML = ["Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis", "Jan", "Feb", "Mac", "Apr", "Mei"].map((month) => `<span>${month}</span>`).join("");
  $("#timelineList").innerHTML = events.map((event) => {
    const left = Math.max(0, ((parseDate(event.start) - start) / total) * 100);
    const width = Math.max(0.7, ((parseDate(event.end) - parseDate(event.start) + 86400000) / total) * 100);
    return `<div class="timeline-row">
      <div class="timeline-label"><strong>${title(event)}</strong><span>${dateRange(event)} - ${categoryLabel(event.category)}</span></div>
      <div class="timeline-track"><button class="timeline-bar" data-id="${event.id}" style="left:${left}%;width:${width}%;background:${categories[event.category].color}" type="button"></button></div>
    </div>`;
  }).join("");
  document.querySelectorAll(".timeline-bar").forEach((bar) => bar.addEventListener("click", () => openEvent(bar.dataset.id)));
}

function renderTable(events) {
  $("#eventTable").innerHTML = events.map((event) => `<tr>
    <td><strong>${title(event)}</strong></td>
    <td><span class="badge">${categoryLabel(event.category)}</span></td>
    <td>${event.semester}</td>
    <td>${dateRange(event)}</td>
    <td>${daysInclusive(event)} ${state.lang === "ms" ? "hari" : "days"}</td>
  </tr>`).join("");
}

function durationText(event) {
  if (["s1-lecture-1", "s1-lecture-2", "s2-lecture-1", "s2-lecture-2"].includes(event.id)) return "9 minggu";
  if (["s1-break", "s2-break"].includes(event.id)) return "4 minggu";
  if (["s1-mid-break", "s2-mid-break", "s1-revision", "s2-revision", "s1-exam", "s2-exam"].includes(event.id)) return "1 minggu";
  return `${daysInclusive(event)} hari`;
}

function renderOfficialDocument() {
  const academic = state.data.events.filter((event) => event.session === state.session && event.category !== "publicHoliday");
  const holidays = state.data.events.filter((event) => event.session === state.session && event.category === "publicHoliday");
  const rows = (semester) => academic.filter((event) => event.semester === semester).map((event) => `
    <tr>
      <td>${event.title.ms}</td>
      <td>${dateRange(event)}</td>
      <td>${durationText(event)}</td>
    </tr>
  `).join("");

  $("#officialDocument").innerHTML = `
    <div class="official-title">
      <h2>TAKWIM AKADEMIK<br />PUSAT TAMHIDI<br />UNIVERSITI SAINS ISLAM MALAYSIA<br />SESI AKADEMIK 2026/2027</h2>
    </div>
    <table class="official-table">
      <thead>
        <tr><th rowspan="2">AKTIVITI</th><th colspan="2">SEMESTER I</th></tr>
        <tr><th>TARIKH</th><th>TEMPOH</th></tr>
      </thead>
      <tbody>${rows(1)}</tbody>
    </table>
    <table class="official-table">
      <thead>
        <tr><th rowspan="2">AKTIVITI</th><th colspan="2">SEMESTER II</th></tr>
        <tr><th>TARIKH</th><th>TEMPOH</th></tr>
      </thead>
      <tbody>${rows(2)}</tbody>
    </table>
    <p class="official-note">* Tertakluk kepada pindaan</p>
    <div class="holiday-list">
      <strong>Hari Cuti / Kelepasan Am:</strong>
      <ul>${holidays.map((event) => `<li>${event.title.ms}: ${dateRange(event)}</li>`).join("")}</ul>
    </div>
  `;
}

function renderAll() {
  renderI18n();
  const events = activeEvents();
  renderDashboard(events);
  renderCountdown(events);
  renderCalendar(events);
  renderAgenda(events);
  renderTimeline(events);
  renderTable(events);
  renderOfficialDocument();
}

function openEvent(id) {
  const event = state.data.events.find((item) => item.id === id);
  if (!event) return;
  $("#dialogMeta").textContent = `${categoryLabel(event.category)} - Semester ${event.semester}`;
  $("#dialogTitle").textContent = title(event);
  $("#dialogDate").textContent = `${dateRange(event)} - ${daysInclusive(event)} ${state.lang === "ms" ? "hari" : "days"}`;
  $("#eventDialog").showModal();
}

function icsDate(value, addEnd = false) {
  const date = addEnd ? addDays(parseDate(value), 1) : parseDate(value);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function exportIcs() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//USIM//Tamhidi Calendar//MS", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:USIM Tamhidi Calendar"];
  activeEvents().forEach((event) => {
    lines.push("BEGIN:VEVENT", `UID:${event.id}@usim-takwim-pro`, `SUMMARY:${title(event).replaceAll(",", "\\,")}`, `DTSTART;VALUE=DATE:${icsDate(event.start)}`, `DTEND;VALUE=DATE:${icsDate(event.end, true)}`, `CATEGORIES:${categoryLabel(event.category)}`, `DESCRIPTION:Semester ${event.semester} - ${categoryLabel(event.category)}`, "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `usim-tamhidi-${state.session}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function wire() {
  $("#sessionSelect").addEventListener("change", (event) => {
    state.session = event.target.value;
    renderAll();
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches(".semester-filter")) {
      event.target.checked ? state.semesters.add(event.target.value) : state.semesters.delete(event.target.value);
      renderAll();
    }
    if (event.target.matches(".category-filter")) {
      event.target.checked ? state.categories.add(event.target.value) : state.categories.delete(event.target.value);
      renderAll();
    }
  });

  $("#resetBtn").addEventListener("click", () => {
    state.semesters = new Set(["1", "2"]);
    state.categories = new Set(Object.keys(categories));
    state.printSemester = "all";
    document.querySelectorAll("input[type='checkbox']").forEach((input) => { input.checked = true; });
    renderControls();
    renderAll();
  });

  $("#prevMonth").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    renderCalendar(activeEvents());
  });

  $("#nextMonth").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    renderCalendar(activeEvents());
  });

  $("#todayBtn").addEventListener("click", () => {
    const now = new Date();
    state.month = new Date(now.getFullYear(), now.getMonth(), 1);
    renderCalendar(activeEvents());
  });

  document.querySelectorAll(".tab[data-view]").forEach((tab) => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab[data-view], .view").forEach((el) => el.classList.remove("active"));
    tab.classList.add("active");
    $(`#${tab.dataset.view}View`).classList.add("active");
  }));

  $("#langBtn").addEventListener("click", () => {
    state.lang = state.lang === "ms" ? "en" : "ms";
    localStorage.setItem("lang", state.lang);
    renderControls();
    renderAll();
  });

  $("#themeBtn").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.theme);
    document.documentElement.dataset.theme = state.theme;
  });

  $("#exportBtn").addEventListener("click", exportIcs);
  $("#installBtn").addEventListener("click", async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt = null;
    }
  });

  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => {
    state.printSemester = button.dataset.print;
    renderAll();
    window.print();
    state.printSemester = "all";
    renderAll();
  }));

  $("#closeDialog").addEventListener("click", () => $("#eventDialog").close());
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  window.deferredPrompt = event;
  $("#installBtn").disabled = false;
});

async function boot() {
  document.documentElement.dataset.theme = state.theme;
  $("#installBtn").disabled = true;
  await loadData();
  renderControls();
  wire();
  renderAll();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(console.warn);
}

boot().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<div class="panel" style="margin:1rem">Unable to load calendar data. Serve this folder through a local web server or deploy it to Vercel.</div>`);
});
