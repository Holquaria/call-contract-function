const fs = require ('fs/promises')
const { ethers } = require('ethers')
require('dotenv').config()

const abiFilePath = './abi.json'
const chipDataFilePath = './chip-data.json'

getAbi = async () => {
    const data = await fs.readFile(abiFilePath, 'utf-8')
    const abi = JSON.parse(data)['abi']

    return abi
}

getChipData = async () => {
    const data = await fs.readFile(chipDataFilePath, 'utf-8')
    const chipData = JSON.parse(data)

    const chipAddresses = []
    const tokenIds = []

    chipData.forEach((chip, i) => {
        chipAddresses.push(chip.chip_address.S)
        tokenIds.push(i + 1)
    })

    return { chipAddresses, tokenIds }
}

const ALCHEMY_KEY = process.env.ALCHEMY_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

seedChips = async () => {
    let provider = ethers.getDefaultProvider(`https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`)
    const abi = await getAbi()
    const { chipAddresses, tokenIds } = await getChipData()

    const contractAddress = '0xd10820b5328364308Dd0Ec961c7A2a4E15938549'; 
    const contractABI = abi; 
    let signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // const chipAddresses = ["0x5eB4Bf8144199d80028D271a96DAeaE6054f22f2"]; // replace with the chip addresses you want to map
    // const tokenIds = [1]; // replace with the token IDs you want to map the chips to
    const throwIfTokenAlreadyMinted = true; // replace with true or false depending on your needs

    const tx = await contract.seedChipToTokenMapping(chipAddresses, tokenIds, throwIfTokenAlreadyMinted);

    console.log(tx)
}

seedChips().then(() => {
}).catch((error) => {
    console.log(error)
})