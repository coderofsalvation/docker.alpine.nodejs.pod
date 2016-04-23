# Pod (microservices) docker

Easy git push deploy & microservice architecture.


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

> NOTE: proxy,queue & pub/sub bus are only installed when the `MICROSERVICES=1` envvar is passed

# Usage 

    $ BUILD=1 ./build

    $ docker run --name=nodepod -itd                         \
    --volume=$(pwd)/srv:/srv                                 \
    --volume=$(pwd)/.ssh:/home/nodejs/.ssh                   \
    --volume=$(pwd)/.podrc.microservices:/home/nodejs/.podrc \
    --volume=$(pwd)/.ssh.etc:/etc/ssh                        \
    --env=ROOTPASSWD=test                                    \
    --env=PROXY=1                                            \
    --env=MICROSERVICES=1                                    \
    --env=PASSWD=test                                        \
    --env=HOSTNAME=nodepod                                   \
    -p 23:22                                                 \
    -p 81:80                                                 \
    -p 19999:19999                                           \
    nodepod

    $ docker exec -it nodepod /bin/bash

or for testing purposes simply run all together using:

    $ BUILD=1 RUN=1 MICROSERVICES=1 SHELL=1 ./build 

> if you just want a plain pod: Leave out `MICROSERVICES=1` and remove the `.microservices'-part from the `.podrc` volume

## http proxy

to preinstall a http proxy in pod, make sure:

* `ENV PROXY=1` is set in Dockerfile before building
* `--volume=$(pwd)/.podrc.microservices:/home/nodejs/.podrc` is passed in `docker run` instead of `.podrc`
* run `ln -s srv/apps/proxy/replace-rule.sample.js proxy.js` for convenience editing (in combination with `pod restart proxy`)
