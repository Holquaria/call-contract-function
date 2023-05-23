const abiFilePath = './abi.json';
const chipDataFilePath = './chip-data.json';

let web3;
let contract;

async function getAbi() {
  const response = await fetch(abiFilePath);
  const data = await response.json();
  console.log(data.abi)
  return data.abi;
}

async function getChipData() {
  const response = await fetch(chipDataFilePath);
  const chipData = await response.json();

  const chipAddresses = [];
  const tokenIds = [];

  chipData.forEach((chip, i) => {
    chipAddresses.push(chip.chip_address.S);
    tokenIds.push(i + 1);
  });

  return { chipAddresses, tokenIds };
}

async function seedChips() {
  try {
    const ALCHEMY_KEY = '<replace-with-your-alchemy-key>';
    const PRIVATE_KEY = '<replace-with-your-private-key>';
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`);
    const abi = await getAbi();
    const { chipAddresses, tokenIds } = await getChipData();

    const contractAddress = '0xd10820b5328364308Dd0Ec961c7A2a4E15938549';
    const contractABI = abi;
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const throwIfTokenAlreadyMinted = true; // replace with true or false depending on your needs

    const tx = await contract.seedChipToTokenMapping(chipAddresses, tokenIds, throwIfTokenAlreadyMinted);
    console.log(tx);
  } catch (error) {
    console.log(error);
  }
}

async function connectWallet() {
  if (window.ethereum) {
    try {
      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);

      // Enable the "Seed Chips" button
      document.getElementById('seed-button').disabled = false;
      console.log('Wallet connected!');
    } catch (error) {
      console.error(error);
      alert('Failed to connect to wallet.');
    }
  } else {
    alert('Please install MetaMask to connect your wallet.');
  }
}
