const hre = require('hardhat');

async function main(){
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const owners = [
    deployer.address,
  ];
  const threshold = 1;

  const Factory = await hre.ethers.getContractFactory('MultiSigWallet');
  const wallet = await Factory.deploy(owners, threshold);
  await wallet.deployed();
  console.log('Deployed at', wallet.address);
}

main().catch(e=>{console.error(e);process.exit(1)});
