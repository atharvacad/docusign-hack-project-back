# Project Name

## Description

A brief description of your project.

## Installation

### Prerequisites

- Docker
- Node.js
- npm

### Steps

1. Clone the repository:

    ```sh
    git clone https://github.com/your-repo.git
    cd your-repo
    ```

2. Create a `.env` file in the root directory with the following content:

    ```env
    MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>
    DATABASE_NAME=docusign-hack-project
    COLLECTION_NAME=agreements
    PORT=3000
    OPENAI_API_KEY=your_openai_api_key
    ```

3. Build the Docker image:

    ```sh
    docker build -t docusign-hack-project-back .
    ```

4. Run the Docker container:

    ```sh
    docker run -p 3000:3000 --env-file .env docusign-hack-project-back
    ```

5. Access the API:

    ```markdown
    http://localhost:3000/api/all-agreements
    ```

## Usage

Provide examples of how to use your project.

## Contributing

Provide guidelines for contributing to your project.

## License

Include the license information for your project.