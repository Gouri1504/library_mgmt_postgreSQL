# Library Management System

This is a simplified Library Management System built as part of an assignment to demonstrate CRUD operations, RESTful API design, database interaction, and frontend development.

## 🌐 Deployed Links  
🚀 **Live Frontend**: [Click Here](https://library-mgmt-postgresql.onrender.com/)  
🚀 **Live Backend**: [Click Here](https://library-mgmt-f5ae.onrender.com/)  

---

## 📹 Project Explanation Video  
🎥 **Task -2 Video Link**: [Watch Here](https://drive.google.com/file/d/1kQy1JxEGaLws5mOaBPOxCoHZiqS393A2/view?usp=sharing) 

🎥 **Task -1 Video Link**: [Watch Here](https://drive.google.com/file/d/186Ari4mFjpEzOMzyMHTbCZqTsJEOAu4f/view?usp=drive_link)  

---

## 📸 Screenshots

### **1. Database Setup**

- **Creating Tables:**  
![Creating Tables](screenshots/creating_tables.png)

- **Inserting Data:**  
![Inserting Data](screenshots/inserting_data.png)

### **2. API Requests**

#### a) **Unauthorized API Request (Without API Key)**
- **Unauthorized API Call:**  
![Unauthorized API Call](screenshots/unauthorized_api.png)

#### b) **Authorized API Request (With API Key)**
- **Authorized API Call:**  
![Authorized API Call](screenshots/authorized_api.png)

#### c) **Fetching Books Data**
- **Get All Books:**  
![Get All Books](screenshots/get_all_books.png)

- **Get Book By ID:**  
![Get Book By ID](screenshots/get_book_by_id.png)

### **3. Frontend Dashboard**

- **Frontend Dashboard: Filtering Books by Date**  
![Frontend Dashboard](screenshots/frontend_dashboard.png)

- **Members Dashboard:**  
![Members Dashboard](screenshots/members_dashboard.png)

- **Books Dashboard:**  
![Books Dashboard](screenshots/books_dashboard.png)

- **Issuance Dashboard:**  
![Issuance Dashboard](screenshots/issuance_dashboard.png)

### **4. Functionality Demonstrations**

- **Adding a Book:**  
![Adding a Book](screenshots/adding_book.png)

- **Editing a Member:**  
![Editing a Member](screenshots/edit_member.png)

### **5. Logging Mechanism**

- **Log File Configuration:**  
![Log File Configuration](screenshots/log_file_config.png)

- **Sample Log Entries:**  
![Sample Log Entries](screenshots/sample_log.png)

### **6. Containerization (Docker)**

- **Dockerfile Setup:**  
![Dockerfile](screenshots/dockerfile.png)

- **Docker-Compose Setup:**  
![Docker-Compose](screenshots/docker-compose.png)

- **Mounted Volumes:**  
![Mounted Volumes](screenshots/mounted_volumes.png)

- **Running Containers:**  
![Running Containers](screenshots/running_containers.png)

### **7. Simulating Deployment**

- **Code Change:**  
![Code Change](screenshots/code_change.png)

- **Rebuilding Containers:**  
![Rebuilding Containers](screenshots/rebuilding_containers.png)

- **Deployment Output**  
![Deployment Output](screenshots/deployment_output.png)

---

## ✨ Features

* **Member Management:**
    - View, Add, Edit, and Delete members.
* **Book Management:**
    - View, Add, and Delete books.
* **Issuance Management:**
    - Issue new books to members.
    - Track book issuance and return status.
* **Dashboard:**
    - Simple dashboard showing issued books and the ability to filter books by date.
* **API Key Authentication:**
    - Basic API Key security to prevent unauthorized access to the API endpoints.

---

## 🛠 Technologies Used

### **Backend**
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client for Node.js)
- dotenv (for managing environment variables)
- cors (for handling Cross-Origin Resource Sharing)

### **Frontend**
- React
- Axios (for making API requests)

### **Development Tools**
- Visual Studio Code (VS Code)
- pgAdmin (PostgreSQL administration tool)
- psql (PostgreSQL command-line tool)
- Bruno (API testing tool)

---

## 🏗️ Setup Instructions

### **1. Clone the Repository**

```bash
git clone https://github.com/Gouri1504/library_mgmt_postgreSQL
cd library_mgmt_postgreSQL
```

### **2. Backend Setup**

- **Install Node.js Dependencies:**

  ```bash
  cd backend
  npm install
  ```

- **Configure Environment Variables:**
  - Create a `.env` file in the `backend` directory.
  - Add the following credentials:

    ```
    DB_USER=postgres
    DB_HOST=db
    DB_NAME=library_mgmt
    DB_PASS=root
    DB_PORT=5432
    API_KEY=API123
    PORT=3000
    DB_URL=postgresql://library_mgmt_user:dBMQWEvgMoFXW5oW11D6dDeVeQwbOhgA@dpg-cuvgbflds78s73clb7sg-a.singapore-postgres.render.com/library_mgmt
    NODE_ENV=production
    ```

- **Start the Backend Server:**

  ```bash
  npm start
  ```

### **3. Frontend Setup**

- **Install React Dependencies:**

  ```bash
  cd ../frontend
  npm install
  ```

- **Start the React Application:**

  ```bash
  npm start
  ```

---

## 🌍 API Endpoints

**Books:**
- `GET /book` → Get all books.
- `GET /book/:id` → Get a book by ID.
- `POST /book` → Create a new book.
- `PUT /book/:id` → Update a book.
- `DELETE /book/:id` → Delete a book.

**Members:**
- `GET /member` → Get all members.
- `GET /member/:id` → Get a member by ID.
- `POST /member` → Create a new member.
- `PUT /member/:id` → Update a member.
- `DELETE /member/:id` → Delete a member.

**Issuance:**
- `GET /issuance` → Get all issuance records.
- `POST /issuance` → Issue a new book.
- `GET /issuance/pending?date=YYYY-MM-DD` → Get pending books for a specific date.

📌 **Note:** All API requests require an `x-api-key` header.

---

## 🔮 Future Improvements

✔ Implement user authentication and authorization.  
✔ Add advanced search capabilities for books and members.  
✔ Improve UI design and user experience.  
✔ Implement error handling and validation.  
✔ Add unit tests for backend API.  
✔ Enhance security (e.g., HTTPS, password hashing).  
✔ Implement **Edit Functionality** for Books.  

---

