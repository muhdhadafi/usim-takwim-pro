const academicEvents = [
  { id: "s1-reg-univ", title: "Pendaftaran Diri / Universiti Secara Dalam Talian", start: "2026-06-13", end: "2026-06-14", type: "semester", semester: "1" },
  { id: "s1-reg-hostel", title: "Pendaftaran Kolej Kediaman", start: "2026-06-15", end: "2026-06-16", type: "semester", semester: "1" },
  { id: "s1-orientation", title: "Minggu Taaruf", start: "2026-06-17", end: "2026-06-18", type: "semester", semester: "1" },
  { id: "s1-lecture-a", title: "Perkuliahan", start: "2026-06-22", end: "2026-08-23", type: "kuliah", semester: "1" },
  { id: "s1-mid-break", title: "Cuti Pertengahan Semester I", start: "2026-08-24", end: "2026-08-31", type: "cuti", semester: "1" },
  { id: "s1-lecture-b", title: "Perkuliahan", start: "2026-09-01", end: "2026-10-31", type: "kuliah", semester: "1" },
  { id: "s1-revision", title: "Minggu Ulang Kaji", start: "2026-11-01", end: "2026-11-09", type: "peperiksaan", semester: "1" },
  { id: "s1-exam", title: "Peperiksaan Akhir Semester I", start: "2026-11-10", end: "2026-11-13", type: "peperiksaan", semester: "1" },
  { id: "s1-break", title: "Cuti Semester I", start: "2026-11-14", end: "2026-12-13", type: "cuti", semester: "1" },
  { id: "s2-course-reg", title: "Pendaftaran Kursus (Online)", start: "2026-12-14", end: "2026-12-14", type: "semester", semester: "2" },
  { id: "s2-lecture-a", title: "Perkuliahan", start: "2026-12-14", end: "2027-02-14", type: "kuliah", semester: "2" },
  { id: "s2-mid-break", title: "Cuti Pertengahan Semester II", start: "2027-02-15", end: "2027-02-21", type: "cuti", semester: "2" },
  { id: "s2-lecture-b", title: "Perkuliahan", start: "2027-02-22", end: "2027-04-25", type: "kuliah", semester: "2" },
  { id: "s2-revision", title: "Minggu Ulang Kaji", start: "2027-04-26", end: "2027-05-02", type: "peperiksaan", semester: "2" },
  { id: "s2-exam", title: "Peperiksaan Akhir Semester II", start: "2027-05-03", end: "2027-05-07", type: "peperiksaan", semester: "2" },
  { id: "s2-break", title: "Cuti Semester II", start: "2027-05-08", end: "2027-06-06", type: "cuti", semester: "2" },
  { id: "h-awal-muharram", title: "Awal Muharram", start: "2026-06-17", end: "2026-06-17", type: "cuti-umum", semester: "1" },
  { id: "h-maulidur", title: "Hari Keputeraan Nabi Muhammad S.A.W", start: "2026-08-25", end: "2026-08-25", type: "cuti-umum", semester: "1" },
  { id: "h-merdeka", title: "Hari Merdeka", start: "2026-08-31", end: "2026-08-31", type: "cuti-umum", semester: "1" },
  { id: "h-malaysia", title: "Hari Malaysia", start: "2026-09-16", end: "2026-09-16", type: "cuti-umum", semester: "1" },
  { id: "h-deepavali", title: "Cuti Gantian Deepavali", start: "2026-11-09", end: "2026-11-09", type: "cuti-umum", semester: "1" },
  { id: "h-christmas", title: "Hari Krismas", start: "2026-12-25", end: "2026-12-25", type: "cuti-umum", semester: "2" },
  { id: "h-new-year", title: "Cuti Tahun Baru 2027", start: "2027-01-01", end: "2027-01-01", type: "cuti-umum", semester: "2" },
  { id: "h-israk", title: "Cuti Israk dan Mikraj", start: "2027-01-06", end: "2027-01-06", type: "cuti-umum", semester: "2" },
  { id: "h-ns-ruler", title: "Hari Keputeraan Yang di-Pertuan Besar Negeri Sembilan", start: "2027-01-14", end: "2027-01-14", type: "cuti-umum", semester: "2" },
  { id: "h-thaipusam", title: "Cuti Thaipusam", start: "2027-01-22", end: "2027-01-22", type: "cuti-umum", semester: "2" },
  { id: "h-cny-replacement", title: "Cuti Gantian Tahun Baru Cina", start: "2027-02-08", end: "2027-02-08", type: "cuti-umum", semester: "2" },
  { id: "h-nuzul", title: "Hari Nuzul Al-Quran", start: "2027-02-24", end: "2027-02-24", type: "cuti-umum", semester: "2" },
  { id: "h-aidilfitri", title: "Cuti Hari Raya Aidilfitri", start: "2027-03-10", end: "2027-03-11", type: "cuti-umum", semester: "2" },
  { id: "h-aidiladha", title: "Cuti Hari Raya Aidiladha", start: "2027-05-17", end: "2027-05-17", type: "cuti-umum", semester: "2" }
];

