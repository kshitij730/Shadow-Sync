# ShadowSync | Distributed Context Engine

**ShadowSync** is a Real-Time Distributed Context Engine designed to give AI systems a shared memory, shared state, and shared understanding of user activity. It acts as the "central nervous system" for AI applications, bridging the gap between isolated interactions by capturing, transforming, embedding, and syncing context across a unified memory graph.

![ShadowSync Dashboard](https://github.com/kshitij730/Shadow-Sync/blob/main/Dashboard%20img.png)

## 🚀 Mission

LLMs today are stateless—every request acts as if nothing happened before. ShadowSync introduces statefulness.

> **"It lets AI systems remember, share knowledge, and stay in sync like humans do."**

## ⭐ Key Features

### 1. Context Capture Layer
*   **Universal Ingestion:** Captures raw text, thoughts, tasks, and facts via natural language input.
*   **AI Pre-processing:** Utilizes **Google Gemini 2.5 Flash** to normalize unstructured data into structured JSON objects.

### 2. Dynamic Knowledge Graph
*   **Visualization:** Powered by **D3.js**, this view visualizes the semantic connections between entities (People, Events, Concepts).
*   **Real-time Updates:** Nodes and links are dynamically added as new context is ingested.
*   **Force-Directed Layout:** Interactive physics-based rendering of the memory web.

### 3. Vector Embeddings Space
*   **Latent Projection:** A 2D visualization (using **Recharts**) of high-dimensional semantic vectors.
*   **Semantic Clustering:** visually groups related memories (e.g., separating "Work" thoughts from "Personal" memories).

### 4. Real-Time Event Bus
*   **System Transparency:** A scrolling log of all internal system operations (CAPTURE, PROCESS, EMBED, STORE, SYNC).
*   **Visual Status:** Color-coded events allow for immediate system health monitoring.

### 5. Context Agent
*   **Memory-Aware Chat:** An AI agent that has read-access to the knowledge graph.
*   **Retrieval Augmented Generation (RAG):** Queries are answered based *specifically* on the captured context history, not just general training data.

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (Cyberpunk/Dark Mode aesthetic)
*   **AI Model:** Google Gemini API (`gemini-2.5-flash`) via `@google/genai` SDK
*   **Visualization:**
    *   `d3` (Force-directed Knowledge Graphs)
    *   `recharts` (Vector Scatter Plots)
*   **Icons:** Lucide React

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/shadowsync.git
    cd shadowsync
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    ShadowSync requires a Google Gemini API Key to perform context extraction and agent reasoning.
    
    *   Create a `.env` file in the root.
    *   Add your key:
        ```env
        API_KEY=your_google_gemini_api_key_here
        ```
    *   *Note: In the web demo environment, this is handled via `process.env.API_KEY` injection.*

4.  **Run the Application**
    ```bash
    npm start
    ```

## 🧠 System Architecture Layers

The application simulates a robust 10-layer architecture:

1.  **Capture:** Standardizes inputs from text/voice.
2.  **Processing:** NLP extraction of entities and relationships.
3.  **Graph Builder:** Updates the semantic node network.
4.  **Vector Store:** Manages embedding coordinates.
5.  **Consistency:** Simulates distributed state sync (latency/replication).
6.  **Event Bus:** Pub/Sub system for UI updates.
7.  **Context API:** Interface for the Agent to retrieve memory.
8.  **Agent Coordination:** The chat interface logic.
9.  **Local Cache:** Browser-state management.
10. **Identity:** User-specific memory isolation.

## 🔮 Usage Guide

1.  **Ingest:** Type a sentence like *"I have a meeting with Sarah at 2 PM regarding the Apollo Project"* into the bottom input bar.
2.  **Observe:** Watch the **Event Bus** on the right trigger `CAPTURE`, `PROCESS`, and `STORE` events.
3.  **Visualize:**
    *   See "Sarah" (Person) and "Apollo Project" (Concept) appear in the **Knowledge Graph**.
    *   See a new point appear in the **Vector Space**.
4.  **Query:** Go to the **Agent** tab and ask: *"When is my meeting with Sarah?"*. The agent will retrieve the specific memory and answer.

## 📄 License

MIT License.
