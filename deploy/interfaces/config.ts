export interface Config {
  ProxyAdmin: string;
  Timelock: string;
  FairLaunch?: FairLaunch;
  MiniFL?: MiniFL;
  Scientix?: Scientix;
  Tokens: Tokens;
  xMOLE: string;
  MOLEFeeder: string;
  GrassHouses: GrassHouse[];
  GrassHouseGateway: string;
}

export interface FairLaunch {
  address: string;
  deployedBlock: number;
  pools: Pool[];
}

export interface MiniFL {
  address: string;
  deployedBlock: number;
  pools: PoolsEntity2[];
}

export interface PoolsEntity2 {
  id: number;
  stakingToken: string;
  address: string;
  rewarder: string;
}

export interface Pool {
  id: number;
  stakingToken: string;
  address: string;
}

export interface Scientix {
  StakingPools: StakingPools;
}

export interface StakingPools {
  address: string;
  deployedBlock: number;
  pools: Pool2[];
}

export interface Pool2 {
  id: number;
  name: string;
  stakingToken: string;
  rewardToken: string;
}

export interface Tokens {
  MOLE?: string;
  fdMOLE?: string;
  SCIX?: string;
  fdSCIX?: string;
}

export interface GrassHouse {
  name: string;
  address: string;
  rewardToken: string;
}