const typeMeta = {
  semester: { label: "Semester / Pendaftaran", color: "#2f6f90" },
  kuliah: { label: "Kuliah", color: "#006b3f" },
  peperiksaan: { label: "Peperiksaan", color: "#6b3fa0" },
  cuti: { label: "Cuti Semester", color: "#a05a00" },
  "cuti-umum": { label: "Cuti Umum", color: "#b42318" }
};

const state = {
  month: new Date(2026, 5, 1),
  semester: "all",
  types: new Set(Object.keys(typeMeta)),
  view: "calendar"
};

const els = {
  semesterFilter: document.querySelector("#semesterFilter"),
  typeFilters: document.querySelector("#typeFilters"),
  statsGrid: document.querySelector("#statsGrid"),
  nextList: document.querySelector("#nextList"),
  monthLabel: document.querySelector("#monthLabel"),
  calendarGrid: document.querySelector("#calendarGrid"),
  eventTable: document.querySelector("#eventTable"),
  tableCount: document.querySelector("#tableCount"),
  timelineScale: document.querySelector("#timelineScale"),
  timelineList: document.querySelector("#timelineList"),
  timelineRange: document.querySelector("#timelineRange"),
  dialog: document.querySelector("#eventDialog")
};

const fmtMonth = new Intl.DateTimeFormat("ms-MY", { month: "long", year: "numeric" });
const fmtDate = new Intl.DateTimeFormat("ms-MY", { day: "numeric", month: "short", year: "numeric" });

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

function daysInclusive(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000) + 1;
}

function eventRangeText(event) {
  const start = parseDate(event.start);
  const end = parseDate(event.end);
  return sameDay(start, end) ? fmtDate.format(start) : `${fmtDate.format(start)} - ${fmtDate.format(end)}`;
}

function filteredEvents() {
  return academicEvents
    .filter((event) => state.semester === "all" || event.semester === state.semester)
    .filter((event) => state.types.has(event.type))
    .sort((a, b) => parseDate(a.start) - parseDate(b.start));
}

function renderFilters() {
  els.typeFilters.innerHTML = Object.entries(typeMeta).map(([type, meta]) => `
    <label class="check-item">
      <input type="checkbox" value="${type}" checked />
      <span class="type-dot" style="background:${meta.color}"></span>
      <span>${meta.label}</span>
    </label>
  `).join("");
}

