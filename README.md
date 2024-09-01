# Nodejs_app_deployment
Repository to deploy a Nodejs application to Kubernetes cluster. The express application will start based on the liveness check available at /live and publish metrics at /metrics endpoint. I have installed a Prometheus-Grafana stack to monitor these metrics. A screenshot of the Grafana dashboards is added below.
The service-monitor yml file is used to scrape the metrics of the deployed application.



![Screenshot 2024-08-31 144303](https://github.com/user-attachments/assets/566673cc-14b4-4d6a-b2c6-9514512cf9f9)
