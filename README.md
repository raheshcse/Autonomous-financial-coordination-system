# Autonomous Financial Coordination System

A full-stack AI-powered financial governance and workflow orchestration platform built using React, FastAPI, SQLite, SQLAlchemy, and LangGraph.

The system simulates enterprise-scale financial coordination processes including fraud analysis, vendor trust evaluation, compliance validation, risk escalation, audit trace generation, and executive approval workflows through multi-agent orchestration.

---

# Project Overview

This project was designed to demonstrate how AI agents can coordinate financial governance decisions across operational workflows in a modern enterprise environment.

The platform combines:

* AI-driven workflow orchestration
* Financial risk analysis
* Governance monitoring
* Fraud detection simulation
* Multi-agent decision pipelines
* Real-time analytics dashboards
* Full-stack API integration

The application provides both:

* Backend AI orchestration services
* Interactive frontend operational dashboard

---

# Key Features

## AI Multi-Agent Workflow System

The platform includes multiple autonomous agents responsible for different operational decisions:

* Vendor Trust Agent
* Financial Fraud Agent
* Compliance Agent
* Risk Escalation Agent
* Executive Decision Agent

Each agent contributes to the final governance outcome using LangGraph orchestration.

---

## Governance & Auditability

The platform simulates enterprise governance monitoring by generating:

* Governance warnings
* Escalation decisions
* Fraud risk analysis
* Confidence scoring
* Agent audit trails
* Workflow execution history

---

## Full-Stack Dashboard

The React dashboard provides:

* Transaction analytics
* Risk distribution charts
* Department spend analysis
* Approval status monitoring
* Workflow execution controls
* Audit trace visualization
* Real-time workflow refresh

---

# Technology Stack

## Frontend

* React
* Vite
* Axios
* Recharts

## Backend

* FastAPI
* Python
* LangGraph
* SQLAlchemy
* SQLite

## AI Workflow & Orchestration

* Multi-agent orchestration
* Workflow state management
* Governance drift simulation
* Agent audit tracing

---

# System Architecture

```text
React Frontend Dashboard
            ↓
FastAPI REST API Layer
            ↓
LangGraph Multi-Agent Workflow Engine
            ↓
SQLite Database + Governance Logging
```

---

# Workflow Execution Flow

```text
Transaction Submitted
        ↓
Vendor Trust Evaluation
        ↓
Fraud Risk Analysis
        ↓
Compliance Validation
        ↓
Risk Escalation Review
        ↓
Executive Decision Generation
        ↓
Governance Warnings + Audit Trail
```

---

# API Endpoints

## Core Endpoints

```text
GET /transactions
GET /analytics/risk-summary
GET /analytics/department-spend
GET /analytics/status-summary
POST /run-financial-coordination/{transaction_id}
```

---

# Dashboard Features

* Real-time analytics
* Fraud monitoring
* Governance tracking
* Audit trace visualization
* Risk escalation workflows
* Workflow execution controls

---

# Local Development Setup

## Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Project Goals

This project was created to explore:

* AI-native enterprise workflow systems
* Autonomous decision orchestration
* Governance-aware AI workflows
* Financial process automation
* Multi-agent coordination architectures
* Full-stack AI engineering

---

# Future Improvements

* Cloud deployment
* Authentication & RBAC
* Docker containerization
* PostgreSQL migration
* Real-time websocket updates
* AI observability metrics
* Advanced governance analytics

---

# Author

Rahesh Saravanan

AI Engineering | Full-Stack Development | Agentic Workflow Systems