function renderStats(events) {
  const kuliahDays = events.filter((event) => event.type === "kuliah").reduce((sum, event) => sum + daysInclusive(event.start, event.end), 0);
  const examDays = events.filter((event) => event.type === "peperiksaan").reduce((sum, event) => sum + daysInclusive(event.start, event.end), 0);
  const holidayDays = events.filter((event) => event.type === "cuti" || event.type === "cuti-umum").reduce((sum, event) => sum + daysInclusive(event.start, event.end), 0);
  const semesterCount = new Set(events.map((event) => event.semester)).size;
  const stats = [
    [events.length, "Aktiviti aktif"],
    [kuliahDays, "Hari kuliah"],
    [examDays, "Hari ulang kaji / peperiksaan"],
    [holidayDays, "Hari cuti"],
    [semesterCount, "Semester dipapar"],
    [academicEvents.length, "Jumlah rekod"]
  ];
  els.statsGrid.innerHTML = stats.map(([value, label]) => `
    <div class="stat-card">
      <p class="stat-value">${value}</p>
      <p class="stat-label">${label}</p>
    </div>
  `).join("");
}

function renderNext(events) {
  const today = new Date();
  const upcoming = events.filter((event) => parseDate(event.end) >= today).slice(0, 5);
  const fallback = events.slice(0, 5);
  els.nextList.innerHTML = (upcoming.length ? upcoming : fallback).map((event) => `
    <div class="next-item" style="border-left-color:${typeMeta[event.type].color}">
      <strong>${event.title}</strong>
      <span>${eventRangeText(event)} · ${typeMeta[event.type].label}</span>
    </div>
  `).join("");
}

function eventsForDay(events, day) {
  return events.filter((event) => parseDate(event.start) <= day && parseDate(event.end) >= day);
}

function renderCalendar(events) {
  els.monthLabel.textContent = fmtMonth.format(state.month);
  els.calendarGrid.innerHTML = "";
  const monthStart = new Date(state.month.getFullYear(), state.month.getMonth(), 1);
  const monthEnd = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 0);
  const mondayIndex = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -mondayIndex);
  const totalCells = Math.ceil((mondayIndex + monthEnd.getDate()) / 7) * 7;
  const today = new Date();

  for (let index = 0; index < totalCells; index += 1) {
    const day = addDays(gridStart, index);
    const cell = document.createElement("article");
    cell.className = "day-cell";
    if (day.getMonth() !== state.month.getMonth()) cell.classList.add("is-muted");
    if (sameDay(day, today)) cell.classList.add("is-today");

    const dayEvents = eventsForDay(events, day);
    const visible = dayEvents.slice(0, 3);
    cell.innerHTML = `
      <div class="day-number">${day.getDate()}</div>
      <div class="cell-events"></div>
    `;
    const holder = cell.querySelector(".cell-events");
    visible.forEach((event) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "event-chip";
      chip.dataset.type = event.type;
      chip.textContent = event.title;
      chip.addEventListener("click", () => openEvent(event));
      holder.appendChild(chip);
    });
    if (dayEvents.length > 3) {
      const more = document.createElement("span");
      more.className = "more-chip";
      more.textContent = `+${dayEvents.length - 3} lagi`;
      holder.appendChild(more);
    }
    els.calendarGrid.appendChild(cell);
  }
}

function renderTimeline(events) {
  const start = parseDate("2026-06-01");
  const end = parseDate("2027-06-30");
  const total = end - start;
  els.timelineRange.textContent = "Jun 2026 - Jun 2027";
  els.timelineScale.innerHTML = ["Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis", "Jan", "Feb", "Mac", "Apr", "Mei"].map((month) => `<span>${month}</span>`).join("");
  els.timelineList.innerHTML = events.map((event) => {
    const eventStart = parseDate(event.start);
    const eventEnd = parseDate(event.end);
    const left = Math.max(0, ((eventStart - start) / total) * 100);
    const width = Math.max(0.7, ((eventEnd - eventStart + 86400000) / total) * 100);
    return `
      <div class="timeline-row">
        <div class="timeline-label">
          <strong>${event.title}</strong>
          <span>${eventRangeText(event)} · Sem ${event.semester}</span>
        </div>
        <div class="timeline-track">
          <button class="timeline-bar" data-id="${event.id}" data-type="${event.type}" style="left:${left}%;width:${width}%" title="${event.title}" aria-label="${event.title}"></button>
        </div>
      </div>
    `;
  }).join("");
  els.timelineList.querySelectorAll(".timeline-bar").forEach((bar) => {
    bar.addEventListener("click", () => openEvent(academicEvents.find((event) => event.id === bar.dataset.id)));
  });
}

