import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';
import {
  PancakeswapV2RestrictedStrategyAddBaseTokenOnly__factory,
  PancakeswapV2RestrictedStrategyLiquidate__factory,
  PancakeswapV2Worker,
  PancakeswapV2Worker__factory,
  Timelock__factory,
} from '../typechain';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    /*
  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
  Check all variables below before execute the deployment script
  */
  const WORKERS = [{
		WORKER_NAME: "BUSD-USDT Worker",
    VAULT_CONFIG_ADDR: '0x709b102EF4b605197C75CfEA45F455A4e7ce065B',
    WORKER_CONFIG_ADDR: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    REINVEST_BOT: '0xe45216Ac4816A5Ec5378B1D13dE8aA9F262ce9De',
    POOL_ID: 258,
    VAULT_ADDR: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    BASE_TOKEN_ADDR: '0x55d398326f99059ff775485246999027b3197955',
    MASTER_CHEF_ADDR: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    PANCAKESWAP_ROUTER_ADDR: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    ADD_STRAT_ADDR: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
    LIQ_STRAT_ADDR: '0x9Da5D593d08B062063F81913a08e04594F84d438',
    REINVEST_BOUNTY_BPS: '300',
    WORK_FACTOR: '8600',
    KILL_FACTOR: '9200',
    MAX_PRICE_DIFF: '11000',
    TIMELOCK: '0x2D5408f2287BF9F9B05404794459a846651D0a59',
    EXACT_ETA: '1622082600',
    STRATS: [
      '0x5f94f61095731b669b30ed1f3f4586BBb51f4001',
      '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419'
    ]
  }, {
		WORKER_NAME: "BNB-USDT Worker",
    VAULT_CONFIG_ADDR: '0x709b102EF4b605197C75CfEA45F455A4e7ce065B',
    WORKER_CONFIG_ADDR: '0xADaBC5FC5da42c85A84e66096460C769a151A8F8',
    REINVEST_BOT: '0xe45216Ac4816A5Ec5378B1D13dE8aA9F262ce9De',
    POOL_ID: 264,
    VAULT_ADDR: '0x158Da805682BdC8ee32d52833aD41E74bb951E59',
    BASE_TOKEN_ADDR: '0x55d398326f99059ff775485246999027b3197955',
    MASTER_CHEF_ADDR: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    PANCAKESWAP_ROUTER_ADDR: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    ADD_STRAT_ADDR: '0x4c7a420142ec69c7Df5c6C673D862b9E030743bf',
    LIQ_STRAT_ADDR: '0x9Da5D593d08B062063F81913a08e04594F84d438',
    REINVEST_BOUNTY_BPS: '300',
    WORK_FACTOR: '7000',
    KILL_FACTOR: '8333',
    MAX_PRICE_DIFF: '11000',
    TIMELOCK: '0x2D5408f2287BF9F9B05404794459a846651D0a59',
    EXACT_ETA: '1622082600',
    STRATS: [
      '0x5f94f61095731b669b30ed1f3f4586BBb51f4001',
      '0x55fCc2Dfb1a26e58b1c92a7C85bD2946037A9419'
    ]
  }]









  for(let i = 0; i < WORKERS.length; i++) {
    console.log("===================================================================================")
    console.log(`>> Deploying an upgradable PancakeswapV2Worker contract for ${WORKERS[i].WORKER_NAME}`);
    const PancakeswapV2Worker = (await ethers.getContractFactory(
      'PancakeswapV2Worker',
      (await ethers.getSigners())[0]
    )) as PancakeswapV2Worker__factory;
    const pancakeswapV2Worker = await upgrades.deployProxy(
      PancakeswapV2Worker,[
        WORKERS[i].VAULT_ADDR, WORKERS[i].BASE_TOKEN_ADDR, WORKERS[i].MASTER_CHEF_ADDR,
        WORKERS[i].PANCAKESWAP_ROUTER_ADDR, WORKERS[i].POOL_ID, WORKERS[i].ADD_STRAT_ADDR,
        WORKERS[i].LIQ_STRAT_ADDR, WORKERS[i].REINVEST_BOUNTY_BPS
      ]
    ) as PancakeswapV2Worker;
    await pancakeswapV2Worker.deployed();
    console.log(`>> Deployed at ${pancakeswapV2Worker.address}`);

    console.log(`>> Adding REINVEST_BOT`);
    await pancakeswapV2Worker.setReinvestorOk([WORKERS[i].REINVEST_BOT], true);
    console.log("✅ Done");

    console.log(`>> Adding Strategies`);
    await pancakeswapV2Worker.setStrategyOk(WORKERS[i].STRATS, true);
    console.log("✅ Done");

    console.log(`>> Whitelisting a worker on strats`);
    const addStrat = PancakeswapV2RestrictedStrategyAddBaseTokenOnly__factory.connect(WORKERS[i].ADD_STRAT_ADDR, (await ethers.getSigners())[0])
    await addStrat.setWorkersOk([pancakeswapV2Worker.address], true)
    const liqStrat = PancakeswapV2RestrictedStrategyLiquidate__factory.connect(WORKERS[i].LIQ_STRAT_ADDR, (await ethers.getSigners())[0])
    await liqStrat.setWorkersOk([pancakeswapV2Worker.address], true)
    for(let j = 0; j < WORKERS[i].STRATS.length; j++) {
      const strat = PancakeswapV2RestrictedStrategyAddBaseTokenOnly__factory.connect(WORKERS[i].STRATS[j], (await ethers.getSigners())[0])
      await strat.setWorkersOk([pancakeswapV2Worker.address], true)
    }
    console.log("✅ Done");

    const timelock = Timelock__factory.connect(WORKERS[i].TIMELOCK, (await ethers.getSigners())[0]);

    console.log(">> Timelock: Setting WorkerConfig via Timelock");
    const setConfigsTx = await timelock.queueTransaction(
      WORKERS[i].WORKER_CONFIG_ADDR, '0',
      'setConfigs(address[],(bool,uint64,uint64,uint64)[])',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],
        [
          [pancakeswapV2Worker.address], [{acceptDebt: true, workFactor: WORKERS[i].WORK_FACTOR, killFactor: WORKERS[i].KILL_FACTOR, maxPriceDiff: WORKERS[i].MAX_PRICE_DIFF}]
        ]
      ), WORKERS[i].EXACT_ETA
    );
    console.log(`queue setConfigs at: ${setConfigsTx.hash}`)
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${WORKERS[i].WORKER_CONFIG_ADDR}', '0', 'setConfigs(address[],(bool,uint64,uint64,uint64)[])', ethers.utils.defaultAbiCoder.encode(['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],[['${pancakeswapV2Worker.address}'], [{acceptDebt: true, workFactor: ${WORKERS[i].WORK_FACTOR}, killFactor: ${WORKERS[i].KILL_FACTOR}, maxPriceDiff: ${WORKERS[i].MAX_PRICE_DIFF}}]]), ${WORKERS[i].EXACT_ETA})`)
    console.log("✅ Done");

    console.log(">> Timelock: Linking VaultConfig with WorkerConfig via Timelock");
    const setWorkersTx = await timelock.queueTransaction(
      WORKERS[i].VAULT_CONFIG_ADDR, '0',
      'setWorkers(address[],address[])',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','address[]'],
        [
          [pancakeswapV2Worker.address], [WORKERS[i].WORKER_CONFIG_ADDR]
        ]
      ), WORKERS[i].EXACT_ETA
    );
    console.log(`queue setWorkers at: ${setWorkersTx.hash}`)
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${WORKERS[i].VAULT_CONFIG_ADDR}', '0','setWorkers(address[],address[])', ethers.utils.defaultAbiCoder.encode(['address[]','address[]'],[['${pancakeswapV2Worker.address}'], ['${WORKERS[i].WORKER_CONFIG_ADDR}']]), ${WORKERS[i].EXACT_ETA})`)
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['PancakeswapWorkers'];