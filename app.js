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
    nextClass: "Kelas Seterusnya",
    classCountdownLabel: "ke kelas",
    reminderBefore: "Reminder sebelum kelas",
    enableNotifications: "Aktifkan notifikasi",
    todayClasses: "Kelas Hari Ini",
    noClassToday: "Tiada kelas hari ini",
    notificationReady: "Notifikasi aktif semasa app dibuka",
    notificationDenied: "Notifikasi disekat browser",
    daysRemaining: "hari lagi",
    print: "Cetak",
    printFull: "Tahun Penuh",
    calendar: "Kalendar",
    planner: "Planner",
    agenda: "Agenda",
    classes: "Kelas",
    classSchedule: "Jadual Kelas",
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
    , studentProfile: "Profil Pelajar", save: "Simpan", semesterProgress: "Progress Semester", taskTracker: "Assignment & Exam Tracker", add: "Tambah", weeklyActions: "Apa Perlu Buat Minggu Ini?", assistant: "Assistant", graduation: "Graduation Journey"
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
    nextClass: "Next Class",
    classCountdownLabel: "to class",
    reminderBefore: "Reminder before class",
    enableNotifications: "Enable notifications",
    todayClasses: "Today's Classes",
    noClassToday: "No class today",
    notificationReady: "Notifications active while app is open",
    notificationDenied: "Notifications blocked by browser",
    daysRemaining: "days remaining",
    print: "Print",
    printFull: "Full Year",
    calendar: "Calendar",
    planner: "Planner",
    agenda: "Agenda",
    classes: "Classes",
    classSchedule: "Class Schedule",
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
    , studentProfile: "Student Profile", save: "Save", semesterProgress: "Semester Progress", taskTracker: "Assignment & Exam Tracker", add: "Add", weeklyActions: "What Should I Do This Week?", assistant: "Assistant", graduation: "Graduation Journey"
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
  classSchedule: window.USIM_CLASS_SCHEDULE || { student: {}, teachingWeeks: [], entries: [] },
  lang: localStorage.getItem("lang") || "ms",
  theme: localStorage.getItem("theme") || "light",
  session: "2026-2027",
  semesters: new Set(["1", "2"]),
  categories: new Set(Object.keys(categories)),
  month: new Date(2026, 5, 1),
  printSemester: "all",
  reminderMinutes: Number(localStorage.getItem("classReminderMinutes") || 15),
  profile: JSON.parse(localStorage.getItem("studentProfile") || "null") || {
    name: "Rayyan Rizqi",
    faculty: "FPQS",
    programme: "Tamhidi of Syariah and Law",
    intake: 2026,
    semester: 1
  },
  tasks: JSON.parse(localStorage.getItem("studentTasks") || "[]"),
  checklist: JSON.parse(localStorage.getItem("tamhidiChecklist") || "null") || {},
  attendance: JSON.parse(localStorage.getItem("attendanceTracker") || "null") || [
    { id: "att-tsu0134", subject: "TSU0134 Malaysian Legal System", attended: 0, total: 0 },
    { id: "att-tsu0124", subject: "TSU0124 Islamic Jurisprudence", attended: 0, total: 0 },
    { id: "att-tsu0114", subject: "TSU0114 Islamic Legislation", attended: 0, total: 0 }
  ],
  budget: JSON.parse(localStorage.getItem("studentBudget") || "null") || { allowance: 0, food: 0, transport: 0, books: 0 },
  notificationTimers: []
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

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function combineDateTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const copy = new Date(date);
  copy.setHours(hours, minutes, 0, 0);
  return copy;
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
  if (!window.USIM_CLASS_SCHEDULE) {
    const classResponse = await fetch("class-schedule.json", { cache: "no-store" });
    state.classSchedule = await classResponse.json();
  }
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

function dayLabel(day) {
  const labels = {
    Monday: state.lang === "ms" ? "Isnin" : "Monday",
    Tuesday: state.lang === "ms" ? "Selasa" : "Tuesday",
    Wednesday: state.lang === "ms" ? "Rabu" : "Wednesday",
    Thursday: state.lang === "ms" ? "Khamis" : "Thursday",
    Friday: state.lang === "ms" ? "Jumaat" : "Friday"
  };
  return labels[day] || "-";
}

function timeText(entry) {
  return entry.start && entry.end ? `${entry.start} - ${entry.end}` : "-";
}

