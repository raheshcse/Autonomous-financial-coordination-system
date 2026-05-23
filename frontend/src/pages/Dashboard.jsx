import AuditTrailModal from "../components/AuditTrailModal";
import { useCallback, useEffect, useState } from "react";
import {
  getRiskSummary,
  getDepartmentSpend,
  getStatusSummary,
  getTransactions,
  runFinancialWorkflow,
} from "../services/api";

import TransactionTable from "../components/TransactionTable";
import GovernanceWarnings from "../components/GovernanceWarnings";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});

const RISK_COLORS = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#dc2626",
  critical: "#7f1d1d",
  unknown: "#64748b",
};

const STATUS_COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#64748b"];

const toNumber = (value) => Number(value) || 0;
const titleCase = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function Dashboard() {
  const [riskSummary, setRiskSummary] = useState([]);
  const [departmentSpend, setDepartmentSpend] = useState([]);
  const [statusSummary, setStatusSummary] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [workflowResult, setWorkflowResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [runningTransactionId, setRunningTransactionId] = useState(null);

  const loadDashboardData = useCallback(async () => {
  try {
    setIsLoading(true);
    setErrorMessage("");

    const [risk, spend, status, txns] = await Promise.all([
      getRiskSummary(),
      getDepartmentSpend(),
      getStatusSummary(),
      getTransactions(),
    ]);

    setRiskSummary(risk);
    setDepartmentSpend(spend);
    setStatusSummary(status);
    setTransactions(txns);
  } catch (error) {
    console.error("Dashboard load error:", error);
    setErrorMessage(
      "Unable to load dashboard data. Please confirm the backend is running on http://127.0.0.1:8000."
    );
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadDashboardData();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadDashboardData]);

  const handleRunWorkflow = async (transactionId) => {
    try {
      setRunningTransactionId(transactionId);
      setErrorMessage("");

      const result = await runFinancialWorkflow(transactionId);

      setWorkflowResult(result);

      await loadDashboardData();
    } catch (error) {
      console.error("Workflow execution error:", error);
      setErrorMessage(
        "The AI workflow could not be completed. Please check the backend and try again."
      );
    } finally {
      setRunningTransactionId(null);
    }
  };

  const totalSpend = transactions.reduce(
    (sum, tx) => sum + toNumber(tx.amount),
    0
  );

  const highRiskCount = transactions.filter(
    (tx) => ["high", "critical"].includes(String(tx.risk_level).toLowerCase())
  ).length;

  const departmentChartData = departmentSpend.map((item) => ({
    department: titleCase(item.department),
    total_spend: toNumber(item.total_spend ?? item.spend ?? item.amount),
  }));

  const riskChartData = riskSummary.map((item) => ({
    risk_level: titleCase(item.risk_level ?? item.risk),
    count: toNumber(item.count ?? item.total),
    fill: RISK_COLORS[String(item.risk_level ?? item.risk).toLowerCase()] || RISK_COLORS.unknown,
  }));

  const statusChartData = statusSummary.map((item) => ({
    approval_status: titleCase(item.approval_status ?? item.status),
    count: toNumber(item.count ?? item.total),
  }));

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>AI Financial Governance</p>
          <h1 style={headingStyle}>Autonomous Financial Coordination System</h1>
          <p style={subheadingStyle}>
            Monitor transaction risk, approval status, spend patterns, and agent decisions from one operational dashboard.
          </p>
        </div>

        <button style={refreshButtonStyle} onClick={loadDashboardData} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </section>

      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

      <div style={metricGridStyle}>
        <div style={cardStyle}>
          <span style={metricLabelStyle}>Total Transactions</span>
          <strong style={metricValueStyle}>{isLoading ? "..." : transactions.length}</strong>
          <span style={metricHintStyle}>Records loaded from backend</span>
        </div>

        <div style={cardStyle}>
          <span style={metricLabelStyle}>Total Spend</span>
          <strong style={metricValueStyle}>{isLoading ? "..." : currencyFormatter.format(totalSpend)}</strong>
          <span style={metricHintStyle}>Calculated from transaction amounts</span>
        </div>

        <div style={cardStyle}>
          <span style={metricLabelStyle}>High Risk Items</span>
          <strong style={{ ...metricValueStyle, color: highRiskCount > 0 ? "#b91c1c" : "#0f172a" }}>
            {isLoading ? "..." : highRiskCount}
          </strong>
          <span style={metricHintStyle}>High and critical risk levels</span>
        </div>
      </div>

      <div style={chartGridStyle}>
        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={sectionTitleStyle}>Department Spend</h2>
            <span style={smallPillStyle}>{departmentChartData.length} departments</span>
          </div>

          <div style={chartBodyStyle}>
            {departmentChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="department" tick={{ fill: "#475569", fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => compactCurrencyFormatter.format(value)} tick={{ fill: "#475569", fontSize: 12 }} />
                  <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                  <Bar dataKey="total_spend" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={emptyStateStyle}>{isLoading ? "Loading spend data..." : "No spend data available."}</div>
            )}
          </div>
        </div>

        <div style={chartCardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={sectionTitleStyle}>Risk Summary</h2>
            <span style={smallPillStyle}>{highRiskCount} elevated</span>
          </div>

          <div style={chartBodyStyle}>
            {riskChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskChartData}
                    dataKey="count"
                    nameKey="risk_level"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={3}
                  >
                    {riskChartData.map((item) => (
                      <Cell key={item.risk_level} fill={item.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={emptyStateStyle}>{isLoading ? "Loading risk data..." : "No risk data available."}</div>
            )}
          </div>
        </div>

        <div style={{ ...chartCardStyle, gridColumn: "1 / -1" }}>
          <div style={cardHeaderStyle}>
            <h2 style={sectionTitleStyle}>Approval Status</h2>
            <span style={smallPillStyle}>{statusChartData.length} statuses</span>
          </div>

          <div style={chartBodyStyle}>
            {statusChartData.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="approval_status" tick={{ fill: "#475569", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusChartData.map((_, index) => (
                      <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={emptyStateStyle}>{isLoading ? "Loading status data..." : "No status data available."}</div>
            )}
          </div>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        onRunWorkflow={handleRunWorkflow}
        isLoading={isLoading}
        runningTransactionId={runningTransactionId}
      />

      <GovernanceWarnings result={workflowResult} />
      <AuditTrailModal result={workflowResult} />
    </div>
  );
}

const cardStyle = {
  padding: "22px",
  border: "1px solid #dbe3ef",
  borderRadius: "8px",
  background: "#ffffff",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
};

const chartCardStyle = {
  padding: "22px",
  border: "1px solid #dbe3ef",
  borderRadius: "8px",
  background: "#ffffff",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
};

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 32px 96px",
  background: "#f5f7fb",
  color: "#0f172a",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const heroStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "flex-start",
  marginBottom: "24px",
};

const eyebrowStyle = {
  margin: "0 0 8px",
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const headingStyle = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 42px)",
  lineHeight: 1.1,
  color: "#0f172a",
};

const subheadingStyle = {
  maxWidth: "760px",
  margin: "12px 0 0",
  color: "#475569",
  fontSize: "16px",
  lineHeight: 1.6,
};

const refreshButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const errorStyle = {
  marginBottom: "20px",
  padding: "14px 16px",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#991b1b",
  fontWeight: 600,
};

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const metricLabelStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 800,
  textTransform: "uppercase",
};

const metricValueStyle = {
  display: "block",
  marginTop: "10px",
  color: "#0f172a",
  fontSize: "34px",
  lineHeight: 1,
};

const metricHintStyle = {
  display: "block",
  marginTop: "12px",
  color: "#64748b",
  fontSize: "13px",
};

const chartGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  marginBottom: "14px",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "18px",
};

const smallPillStyle = {
  padding: "5px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#3730a3",
  fontSize: "12px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const chartBodyStyle = {
  minHeight: "280px",
};

const emptyStateStyle = {
  display: "grid",
  placeItems: "center",
  minHeight: "260px",
  border: "1px dashed #cbd5e1",
  borderRadius: "8px",
  color: "#64748b",
  background: "#f8fafc",
};

export default Dashboard;
