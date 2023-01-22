# Music Paradise - A collaborative music controller
![Alt][1]

## If you are looking for a app that friends can control the music together. You need Music Paradise.

### Description
Music Paradise is a collaborative music controlling web application
You can be a host, create a room, and invite your friends to join by sharing the room code.
When creating the room, you can specify whether you allow your guests to control the music.
![Alt][2]
Or you can join the room if you get the room code from your friends.
![Alt][3]
Inside the room, the music player panel displays the music playing
![Alt][4]

### How Music Paradise is created
Music Paradise consists of several parts:
1. Backend framework written in Python and the django framework
	- Use a SQLite database to store all rooms created by users
	- Provide a REST API for the fronetend to communicate
	- Handle basic CRUD operations
	- 
2. Frontend written in JavaScript with React and MUI
	- Render the Music Paradise webpage
	- Use Routers to direct users to specific pages
	- Fetch requests to the backend on user's events
3. spotify app
	- Handle authentication and authorization process of a Spotify account
	- Get song information by communicating through Spotify API
	- Handle vote-to-skip system in the room
4. webpack
	- Bundle JavaScript, CSS, and other files into one to improve load times and reduce the number of requests to the server.
5. babel
	- Transpile modern JavaScript to an older version of JavaScript for older browsers that may not support newer JavaScript

## How to Install and Run Just-Post-It

### 1. Install Required Python Modules

```shell
pip install -r requirements.txt
```
### 2. [Install Node.js](https://nodejs.org/en/)

### 3. Install All Node Modules for Just-Post-It
Navigate to the `frontend` folder
```shell
cd frontend
```
Then install the depedencies
```shell
npm i
```
### 4. Compile the Front-End
You can run the production compile script
```shell
npm run build
```
or run the development compile script
```shell
npm run dev
```
### 5. Run the Server
Navigate back to the `Just-Post-It` folder
Run the following command
```shell
python manage.py runserver
```

## Credits
I follow the most of the steps in the tutorial created by Tech with Tim. Tutorial video linked below:
[Django & React Tutorial #1 - Full Stack Web App With Python & JavaScript](https://www.youtube.com/watch?v=JD-age0BPVo&list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j&index=2)

Note there are some changes from the tutorial includes:
- Changed the React structure from Class components to Functional components.
- Alter the music player panel display
- Separate vote systems for skipping to next song and skipping to previous song
 
## License

[MIT](https://choosealicense.com/licenses/mit/)

[1]: /imgs/Demo_1.png "HomePage"
[2]: /imgs/Demo_2.png "Create Room Page"
[3]: /imgs/Demo_3.png "Join Room Page"
[4]: /imgs/Demo_4.png "Room Page"
  

