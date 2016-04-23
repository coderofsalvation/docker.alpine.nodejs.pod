
    +--------+      +----------------+
    | proxy  |---+--+ microservice A +--------------+
    +--------+   |  +----------------+         +----+---+
                 |                             | queue  |
                 |  +----------------+         +----+---+
                 +--+ microservice B +--------------+
                    +----------------+
# Usage 

    $ BUILD=1 ./build

    $ docker run --name=nodepod -itd                 \
    --volume=$(pwd)/srv:/srv                         \
    --volume=$(pwd)/.ssh:/home/nodejs/.ssh           \
    --volume=$(pwd)/$PODRC:/home/nodejs/.podrc       \
    --volume=$(pwd)/.ssh.etc:/etc/ssh                \
    --env=ROOTPASSWD=test                            \
    --env=PROXY=1                                    \
    --env=PASSWD=test                                \
    --env=HOSTNAME=nodepod                           \
    -p 23:22                                         \
    -p 81:80                                         \
    -p 19999:19999                                   \
    nodepod

    $ docker exec -it nodepod /bin/bash

or for testing purposes simply run all together using:

    $ BUILD=1 RUN=1 PROXY=1 SHELL=1 ./build 

## builtin http proxy

to preinstall a http proxy in pod, make sure:

* `ENV PROXY=1` is set in Dockerfile before building
*  `--volume=$(pwd)/.podrc.proxy:/home/nodejs/.podrc` is passed in `docker run` instead of `.podrc`
* run `ln -s srv/apps/proxy/replace-rule.sample.js proxy.js` for convienence editing (in combination with `pod restart proxy`)
