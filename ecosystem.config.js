module.exports = {
  apps: [
    {
      name: "a8n-backend",
      script: "uvicorn",
      args: "app.main:app --host 0.0.0.0 --port 8000",
      interpreter: "../venv/bin/python",
      cwd: "./backend/src",
      watch: false,
      env: {
        PYTHONUNBUFFERED: "1"
      }
    },
    {
      name: "a8n-executor-engine",
      script: "../venv/bin/python",
      args: "-m app.main",
      cwd: "./executor-engine/src",
      watch: false,
      env: {
        PYTHONUNBUFFERED: "1"
      }
    }
  ]
};

