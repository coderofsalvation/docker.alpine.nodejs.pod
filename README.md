# Pod (microservices) docker

Easy git push deploy (& microservice architecture) in a docker.

## Usage 

look at [build](build) 

    $ BUILD=1 RUN=1 ./build
    + docker build -t nodepod .
    + docker run -it --volume=/home/username/docker.nodejs.pod/srv:/srv --volume=/home/username/docker.nodejs.pod/.ssh:/home/nodejs/.ssh --volume=/home/username/docker.nodejs.pod/.podrc:/home/nodejs/.podrc --volume=/home/username/docker.nodejs.pod/.ssh.etc:/etc/ssh --env=ROOTPASSWD=test --env=PASSWD=test --env=HOSTNAME=nodepod -p 23:22 -p 81:8080 -p 19999:19999 --name=nodepod nodepod

This will build and run a docker which has pod & ssh pre-installed.

## Read this if you like easy-peasy microservices 

This is what you can get by adding one environmentvariable:


                           bb/github   gitrepo        pod REST       pod web  
                            webhook     push          requests      dashboard          
                              :          :                :             :              
          +--------------------------------------------------------------------+
          |                          P O D  + P M 2                            |       
          +--------------------------------------------------------------------+
               :              :          :                :             :              
               :              :          :                :             :      
          +--------+      +----------------+              :             :              
          | proxy  |---+--+ microservice A +--------------+-------------+            
          +--------+   |  +----------------+         +----+---+  +------+------+       
                       |      :          :           | queue  |  | pub/sub bus |
                       |  +----------------+         +----+---+  +------+------+
                       +--+ microservice B +--------------+-------------+
                          +----------------+

> NOTE: the lightweight proxy, queue & pub/sub bus are only installed when `MICROSERVICES=1` is passed

# Usage 

A bit of bash tells a thousands words:

    $ BUILD=1 ./build
    > docker run --name=nodepod -itd                           
    > --volume=$(pwd)/srv:/srv                                 
    > --volume=$(pwd)/.ssh:/home/nodejs/.ssh                   
    > --volume=$(pwd)/.podrc.microservices:/home/nodejs/.podrc 
    > --volume=$(pwd)/.ssh.etc:/etc/ssh                        
    > --env=ROOTPASSWD=test                                    
    > --env=MICROSERVICES=1                                    
    > --env=PASSWD=test                                        
    > --env=HOSTNAME=nodepod                                   
    > -p 23:22                                                 
    > -p 81:8080
    > -p 19999:19999                                           
    > nodepod                                                  

    $ docker exec -it nodepod /bin/bash

or for testing purposes simply run all together using:

    $ BUILD=1 RUN=1 MICROSERVICES=1 BUILD=1 ./build 

> if you just want a plain pod: Leave out `MICROSERVICES=1` and remove the `.microservices'-part from the `.podrc` volume

## creating a new microservice


* create a new nodejs container using the `pod create` command
* pull the repo to your local machine
* run `npm install simplequeue simplebus --save`
* `git add` the files
* push it

voila!

> if this didn't make sense, please read the [pod docs](https://github.com/yyx990803/pod#using-a-remote-github-repo)

## http proxy

The [proxy](https://npmjs.org/package/nproxy) runs on port 8989.
to preinstall a http proxy in pod, make sure:

* `ENV PROXY=1` is set in Dockerfile before building
* `--volume=$(pwd)/.podrc.microservices:/home/nodejs/.podrc` is passed in `docker run` instead of `.podrc`
* run `ln -s srv/apps/proxy/replace-rule.sample.js proxy.js` outside the docker for convenience editing
* use `pod restart proxy` to reload the proxy

## queue 

[Lightweight queue](https://npmjs.org/package/rsmq) which allows microservices to act as distributed producers/consumers.
It uses redis at port 6379, has a cli (`queue --help`) and a [REST api](https://npmjs.org/package/rest-rsmq) at port 3000.

* [example producer .js code](https://npmjs.org/package/rsmq)
* [example consumer .js code](https://npmjs.org/package/rsmq-worker)

## pub/sub bus

[Lightweight pub/sub bus](https://npmjs.org/package/simplebus) which allows microservices to act as distributed publishers/subscribers.
It runs at port 3001.

* [example publisher ,js code](https://github.com/ajlopez/SimpleBus/blob/master/samples/Market/operator.js)
* [example subscriber .js code](https://github.com/ajlopez/SimpleBus/blob/master/samples/Market/subscriber.js)

> NOTE: redis can also be used for pub/sub behaviour