function scheduledClasses() {
  return state.classSchedule.entries.filter((entry) => entry.day && entry.start && entry.end);
}

function classOccurrences() {
  const occurrences = [];
  scheduledClasses().forEach((entry) => {
    state.classSchedule.teachingWeeks.forEach((range) => {
      let day = firstDayInRange(range.start, entry.day);
      const end = parseDate(range.end);
      while (day <= end) {
        occurrences.push({
          ...entry,
          date: new Date(day),
          startsAt: combineDateTime(day, entry.start),
          endsAt: combineDateTime(day, entry.end)
        });
        day = addDays(day, 7);
      }
    });
  });
  return occurrences.sort((a, b) => a.startsAt - b.startsAt);
}

function nextClassOccurrence(now = new Date()) {
  return classOccurrences().find((occurrence) => occurrence.endsAt >= now);
}

function formatClassCountdown(occurrence, now = new Date()) {
  if (!occurrence) return "-";
  const diff = occurrence.startsAt - now;
  if (diff <= 0 && occurrence.endsAt >= now) return state.lang === "ms" ? "Sedang berlangsung" : "In progress";
  if (diff < 0) return state.lang === "ms" ? "Selesai" : "Done";
  const minutes = Math.ceil(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}j`;
  if (hours > 0) return `${hours}j ${mins}m`;
  return `${mins}m`;
}

function classStatus(occurrence, now = new Date()) {
  if (occurrence.startsAt <= now && occurrence.endsAt >= now) return "now";
  if (occurrence.endsAt < now) return "past";
  return "upcoming";
}

function renderClassSchedule() {
  const schedule = state.classSchedule;
  const scheduled = scheduledClasses();
  const courses = new Set(schedule.entries.map((entry) => entry.courseCode));
  const now = new Date();
  const next = nextClassOccurrence(now);
  const todays = classOccurrences().filter((occurrence) => dateKey(occurrence.startsAt) === dateKey(now));

  $("#nextClassTitle").textContent = next ? `${next.courseCode} ${next.type}` : "-";
  $("#nextClassMeta").textContent = next ? `${dayLabel(next.day)} ${timeText(next)} - ${next.venue}` : "-";
  $("#nextClassCountdown").textContent = formatClassCountdown(next, now);

  $("#todayClasses").innerHTML = `
    <div class="section-head compact-head"><h2>${i18n[state.lang].todayClasses}</h2><span>${todays.length}</span></div>
    <div class="today-list">
      ${todays.length ? todays.map((entry) => {
        const status = classStatus(entry, now);
        return `<article class="today-class ${status}">
          <strong>${entry.start} ${entry.courseCode}</strong>
          <span>${entry.courseName}</span>
          <small>${entry.venue} - ${status === "past" ? "past/missed" : status === "now" ? "now" : "upcoming"}</small>
        </article>`;
      }).join("") : `<p class="muted">${i18n[state.lang].noClassToday}</p>`}
    </div>
  `;

  $("#classProfile").innerHTML = `
    <article><strong>${schedule.student.name || "-"}</strong><span>${schedule.student.matricNumber || "-"}</span></article>
    <article><strong>${schedule.student.programme || "-"}</strong><span>${schedule.student.academicSession || "-"}</span></article>
    <article><strong>${scheduled.length}</strong><span>Slot mingguan</span></article>
    <article><strong>${courses.size}</strong><span>Kursus</span></article>
  `;

  const grouped = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
    const entries = scheduled.filter((entry) => entry.day === day);
    return `<section class="class-day">
      <h3>${dayLabel(day)}</h3>
      ${entries.map((entry) => `<button class="class-card" type="button" data-class-no="${entry.no}">
        <strong>${entry.start} ${entry.courseCode}</strong>
        <span>${entry.courseName}</span>
        <small>${entry.type} - ${entry.venue}</small>
      </button>`).join("")}
    </section>`;
  }).join("");
  $("#classWeek").innerHTML = grouped;

  $("#classTable").innerHTML = schedule.entries.map((entry) => `<tr>
    <td>${entry.no}</td>
    <td>${dayLabel(entry.day)}</td>
    <td>${timeText(entry)}</td>
    <td><strong>${entry.courseCode}</strong></td>
    <td>${entry.courseName}</td>
    <td>${entry.type}</td>
    <td>${entry.group}</td>
    <td>${entry.venue || "-"}</td>
    <td>${entry.lecturer || "-"}</td>
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

function saveProfile() {
  state.profile = {
    name: $("#profileName").value.trim() || "Rayyan Rizqi",
    faculty: $("#profileFaculty").value,
    programme: $("#profileProgramme").value.trim() || "Tamhidi of Syariah and Law",
    intake: Number($("#profileIntake").value || 2026),
    semester: Number($("#profileSemester").value || 1)
  };
  localStorage.setItem("studentProfile", JSON.stringify(state.profile));
  renderPlanner();
}

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(state.tasks));
}

