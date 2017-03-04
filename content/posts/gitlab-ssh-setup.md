+++
title_color = "mdl-color-text--accent-contrast"
date = "2017-01-05T13:25:40Z"
title = "Gitlab SSL and SSH Setup"
tags = [ "gitlab", "ssl", "ssh", "revserse-proxy" ]

[featured_img]
  pos = "center"
  repeat = ""
  size_summary = "90%"
  size_single = "auto 80%"
  url = "/images/gitlab.svg"


+++

I had a few troubles getting SSL and SSH set up for my self hosted community version of Gitlab. [Gitlab](https://about.gitlab.com/downloads/) itself is awesome and totally easy to install (the said under two minute and it was). My difficulties stemmed from my hosting set up.

#### Setup

I have a sever with Ubuntu 16.04 that I run containers on using [LXD](https://github.com/lxc/lxd) . I use the [iptables](https://linux.die.net/man/8/iptables) directly to manage the firewall (not sure why, it would have been easier to stick with [ufw](https://wiki.ubuntu.com/UncomplicatedFirewall)) and [iptables-persistent](http://stackoverflow.com/questions/30818931/debian-8-iptables-persistent) to persist changes. I keep a set of iptables rules in two files, `rules.v4` and `rules.v6`, in `/etc/iptables`. I run `iptables-restore rules.v4` and `ip6tables-restore rules.v6` whenever I want to get changes from the files into the iptables and `iptables-save` and `ip6tables-save` to have changes persist through restarts of the networking service.

I run [nginx](https://www.nginx.com/resources/wiki/) in one container and applications in their own containers. I open up ports as necessary in the iptables on the server and forward traffic to the nginx container. I do use ufw to manage the firewall there, basically making sure that the nginx container is able to receive whatever traffic is sent to it from the server. Then I use nginx to manage the traffic to the other containers and ufw again in the containers to make sure the required ports can receive traffic. I set up [letsencrypt](https://letsencrypt.org/), which makes managing ssl certificates super easy. ([How To Secure Nginx with Let's Encrypt on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) was hugely helpful.)

#### Terminating SSL Connections at a Reverse Proxy

Gitlab comes bundled with its own nginx server, so when I updated `external_url` in [`/etc/gitlab/gitlab.rb`](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/configuration.md) with an `https` url, it bonked. It took a little wading through the docs to find this very clear explanation on [how to support proxied SSL](https://docs.gitlab.com/omnibus/settings/nginx.html#supporting-proxied-ssl).

{{< highlight ruby "linenos=table" >}}
    nginx['listen_port'] = 80
    nginx['listen_https'] = false
    nginx['proxy_set_headers'] = {
       "X-Forwarded-Proto" => "https",
       "X-Forwarded-Ssl" => "on"
    }

{{< /highlight >}}

#### Enabling SSH Connections to Repositories Through a Reverse Proxy

I went in to the admin panel and added my SSH key, went back to my development machine and tried to SSH to a repository, but no luck. It kept asking for a password. Here are the steps to get it working:

1. Open up a dedicated port on the server firewall for both ipv4 and ipv6
2. Forward traffic from that port to the nginx container
3. Open up a port on the nginx container to receive the traffic
4. Pass the traffic through nginx to the Gitlab container using the [nginx proxy stream module](https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html)
5. Open up a port on the Gitlab container to receive the traffic
6. Update `/etc/gitlab/gitlab.rb` so that it knows where the SSH traffic is coming from (this also adds the port to the SSH repo links)
<div>
{{< highlight ruby "linenos=table" >}}
    gitlab_rails['gitlab_shell_ssh_port'] = <port>
{{< /highlight >}}
<div>
7. Add the port to `/etc/sshd_config` and restart the ssh service with `systemctl restart ssh`



