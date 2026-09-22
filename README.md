# ECommerce Full Stack

A full-stack e-commerce application built with **ASP.NET Core Web API** and **Angular**, designed to demonstrate modern backend and frontend development practices.

## 🚀 Tech Stack

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQL Server
* RESTful APIs
* JWT Authentication
* Dependency Injection
* DTOs
* Entity Framework Core Migrations

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* Angular Services
* Route Guards
* HTTP Interceptors
HomePage:
https://github.com/user-attachments/assets/325a758a-88db-4ebc-905f-a5e077c560c7
## 📁 Project Structure

```text
ECommerce-FullStack/
│
├── ECommerce.API/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── ECommerce.API.csproj
│
├── ecommerce-client/
│   ├── src/
│   ├── public/
│   ├── angular.json
│   └── package.json
│
└── .gitignore
```

## ✨ Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected Angular routes
* JWT HTTP interceptor

### Products

* Product management
* Product listing
* Product details
* Product categories

### Shopping Cart

* Add products to cart
* Update cart items
* Remove cart items
* Cart management

### Orders

* Order creation
* Order management
* Order status handling

## 🔐 Authentication Flow

The application uses JWT authentication between the Angular frontend and ASP.NET Core Web API.

```text
Angular
   │
   │ Login
   ▼
ASP.NET Core Web API
   │
   │ JWT Token
   ▼
Angular
   │
   │ Authorization: Bearer Token
   ▼
Protected API Endpoints
```

## 🛠️ Getting Started

### Prerequisites

Make sure you have installed:

* .NET SDK
* SQL Server
* Node.js
* Angular CLI
* Visual Studio or VS Code

### Backend Setup

Navigate to the API project:

```bash
cd ECommerce.API
```

Restore dependencies:

```bash
dotnet restore
```

Update the SQL Server connection string in:

```text
appsettings.json
```

Apply Entity Framework Core migrations:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

### Frontend Setup

Open another terminal and navigate to:

```bash
cd ecommerce-client
```

Install dependencies:

```bash
npm install
```

Run Angular:

```bash
ng serve
```

Then open the Angular application in your browser.

## 🗄️ Database

The backend uses **SQL Server** with **Entity Framework Core** for data access and database migrations.

The database contains entities related to:

* Users
* Products
* Categories
* Cart
* Cart Items
* Orders
* Order Items

## 🔄 Application Architecture

```text
┌──────────────────────┐
│   Angular Frontend   │
│   TypeScript         │
└──────────┬───────────┘
           │ HTTP / REST
           ▼
┌──────────────────────┐
│ ASP.NET Core Web API │
│ Controllers          │
│ Services             │
│ DTOs                 │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Entity Framework     │
│ Core                 │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      SQL Server      │
└──────────────────────┘
```

## 📌 Project Status

This project is actively being developed as a full-stack e-commerce application.

New features, improvements, and refinements will be added progressively.

## 🎯 Purpose

This project demonstrates practical experience building a complete web application using modern **.NET and Angular technologies**, including API development, database integration, authentication, frontend routing, and communication between frontend and backend.

## 👨‍💻 Author

**Mubasher**

ASP.NET Full Stack Developer

* GitHub: [@mubasherjam](https://github.com/mubasherjam)

## 📄 License

This project is for educational and portfolio purposes.
