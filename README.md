# Usage 

    $ BUILD=1 ./build

    $ docker run -it                         \
        -v $(pwd)/srv:/srv                   \
        -v $(pwd)/.ssh:/home/nodejs/.ssh     \
        -v $(pwd)/.podrc:/home/nodejs/.podrc \
        -v $(pwd)/.ssh.etc:/etc/ssh          \
        -e ROOTPASSWD=test                   \
        -e PASSWD=test                       \
        -e HOSTNAME=nodepod                  \
        -p 22:22                             \ # ssh port
        -p 81:80                             \ # http port
        -p 19999:19999                       \ # pod webinterface port
        nodepod
