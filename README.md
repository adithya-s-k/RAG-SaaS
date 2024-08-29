<h2 align="center">RAG SaaS</h2>
<p align="center">
  Ship RAG solutions quickly⚡
</p>

<p align="center">
  <img alt="RAG-SaaS Logo" src="./assets/banner.png" width="80%">
</p>

<p align="center">
  <strong>A end to end SaaS Solution for Retrieval-Augmented Generation (RAG) <br> and Agentic based applications.</strong><br>

</p>

<p align="center">
  <a href="#-features">Features</a> ·
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-docker-compose-deployment">Deployment</a> ·
  <a href="#roadmap">Roadmap</a>
</p>

<p align="center">
  <a href="https://github.com/adithya-s-k/RAG-SaaS/stargazers">
    <img src="https://img.shields.io/github/stars/adithya-s-k/RAG-SaaS?style=social" alt="GitHub Stars">
  </a>
  <a href="https://github.com/adithya-s-k/RAG-SaaS/network/members">
    <img src="https://img.shields.io/github/forks/adithya-s-k/RAG-SaaS?style=social" alt="GitHub Forks">
  </a>
  <a href="https://github.com/adithya-s-k/RAG-SaaS/issues">
    <img src="https://img.shields.io/github/issues/adithya-s-k/RAG-SaaS" alt="GitHub Issues">
  </a>
  <a href="https://github.com/adithya-s-k/RAG-SaaS/pulls">
    <img src="https://img.shields.io/github/issues-pr/adithya-s-k/RAG-SaaS" alt="GitHub Pull Requests">
  </a>
  <a href="https://github.com/adithya-s-k/RAG-SaaS/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/adithya-s-k/RAG-SaaS" alt="License">
  </a>
</p>

## Features

- 🔐 Basic Authentication
- 💬 Chat History Tracking
- 🧠 Multiple RAG Variations
  - Basic RAG
  - Two additional configurations
- 👨‍💼 Admin Dashboard
  - 📥 Data Ingestion
  - 📊 Monitoring
  - 👁️ Observability
  - 🔄 RAG Configuration Switching
- 🗄️ S3 Integration for PDF uploads
- 🐳 Easy Deployment with Docker / Docker Compose

## Tech Stack

- 🦙 LlamaIndex: For building and orchestrating RAG pipelines
- 📦 MongoDB: Used as both a normal database and a vector database
- ⚡ FastAPI: Backend API framework
- ⚛️ Next.js: Frontend framework
- 🔍 Qdrant: Vector database for efficient similarity search
- 👁️ Arize Phoenix: Observability Platform to monitor/evaluate your RAG system

## 🌟 Why RAG-SaaS?

