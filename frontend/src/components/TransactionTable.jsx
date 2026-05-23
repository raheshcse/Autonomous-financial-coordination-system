const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const titleCase = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getRiskStyle = (riskLevel) => {
  const risk = String(riskLevel || "unknown").toLowerCase();

  if (risk === "critical") return { background: "#fee2e2", color: "#7f1d1d", border: "1px solid #fecaca" };
  if (risk === "high") return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
  if (risk === "medium") return { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" };
  if (risk === "low") return { background: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0" };

  return { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" };
};

const getStatusStyle = (statusValue) => {
  const status = String(statusValue || "unknown").toLowerCase();

  if (status.includes("approved")) return { background: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0" };
  if (status.includes("reject") || status.includes("denied")) return { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" };
  if (status.includes("review") || status.includes("pending")) return { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };

  return { background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" };
};

function TransactionTable({ transactions, onRunWorkflow, isLoading, runningTransactionId }) {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Financial Transactions</h2>
          <p style={subtitleStyle}>Live transaction records with risk and workflow controls.</p>
        </div>
        <span style={countStyle}>{transactions.length} records</span>
      </div>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Transaction ID</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Risk</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Fraud Score</th>
              <th style={thStyle}>Escalation</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => {
              const isRunning = runningTransactionId === tx.transaction_id;

              return (
                <tr key={tx.transaction_id} style={trStyle}>
                  <td style={strongTdStyle}>{tx.transaction_id}</td>
                  <td style={tdStyle}>{titleCase(tx.department)}</td>
                  <td style={tdStyle}>{currencyFormatter.format(Number(tx.amount) || 0)}</td>
                  <td style={tdStyle}>
                    <span style={{ ...badgeStyle, ...getRiskStyle(tx.risk_level) }}>
                      {titleCase(tx.risk_level)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ ...badgeStyle, ...getStatusStyle(tx.approval_status) }}>
                      {titleCase(tx.approval_status)}
                    </span>
                  </td>
                  <td style={tdStyle}>{tx.fraud_score ?? "N/A"}</td>
                  <td style={tdStyle}>
                    <span style={tx.escalation_required ? escalationYesStyle : escalationNoStyle}>
                      {tx.escalation_required ? "Required" : "Clear"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        ...buttonStyle,
                        ...(isRunning ? buttonBusyStyle : {}),
                      }}
                      onClick={() => onRunWorkflow(tx.transaction_id)}
                      disabled={isRunning || Boolean(runningTransactionId)}
                    >
                      {isRunning ? "Running..." : "Run AI Workflow"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {!transactions.length && (
              <tr>
                <td style={emptyCellStyle} colSpan="8">
                  {isLoading ? "Loading transactions..." : "No transactions returned from the backend."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const containerStyle = {
  marginTop: "32px",
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
  background: "#f1f5f9",
  color: "#334155",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const tableWrapStyle = {
  maxHeight: "440px",
  overflowX: "auto",
  overflowY: "auto",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "920px",
};

const thStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1,
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
  verticalAlign: "middle",
};

const strongTdStyle = {
  ...tdStyle,
  color: "#0f172a",
  fontWeight: 800,
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "24px",
  padding: "3px 9px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const escalationYesStyle = {
  ...badgeStyle,
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
};

const escalationNoStyle = {
  ...badgeStyle,
  background: "#f8fafc",
  color: "#475569",
  border: "1px solid #e2e8f0",
};

const buttonStyle = {
  padding: "9px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#0f172a",
  color: "#ffffff",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const buttonBusyStyle = {
  background: "#475569",
  cursor: "wait",
};

const emptyCellStyle = {
  padding: "34px 14px",
  color: "#64748b",
  textAlign: "center",
  background: "#f8fafc",
};

export default TransactionTable;
