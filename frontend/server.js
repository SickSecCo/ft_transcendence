const path = require("path");
const { app, httpsServer, port, ip } = require("./config/serverConfig");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: httpsServer });

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);

app.get("*", (req, res) => {
  console.log("NOT ABLE TO SERVE url: ", req.url);
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Avvia il server
httpsServer.listen(port, ip, () => {
  console.log(`Server running at https://${ip}:${port}/`);
});
