# Task Manager

## Run locally

1. Start the backend from the `backend` directory with `npm start`. It needs
   `MONGODB_URI` in `backend/.env`; `PORT` is optional and defaults to `5000`.
2. Start the frontend from the `frontend` directory with `npm run dev`.

The frontend uses `http://localhost:5000` by default. To point it at another
backend, set `VITE_API_URL` to its origin before building, for example
`https://api.example.com`.

## Deploy

The root `render.yaml` defines the backend web service and frontend static site.
Create a Render Blueprint from the repository and enter `MONGODB_URI` and
`FRONTEND_URL` when prompted. Set `FRONTEND_URL` to the deployed frontend's
origin, including `https://`. Render supplies the backend `PORT` and populates
the frontend's `VITE_API_URL` from the backend service hostname.

The frontend build output is in `frontend/dist`.
