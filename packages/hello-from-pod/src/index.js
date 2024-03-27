import fs from 'fs';
import https from 'https';

// Get the Pod IP and Node IP from environment variables
const podIP = process.env.POD_IP;
const nodeIP = process.env.NODE_IP;
const port = process.env.PORT || 3000;

const options = {
  key: fs.readFileSync('/etc/ssl/certs/tls.key'),
  cert: fs.readFileSync('/etc/ssl/certs/tls.crt'),
};

const server = https.createServer(options, (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Pod IP: ${podIP}\nNode IP: ${nodeIP}`);
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
