# TECHOVERSTACK  

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
## TECHOVERSTACK DESIGN DOCUMENT:  
*Functional Specifics*  
### Overview  
TECHOVERFLOW is a forum for people to ask question and answer others questions.  
  
### Usage Scenarios:  
  
1. User enter the website to find solution for his problem. User can post his question at the platform which is available for all users.  
2. User can read any Question and provide answer for it.  
3. User can search in questions related to specific topic and also can filter around questions with question tags.  
4. User can upvote or downvote an answer from any user.  
5. User can mark and unmark any question as favourite question.  
  
### Database model structure:  
Here i have used mongoDb as database.  
  
Schema Preview:  
``` 
  User: {
    'username': string,  
    'password': String,  
    'questions': Array of 'Question', # all questions user created  
    'favQuestions': Array of 'Question', # all questions user marked as favourite  
  }  
  Question: {  
    'title': String,  
    'body':  String,  
    'tags':  Array of 'Tag',  
    'answers':  Array of 'Answers', # all answer to the questions  
    'by': object key of 'User' # creater of question  
  }  
  Answer: {  
    'body':  String,  
    'by': object key of 'User' # creater of question,  
    'votes': 'Number',  
    'upvote': Array of User, # all users who upvote the answer  
    'downvote': Array of User, # all users who downvote the answer  
  }  
  tag: {  
    name: String  
  }  
```
  
### Screen by Screen Specification  
#### Login/Signup Screen  
![alt text](https://i.ibb.co/qRqkTcb/Screen-Shot-2018-11-28-at-11-11-51-AM.png)  
*Use Case*  
1. Once user enter the product he/she need to signup and the login to the website. by entering username and password.  
2. In case user has logged in user can use the application until session expires(1 month period).  
3. Here i have implemented a JWT based authentication with local storage. As user login in frontend application a token is saved in localstorage which is used to authenticate user session.  
  
#### Dashboard  
![alt text](https://i.ibb.co/r3g47QF/Screen-Shot-2018-11-29-at-9-41-53-AM.png)  
1. After login application will redirect to the dashboard.  
2. User can see and filter all question on the dashboard.  
3. User can search for question by using search bar.  
4. User can filter questions by tags by clicking on the tag.  
  
#### Question View.  
![alt text](https://i.ibb.co/DbkVHRw/Screen-Shot-2018-11-28-at-11-32-15-AM.png)  
*Use Case*  
1. On click on any question in dashboard user can view qustion in detail on this page.    
2. Here user can read Question and provide answer to the question.  
3. Any user can upvote or downvote the answer by clicking at the up and down icon below every answer.  
4. User can mark the question as favourite by clicking at the star icon after question title.  
    
#### Profile Screen  
![alt text](https://i.ibb.co/R9mhGPR/Screen-Shot-2018-11-28-at-11-27-35-AM.png)  
*Use Case*  
1. User can visit his own or any user profile.  
2. Profile contain information about users username, asked questions and favourite questions.  
  
