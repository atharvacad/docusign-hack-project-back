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
    ```

    Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB credentials and cluster URL.

## Running the Application

1. **Start MongoDB:**

    Ensure that MongoDB is running on your local machine or in a Docker container, or ensure that your MongoDB cloud instance is accessible.

2. **Run the application:**

    ```sh
    node src/app.js
    ```

    The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints

### Create Agreement

- **URL:** `/api/agreements`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Description:** Creates a new agreement by uploading a PDF file along with the company name and agreement name.

#### Request Body

- `companyName` (string): The name of the company.
- `agreementName` (string): The name of the agreement.
- `pdfFile` (file): The PDF file of the agreement.

#### Example using Postman

1. Open Postman and create a new `POST` request.
2. Set the URL to `http://localhost:3000/api/agreements`.
3. In the `Body` tab, select `form-data`.
4. Add the following fields:
    - `companyName`: Enter the company name (e.g., "Example Company").
    - `agreementName`: Enter the agreement name (e.g., "Example Agreement").
    - `pdfFile`: Select a PDF file to upload.
5. Click `Send`.

### Get All Agreements

- **URL:** `/api/all-agreements`
- **Method:** `GET`
- **Description:** Retrieves all agreements stored in the MongoDB database.

#### Example using Postman

1. Open Postman and create a new `GET` request.
2. Set the URL to `http://localhost:3000/api/all-agreements`.
3. Click `Send`.

## License

This project is licensed under the MIT License.