# Pre-requisites
1. Create GCP account with Billing Enabled
2. Create a Standard Kubernetes cluster with 3 node, with autoscaling disabled, with n2-standard-2 type machine, with Standard Persistent disk as storage type

# Database Setup Deployment
1. Apply the mysql-config file
2. Apply the mysql-secret file
3. Apply the mysql-statefulset file
4. Apply the mysql-service file to create the Headless service

# Test Database setup with a Temporary Pod
1. Run the following command to check the status of the MYSQL Stateful pod:
```
kubectl get pods -l app=mysql
```

You should see output similar to:
```
NAME                    READY   STATUS    RESTARTS   AGE
mysql-statefulset-0     1/1     Running   0          2m
```

2. Check the status of the PVC to ensure it's bound to a PV:
```
kubectl get pvc
```

You should see output similar to:
```
NAME                       STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mysql-persistent-storage   Bound    pvc-1234abcd-5678-efgh-9012-ijklmnopqrst   10Gi       RWO            standard       2m
```

3. Connect to MySQL and Grant permissions to the user 'user'
Apply the temporary pod (database-test-pod.yaml) to connect to the MySQL database.

Once the "mysql-client" pod is running, exec into the pod:
```
kubectl exec -it mysql-client -- bash
```

Inside the "mysql-client" pod, connect to MySQL using the root user credentials:
```
mysql -h mysql-statefulset-0.mysql-service -u root -p
```

Then enter password in normal string when prompted

Once connected as the root user, grant the necessary privileges to the user "user":
```
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Exit out of mysql
```
exit
```

4. Login with normal 'user' user

Inside the mysql-client pod, connect to the MySQL instance using the credentials stored in the Secret:
```
mysql -h mysql-statefulset-0.mysql-service -u ${user} -p
```

Then enter password in normal string when prompted
Replace user and password with the values stored in your Secret 

5. Once connected, run some basic queries to verify the database is operational:
```
SHOW DATABASES;
CREATE DATABASE testdb;
USE testdb;
CREATE TABLE test (id INT PRIMARY KEY, value VARCHAR(50));
INSERT INTO test (id, value) VALUES (1, 'test value');
SELECT * FROM test;
```

Exit out of mysql, then exit out of the pod
```
exit
exit
```

6. Delete the database-test-pod after testing
```
kubectl delete pod mysql-client
```

# Initialize the database so that it can be used by the API pods
In our Backend code in Docker Image, we are referring to database "simple_todo", and table "Todo". Create the database and the table

1. Deploy a temporary MYSQL Client Pod by running the following command
```
# kubectl run mysql-client --image=mysql:8.0 -i --tty --rm --restart=Never -- \
  mysql -h mysql-service -P 3306 -u ${user} -p${password}

kubectl run mysql-client --image=mysql:8.0 -i --tty --rm --restart=Never -- \
  mysql -h mysql-statefulset-0.mysql-service -u ${user} -p${password}
```
Replace the values of ${user} and ${password} in the above command
Enter the user 'user' password when it prompts.

2. Run the SQL commands in the MySQL client pod:
```
CREATE DATABASE simple_todo;
USE simple_todo;

CREATE TABLE Todo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);
```

3. Check Table has been created successfully or not
```
SHOW TABLES;
```

4. Exit from mysql, then you will be automatically exited from the pod. Pod will also get deleted automatically
```
exit
```

# Deploy the API pods
1. Apply the api-config file
2. Apply the api-secret file
3. Apply the api-deployment file
4. Apply the api-service file to create the Load Balancer service

# Test the Kubernetes Cluster
1. Open the LoadBalancer External IP and add the port on which the API server is deployed.

You should see the default response when open the Load Balancer's External IP with the correct port, if everything was deployed successfully.

2. After the url, add "/todos" to get all the Todos present in the DB
3. From Thunder Client, add a new Todo by hitting POST "/todos" API.
4. Repeat Step 2 to see that the new Todo is added or not
5. Delete the database pod. It should restart automatically.
6. Then check whether you have all your Todos or not.

# Implement Horizontal Pod Autoscaler
1. Apply the Horizontal Pod Autoscaler yaml file

2. After the HPA has been applied, go inside the HPA in watch mode
```
kubectl get hpa ${hpa-name} --watch
```

3. After going inside HPA, in a different terminal, go inside one of the pod of deployment
```
kubectl exec -it ${pod-name} -- sh
```

4. Inside the pod, execute node
```
node
```

5. Inside node, copy paste the fibonacci function.

6. Call the fibonacci function for 46, and then switch to HPA terminal to see how Pods will spin up, and how pods will go down

# Implement Rolling Update Strategy

