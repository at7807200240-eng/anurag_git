const projects = [
  {
    slug: "lecture-ledger",
    name: "Lecture Ledger",
    status: "shipped",
    tagline: "Upload a lecture or meeting — get a structured summary, action items, and a searchable archive you can ask questions across.",
    stack: ["FastAPI", "MySQL", "Qdrant", "Gemini", "Whisper"],
    overview: "A full-stack notes assistant that turns raw audio or pasted transcripts into structured, searchable knowledge. Upload a recording or paste text, and it transcribes locally via Whisper, extracts a structured summary with Gemini (key points, action items, topics), stores everything in MySQL, and embeds the transcript into Qdrant so you can semantically search or ask questions across every note you've ever ingested.",
    features: [
      "Dual ingestion paths: paste text (synchronous) or upload audio (background-processed with live status polling)",
      "Structured extraction via Gemini — typed key points, action items with owner/due-date fields, and topic tags",
      "Semantic search and a RAG 'ask across all notes' feature — e.g. \"what did we cover about gradient boosting across all my ML lectures?\"",
      "JWT-based auth with per-user filtering baked into every Qdrant query",
      "Local Whisper transcription instead of a paid API — zero marginal cost per upload"
    ],
    challenges: [
      "Diagnosed and fixed a passlib/bcrypt version incompatibility causing silent password-hash failures — replaced passlib entirely with direct bcrypt calls",
      "Migrated off two separate Gemini API breaking changes mid-build: a deprecated embedding model returning a 404, and a vector-dimension mismatch (768 → 3072) once the replacement model was wired in",
      "Adapted to a qdrant-client API change (.search() → .query_points()) that silently changed the return shape, not just the method name",
      "Designed the MySQL + Qdrant split deliberately — relational data for users/notes/tags, vector DB for embeddings"
    ],
    tech: ["FastAPI", "MySQL", "SQLAlchemy", "Qdrant", "Gemini API", "Whisper (local)", "JWT", "Vanilla JS"],
    github: "https://github.com/at7807200240-eng/lecture_ledger",
    demo: ""
  },
  {
    slug: "rag-pdf-pipeline",
    name: "RAG PDF Pipeline",
    status: "shipped",
    tagline: "An event-driven RAG pipeline for ingesting and querying PDFs, with a Streamlit interface on top.",
    stack: ["FastAPI", "Inngest", "Qdrant", "Gemini", "Streamlit"],
    overview: "A retrieval-augmented generation system for PDFs, built around an event-driven architecture rather than a simple synchronous pipeline. Documents are ingested asynchronously via Inngest, chunked and embedded into Qdrant, and queried through Gemini with retrieved context — all exposed through a Streamlit frontend for uploading documents and asking questions.",
    features: [
      "Event-driven ingestion using Inngest, decoupling upload from processing rather than blocking on a single request",
      "Chunking and embedding pipeline into Qdrant for semantic retrieval over PDF content",
      "Gemini-powered question answering grounded in retrieved chunks, with source attribution",
      "Streamlit frontend for document upload and interactive querying"
    ],
    challenges: [
      "Resolved a breaking Qdrant client API change mid-project (.search() → .query_points()) — the same issue later recurred in Lecture Ledger",
      "Adapted to shifting Gemini model availability (gemini-2.5-flash, gemini-embedding-001) as model names changed during development",
      "Debugged import path issues and a GitHub Pages misconfiguration when documenting and deploying the project"
    ],
    tech: ["FastAPI", "Inngest", "Qdrant", "Gemini API", "Streamlit", "Python"],
    github: "https://github.com/at7807200240-eng/rag_repo",
    demo: ""
  }
];

const coursework = [
  { name: "ResumeForge — Flask resume builder (academic project report)", meta: "Web Design · BCA AI&ML" },
  { name: "Gradient Boosting Machines — theory writeup with LaTeX formulas", meta: "Machine Learning" },
  { name: "Crop production reference notes (Peach, Coconut, Arecanut)", meta: "Agriculture" }
];

function renderProjects() {
  const list = document.getElementById('projList');
  list.innerHTML = projects.map(p => `
    <div class="proj-card" tabindex="0" data-slug="${p.slug}">
      <div class="proj-top">
        <div class="proj-name">${p.name}</div>
        <div class="proj-status">${p.status}</div>
      </div>
      <div class="proj-desc">${p.tagline}</div>
      <div class="proj-stack">${p.stack.map(s => `<span class="stack-tag">${s}</span>`).join('')}</div>
      <div class="proj-arrow">View details →</div>
    </div>
  `).join('');

  list.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openDrawer(card.dataset.slug));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(card.dataset.slug); }
    });
  });
}

function renderCoursework() {
  const list = document.getElementById('courseList');
  list.innerHTML = coursework.map(c => `
    <div class="course-row">
      <span class="cname">${c.name}</span>
      <span class="cmeta">${c.meta}</span>
    </div>
  `).join('');
}

function openDrawer(slug) {
  const p = projects.find(pr => pr.slug === slug);
  if (!p) return;

  const demoLink = p.demo
    ? `<a href="${p.demo}" target="_blank" rel="noopener">Live demo</a>`
    : '';

  document.getElementById('drawer').innerHTML = `
    <button class="drawer-close" id="drawerCloseBtn" aria-label="Close">&times;</button>
    <div class="drawer-eyebrow">${p.status}</div>
    <h2>${p.name}</h2>
    <p class="drawer-tagline">${p.overview}</p>

    <div class="drawer-block">
      <h4>Key features</h4>
      <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>

    <div class="drawer-block">
      <h4>Challenges &amp; debugging</h4>
      <ul>${p.challenges.map(c => `<li>${c}</li>`).join('')}</ul>
    </div>

    <div class="drawer-block">
      <h4>Tech stack</h4>
      <div class="stack-pills">${p.tech.map(t => `<span class="stack-pill">${t}</span>`).join('')}</div>
    </div>

    <div class="drawer-links">
      <a href="${p.github}" target="_blank" rel="noopener">View on GitHub</a>
      ${demoLink}
    </div>
  `;

  document.getElementById('drawer').classList.add('active');
  document.getElementById('drawerBackdrop').classList.add('active');
  document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('active');
  document.getElementById('drawerBackdrop').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// Initialize rendering
renderProjects();
renderCoursework();

// --- NEW LOGIC: Email Dropdown Toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const emailBtn = document.getElementById('email-btn');
  const emailDropdown = document.getElementById('emailDropdown');
  
  if (emailBtn && emailDropdown) {
    // Toggle dropdown when clicking "Email"
    emailBtn.addEventListener('click', function(e) {
      e.preventDefault(); 
      e.stopPropagation(); // Prevents the click from immediately closing it
      emailDropdown.classList.toggle('active');
      
      // Optional: highlight the email button while dropdown is open
      if (emailDropdown.classList.contains('active')) {
        emailBtn.style.borderColor = "var(--violet)";
        emailBtn.style.background = "rgba(124,108,242,0.12)";
      } else {
        emailBtn.style.borderColor = "";
        emailBtn.style.background = "";
      }
    });

    // Close the dropdown if the user clicks anywhere else on the page
    document.addEventListener('click', (e) => {
      if (!emailDropdown.contains(e.target) && e.target !== emailBtn) {
        emailDropdown.classList.remove('active');
        emailBtn.style.borderColor = "";
        emailBtn.style.background = "";
      }
    });
    
    // Close the dropdown if the user hits the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && emailDropdown.classList.contains('active')) {
        emailDropdown.classList.remove('active');
        emailBtn.style.borderColor = "";
        emailBtn.style.background = "";
      }
    });
  }
});