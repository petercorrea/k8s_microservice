sudo systemctl stop kubelet
sudo systemctl disable kubelet
sudo systemctl stop docker
sudo systemctl disable docker
# If you're using containerd directly
sudo systemctl stop containerd
sudo systemctl disable containerd
sudo rm -rf /etc/kubernetes/manifests/*.yaml
sudo rm -rf /etc/kubernetes/pki
sudo rm -rf /var/lib/etcd
sudo kubeadm reset
sudo rm -rf /etc/cni/net.d
sudo ss -tulnp | grep -E ':6443|:10259|:10257|:10250|:2379|:2380'
ps aux | grep kube
ps aux | grep etcd