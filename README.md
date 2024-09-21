Hello the interviewer from Momos team,
Thank you for taking your precious time to review my code. In a limited time, I can implement all of the features as required, and the following is the thought process to scale the scraper to handle ~5000 URL at the same time.

The question: Imagine you're given 1 CPU and 1GB RAM server to run the BE, how can you scale your scraper to handle ~5000 URL at the same time?

My answer is: Implement the serverless architecture to loosely couple the scraper and the backend application (1 CPU and 1GB RAM), so that the scraper can be scaled independently of the backend application. I can split the urls into batches send them into an AWS SQS, then trigger a Lambda function for each batch of provided URLs. The Lambda function will then scrape the urls images and videos URLs and store the data into an RDS Postgres database which is the same DB using by the backend application. The RDS Proxy will handle the connection pooling for the Postgres database. I need to configure the Lambda function to run in a VPC to allow it to access the RDS Postgres database.

![AWS Architecture](https://github.com/user-attachments/assets/d41f9be9-f656-4d35-a62b-b348b66150b7)

My idea can be illustrated in the following steps:

1. Split the 5000 URLs into batches and send them into an AWS SQS.
2. Trigger a Lambda function for each batch of provided URLs.
3. The Lambda function will process the batch of messages, scrape the URLs, extract the images and videos URLs, and store the data into an RDS Postgres database, then update the scraping status.
4. Configure Security Group and VPC to secure the Postgres database. Ensure that the security group associated with your RDS instance allows inbound traffic from the Lambda function's security group.
5. Use the RDS Proxy to manage connections to the RDS Postgres database.
6. Implement dead-letter queue to handle the messages that failed to be processed by the Lambda function.
7. Test the system with a small batch of URLs, ex: 50 URLs per batch, and gradually increase/decrease the batch size until the system fails or the performance is satisfactory.
8. Use AWS CloudWatch Logs to monitor and ensure that the Lambda function is running smoothly.

Considerations:
1. If the batch size is 50, so the number of batches is 100 (5000 / 50). So Lambda Instances needed is 100 (if processing all batches concurrently).
2. The scraping for each URL may take a long time and consume a lot of memory, be aware of execution time (maximum of 15 minutes) and memory allocation, so we need to check the telemetry data and reduce the batch size if necessary.
3. The default limit for concurrency Lambda function is 1000 instances, we need to consider the current instances count and adjust the batch size accordingly to avoid hitting the limit.
4. Consider to implement rate limiting in the scraping logic, depending on the target website's rate limits.
5. Check the Lambda allocated memory and acctual memory usage in CloudWatch Logs to adjust the memory needed and optimize the cost of the Lambda function.

Thank you and have a great day!
Tran Trong Nhan
