# TECHOVERFLOW  

## dependencies  
nodeJS > 9.1
## steps to build  
```
npm install -g bower
npm install
```
## steps to run
```
npm start
```
## TECHOVERFLOW DESIGN DOCUMENT:  
*Functional Specifics*  
### Overview  
TECHOVERFLOW is a forum for people to ask question and answer others questions.  
### Usage Scenarios:  

1. User enter the website to find solution for his problem. User can post his question at the platform which is available for all users.  
2. User can read any Question and provide answer for it.  
3. User can search in questions related to specific topic and also can filter around questions with question tags.  
4. User can upvote or downvote an answer from any user.  
5. User can mark and unmark any question as favourite question.  
  
### Screen by Screen Specification  
#### Login/Signup Screen  
![alt text](https://ibb.co/xM9JxBV)  
*Use Case*  
1. Once user enter the product he/she need to signup and the login to the website. by entering username and password.  
2. In case user has logged in user can use the application until session expires(1 month period).  
3. Here i have implemented a JWT based authentication with local storage. As user login in frontend application a token is saved in localstorage which is used to authenticate user session.  

#### Profile Screen  
![alt text](https://ibb.co/2yQ80PG)  
