function AuditTrailModal({ result }) {
  if (!result || !result.audit_trail) return null;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Agent Audit Trail</h2>
          <p style={subtitleStyle}>Step-by-step trace of the multi-agent workflow.</p>
        </div>
        <span style={countStyle}>{result.audit_trail.length} events</span>
      </div>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Agent</th>
              <th style={thStyle}>Decision</th>
              <th style={thStyle}>Confidence</th>
              <th style={thStyle}>Notes</th>
              <th style={thStyle}>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {result.audit_trail.map((event, index) => (
              <tr key={index} style={trStyle}>
                <td style={strongTdStyle}>{event.agent || "Agent"}</td>
                <td style={tdStyle}>
                  <span style={decisionStyle}>{event.decision || "Recorded"}</span>
                </td>
                <td style={tdStyle}>{event.confidence ?? "N/A"}</td>
                <td style={tdStyle}>{event.notes || "No notes recorded."}</td>
                <td style={tdStyle}>{event.timestamp || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const containerStyle = {
  marginTop: "24px",
  padding: "22px",
  border: "1px solid #dbe3ef",
  borderRadius: "8px",
  background: "#ffffff",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const titleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "20px",
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const countStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tableWrapStyle = {
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "840px",
};

const thStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #dbe3ef",
  background: "#f8fafc",
  color: "#475569",
  fontSize: "12px",
  fontWeight: 800,
  textAlign: "left",
  textTransform: "uppercase",
};

const trStyle = {
  borderBottom: "1px solid #edf2f7",
};

const tdStyle = {
  padding: "14px",
  color: "#334155",
  fontSize: "14px",
  verticalAlign: "top",
};

const strongTdStyle = {
  ...tdStyle,
  color: "#0f172a",
  fontWeight: 800,
};

const decisionStyle = {
  display: "inline-flex",
  padding: "4px 9px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#3730a3",
  border: "1px solid #c7d2fe",
  fontSize: "12px",
  fontWeight: 800,
};

export default AuditTrailModal;