function semesterBounds() {
  const lectures = state.data.events.filter((event) => event.session === state.session && event.semester === 1 && event.category === "lecture");
  return {
    start: parseDate(lectures[0]?.start || "2026-06-22"),
    end: parseDate(lectures[lectures.length - 1]?.end || "2026-10-31")
  };
}

function daysUntil(date) {
  return Math.ceil((date - new Date()) / 86400000);
}

function renderPlanner() {
  if (!$("#plannerView")) return;
  $("#profileName").value = state.profile.name;
  $("#profileFaculty").value = state.profile.faculty;
  $("#profileProgramme").value = state.profile.programme;
  $("#profileIntake").value = state.profile.intake;
  $("#profileSemester").value = state.profile.semester;

  const bounds = semesterBounds();
  const now = new Date();
  const total = Math.max(1, bounds.end - bounds.start);
  const progress = Math.min(100, Math.max(0, Math.round(((now - bounds.start) / total) * 100)));
  const week = Math.min(14, Math.max(1, Math.ceil(((now - bounds.start) / 86400000 + 1) / 7)));
  const nextExam = state.data.events.find((event) => event.category === "exam" && parseDate(event.end) >= now);
  const pendingTasks = state.tasks.filter((task) => !task.done).sort((a, b) => new Date(a.due) - new Date(b.due));
  const weekTasks = pendingTasks.filter((task) => daysUntil(new Date(task.due)) <= 7);
  const remainingHolidays = state.data.events.filter((event) => event.category === "publicHoliday" && parseDate(event.start) >= now).length;

  $("#semesterWeek").textContent = `Week ${week}/14`;
  $("#semesterProgressBar").style.width = `${progress}%`;
  $("#semesterProgressBar").textContent = `${progress}%`;
  $("#plannerMetrics").innerHTML = [
    [`${Math.max(0, daysUntil(bounds.end))}`, "days until lectures end"],
    [`${nextExam ? Math.max(0, daysUntil(parseDate(nextExam.start))) : "-"}`, "days until final exam"],
    [`${pendingTasks.length}`, "pending tasks"],
    [`${remainingHolidays}`, "holidays remaining"]
  ].map(([value, label]) => `<article><strong>${value}</strong><span>${label}</span></article>`).join("");

  $("#taskList").innerHTML = pendingTasks.length ? pendingTasks.map((task) => {
    const left = daysUntil(new Date(task.due));
    const urgency = left < 0 ? "late" : left <= 3 ? "soon" : "normal";
    return `<article class="task-item ${urgency}">
      <button class="task-check" data-task-id="${task.id}" type="button">OK</button>
      <div><strong>${task.title}</strong><span>${task.type} - ${new Date(task.due).toLocaleString(locale())} - ${left < 0 ? Math.abs(left) + " days late" : left + " days left"}</span></div>
    </article>`;
  }).join("") : `<p class="muted">No pending assignments or exams yet.</p>`;

  const nextClass = nextClassOccurrence(now);
  const nextCalendarEvent = activeEvents().find((event) => parseDate(event.end) >= now);
  const actions = [
    nextClass ? `Attend ${nextClass.courseCode} at ${nextClass.start}, ${nextClass.venue}` : "Review your class timetable",
    nextCalendarEvent ? `Check upcoming academic event: ${title(nextCalendarEvent)}` : "No academic event due soon",
    weekTasks.length ? `Finish ${weekTasks[0].title} (${daysUntil(new Date(weekTasks[0].due))} days left)` : "Add your assignment or quiz deadlines",
    nextExam ? `Start revision for finals (${Math.max(0, daysUntil(parseDate(nextExam.start)))} days left)` : "Keep lecture notes updated"
  ];
  $("#weeklyActions").innerHTML = actions.map((action) => `<label class="action-item"><input type="checkbox" /> ${action}</label>`).join("");

  const year = Math.max(1, Math.ceil(state.profile.semester / 2));
  $("#graduationJourney").innerHTML = [1, 2, 3, 4].map((item) => `<span class="${item < year ? "done" : item === year ? "current" : ""}">Year ${item}</span>`).join("") +
    `<p class="muted">Expected graduation: July ${Number(state.profile.intake) + 4}</p>`;

  document.querySelectorAll(".task-check").forEach((button) => button.addEventListener("click", () => {
    const task = state.tasks.find((item) => item.id === button.dataset.taskId);
    if (task) task.done = true;
    saveTasks();
    renderPlanner();
  }));
}

