import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./styles/ResultPage.scss";

interface ExperienceItem {
  jobTitle: string;
  company: string;
  location: string;
  duration: string;
  bullets: string[];
}

interface Resume {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: string;
  achievements: string[];
}

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [resume, setResume] = useState<Resume | null>(null);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    if (state?.resume) {
      try {
        const parsed = JSON.parse(state.resume);
        setResume(parsed);
      } catch (err) {
        console.error("Failed to parse resume JSON:", err);
      }
    }
  }, [state?.resume]);

const handleDownloadPDF = async () => {
  const input = document.querySelector(".resume-container") as HTMLElement;
  const buttons = input.querySelector(".resume-buttons") as HTMLElement;
  if (!input) return;

  // Hide buttons
  if (buttons) buttons.style.display = "none";

  // Wait for the DOM to update
  await new Promise((resolve) => setTimeout(resolve, 100));

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  // Show buttons again
  if (buttons) buttons.style.display = "";

  pdf.save(`${resume?.name.replace(/\s+/g, "_")}_Resume.pdf`);
};

  const handleCopy = () => {
    if (!resume) return;
    const textToCopy = `
${resume.name}
Email: ${resume.email} | Phone: ${resume.phone}

Summary
${resume.summary}

Skills
${resume.skills.join(", ")}

Experience
${resume.experience
      .map(
        (exp) =>
          `${exp.jobTitle} at ${exp.company}, ${exp.location} (${exp.duration})
- ${exp.bullets.join("\n- ")}`
      )
      .join("\n\n")}

Education
${resume.education}

Achievements
${resume.achievements.join("\n")}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopySuccess("Copied to clipboard!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  if (!state?.resume) {
    return (
      <div className="resume-container">
        <h3>No resume data found.</h3>
        <button className="resume-button resume-secondary" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="resume-container">
        <h3>Loading resume...</h3>
      </div>
    );
  }

  return (
    <div className="resume-container">
      <h1 className="resume-name">{resume.name}</h1>
      <p className="resume-contact">
        📧 {resume.email} | 📞 {resume.phone}
      </p>

      <section className="resume-section">
        <h2 className="resume-section-title">Summary</h2>
        <p>{resume.summary}</p>
      </section>

      <section className="resume-section">
        <h2 className="resume-section-title">Skills</h2>
        <ul className="resume-skills">
          {resume.skills.map((skill, i) => (
            <li key={i} className="resume-skill-item">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="resume-section">
        <h2 className="resume-section-title">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="resume-experience-item">
            <h3 className="resume-experience-title">{exp.jobTitle}</h3>
            <p className="resume-experience-subtitle">
              {exp.company}, {exp.location} | {exp.duration}
            </p>
            <ul className="resume-bullet-list">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="resume-bullet-item">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2 className="resume-section-title">Education</h2>
        <p>{resume.education}</p>
      </section>

      <section className="resume-section">
        <h2 className="resume-section-title">Achievements</h2>
        <ul className="resume-achievements">
          {resume.achievements.map((ach, idx) => (
            <li key={idx} className="resume-achievement-item">
              {ach}
            </li>
          ))}
        </ul>
      </section>

      <div className="resume-buttons">
        <button className="resume-button resume-primary" onClick={handleCopy}>
          Copy to Clipboard
        </button>&nbsp;&nbsp;
        <button className="resume-button resume-primary" onClick={handleDownloadPDF}>
          Download as PDF
        </button>&nbsp;&nbsp;
        <button className="resume-button resume-secondary" onClick={() => navigate("/")}>
          Generate Another
        </button>
        {copySuccess && <span className="resume-copied">{copySuccess}</span>}
      </div>
    </div>
  );
};

export default ResultPage;
