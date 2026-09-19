- use npm install -g pm2 -- it is a process mananager which keeps ur server running so that you dont have to keep the terminal open forever
- whitelisting ip (:3000) mongodb server on EC2 instance
- pm2 start npm -- start
- pm2 logs
- pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete <name>
- pm2 start npm --name "devtiner-backend" --start

- Front end: http://3.131.93.54
- BE: http://3.131.93.54:3000/feed

# add nginx config

config nginx - /etc/nginx/sites-available/default

restart nginx
sudo systemctl restart nginx

# Proxy /api requests to Node.js on port 3000
location /api/ {
    proxy_pass http://localhost:3000/; # Points to your Node app
    proxy_http_version 1.1;
    
    # Necessary headers to preserve client details
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket support (Optional, but highly recommended)
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}

- Modify the front end codebase base url from localhost:3000 to  /api

# Adding a custom domain name
- purchased domain name from godaddy
- signup on cloudflare & add a new domain name
- change the nameservers on godaddy and point it to cloudflare
- wait for sometime till your name servers are updated.
- DNS -> Update A record on CloudFlare
- Enable SSL -> use Flexible by default

# Sending Emails vias SES
- Create an IAM user
- Give Access to AmazonSESFullAccess
- Amazon SES: Create an Identity
- Verify your domain
- Verify an email address
- Install SDK
- Amazon SES secret access key
- Set up SesClient
- Access Credentials should be created in IAM under Security
- Add the credentials to the env file
- Write code for SESClient
- Write code for Sending email address
- Make the email dynamic by passing more params to the run function