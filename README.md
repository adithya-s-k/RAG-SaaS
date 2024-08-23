# RAG-SaaS: Ship RAG Solutions Quickly

![RAG SAAS](./assets/banner.png)

[![GitHub Stars](https://img.shields.io/github/stars/adithya-s-k/RAG-SaaS?style=social)](https://github.com/adithya-s-k/RAG-SaaS/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/adithya-s-k/RAG-SaaS?style=social)](https://github.com/adithya-s-k/RAG-SaaS/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/adithya-s-k/RAG-SaaS)](https://github.com/adithya-s-k/RAG-SaaS/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/adithya-s-k/RAG-SaaS)](https://github.com/adithya-s-k/RAG-SaaS/pulls)
[![License](https://img.shields.io/github/license/adithya-s-k/RAG-SaaS)](https://github.com/adithya-s-k/RAG-SaaS/blob/main/LICENSE)

RAG-SaaS is a complete Software-as-a-Service (SaaS) template for Retrieval-Augmented Generation (RAG) based applications. It provides a customizable, end-to-end solution for developers looking to quickly deploy RAG systems without worrying about the underlying infrastructure.

## 🚀 Features

- 🔐 Basic Authentication
- 💬 Chat History Tracking
- 🧠 Multiple RAG Variations
  - Basic RAG
  - Two additional configurations
- 👨‍💼 Admin Dashboard
  - 📥 Data Ingestion
  - 📊 Monitoring
  - 🔄 RAG Configuration Switching
- 🗄️ S3 Integration for PDF uploads
- 🐳 Easy Deployment with Docker / Docker Compose

## 🏗️ Tech Stack

- 🦙 LlamaIndex: For building and deploying RAG pipelines
- 📦 MongoDB: Used as both a normal database and a vector database
- ⚡ FastAPI: Backend API framework
- ⚛️ Next.js: Frontend framework

## 🌟 Why RAG-SaaS?

Setting up reliable RAG systems can be time-consuming and complex. RAG-SaaS allows developers to focus on fine-tuning their RAG pipeline rather than worrying about packaging it into a usable application. Built on top of [create-llama](https://www.llamaindex.ai/blog/create-llama-a-command-line-tool-to-generate-llamaindex-apps-8f7683021191) by LlamaIndex, RAG-SaaS provides a solid foundation for your RAG-based projects.

## 🚀 Quick Start

1. Clone the repository:

   ```
   git clone https://github.com/adithya-s-k/RAG-SaaS.git
   cd RAG-SaaS
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file with your specific configurations.

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🐳 Docker Deployment

To deploy RAG-SaaS using Docker:

1. Build the Docker image:

   ```
   docker build -t rag-saas .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 rag-saas
   ```

For Docker Compose deployment, use:

```
docker-compose up
```

## 🛠️ Configuration

### RAG Configurations

RAG-SaaS comes with three RAG configurations out of the box. You can switch between these in the Admin Dashboard or modify them in the `config/rag_configs.py` file.

### S3 Integration

To enable S3 integration for PDF uploads:

1. Set the following environment variables in your `.env` file:

   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_BUCKET_NAME=your_bucket_name
   ```

2. Update the S3 configuration in `config/s3_config.py` if needed.

## 👥 Contributing

We welcome contributions to RAG-SaaS! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to get started.

## 📄 License

RAG-SaaS is open-source software licensed under the [MIT license](LICENSE).

## 🙏 Acknowledgements

- [LlamaIndex](https://www.llamaindex.ai/) for the create-llama tool
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)

## 📞 Contact

For any inquiries or support, please open an issue on this repository or contact the maintainers directly.
