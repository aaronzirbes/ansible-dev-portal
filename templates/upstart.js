# Generated by Ansible for {{ansible_fqdn}}
description "Dev Portal Upstart"

start on started docker
stop on runlevel [!2345]

respawn

setuid root
setgid root

script

  . /usr/local/bin/read_userdata.sh

  if $(docker ps -a --filter name=${UPSTART_JOB} | grep -e ".*"); then
    docker rm ${UPSTART_JOB}
  fi

  # Use "--rm" rather than "--restart" when testing

  /usr/bin/docker run \
    --name ${UPSTART_JOB} \
    -h `cat /etc/hostname` \
    --restart="always" \
    --dns=172.17.42.1 \
    -p 9000:9000 \
    {{kafka_manager_container}}:{{kafka_manager_version}}

end script

pre-stop script
  /usr/bin/docker stop ${UPSTART_JOB}
end script
