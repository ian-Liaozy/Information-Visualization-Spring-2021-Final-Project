# Information-Visualization-Spring-2021-Final-Project

![Final Look](https://github.com/ian-Liaozy/Information-Visualization-Spring-2021-Final-Project/blob/da477b9315da62e73baffe61ee95f825f99da7da/Screen%20Shot%202021-05-25%20at%205.46.43%20PM.png)


### _Overview_
With the rapid popularization of the internet, social media has become an important platform of expression and communication in the 21st century. However, compared to the traditional medium of expression, social media allows more possibility for irresponsible actions. The atmosphere of social media platforms can become very toxic. Weibo is one of the most popular social media platforms in China. With the characteristic of user anonymity, the prevalence of hate speech and hate comments becomes an important issue in Weibo. Specifically, with the rising gender awareness and the increasing gender antagonism in China/, sexist comments became an important source of Weibo’s hate speech. To address the above issues, we propose a visualization project that analyzes 8969 Weibo sexist comments. 
Our visualization project seeks to tackle two main goals: 
1. Construct user portraits of sexist comment senders by finding patterns in geographical location, gender, and publish time. 

2. Find patterns in the contents of sexist comments. Which types of sexist comments and keywords are the most prevalent? 

### _Description of the data_

The dataset we use is hateComment.csv, which contains 8969 Weibo comments with 9 variables, including distinct Weibo id, comment content, gender, location, number of likes, date, label, target, and category of sexism (4 levels) the comment belongs to. The comments were extracted from weibo.cn by manually searching for specific sexist lexicons, Of all the comments, our visualization ONLY uses the 3093 comments that were labeled “1” by the author, which means the comments were recognized as sexist. There are two types of target, individual and group. The comments are labeled into 4 categories: stereotype based on appearance(SA), stereotype based on cultural background (SCB), microaggression (MA), and sexual offense (SO).
We derived a *new variable* – comment *count by days in a week* (Monday to Sunday) – to reflect the potential pattern of sexist comment’s publishing time. 
We plan to preprocess the raw data using python and MS Excel and deploy the *geo-JSON* data of China in our project. We also performed some basic exploratory data analysis (with python and Excel) during our design process to ensure the meaningfulness of our final product. 

