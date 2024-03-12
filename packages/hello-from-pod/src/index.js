import http from 'http';

// Get the Pod IP and Node IP from environment variables
const podIP = process.env.POD_IP;
const nodeIP = process.env.NODE_IP;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Pod IP: ${podIP}\nNode IP: ${nodeIP}`);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
