
# COVID Tracker Component View
## Context
The COVID Tracker app backend is described in using the following models and tables.

## Concerns
COVID Tracker App

## Stakeholders
* Architects
* Developers/Engineers
* DevOps Engineers

## Model
![Image of COVID Tracker Component View](https://app.lucidchart.com/publicSegments/view/3ae6514f-7017-4667-ad32-09b4d2cfb441/image.png)
*Model Notation: AWS Architecture*

## Model Elements
| **Component**                     | **Type**    | **Description**                                                                               |
|-----------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| COVID Tracker App                 | App         | COVID-19 pandemic response mobile application called the COVID Tracker                        |
| RegisterService                   | Service     | Service encompasses all onboarding, authentication checking and session management operations |
| CheckInService                    | Service     | Service delivers all checkin related operations                                               |
| StatsService                      | Service     | Service delivers all statistical and content based data to the app                            |
| SettingsService                   | Service     | Service delivers all settings related information to the app                                  |
| UploadService                     | Service     | Service supports upload of diagnosis keys and follow-on call messages to the app              |
| ExposuresService                  | Service     | Service delivers the distribution of exposure keys periodically through the network           |
| COVIDTracker Database             | Database    | Data Store for all app collected data and setting information                                 |
| Diagnosis Key Registry            | Registry    | Registry containing the diagnosis keys                                                        |
| Stats                             | Data Store  | Data Store for all statistical and content                                                    |
| Assets                            | Data Store  | Data Store for all app related assets                                                         |
| Upload                            | Data Store  | Transient data Store for all upload data                                                      |
| DiagnosisKeyFiles                 | Data Store  | Diagnosis Keys are structured into files, this is the store                                   |
| COVIDTrackerCSOUpload             | Worker Task | Background worker task used to prepare files sent to CSO                                      |
| COVIDTrackerCCTUpload             | Worker Task | Background worker task used to send Follow-on Messages to CCT                                 |
| COVIDTrackerCCTUploadNotification | Service     | Service supports notification of positive user via SMS for Diagnosis Key Upload               |
|                                   |             |                                                                                               |

# COVID Tracker API View
## Context
The COVID Tracker app

## Concerns
COVID Tracker App

## Stakeholders
* Architects
* Developers/Engineers
* DevOps Engineers

## Model
![Image of COVID Tracker API View](https://app.lucidchart.com/publicSegments/view/e4bbb842-8ae3-4882-89c8-d1403ad3f3d7/image.png)
*Model Notation: AWS Architecture*

## Model Elements
| **API Name**             | **Purpose**                                                                                                                                | **Operations**   |                                                                             |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------------------------------------------------------------------|
| Registration Service     | Used as part of the onboarding process to verify and create an app registration Used to manage session information and API authentications | /register        | POST – Initial Registration GET – session management DELETE – support Leave |
| Checkin Service          | Used to upload check-in data                                                                                                               | /checkin         | POST – check-in                                                             |
| Stats Service            | Used to supply News & Information with stats data                                                                                          | /stats           | GET - stats                                                                 |
| Exposure Service         | Used to manage diagnosis key file distribution                                                                                             | /exposure        | GET – diagnosis keys & files                                                |
| Settings Service         | Used to manage setting date                                                                                                                | /settings        | GET – get settings                                                          |
| Upload Service           | Used to upload diagnosis keys based on a positive test result                                                                              | /upload          | POST – diagnosis keys                                                       |
| CallBackRequest Service  | Used to upload Call Back Request                                                                                                           | /callbackrequest | POST – call back request                                                    |
| PushNotification Service | Used by CCT to trigger and SMS containing OTC to be sent to a user to enable upload of Diagnosis Keys                                      | /notify          | POST - notify                                                               |

###	Request/Response Message Data
| **API**         | **Request**                                            | **Request Body**                                                                                                                                                                       | **Response Body (200)**                                                                          |
|-----------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| HealthCheck     | GET https://covidtracker.ie/api/healthcheck            |                                                                                                                                                                                        | { "version":"1.0.0", "serverTimestamp":"2020-05-15T08:18:19.244Z", "status":"ok", "memoryUsage": |
| Settings        | GET <https://covidtracker.ie/api/data/settings>        |                                                                                                                                                                                        | See settings Setting Keys                                                                        |
| Register        | POST <https://covidtracker.ie/api/register>            |                                                                                                                                                                                        | {"nonce":"…"}                                                                                    |
|                 | PUT <https://covidtracker.ie/api/register>             | nonce: "…"                                                                                                                                                                             |                                                                                                  |
| Auth            | POST <https://covidtracker.ie/api/refresh>             |                                                                                                                                                                                        | {"expires":"2020-05-16T10:04:20.235Z", "token":"…”}                                              |
| Check-In        | POST <https://covidtracker.ie/api/check-in>            | { "ageRange": "21-30", "locality": "Dublin", "sex": "m", "ok": true, "data": [ { "status": "u", "date": “20/04/2020", "fever": 0, "cough": 1, "breath": 0, "flu": 0 }, ] //repeating } |                                                                                                  |
| Notify          | POST <https://covidtracker.ie/api/notify/positive>     | mobile: "+353858048193" dateoflastexposure: “20/04/2020”                                                                                                                               | {"code":670619}                                                                                  |
| Exposure Verify | POST <https://covidtracker.ie/api/exposures/verify>    | {"hash": “…"}                                                                                                                                                                          | {"token":"…"}                                                                                    |
| Exposure Upload | POST <https://covidtracker.ie/api/exposure>s           | {"token": "…", "exposures": [ { "keyData": "Bx2gNAKTBQqUKwxjigwJ5g==", "rollingStartNumber": 2647440,"transmissionRiskLevel": 0}, }]}                                                  |                                                                                                  |
| Exposure List   | GET POST https://covidtracker.ie/api/exposures?since=0 |                                                                                                                                                                                        |                                                                                                  |
| Forget (Leave)  | DELETE <https://covidtracker.ie/api/register>          |                                                                                                                                                                                        |                                                                                                  |

### API to Backend Entity Mapping 
Mapping of APIs to Backend entities based on Create, Read, Update, Delete of records
|                          | Registrations | Exposures | Exposure_Export_Files | Verifications | UploadTokens | Check_Ins | Settings |
|--------------------------|---------------|-----------|-----------------------|---------------|--------------|-----------|----------|
| Registration Service     | CRUD          | \-        | \-                    | \-            | \-           | \-        | R        |
| Checkin Service          | R             | \-        | \-                    | \-            | \-           | CR        | R        |
| Stats Service            | R             | \-        | \-                    | \-            | \-           | \-        | R        |
| Exposure Service         | R             | \-R       | R                     | \-            | \-           | \-        | R        |
| Settings Service         | R             | \-        | \-                    | \-            | \-           | \-        | \-       |
| Upload Service           | R             | CR        | CR                    | CR            | CR           | \-        | R        |
| CallBackRequest Service  | R             | \-        | \-                    | \-            | \-           | \-        | \-       |
| PushNotification Service | \-            | \-        | \-                    | \-            | \-           | \-        | \-       |


# AWS Infrastructure View
## Context
The COVID Tracker app

## Concerns
COVID Tracker App

## Stakeholders
* Architects
* Developers/Engineers
* DevOps Engineers

## Model
![Image of COVID Tracker AWS Infrastructure](https://app.lucidchart.com/publicSegments/view/9fabdde0-d141-4eaf-b792-14a855757dd2/image.png)
*Model Notation: AWS Architecture*

## Model Elements
| **App Backend**           | **Type**            | **Provider** | **Description**                                                                                                                                                                                                                                                                                                         |
|---------------------------|---------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Amazon Route 53           | DNS                 | AWS          | Amazon Route 53 is a scalable domain name system (DNS) service intended to give business and developers a reliable way to direct end users to applications                                                                                                                                                                 |
| Web Application Firewall  | Firewall            | AWS          | AWS WAF is a web application firewall that helps protect your web applications or APIs against common web exploits that may affect availability, compromise security, or consume excessive resources                                                                                                                       |
| API Gateway               | API Gateway         | AWS          | Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket APIs at any scale.                                                                                                                                                                          |
| VPC                       | File Transfer       | AWS          | Amazon Virtual Private Cloud (Amazon VPC) enables you to launch AWS resources into a virtual network that you've defined. This virtual network closely resembles a traditional network that you'd operate in your own data center, with the benefits of using the scalable infrastructure of AWS.                          |
| Public Subnet             | Network             | AWS          | A public subnet is a subnet that's associated with a route table that has a route to an Internet gateway. A private subnet with a size /24 IPv4 CIDR block (example: 10.0. 1.0/24). This provides 256 private IPv4 addresses                                                                                               |
| Private Subnet            | Network             | AWS          | This provides 256 private IPv4 addresses. A public subnet is a subnet that's associated with a route table that has a route to an Internet gateway. A private subnet with a size /24 IPv4 CIDR block (example: 10.0. 1.0/24). ... This connects the VPC to the Internet and to other AWS services.                         |
| Application Load Balancer | Load Balancer       | AWS          | A load balancer serves as the single point of contact for clients. The load balancer distributes incoming application traffic across multiple targets, such as EC2 instances, in multiple Availability Zones.                                                                                                              |
| AWS Fargate               | Container Service   | AWS          | AWS Fargate is a serverless compute engine for containers that works with both Amazon Elastic Container Service (ECS) and Amazon Elastic Kubernetes Service (EKS).                                                                                                                                                         |
| AWS Aurora PostresSQL     | Database            | AWS          | Amazon Aurora PostgreSQL is a fully managed, PostgreSQL-compatible, and ACID-compliant relational database engine that combines the speed and reliability of high-end commercial databases with the simplicity and cost-effectiveness of open-source databases.                                                            |
| Lambda Function           | Serverless Function | AWS          | AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you. You can use AWS Lambda to extend other AWS services with custom logic, or create your own back-end services that operate at AWS scale, performance, and security. |
| SNS                       | Pub/Sub             | AWS          | Amazon Simple Notification Service (SNS) is a highly available, durable, secure, fully managed pub/sub messaging service that enables you to decouple microservices, distributed systems, and serverless applications                                                                                                      |
| S3 Bucket                 | Data Store          | AWS          | Amazon S3 bucket is a public cloud storage resource available in Amazon Web Services' (AWS) Simple Storage Service (S3), an object storage offering. Amazon S3 buckets, which are similar to file folders, store objects, which consist of data and its descriptive metadata.                                              |

# AWS Network Configuration View
## Context
The COVID Tracker app

## Concerns
COVID Tracker App

## Stakeholders
* Architects
* Developers/Engineers
* DevOps Engineers

## Model
![Image of COVID Tracker AWS Infrastructure](https://app.lucidchart.com/publicSegments/view/eea8181f-8ff1-4281-b776-9c656f558fc3/image.png)
*Model Notation: AWS Architecture*
