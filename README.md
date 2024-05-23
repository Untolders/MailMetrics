# Email Optimization Hackathon: A/B Testing for Engagement Boost

## Description:
Developed a robust A/B testing platform to optimize email engagement metrics for a company's marketing campaign. This can be used for sending  newsletters to its subscriber base and  improve open rates, click-through rates (CTR), and overall engagement by analysing the data. This solution should enable marketers to conduct A/B tests on various elements of their email campaigns and provide actionable insights for future optimizations.

## Key Features:

### Frontend Features:

1. **User-friendly Interface:**
   - Intuitive forms and interfaces for setting email template variants where users can create multiple variants of an email such as subject lines, sender names, etc.
   - Implement validation to ensure accurate data entry.

2. **Real-time Dashboard:**
   - Dashboard that shows how each email version is performing, using charts and graphs to make the data easy to understand, like how many emails were sent and how many users opened the sent email.

### Backend Features:

1. **Experiment Management:**
   - Backend system to manage A/B tests, including creating, updating, and deleting experiments.
   - Store experiment configurations and results securely in a database.

2. **Integration with Email Service Provider:**
   - Set up an email-sending process by integrating email services module of Node.js (nodemailer).
   - Develop APIs to trigger email sends and track views and clicks  (by Tracking pixcel and APIs)email engagement metric.

3. **Data Analysis and Insights:**
   - Use smart algorithms to analyze the data from the email tests and give the marketing team useful insights and suggestions for improving their emails.

## Frontend Tasks (Technically):

- Develop frontend components using HTML, CSS, and JavaScript frameworks/libraries ejs.
- Utilize Chart.js for creating interactive charts and graphs to visualize email engagement metrics.

## Backend Tasks (Technically):

- Build RESTful APIs using Node.js with Express for handling requests related to experiment management and data analysis.
- Utilize MongoDB for storing experiment data and results.

## Technologies Used:

- MongoDB
- Node.js
- express.js
- HTML
- CSS
- JavaScript
- Chart.js (for data visualization)
- Tracking Pixcel(for tracking )
- nodemailer(for sending mails)



### Experiment Management:

1. **Experiment Creation:**
   - **User Interface:** Users can create new experiments through an intuitive interface. They input details such as experiment name, email variants (subject lines, sender names, etc.), sample size, and duration.
   - **Backend Functionality:** Upon submission, the backend creates a new experiment object and stores it in the database. It generates unique identifiers for each variant and sets up tracking mechanisms.

2. **Experiment Monitoring:**
   - **Real-time Dashboard:** A dashboard provides real-time updates on the status of ongoing experiments. It displays key metrics such as the number of emails sent, open rates, and click-through rates for each variant.
   - **Email Status Updates:** Users receive email notifications or alerts when significant milestones are reached, such as experiment completion or statistically significant results.

