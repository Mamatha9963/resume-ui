import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  if (!state?.resume) {
    return (
      <div style={{ padding: 20 }}>
        <h3>No resume data found.</h3>
        <button
          onClick={() => navigate("/")}
          style={buttonStyleSecondary}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!resume) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading resume...</h3>
      </div>
    );
  }

  const handleCopy = () => {
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

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 4, color: "#0B3D91" }}>
        {resume.name}
      </h1>
      <p style={{ fontSize: 16, marginBottom: 20, color: "#555" }}>
        📧 {resume.email} | 📞 {resume.phone}
      </p>

      <Section title="Summary">
        <p style={{ fontSize: 16, whiteSpace: "pre-wrap" }}>{resume.summary}</p>
      </Section>

      <Section title="Skills">
        <ul style={skillListStyle}>
          {resume.skills.map((skill, i) => (
            <li key={i} style={skillItemStyle}>
              {skill}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        {resume.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3 style={experienceTitleStyle}>{exp.jobTitle}</h3>
            <p style={experienceSubStyle}>
              {exp.company}, {exp.location} | {exp.duration}
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 8 }}>
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} style={{ marginBottom: 6, fontSize: 15 }}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Education">
        <p style={{ fontSize: 16 }}>{resume.education}</p>
      </Section>

      <Section title="Achievements">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {resume.achievements.map((ach, idx) => (
            <li key={idx} style={{ marginBottom: 6, fontSize: 15 }}>
              {ach}
            </li>
          ))}
        </ul>
      </Section>

      <div style={{ marginTop: 30 }}>
        <button onClick={handleCopy} style={buttonStylePrimary}>
          Copy to Clipboard
        </button>{" "}
        <button
          onClick={() => navigate("/")}
          style={buttonStyleSecondary}
        >
          Generate Another
        </button>
        {copySuccess && (
          <span
            style={{
              marginLeft: 15,
              color: "green",
              fontWeight: "600",
              fontSize: 14,
              verticalAlign: "middle",
            }}
          >
            {copySuccess}
          </span>
        )}
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: 24 }}>
    <h2
      style={{
        borderBottom: "2px solid #0B3D91",
        paddingBottom: 6,
        marginBottom: 12,
        fontSize: 22,
        color: "#0B3D91",
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const skillListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  listStyle: "none",
  paddingLeft: 0,
  margin: 0,
};

const skillItemStyle: React.CSSProperties = {
  backgroundColor: "#e1ecf4",
  color: "#0366d6",
  padding: "6px 12px",
  borderRadius: 15,
  fontSize: 14,
  margin: "4px 8px 4px 0",
};

const experienceTitleStyle: React.CSSProperties = {
  margin: "0 0 4px",
  fontSize: 18,
  color: "#0B3D91",
};

const experienceSubStyle: React.CSSProperties = {
  fontStyle: "italic",
  fontSize: 14,
  margin: "0 0 8px",
  color: "#555",
};

const buttonStylePrimary: React.CSSProperties = {
  backgroundColor: "#0B3D91",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 5,
  fontSize: 16,
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const buttonStyleSecondary: React.CSSProperties = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 5,
  fontSize: 16,
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default ResultPage;
