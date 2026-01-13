# ISI Project - SmartGuide

SmartGuide is a GIS-based web application designed to help tourists and history enthusiasts explore Bucharest. It provides personalized monument recommendations based on user preferences and calculates optimized travel itineraries using the ArcGIS Maps SDK.

&nbsp;

Before you begin, ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended for deployment)
* [Node.js](https://nodejs.org/)
* [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

&nbsp;

## Installation
Unzip the project archive to your desired location. 


Install dependencies - open a terminal in the project root and install the frontend dependencies:
```bash
cd smart-guide-project
npm install
```

## Running the Application

### Deployment via Docker


1. Navigate to the root directory (where `compose.yaml` is located).
2. Run the following command (for first setup `--build` is required):

```bash
docker-compose up -d --build
```
> **Note**: If you get any errors while building (i.e. `cannot find module`), try manually installing the modules by executing `npm install` in the corresponding folders.
3. Access the application: `http://localhost:4200` (frontend)

&nbsp;

### Local Development Mode (Angular)

To run the frontend with hot-reload for development:

```bash
cd smart-guide-project
ng serve
```

The application will be available at `http://localhost:4200`.