function addTask(event) {
  event.preventDefault();
  state.tasks.push({
    id: `task-${Date.now()}`,
    title: $("#taskTitle").value.trim(),
    type: $("#taskType").value,
    due: $("#taskDue").value,
    done: false
  });
  saveTasks();
  $("#taskForm").reset();
  renderPlanner();
}

function answerAssistant() {
  const question = $("#assistantQuestion").value.toLowerCase();
  const now = new Date();
  const nextClass = nextClassOccurrence(now);
  const nextBreak = state.data.events.find((event) => event.category === "semesterBreak" && parseDate(event.end) >= now);
  const nextExam = state.data.events.find((event) => event.category === "exam" && parseDate(event.end) >= now);
  const holidays = state.data.events.filter((event) => event.category === "publicHoliday" && event.semester === 1);
  let answer = "Try asking: next class, semester break, finals, holidays, or pending tasks.";
  if (question.includes("next class") || question.includes("kelas")) answer = nextClass ? `${nextClass.courseCode} ${nextClass.type}, ${dayLabel(nextClass.day)} ${timeText(nextClass)} at ${nextClass.venue}.` : "No upcoming class found.";
  else if (question.includes("break") || question.includes("cuti semester")) answer = nextBreak ? `${nextBreak.title.ms}: ${dateRange(nextBreak)}.` : "No upcoming semester break found.";
  else if (question.includes("final") || question.includes("exam")) answer = nextExam ? `${nextExam.title.ms} starts in ${Math.max(0, daysUntil(parseDate(nextExam.start)))} days (${dateRange(nextExam)}).` : "No upcoming exam found.";
  else if (question.includes("holiday") || question.includes("cuti")) answer = holidays.map((event) => `${event.title.ms} (${dateRange(event)})`).join("; ");
  else if (question.includes("task") || question.includes("assignment")) answer = state.tasks.filter((task) => !task.done).length ? `${state.tasks.filter((task) => !task.done).length} pending task(s).` : "No pending tasks.";
  $("#assistantAnswer").textContent = answer;
}

const firstWeekItems = [
  "Activate student email",
  "Register courses",
  "Download timetable",
  "Join faculty WhatsApp/Telegram",
  "Locate lecture halls",
  "Locate library",
  "Find cafeteria and food options",
  "Obtain matric card"
];

const guideItems = [
  ["What is Tamhidi?", "Foundation year that prepares students for degree study at USIM."],
  ["CGPA basics", "Each course contributes grade points. Keep steady coursework marks before finals."],
  ["Attendance rule", "Aim for at least 80% attendance for every course to stay examination-safe."],
  ["Exam system", "Revision week comes before final examination. Plan notes by course, not by panic."],
  ["If you fail a subject", "Check official faculty instructions, repeat/appeal rules, and meet your academic advisor early."],
  ["Semester structure", "Registration, lectures, mid-semester break, lectures, revision, finals, semester break."]
];

const campusPlaces = [
  ["Faculty buildings", "FKP, FPQS, FSU and nearby lecture venues used in your timetable."],
  ["Lecture halls", "DKS, DKP, BT rooms and tutorial rooms. Visit once before first class."],
  ["Library", "Use for printing, references, quiet revision and past-year paper searching."],
  ["Cafeteria", "Plan meal time between 12:30 and afternoon classes."],
  ["Surau/Masjid", "Useful between Zohor/Asar and evening activities."],
  ["Bus stops", "Check route early during orientation week."],
  ["ATM", "Keep emergency cash for food, printing and transport."],
  ["Clinic", "Save location and operating hours before you need it."]
];

