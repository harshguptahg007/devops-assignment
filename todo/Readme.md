# 1. Create a "todo" folder which will contain the application code and the docker file

# 2. Create a simple Todo BE application (todo-backend) using Node.js, Express.js, Typescript, Nodemon

# 3. Create a .dockerignore file in the "todo" to ignore the node_modules of the project.

# 4. Create a dockerfile which will contain code for building docker image.

# 5. Add a running command which will run the code of the Backend application

# 6. Command to build the docker image

```
docker build -t simple-todo:1 .
```

# 10. Command to run the docker image
```
docker compose up --build # (if docker-compose used)

or

docker run -d --name todo-container -p 8080:3010 simple-todo:1 (if docker compose not used)
```

# 11. Command to stop and delete all the containers
```
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)
```
