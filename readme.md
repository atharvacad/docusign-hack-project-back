# Docusign Hack Project Backend

This is the backend API for the Docusign Hack Project. It allows you to create agreements by uploading PDF files and retrieve all agreements stored in the MongoDB database.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/docusign-hack-project-back.git
    cd docusign-hack-project-back
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Create a `.env` file:**

    Create a `.env` file in the root directory of the project with the following content:

    ```properties
    MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>
    DATABASE_NAME=docusign-hack-project
    COLLECTION_NAME=agreements
    PORT=3000
    OPENAI_API_KEY=your_openai_api_key
    ```

    Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials and cluster URL. Replace `your_openai_api_key` with your actual OpenAI API key.

## Running the Application

1. **Start MongoDB:**

    Ensure that MongoDB is running on your local machine or in a Docker container, or ensure that your MongoDB cloud instance is accessible.

2. **Run the application:**

    ```sh
    node src/app.js
    ```

    The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints

### Create or Update Agreement

- **URL:** `/api/agreements`
- **Method:** `POST`
- **Description:** Create a new agreement or update an existing agreement by uploading a PDF file.
- **Query Parameter:**
  - `update` (boolean, optional): If set to `true`, the endpoint will update an existing agreement. If not provided or set to `false`, the endpoint will create a new agreement.
- **Request Body:**
  - `companyName` (string): The name of the company.
  - `agreementName` (string): The name of the agreement.
  - `pdfFile` (file): The PDF file of the agreement.
- **Response:**
  - `201 Created`: Agreement processed successfully.
  - `404 Not Found`: Agreement not found (when `update=true`).
  - `500 Internal Server Error`: An error occurred while processing the agreement.

#### Example using Postman

1. **Create a New Agreement:**
    - **URL:** `http://localhost:3000/api/agreements`
    - **Method:** `POST`
    - **Body:** `form-data`
        - `companyName`: Enter the company name (e.g., "Example Company").
        - `agreementName`: Enter the agreement name (e.g., "Example Agreement").
        - `pdfFile`: Select a PDF file to upload.
    - **Send the Request.**

2. **Update an Existing Agreement:**
    - **URL:** `http://localhost:3000/api/agreements?update=true`
    - **Method:** `POST`
    - **Body:** `form-data`
        - `companyName`: Enter the company name (e.g., "Example Company").
        - `agreementName`: Enter the agreement name (e.g., "Example Agreement").
        - `pdfFile`: Select a PDF file to upload.
    - **Send the Request.**

### Get All Agreements

- **URL:** `/api/all-agreements`
- **Method:** `GET`
- **Description:** Retrieve all agreements stored in the MongoDB database.
- **Response:**
  - `200 OK`: A list of all agreements.
  - `500 Internal Server Error`: An error occurred while retrieving the agreements.

## License

This project is licensed under the MIT License.