const resources = [
  ["TSU0134", "Malaysian Legal System", "Case summaries, lecture notes, tutorial questions"],
  ["TSU0124", "Islamic Jurisprudence", "Usul fiqh terms, concept maps, past questions"],
  ["TSU0114", "Islamic Legislation", "Legislation notes, comparison tables"],
  ["TSU0144", "Legal Skills", "Moot/presentation tips, writing templates"],
  ["TLA0032", "Arabic", "Vocabulary drills, grammar charts"],
  ["TLE0013", "English", "Presentation scripts, essay outlines"]
];

const faqItems = [
  ["When is registration?", "Semester I registration is 13-16 June 2026, with orientation on 17-18 June 2026."],
  ["When are finals?", "Semester I final examination is 10-13 November 2026. Semester II final examination is 3-7 May 2027."],
  ["When is semester break?", "Semester I break is 14 November-13 December 2026. Semester II break is 8 May-6 June 2027."],
  ["What if attendance is below 80%?", "Treat it as urgent. Speak to the lecturer or academic office and avoid further absence."],
  ["How to calculate GPA?", "Multiply each course grade point by credit hours, total them, then divide by total credit hours."],
  ["How to appeal results?", "Follow official USIM/faculty appeal instructions after result release and meet deadlines."]
];

function saveCompanionState() {
  localStorage.setItem("tamhidiChecklist", JSON.stringify(state.checklist));
  localStorage.setItem("attendanceTracker", JSON.stringify(state.attendance));
  localStorage.setItem("studentBudget", JSON.stringify(state.budget));
}

function nextPrayer() {
  const now = new Date();
  const prayers = [...document.querySelectorAll(".prayer-input")].map((input) => {
    const [hours, minutes] = input.value.split(":").map(Number);
    const at = new Date(now);
    at.setHours(hours, minutes, 0, 0);
    return { name: input.dataset.prayer, at };
  }).sort((a, b) => a.at - b.at);
  return prayers.find((item) => item.at >= now) || { ...prayers[0], at: addDays(prayers[0].at, 1) };
}

function renderCompanion() {
  if (!$("#companionView")) return;
  const now = new Date();
  const todays = classOccurrences().filter((occurrence) => dateKey(occurrence.startsAt) === dateKey(now));
  const nextClass = nextClassOccurrence(now);
  const nextExam = state.data.events.find((event) => event.category === "exam" && parseDate(event.end) >= now);
  const pendingTasks = state.tasks.filter((task) => !task.done).sort((a, b) => new Date(a.due) - new Date(b.due));
  const nextHoliday = state.data.events.find((event) => event.category === "publicHoliday" && parseDate(event.start) >= now);

  $("#dailyGreeting").textContent = `Assalamualaikum ${state.profile.name || "Rayyan"}`;
  $("#dailySummary").textContent = `${todays.length} class(es) today. ${pendingTasks.length} pending task(s).`;
  $("#dailyStack").innerHTML = [
    ["Today", `${todays.length} classes`],
    ["Next class", nextClass ? `${nextClass.courseCode} ${nextClass.start}` : "-"],
    ["Final exam", nextExam ? `${Math.max(0, daysUntil(parseDate(nextExam.start)))} days` : "-"],
    ["Holiday", nextHoliday ? `${nextHoliday.title.ms}` : "-"]
  ].map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");

  $("#firstWeekChecklist").innerHTML = firstWeekItems.map((item) => `<label class="check-item-row"><input type="checkbox" data-check="${item}" ${state.checklist[item] ? "checked" : ""} /> ${item}</label>`).join("");
  const done = firstWeekItems.filter((item) => state.checklist[item]).length;
  $("#checklistProgress").textContent = `${done}/${firstWeekItems.length}`;

  $("#survivalGuide").innerHTML = guideItems.map(([head, body]) => `<details><summary>${head}</summary><p>${body}</p></details>`).join("");

  $("#attendanceList").innerHTML = state.attendance.map((item) => {
    const pct = item.total ? Math.round((item.attended / item.total) * 100) : 100;
    return `<article class="attendance-item ${pct < 80 ? "danger" : ""}">
      <strong>${item.subject}</strong>
      <span>${item.attended}/${item.total} attended - ${pct}%</span>
      <div><button class="ghost" data-attend="${item.id}" type="button">Attend</button><button class="ghost" data-miss="${item.id}" type="button">Miss</button></div>
    </article>`;
  }).join("");

  $("#resourceHub").innerHTML = resources.map(([code, name, detail]) => `<article><strong>${code}</strong><span>${name}</span><small>${detail}</small></article>`).join("");

  $("#campusExplorer").innerHTML = campusPlaces.map(([place, detail]) => `<article><strong>${place}</strong><span>${detail}</span></article>`).join("");

  const prayer = nextPrayer();
  $("#nextPrayerText").textContent = `Next prayer: ${prayer.name} at ${prayer.at.toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" })}`;

  const remaining = Number(state.budget.allowance) - Number(state.budget.food) - Number(state.budget.transport) - Number(state.budget.books);
  $("#budgetAllowance").value = state.budget.allowance;
  $("#budgetFood").value = state.budget.food;
  $("#budgetTransport").value = state.budget.transport;
  $("#budgetBooks").value = state.budget.books;
  $("#budgetBalance").textContent = `Remaining balance: RM${remaining}`;

  $("#tamhidiRoadmap").innerHTML = ["Semester 1", "Semester 2", "Result Release", "Degree Placement", "Law / Syariah Degree"].map((step, index) => `<span class="${index === 0 ? "current" : ""}">${step}</span>`).join("");
  $("#parentMode").innerHTML = `<strong>Parent Mode</strong><span>Next exam: ${nextExam ? dateRange(nextExam) : "-"}</span><span>Next break/holiday: ${nextHoliday ? `${nextHoliday.title.ms} (${dateRange(nextHoliday)})` : "-"}</span>`;

  renderEligibility(Number($("#gpaInput").value || localStorage.getItem("studentGpa") || 0));
  renderFaq();
}

