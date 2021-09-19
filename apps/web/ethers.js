import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

// could use some love
class Eth {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.user = null;
    this.loaded = false;
  }

  async setupUser() {
    let address = await this.signer.getAddress();
    let ensName = await this.provider.lookupAddress(address);

    let avatar = null;

    if (ensName) {
      const resolver = await this.provider.getResolver(ensName);
      avatar = await resolver.getText("avatar");
    }

    this.user = {
      avatar,
      address: address.toLocaleLowerCase(),
      name: ensName || address
    };
  }

  async getAvatar(ens) {
    if (ens) {
      const resolver = await this.provider.getResolver(ens);
      let avatar = await resolver.getText("avatar");
      return avatar;
    }
  }

  async getEnsName(address) {
    if (this.provider) {
      let ens = await this.provider.lookupAddress(address);
      return ens;
    }

    return null;
  }

  async connect() {
    this.modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            pollingInterval: 20000000,
            rpc: {
              1: "https://eth-mainnet.alchemyapi.io/v2/fs4lrnWP8rKa8o1yezUnJsFo4ViE92qI"
            }
          }
        }
      } // required
    });

    if (this.modal.cachedProvider) {
      const rawProvider = await this.modal.connect();
      this.provider = new ethers.providers.Web3Provider(rawProvider);
      this.signer = this.provider.getSigner();

      await this.setupUser();

      this.loaded = true;

      return true;
    }

    return false;
  }

  async logIn() {
    const rawProvider = await this.modal.connect();
    this.provider = new ethers.providers.Web3Provider(rawProvider);
    this.signer = this.provider.getSigner();
    await this.setupUser();

    this.loaded = true;

    return true;
  }
}

export default new Eth();