function renderTable(events) {
  els.tableCount.textContent = `${events.length} rekod`;
  els.eventTable.innerHTML = events.map((event) => `
    <tr>
      <td><strong>${event.title}</strong></td>
      <td><span class="badge">${typeMeta[event.type].label}</span></td>
      <td>Semester ${event.semester}</td>
      <td>${eventRangeText(event)}</td>
      <td>${daysInclusive(event.start, event.end)} hari</td>
    </tr>
  `).join("");
}

function renderAll() {
  const events = filteredEvents();
  renderStats(events);
  renderNext(events);
  renderCalendar(events);
  renderTimeline(events);
  renderTable(events);
}

function openEvent(event) {
  if (!event) return;
  document.querySelector("#dialogCategory").textContent = `${typeMeta[event.type].label} · Semester ${event.semester}`;
  document.querySelector("#dialogTitle").textContent = event.title;
  document.querySelector("#dialogDate").textContent = eventRangeText(event);
  document.querySelector("#dialogMeta").textContent = `${daysInclusive(event.start, event.end)} hari · Sesi Akademik 2026/2027`;
  els.dialog.showModal();
}

function toIcsDate(value, addEndDay = false) {
  const date = addEndDay ? addDays(parseDate(value), 1) : parseDate(value);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function exportIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//USIM Tamhidi//Takwim Akademik 2026-2027//MS",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Takwim Akademik USIM 2026/2027"
  ];
  filteredEvents().forEach((event) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@usim-takwim.local`,
      `SUMMARY:${event.title.replaceAll(",", "\\,")}`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.start)}`,
      `DTEND;VALUE=DATE:${toIcsDate(event.end, true)}`,
      `CATEGORIES:${typeMeta[event.type].label}`,
      `DESCRIPTION:Semester ${event.semester} - ${typeMeta[event.type].label}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "takwim-akademik-usim-2026-2027.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function wireEvents() {
  els.semesterFilter.addEventListener("change", (event) => {
    state.semester = event.target.value;
    renderAll();
  });
  els.typeFilters.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) {
      event.target.checked ? state.types.add(event.target.value) : state.types.delete(event.target.value);
      renderAll();
    }
  });
  document.querySelector("#resetFilters").addEventListener("click", () => {
    state.semester = "all";
    state.types = new Set(Object.keys(typeMeta));
    els.semesterFilter.value = "all";
    els.typeFilters.querySelectorAll("input").forEach((input) => { input.checked = true; });
    renderAll();
  });
  document.querySelector("#prevMonth").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    renderCalendar(filteredEvents());
  });
  document.querySelector("#nextMonth").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    renderCalendar(filteredEvents());
  });
  document.querySelector("#todayBtn").addEventListener("click", () => {
    const now = new Date();
    state.month = new Date(now.getFullYear(), now.getMonth(), 1);
    renderCalendar(filteredEvents());
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab, .view").forEach((el) => el.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.view}View`).classList.add("active");
    });
  });
  document.querySelector("#themeBtn").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    document.querySelector("#themeIcon").textContent = next === "dark" ? "☾" : "◐";
  });
  document.querySelector("#exportBtn").addEventListener("click", exportIcs);
  document.querySelector("#printBtn").addEventListener("click", () => window.print());
  document.querySelector("#closeDialog").addEventListener("click", () => els.dialog.close());
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("sw.js");
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  }
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  document.querySelector("#installBtn").disabled = false;
});

document.querySelector("#installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  document.querySelector("#themeIcon").textContent = savedTheme === "dark" ? "☾" : "◐";
  document.querySelector("#installBtn").disabled = true;
  renderFilters();
  wireEvents();
  renderAll();
  registerServiceWorker();
});