function renderEligibility(gpa) {
  localStorage.setItem("studentGpa", String(gpa || 0));
  $("#gpaInput").value = gpa || "";
  const programmes = [
    ["Syariah", 2.0],
    ["Fiqh dan Fatwa", 2.0],
    ["Muamalat", 2.0],
    ["Undang-Undang", 3.0]
  ];
  $("#eligibilityList").innerHTML = programmes.map(([name, min]) => `<article class="${gpa >= min ? "eligible" : ""}"><strong>${gpa >= min ? "Eligible" : "Target"}: ${name}</strong><span>Minimum guide: ${min.toFixed(2)} GPA</span></article>`).join("");
}

function renderFaq() {
  const query = ($("#faqSearch")?.value || "").toLowerCase();
  const matches = faqItems.filter(([q, a]) => `${q} ${a}`.toLowerCase().includes(query));
  $("#faqList").innerHTML = matches.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("");
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
  renderClassSchedule();
  renderOfficialDocument();
  renderPlanner();
  renderCompanion();
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

function dayToIndex(day) {
  return { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }[day];
}

function firstDayInRange(rangeStart, day) {
  const start = parseDate(rangeStart);
  const diff = (dayToIndex(day) - start.getDay() + 7) % 7;
  return addDays(start, diff);
}

function icsDateTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const copy = new Date(date);
  copy.setHours(hours, minutes, 0, 0);
  return `${copy.getFullYear()}${String(copy.getMonth() + 1).padStart(2, "0")}${String(copy.getDate()).padStart(2, "0")}T${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}00`;
}