3. **Experiment Analysis:**
   - **Data Collection:** The system collects data on user interactions with each email variant, tracking metrics like open rates, click-through rates, and conversion rates.
  
     ![Screenshot 2024-05-18 002002](https://github.com/Untolders/MailMetrics/assets/131255604/fbcdb75c-5eaa-47f2-a593-11c3511718aa)

   - **Statistical Analysis:** Statistical methods are employed to analyze the collected data and determine the significance of differences between variants. This analysis informs users about which variants are performing better and whether the results are statistically significant.
     
![Screenshot 2024-05-18 002701](https://github.com/Untolders/MailMetrics/assets/131255604/bbce017b-a3d7-45c2-930f-0065fa9b0abc)

4. **Experiment Adjustment:**
   - **Variant Optimization:** Based on the analysis, users can make adjustments to underperforming variants or create new variants to test different elements.
  
     ![Screenshot 2024-05-18 002106](https://github.com/Untolders/MailMetrics/assets/131255604/4e1b9d98-f3c3-4bd8-a53c-6b5d86d4862d)

   - **Duration Extension:** Users have the option to extend the duration of an experiment if initial results are inconclusive or if they want to gather more data for statistical validity.

5. **Experiment Conclusion:**
   - **Result Presentation:** Once an experiment concludes, the platform presents a detailed report summarizing the findings. It highlights the performance of each variant and provides actionable insights for future email campaigns.
![Screenshot 2024-05-18 002017](https://github.com/Untolders/MailMetrics/assets/131255604/b5b710a3-7e74-4458-af2a-d07fab187ee5)

   - **Archiving:** Completed experiments are archived for reference, allowing users to revisit past results and learn from previous tests.

### Integration with Email Service Provider:

1. **Email Sending Process:**
   - **Email API Integration:** The platform integrates with email service  (e.g., Nodemailer) to send out email variants to the designated audience.
   - **Tracking Mechanisms:** Each email variant is embedded with tracking pixels or unique identifiers to monitor user interactions.

2. **Metrics Tracking:**
   - **Real-time Tracking:** The platform continuously tracks user interactions with sent emails, recording metrics such as opens, clicks, and conversions.
   - **Data Storage:** Collected metrics are securely stored in the database for later analysis and reporting.

### Backend Infrastructure:

1. **RESTful APIs:**
   - **Experiment Management Endpoints:** APIs handle CRUD operations for experiments, allowing users to create, update, retrieve, and delete experiment data.
  
     ![Screenshot 2024-05-18 002106](https://github.com/Untolders/MailMetrics/assets/131255604/d74ca788-a5fc-48be-87ba-67e8d6227dbd)

   - **Email Sending Endpoints:** APIs trigger the sending of email variants and track user interactions with sent emails.
  
     ![Screenshot 2024-05-18 002529](https://github.com/Untolders/MailMetrics/assets/131255604/09aafcbc-87fb-4770-b2a0-8c60bdba97a9)


2. **Database Management:**
   - **Data Storage:** Experiment configurations, email metrics, and user interactions are stored in a relational or NoSQL database (e.g., MongoDB, PostgreSQL) for efficient retrieval and analysis.
   - **Data Security:** Robust security measures are implemented to protect sensitive experiment data and user information.

3. **Scalability and Performance:**
   - **Scalable Architecture:** The backend infrastructure is designed to handle a large volume of experiments and user interactions, with scalability built into the system architecture.
   - **Performance Optimization:** Techniques such as caching, query optimization, and load balancing are employed to ensure optimal performance and responsiveness.

By effectively managing experiments, integrating with email service providers, and maintaining a robust backend infrastructure, the A/B testing platform enables marketers to optimize email engagement metrics and drive better campaign performance.




### Flow Chart:
![Concept flow map](https://github.com/Untolders/MailMetrics/assets/131255604/9469af0f-0cab-40e2-9186-e0f324a2cfb8)

### Demo Video Link:
Provide a link to a demo video showcasing the functionality and features of the A/B testing platform. This video should demonstrate how users can set up experiments, analyze results, and utilize the insights provided by the system.

https://github.com/Untolders/MailMetrics/assets/131255604/efd575f2-29a6-4995-9e97-d2748b0a4d1f



[Demo Video Link](https://youtu.be/nHf7q36SEU4)




## Project Setup

To run this project on your local machine, follow these steps:

1. Clone the repository using `git clone https://github.com/Untolders/MailMetrics`
2. Navigate to the project directory using `cd MailMetrics`
3. Install dependencies using `npm install`
4. Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   ATLASDB_URL=<mongodb-url>
   SECRET=<Secret-string>
   DOMAIN=<Domain name e.g:http://localhost:8000>
   MAILMETRICS_MAIL=<your gmail used for sending otp>
   MAILMETRICS_PASSWORD=<app password by two-step verification of google account>
   ```


How to get app password of your gmail : <br/> <a href="https://support.google.com/mail/answer/185833?hl=en#" target="_blank">Document Link</a>     
        <a href="https://www.youtube.com/watch?v=rqPmaDxigNY" target="_blank"> Video Link</a></p>

5. Start the development by command: ` node app.js `


## Features

- Users can sign up and log in to their account.
- Users can save mail, subscribers, and templates.
- User can add multiple sender email.
- User can select sender email from which they want to send email.
- Users can select a subscriber and choose a custom message or template to send.
- Users can view the details of sent mails in the sent section.
- User can Analyse Each Campaign with proper tracking of views and Clicks
- User can Manage Campaigns, Templates and Subscribers by creating, updating and deleting. 

How to get app password of your gmail : <br/> <a href="https://support.google.com/mail/answer/185833?hl=en#" target="_blank">Document Link</a>     
        <a href="https://www.youtube.com/watch?v=rqPmaDxigNY" target="_blank"> Video Link</a></p>


## Usage

To use the application, follow these steps:

- Sign up and log in to your account.
- Verify your email by OTP.
- Add sender Email by entering email address and app Password of google account.
- Add Subscriber by entering name, email and age of subscriber.
- Create a email template by entering a title, subject, body of mail and sender name.
- To send a mail, select template from template section and click on Send.
- Then select subscribe, sender mail and then send email.
- After sending the mail, you can track Campaign by going to campaign section and select the particular campaign.
- Now you can track sent mail, views and clicks of capmaign and you can filter it by Date, Month and Year.
- You can also track - sent, views and click of each subscriber of any particular campaign.


## Website Link : 
<a href="https://mailmetrics-3.onrender.com/MailMetrics/">MailMetrics</a>


