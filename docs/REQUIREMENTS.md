# DevOps Challenge Requirements

## Overview
You have 3 days to containerize, deploy, and create a CI/CD pipeline for the provided Task Manager application. This challenge tests your Docker, orchestration, and automation skills.

## What's Already Done ✅
- Complete React frontend application
- Full Node.js backend API with health checks
- PostgreSQL database schema with sample data
- Redis caching layer integration
- Basic test suite for API endpoints
- API documentation and local setup guide

## Your DevOps Tasks 🚀

---

## Phase 1: Containerization (Day 1)

### Primary Objectives
- [ ] **Create Frontend Dockerfile**
  - Multi-stage build (build React app → serve with nginx)
  - Optimize for production (minimize image size)
  - Configure nginx to serve static files and proxy API calls

- [ ] **Create Backend Dockerfile**
  - Use appropriate Node.js base image
  - Install dependencies efficiently (leverage Docker layer caching)
  - Set up proper user permissions (don't run as root)
  - Include health check instruction

- [ ] **Create Docker Compose Configuration**
  - Define all services: frontend, backend, database, redis, nginx
  - Set up internal networking between services
  - Configure environment variables for each service
  - Set up persistent volumes for database data

- [ ] **Environment Management**
  - Create separate compose files for development and production
  - Manage secrets and environment variables securely
  - Configure service dependencies and startup order

### Success Criteria - Day 1
- ✅ `docker-compose up` starts all services successfully
- ✅ Frontend accessible at `http://localhost`
- ✅ Backend API responding at configured endpoint
- ✅ Database data persists between container restarts
- ✅ All services can communicate with each other

### Bonus Points - Day 1
- Container health checks implemented
- Image size optimization (multi-stage builds)
- Development vs production configurations
- Resource limits and constraints defined

---

## Phase 2: CI/CD Pipeline (Day 2)

### Primary Objectives
- [ ] **GitHub Actions Workflow Setup**
  - Create `.github/workflows/ci-cd.yml`
  - Trigger on push to main branch and pull requests
  - Set up job matrix for parallel processing

- [ ] **Automated Testing**
  - Run backend unit tests in pipeline
  - Frontend build validation
  - Docker image build verification
  - Basic security scanning (optional)

- [ ] **Container Registry Integration**
  - Push images to Docker Hub or GitHub Container Registry
  - Implement proper image tagging strategy
  - Use semantic versioning or commit-based tags

- [ ] **Automated Deployment**
  - Deploy to staging environment on main branch push
  - Deploy to production on release tags
  - Implement basic rollback mechanism

### Success Criteria - Day 2
- ✅ Pipeline runs automatically on code changes
- ✅ All tests pass before deployment
- ✅ Images built and pushed to registry successfully
- ✅ Staging deployment works automatically
- ✅ Pipeline fails gracefully on errors

### Bonus Points - Day 2
- Parallel job execution for faster builds
- Conditional deployments based on branch/tag
- Slack/email notifications on pipeline events
- Integration with code quality tools

---

## Phase 3: Production Deployment (Day 3)

### Primary Objectives
- [ ] **Nginx Reverse Proxy Configuration**
  - Set up nginx as reverse proxy for backend API
  - Configure static file serving for frontend
  - Implement load balancing if multiple backend instances

- [ ] **SSL/TLS Certificate Setup**
  - Configure Let's Encrypt certificates
  - Implement automatic certificate renewal
  - Set up HTTPS redirects

- [ ] **Health Checks and Monitoring**
  - Configure container health checks
  - Set up service restart policies
  - Implement basic logging aggregation
  - Create monitoring endpoints

- [ ] **Production Hardening**
  - Security headers configuration
  - Environment-specific configurations
  - Database backup strategy
  - Resource monitoring and limits

### Success Criteria - Day 3
- ✅ Production environment accessible via HTTPS
- ✅ SSL certificates working correctly
- ✅ Health checks preventing failed deployments
- ✅ Zero-downtime deployment capability
- ✅ Monitoring and logging functional

### Bonus Points - Day 3
- Advanced monitoring with metrics dashboards
- Automated backup and restore procedures
- Performance optimization and caching
- Infrastructure as Code documentation

---

## Deliverables 📋

### Required Files/Folders
```
your-deployment-repo/
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.Dockerfile
├── compose/
│   ├── docker-compose.dev.yml
│   ├── docker-compose.staging.yml
│   └── docker-compose.prod.yml
├── .github/workflows/
│   └── ci-cd.yml
├── nginx/
│   ├── nginx.conf
│   └── ssl-setup.sh
├── scripts/
│   ├── deploy.sh
│   ├── rollback.sh
│   └── backup.sh
├── docs/
│   ├── deployment-guide.md
│   ├── troubleshooting.md
│   └── architecture-diagram.md
└── README.md
```

### Documentation Requirements
1. **Deployment Guide** - Step-by-step deployment instructions
2. **Architecture Diagram** - Visual representation of the system
3. **Troubleshooting Guide** - Common issues and solutions
4. **Environment Setup** - Configuration for different environments
5. **Backup/Recovery** - Data backup and restore procedures

---

## Evaluation Criteria 📊

### Technical Implementation (60%)
- **Containerization Quality** (20%)
  - Proper Dockerfile best practices
  - Efficient layer caching and image optimization
  - Security considerations (non-root users, minimal base images)

- **CI/CD Pipeline Effectiveness** (20%)
  - Automated testing integration
  - Reliable build and deployment process
  - Proper error handling and rollback capabilities

- **Production Readiness** (20%)
  - SSL/TLS implementation
  - Monitoring and health checks
  - Security and performance configurations

### Documentation and Process (40%)
- **Documentation Quality** (20%)
  - Clear setup and deployment instructions
  - Comprehensive troubleshooting guides
  - Architecture and design decisions explained

- **DevOps Best Practices** (20%)
  - Environment separation and configuration management
  - Security considerations implemented
  - Monitoring and logging strategies

---

## Daily Milestones 🗓️

### Day 1 Checkpoint (End of Day)
- Application containerized and running via Docker Compose
- All services communicating properly
- Database data persisting correctly
- Basic documentation started

### Day 2 Checkpoint (End of Day)
- CI/CD pipeline functional and tested
- Images being built and pushed automatically
- Staging deployment working
- Pipeline failure handling verified

### Day 3 Final Submission
- Production environment fully configured
- SSL certificates implemented and working
- Complete documentation package
- Deployment process tested and verified

---

## Getting Help 🤝

### Allowed Resources
- ✅ Official Docker documentation
- ✅ GitHub Actions documentation
- ✅ Nginx configuration guides
- ✅ Stack Overflow and technical forums
- ✅ Mentor check-ins (scheduled)

### Not Allowed
- ❌ Modifying the provided application code
- ❌ Using pre-built deployment templates without understanding
- ❌ Skipping security considerations for "quick wins"

### Daily Check-ins
- **Morning**: Progress review and blocker discussion
- **End of Day**: Milestone verification and next day planning

---

## Success Tips 💡

1. **Start Simple**: Get basic containerization working before adding complexity
2. **Test Incrementally**: Verify each component works before moving to the next
3. **Document as You Go**: Don't leave documentation until the end
4. **Focus on Reliability**: A simple, working solution is better than a complex, broken one
5. **Ask Questions**: Use your daily check-ins to clarify requirements

**Remember**: This challenge simulates real-world DevOps scenarios. Focus on building reliable, maintainable solutions that someone else could operate and debug. Good luck! 🚀
