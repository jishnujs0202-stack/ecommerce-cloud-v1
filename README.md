# E-Commerce Cloud V1 – Three-Tier E-Commerce Application

A simple three-tier E-Commerce application designed and deployed using **AWS cloud services**, **Linux**, **Nginx**, **Flask**, and **MySQL**.

The project demonstrates how the presentation, application, and database layers can be separated and deployed across different cloud resources with controlled network communication.

---

## 📌 Project Overview

The application provides a simple online shopping interface where users can:

- View available products
- Search products
- Add products to a shopping cart
- Update cart quantities
- Proceed through a demo checkout flow

The main objective of the project is to demonstrate **three-tier architecture, cloud deployment, virtualization concepts, networking, and communication between application tiers**.

---

## 🏗️ Architecture

```text
                         INTERNET
                             │
                             ▼
                ┌─────────────────────┐
                │      WEB TIER       │
                │      AWS EC2        │
                │                     │
                │       Nginx         │
                │   Public Subnet     │
                └──────────┬──────────┘
                           │
                           │ HTTP / API
                           │
                           ▼
                ┌─────────────────────┐
                │     APPLICATION     │
                │        TIER         │
                │      AWS EC2        │
                │                     │
                │       Flask         │
                │   Private Subnet    │
                └──────────┬──────────┘
                           │
                           │ MySQL : 3306
                           │
                           ▼
                ┌─────────────────────┐
                │     DATABASE TIER   │
                │      Amazon RDS     │
                │       MySQL         │
                │   Private Network   │
                └─────────────────────┘
