# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.

    config.vbguest.auto_update = false
    config.vm.define "frontend" do |infra|
        infra.vm.box = "centos/7"
        infra.ssh.insert_key = false
        infra.vm.network "private_network", ip: "192.168.55.10"
        infra.vm.hostname = "django.dev"
        infra.vm.provision "shell", inline: <<-SHELL
            # curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
            # sudo yum install nodejs -y
            # sudo yum install python3 -y
            # sudo yum install wget -y
            # wget https://kojipkgs.fedoraproject.org//packages/sqlite/3.10.0/1.fc22/x86_64/sqlite-devel-3.10.0-1.fc22.x86_64.rpm
            # wget https://kojipkgs.fedoraproject.org//packages/sqlite/3.10.0/1.fc22/x86_64/sqlite-3.10.0-1.fc22.x86_64.rpm
            # sudo yum install sqlite-3.10.0-1.fc22.x86_64.rpm sqlite-devel-3.10.0-1.fc22.x86_64.rpm -y
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install docker-ce docker-ce-cli containerd.io -y
            sudo systemctl enable docker
            sudo systemctl start docker
            sudo docker run -d -p 5672:5672 --name rabbit rabbitmq:alpine
            sudo sleep 10

            cd /vagrant/tar
            make build
            make run
            cd /vagrant/ws-notifier
            make build
            make run
            cd /vagrant/django_frontend
            make build
            make run
            cd /vagrant/mock-logs
            make build
            # make run
            # cd /vagrant/rmq-receiver
            # make build
            # make run

        SHELL
        infra.vm.provider "virtualbox" do |vb|
            vb.memory = "1024"
        end
    end

    config.vm.define "ansible-runner" do |infra|
        infra.vm.box = "centos/7"
        infra.ssh.insert_key = false
        infra.vm.network "private_network", ip: "192.168.55.11"
        infra.vm.provision "shell", inline: <<-SHELL
            sudo mkdir -p /root/.ssh
            sudo chmod 0700 /root/.ssh
            sudo cat /vagrant/ansible-runner/id_rsa.pub >> /root/.ssh/authorized_keys
            sudo chmod 0644 /root/.ssh/authorized_keys

            # curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
            sudo yum install epel-release -y
            # sudo yum install ansible -y
            # sudo yum install nodejs -y
            # sudo yum install -y unzip
            # sudo yum install -y java-11-openjdk
            sudo yum install -y git
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install docker-ce docker-ce-cli containerd.io -y
            sudo systemctl enable docker
            sudo systemctl start docker
            
            cd /vagrant/security-monitoring
            git clone https://github.com/wazuh/wazuh-ansible.git
            cd /vagrant/security-monitoring/wazuh-ansible
            git checkout v4.1.5
            #cp -r /vagrant/security-monitoring/ /vagrant/ansible-runner/

            # cd /vagrant/ansible-runner
            # npm install

            # node app.js &

            cd /vagrant/ansible-runner
            make build
            make run

        SHELL
        infra.vm.provider "virtualbox" do |vb|
            vb.memory = "4096"
            vb.cpus = "2"
        end
    end

    # config.vm.define "agent" do |infra|
    #     infra.vm.box = "centos/7"
    #     infra.ssh.insert_key = false
    #     infra.vm.network "private_network", ip: "192.168.55.12"
    #     infra.vm.hostname = "wazuh-agent"
    #     infra.vm.provider "virtualbox" do |vb|
    #         vb.memory = "1024"
    #     end
    #     infra.vm.provision "shell", inline: <<-SHELL
    #         sudo mkdir -p /root/.ssh
    #         sudo chmod 0700 /root/.ssh
    #         sudo cat /vagrant/ansible-runner/id_rsa.pub >> /root/.ssh/authorized_keys
    #         sudo chmod 0644 /root/.ssh/authorized_keys
    #     #     sudo yum install -y yum-utils
    #     #     sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    #     #     sudo yum install docker-ce docker-ce-cli containerd.io -y
    #     #     sudo systemctl enable docker
    #     #     sudo systemctl start docker
    #         SHELL
    # end


  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # NOTE: This will enable public access to the opened port
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"


  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"
  # config.vm.synced_folder ".", "/code"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Enable provisioning with a shell script. Additional provisioners such as
  # Ansible, Chef, Docker, Puppet and Salt are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL
end
