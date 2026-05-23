function GovernanceWarnings({ result }) {
  if (!result) return null;

  const warnings = result.governance_warnings || [];
  const decision = result.executive_decision?.decision || "Decision pending";

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>AI Workflow Result</h2>
          <p style={subtitleStyle}>Latest agent decision and governance review output.</p>
        </div>
        <span style={decisionBadgeStyle}>{decision}</span>
      </div>

      <div style={metaGridStyle}>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Workflow ID</span>
          <strong style={metaValueStyle}>{result.workflow_id || "N/A"}</strong>
        </div>
        <div style={metaItemStyle}>
          <span style={metaLabelStyle}>Transaction</span>
          <strong style={metaValueStyle}>{result.transaction_id || "N/A"}</strong>
        </div>
      </div>

      <h3 style={sectionHeadingStyle}>Governance Warnings</h3>

      <ul style={warningListStyle}>
        {warnings.length ? (
          warnings.map((warning, index) => (
            <li key={index} style={warningItemStyle}>{warning}</li>
          ))
        ) : (
          <li style={clearItemStyle}>No governance warnings returned for this workflow.</li>
        )}
      </ul>
    </div>
  );
}

const containerStyle = {
  marginTop: "24px",
  padding: "22px",
  border: "1px solid #fed7aa",
  borderRadius: "8px",
  background: "#fff7ed",
  boxShadow: "0 12px 32px rgba(154, 52, 18, 0.08)",
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
  color: "#7c2d12",
  fontSize: "20px",
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#9a3412",
  fontSize: "14px",
};

const decisionBadgeStyle = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
  color: "#9a3412",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const metaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const metaItemStyle = {
  padding: "14px",
  borderRadius: "8px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
};

const metaLabelStyle = {
  display: "block",
  color: "#9a3412",
  fontSize: "12px",
  fontWeight: 800,
  textTransform: "uppercase",
};

const metaValueStyle = {
  display: "block",
  marginTop: "6px",
  color: "#431407",
  fontSize: "15px",
};

const sectionHeadingStyle = {
  margin: "18px 0 10px",
  color: "#7c2d12",
  fontSize: "16px",
};

const warningListStyle = {
  display: "grid",
  gap: "8px",
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const warningItemStyle = {
  padding: "12px 14px",
  borderRadius: "8px",
  background: "#ffffff",
  border: "1px solid #fed7aa",
  color: "#7c2d12",
  fontWeight: 600,
};

const clearItemStyle = {
  ...warningItemStyle,
  color: "#166534",
  borderColor: "#bbf7d0",
  background: "#f0fdf4",
};

export default GovernanceWarnings;