Setting up reliable RAG systems can be time-consuming and complex. RAG-SaaS allows developers to focus on fine-tuning and developing their RAG pipeline rather than worrying about packaging it into a usable application. Built on top of [create-llama](https://www.llamaindex.ai/blog/create-llama-a-command-line-tool-to-generate-llamaindex-apps-8f7683021191) by LlamaIndex, RAG-SaaS provides a solid foundation for your RAG-based projects.

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/adithya-s-k/RAG-SaaS.git
   cd RAG-SaaS
   ```

## 🐳 Docker Compose Deployment

### Environment Variables

<details>
<summary>🔑 How to Set up .env</summary>

### Environment Variables

To properly configure and run RAG-SaaS, you need to set up several environment variables. These are divided into three main sections: Frontend, Backend, and Docker Compose. Here's a detailed explanation of each:

#### Frontend Environment (./frontend/.env.local)

- `NEXT_PUBLIC_SERVER_URL`: (Compulsory) The endpoint URL of your FastAPI server.
- `NEXT_PUBLIC_CHAT_API`: (Compulsory) Derived from NEXT_SERVER_URL, typically set to `${NEXT_PUBLIC_SERVER_URL}/api/chat`.

#### Backend Environment (./backend/.env)

1. Model Configuration:

   - `MODEL_PROVIDER`: (Compulsory) The AI model provider (e.g., 'openai').
   - `MODEL`: (Compulsory) The name of the LLM model to use.
   - `EMBEDDING_MODEL`: (Compulsory) The name of the embedding model.
   - `EMBEDDING_DIM`: (Compulsory) The dimensionality of the embedding model.

2. OpenAI Configuration:

   - `OPENAI_API_KEY`: (Compulsory) Your OpenAI API key.

3. Application Settings:

   - `CONVERSATION_STARTERS`: (Compulsory) A list of starter questions for users.
   - `SYSTEM_PROMPT`: (Compulsory) The system prompt for the AI model.
   - `SYSTEM_CITATION_PROMPT`: (Optional) Additional prompt for citation.
   - `APP_HOST`: (Compulsory) The host address for the backend (default: '0.0.0.0').
   - `APP_PORT`: (Compulsory) The port for the backend (default: 8000).

4. Database Configuration:

   - `MONGODB_URI`: (Compulsory) The MongoDB connection URI.
   - `MONGODB_NAME`: (Compulsory) The MongoDB database name (default: 'RAGSAAS').
   - `QDRANT_URL`: (Compulsory) The URL for the Qdrant server.
   - `QDRANT_COLLECTION`: (Compulsory) The Qdrant collection name.
   - `QDRANT_API_KEY`: (Optional) API key for Qdrant authentication.

5. Authentication:

   - `JWT_SECRET_KEY`: (Compulsory) Secret key for signing JWT tokens.
   - `JWT_REFRESH_SECRET_KEY`: (Compulsory) Secret key for signing JWT refresh tokens.
   - `ADMIN_EMAIL`: (Compulsory) Administrator email for application login.
   - `ADMIN_PASSWORD`: (Compulsory) Administrator password for application login.

6. AWS S3 Configuration (Optional):

   - `AWS_ACCESS_KEY_ID`: AWS Access Key ID.
   - `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key.
   - `AWS_REGION`: AWS Region for your services.
   - `BUCKET_NAME`: The name of the S3 bucket to use.

7. Observability:
   - `ARIZE_PHOENIX_ENDPOINT`: (Optional) Endpoint for Arize Phoenix observability.

#### S3 Integration

To enable S3 integration for PDF uploads/Ingestion:

1. Set the following environment variables in your `.env` file:

```

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=bucket_region
BUCKET_NAME=your_bucket_name

```

### Docker Compose Env (./env)

```
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: ragsaas/backend:latest
    container_name: backend
    ports:
      - '8000:8000'
    environment:
      # MongoDB Configuration
      MONGODB_NAME: RAGSAAS
      MONGODB_URI: mongodb://admin:password@mongodb:27017/
      # Qdrant Configuration
      QDRANT_COLLECTION: default
      QDRANT_URL: http://qdrant:6333
      # QDRANT_API_KEY:
      # OPENAI_API_KEY is compulsory
      OPENAI_API_KEY:
      # Backend Application Configuration
      MODEL_PROVIDER: openai
      MODEL: gpt-4o-mini
      EMBEDDING_MODEL: text-embedding-3-small
      EMBEDDING_DIM: 1536
      FILESERVER_URL_PREFIX: http://backend:8000/api/files
      SYSTEM_PROMPT: 'You are a helpful assistant who helps users with their questions.'
      APP_HOST: 0.0.0.0
      APP_PORT: 8000
      JWT_SECRET_KEY:
      JWT_REFRESH_SECRET_KEY:
      ARIZE_PHOENIX_ENDPOINT: http://arizephoenix:4317
```

</details>

For Docker Compose deployment, use:

```bash
docker compose up -d
```

Pull down the containers

```bash
docker compose down
```

### Development Mode

To run the project in development mode, follow these steps:

1. **Start the Next.js Frontend:**

   Navigate to the `frontend` directory and install the required dependencies. Then, run the development server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Set Up the Vector Database (Qdrant), Database (MongoDB), and Observability Platform (Arize Phoenix):**

   You can either self-host these services using Docker or use hosted solutions.

   **Self-Hosted Options:**

   - Qdrant:

     ```bash
     docker pull qdrant/qdrant
     ```

   - MongoDB:

     ```bash
     docker pull mongo
     ```

   - Arize Phoenix:
     ```bash
     docker pull arizephoenix/phoenix
     ```

   **Hosted Options:**

   - Qdrant Cloud: [Qdrant Cloud](https://cloud.qdrant.io/)
   - MongoDB Atlas: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Arize Phoenix: [Arize Phoenix](https://app.phoenix.arize.com/)

3. **Start the FastAPI Server:**

   Navigate to the `backend` directory and set up the Python environment. You can use either Conda or Python's built-in `venv`:

   ```bash
   cd backend
   ```

   **Using Conda:**

   ```bash
   conda create -n ragsaas-venv python=3.11
   conda activate ragsaas-venv
   ```

   **Using Python's `venv`:**

   ```bash
   python -m venv ragsaas-venv
   \ragsaas-venv\Scripts\activate  # On Windows
   source ragsaas-venv/bin/activate  # On macOS/Linux
   ```

   Install the required dependencies and run the server:

   ```bash
   pip install -e .
   python main.py
   ```

---

## Roadmap

- [x] add support to store ingested data in AWS S3
- [x] Add Docker compose for each set up
- [x] Implement Observability
- [ ] Improve authentication system
- [ ] Integrate OmniParse API for efficient Data ingestion
- [ ] Provide more control to Admin over RAG configuration
- [ ] Implement Advanced and Agentic RAG

## 👥 Contributing

We welcome contributions to RAG-SaaS! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to get started.

## 📄 Licensing

This project is available under a dual license:

- Apache License 2.0 for students, developers, and individuals
- GNU General Public License v3.0 for companies and commercial use

See the [LICENSING.md](LICENSING.md) file for more details.

## 🙏 Acknowledgements

This project is built on the following frameworks, technologies and tools:

- [LlamaIndex](https://www.llamaindex.ai/) for the create-llama tool and RAG orchestration
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Qdrant](https://qdrant.tech/)
- [Arize Phoenix](https://docs.arize.com/phoenix)

## Contact & Support

### Bug Reports

If you encounter any issues or bugs, please report them in the [Issues](https://github.com/adithya-s-k/RAG-SaaS/issues) tab of our GitHub repository.

### Commercial Use & Custom Solutions

For inquiries regarding:

- Commercial licensing
- Custom modifications
- Managed deployment
- Specialized integrations

Please contact: adithyaskolavi@gmail.com

We're here to help tailor RAG-SaaS to your specific needs and ensure you get the most out of our solution.

## Star History

<p align="center">
  <a href="https://cognitivelab.in">
    <img src="https://api.star-history.com/svg?repos=adithya-s-k/RAG-SaaS&type=Date" alt="Star History Chart">
  </a>
</p>
