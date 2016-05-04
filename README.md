# Pod (microservices) docker

Easy [Pod (git push deploy)](https://github.com/yyx990803/pod) (& microservice architecture) in a docker.

## Usage: simple 

look at [build](build) 

    $ BUILD=1 RUN=1 ./build
    + docker build -t nodepod .
    + docker run -it --volume=/home/username/docker.nodejs.pod/srv:/srv --volume=/home/username/docker.nodejs.pod/.ssh:/home/nodejs/.ssh --volume=/home/username/docker.nodejs.pod/.podrc:/home/nodejs/.podrc --volume=/home/username/docker.nodejs.pod/.ssh.etc:/etc/ssh --env=ROOTPASSWD=test --env=PASSWD=test --env=HOSTNAME=nodepod -p 23:22 -p 81:8080 -p 19999:19999 --name=nodepod nodepod

This will build and run a docker which has pod & ssh pre-installed.
    
    $ RUN=1 BUILD=1 LOGIN=1 ./build 

## Advanced: microservices 

Continue reading if you like easy-peasy microservices. 
This is what you can get by adding one environmentvariable: MICROSERVICES=1

    $ MICROSERVICES=1 BUILD=1 RUN=1 LOGIN=1 ./build 


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
    > -p 81:8989
    > -p 19999:19999                                           
    > nodepod                                                  

    $ ssh -p 23 nodejs@localhost pod list 
    Password: test

      name       status      port      restarts      uptime           memory        CPU   

      proxy      ON          8989      1             00:45:44         31.00 mb      0.00% 
      queue      ON          3000      0             2d 05:54:52      58.24 mb      0.00% 
      bus        ON          3001      0             2d 05:54:54      31.30 mb      0.00% 

## creating & deploying a new microservice

You can create repos locally:

    $ ssh -p 23 nodejs@localhost pod create myapp
    POD updated config.
    POD created bare repo at /srv/repos/myapp.git
    POD created post-receive hook.
    POD created empty working copy at /srv/apps/myapp

Clone repo
 
    $ git clone ssh://nodejs@localhost:23/srv/apps/myapp
    Cloning into 'myapp'...
    Checking connectivity... done

Now `git push` will deploy your app :D
Tail logs:

    $ ssh -p 23 nodejs@localhost podtail myapp

Or [track an existing repo](https://github.com/yyx990803/pod/wiki/Using-a-remote-repo)
    
    $ ssh -p 23 nodejs@localhost pod remote myapp https://github.com/myuser/foo.git

> if something didn't make sense, please read the [pod docs](https://github.com/yyx990803/pod#using-a-remote-github-repo)

## http proxy

The [proxy](https://npmjs.org/package/http-proxy-rules) runs on port 8080.
You can edit `srv/apps/proxytable.js` to update routes.

## queue 

Scale horizontally using the [Lightweight queue](https://npmjs.org/package/rsmq) which allows microservices to act as distributed producers/consumers.
It uses redis at port 6379, has a cli (`queue --help`) and a [REST api](https://npmjs.org/package/rest-rsmq) at port 3000.

* [microservice example](https://github.com/coderofsalvation/pod.microservice)
* [example producer .js code](https://npmjs.org/package/rsmq)
* [example consumer .js code](https://npmjs.org/package/rsmq-worker)

## pub/sub bus

Scale horizontally using the [Lightweight pub/sub bus](https://npmjs.org/package/simplebus) which allows microservices to act as distributed publishers/subscribers.
It runs at port 3001.

* [microservice example](https://github.com/coderofsalvation/pod.microservice)
* [example publisher ,js code](https://github.com/ajlopez/SimpleBus/blob/master/samples/Market/operator.js)
* [example subscriber .js code](https://github.com/ajlopez/SimpleBus/blob/master/samples/Market/subscriber.js)

> NOTE: redis can also be used for pub/sub behaviour