function exportClassIcs() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//USIM//Class Schedule A261//MS", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:USIM Class Schedule A261"];
  scheduledClasses().forEach((entry) => {
    state.classSchedule.teachingWeeks.forEach((range, index) => {
      const first = firstDayInRange(range.start, entry.day);
      if (first > parseDate(range.end)) return;
      lines.push(
        "BEGIN:VEVENT",
        `UID:class-${entry.no}-${index}@usim-takwim-pro`,
        `SUMMARY:${entry.courseCode} ${entry.type} - ${entry.courseName.replaceAll(",", "\\,")}`,
        `DTSTART:${icsDateTime(first, entry.start)}`,
        `DTEND:${icsDateTime(first, entry.end)}`,
        `RRULE:FREQ=WEEKLY;UNTIL:${icsDateTime(parseDate(range.end), "23:59").replace("T235900", "T235959")}`,
        `LOCATION:${entry.venue || ""}`,
        `DESCRIPTION:Group ${entry.group} - Lecturer ${entry.lecturer || "-"}`,
        "BEGIN:VALARM",
        `TRIGGER:-PT${state.reminderMinutes}M`,
        "ACTION:DISPLAY",
        `DESCRIPTION:${entry.courseCode} starts in ${state.reminderMinutes} minutes at ${entry.venue || "class venue"}`,
        "END:VALARM",
        "END:VEVENT"
      );
    });
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "usim-class-schedule-a261.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function clearNotificationTimers() {
  state.notificationTimers.forEach((timer) => clearTimeout(timer));
  state.notificationTimers = [];
}

function scheduleClassNotifications() {
  clearNotificationTimers();
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const horizon = addDays(now, 7);
  classOccurrences()
    .filter((occurrence) => occurrence.startsAt > now && occurrence.startsAt <= horizon)
    .forEach((occurrence) => {
      const triggerAt = occurrence.startsAt.getTime() - state.reminderMinutes * 60000;
      const delay = triggerAt - now.getTime();
      if (delay < 0) return;
      const timer = setTimeout(() => {
        new Notification(`${occurrence.courseCode} ${occurrence.type}`, {
          body: `${occurrence.courseName}\n${occurrence.start} at ${occurrence.venue}`,
          tag: `class-${occurrence.no}-${dateKey(occurrence.startsAt)}`
        });
      }, delay);
      state.notificationTimers.push(timer);
    });
  $("#reminderStatus").textContent = i18n[state.lang].notificationReady;
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

  $("#saveProfileBtn").addEventListener("click", saveProfile);
  $("#taskForm").addEventListener("submit", addTask);
  $("#askAssistantBtn").addEventListener("click", answerAssistant);
  $("#assistantQuestion").addEventListener("keydown", (event) => {
    if (event.key === "Enter") answerAssistant();
  });
  $("#calcGpaBtn").addEventListener("click", () => renderEligibility(Number($("#gpaInput").value || 0)));
  $("#faqSearch").addEventListener("input", renderFaq);
  $("#addAttendanceBtn").addEventListener("click", () => {
    const subject = prompt("Subject name?");
    if (!subject) return;
    state.attendance.push({ id: `att-${Date.now()}`, subject, attended: 0, total: 0 });
    saveCompanionState();
    renderCompanion();
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-check]")) {
      state.checklist[event.target.dataset.check] = event.target.checked;
      saveCompanionState();
      renderCompanion();
    }
    if (event.target.matches(".prayer-input")) renderCompanion();
    if (["budgetAllowance", "budgetFood", "budgetTransport", "budgetBooks"].includes(event.target.id)) {
      state.budget = {
        allowance: Number($("#budgetAllowance").value || 0),
        food: Number($("#budgetFood").value || 0),
        transport: Number($("#budgetTransport").value || 0),
        books: Number($("#budgetBooks").value || 0)
      };
      saveCompanionState();
      renderCompanion();
    }
  });
  document.addEventListener("click", (event) => {
    const attendId = event.target.dataset.attend;
    const missId = event.target.dataset.miss;
    if (attendId || missId) {
      const item = state.attendance.find((entry) => entry.id === (attendId || missId));
      if (!item) return;
      item.total += 1;
      if (attendId) item.attended += 1;
      saveCompanionState();
      renderCompanion();
    }
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
  $("#exportClassBtn").addEventListener("click", exportClassIcs);
  $("#reminderMinutes").value = String(state.reminderMinutes);
  $("#reminderMinutes").addEventListener("change", (event) => {
    state.reminderMinutes = Number(event.target.value);
    localStorage.setItem("classReminderMinutes", String(state.reminderMinutes));
    scheduleClassNotifications();
  });
  $("#enableNotificationsBtn").addEventListener("click", async () => {
    if (!("Notification" in window)) {
      $("#reminderStatus").textContent = "Notification API unavailable";
      return;
    }
    const permission = await Notification.requestPermission();
    $("#reminderStatus").textContent = permission === "granted" ? i18n[state.lang].notificationReady : i18n[state.lang].notificationDenied;
    scheduleClassNotifications();
  });
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
  scheduleClassNotifications();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(console.warn);
}

boot().catch((error) => {
  console.error(error);
  document.body.insertAdjacentHTML("afterbegin", `<div class="panel" style="margin:1rem">Unable to load calendar data. Serve this folder through a local web server or deploy it to Vercel.</div>`);
});
