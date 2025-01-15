module.exports = {
    apps: [
        {
            name: "backend", // Name of your backend process
            script: "npm",
            args: "start",
            cwd: "./backend", // Path to the backend directory
            env: {
            PORT: 2024,
            NODE_ENV: "production"
            }
        },
        {
            name: "frontend", // Name of your frontend process
            script: "npm",
            args: "start",
            cwd: "./frontend", // Path to the frontend directory
            env: {
            PORT: 2024,
            NODE_ENV: "production"
            }
        }
    ]
};