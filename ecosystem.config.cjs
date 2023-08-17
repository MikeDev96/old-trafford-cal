module.exports = {
  apps: [
    {
      name: "old-trafford-cal",
      script: "./src/index.js",
      out_file: "./logs/out.log",
      error_file: "./logs/err.log",
      time: true,
    },
  ],
}