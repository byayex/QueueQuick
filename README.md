# QueueQuick - Repo

Welcome to the QueueQuick repository! QueueQuick is a SaaS project aimed at providing entrepreneurs with the ability to create waitlists not just for email, but for multiple other channels like WhatsApp and more.

## Getting Started

Use

```bash
npm install --legacy-peer-deps
```

to install the frontend npm packages

### Backend

To start the backend, use the following commands:

#### Development
```bash
go run main.go api.go serve
```
##### Production
```bash
go build main.go api.go
```
This will build an executable for production use.

### Frontend

To start the frontend, use the following commands:

#### Development
```bash
ng serve
```

#### Production
```bash
ng build
```