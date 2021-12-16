// Add consts here
const BIP39 = require("bip39");
//To generate a private key from the hex seed,
//we will to use the ethereumjs-wallet library
const hdkey = require("ethereumjs-wallet/hdkey");
const Wallet = require("ethereumjs-wallet");
const { keccak256 } = require("js-sha3");
const EthereumTx = require("ethereumjs-tx");

// Generate a random mnemonic (uses crypto.randomBytes under the hood),
// defaults to 128-bits of entropy

const generateMnemonic = () => {
  return BIP39.generateMnemonic();
};

const generateSeed = (mnemonic) => {
  //mnemonicToSeed
  return BIP39.mnemonicToSeed(mnemonic);
};

const generatePrivateKey = (mnemonic) => {
  const seed = generateSeed(mnemonic);

  return hdkey
    .fromMasterSeed(seed)
    .derivePath(`m/44'/60'/0'/0/0`)
    .getWallet()
    .getPrivateKey();
};
const derivePubKey = (privateKey) => {
  const wallet = Wallet.fromPrivateKey(privateKey);
  const publicKey = wallet.getPublicKey();

  return publicKey;
};

const myMnemonic = generateMnemonic();
/**
 * BIP39.validateMneumonic("your mneumonic here") returns a boolean
 */
const isValid = BIP39.validateMnemonic(myMnemonic);
console.log(myMnemonic, isValid);

const myPrivateKey = generatePrivateKey(myMnemonic);

const myPublicKey = derivePubKey(myPrivateKey);
//get public key from privvate key

/**Taking the keccak-256 hash of the public key will return 32 bytes which you
 *  need to trim down to the last 20 bytes (40 characters in hex) to get the address */
const deriveEthAddress = (publicKey) => {
  const address = keccak256(publicKey);

  return "ox" + address.substring(address.length - 40, address.length);
};

const myEthAddress = deriveEthAddress(myPublicKey);
console.log("my Private Key: ", myPrivateKey);
console.log("my public key :", myPublicKey);
console.log("my eth address :", myEthAddress);

/*
Do not edit code below this line.
*/

var mnemonicVue = new Vue({
  el: "#app",
  data: {
    mnemonic: "",
    privKey: "",
    pubKey: "",
    ETHaddress: "",
    sampleTransaction: {
      nonce: "0x00",
      gasPrice: "0x09184e72a000",
      gasLimit: "0x2710",
      to: "0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6",
      value: "0x10",
      data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057",
      chainId: 3,
    },
    signedSample: {},
    recoveredAddress: "",
  },
  methods: {
    generateNew: function () {
      this.mnemonic = generateMnemonic();
    },
    signSampleTx: function () {
      this.signedSample = signTx(this.privKey, this.sampleTransaction);
      console.log("signed Sample", this.signedSample);
    },
  },
  watch: {
    mnemonic: function (val) {
      this.privKey = generatePrivKey(val);
    },
    privKey: function (val) {
      this.pubKey = derivePubKey(val);
    },
    pubKey: function (val) {
      this.ETHaddress = deriveEthAddress(val);
      this.recoveredAddress = "";
    },
    signedSample: function (val) {
      this.recoveredAddress = getSignerAddress(val);
    },
  },
});
