// SPDX-License-Identifier: MIT
 

pragma solidity 0.8.10;

interface IStakingPool {
  function deposit(
    uint256 _pid,
    uint256 _amount
  ) external;

  function exit(uint256 _pid) external;

  function claim(uint256 _pid) external;

  function getPoolToken(uint256 _pid) external returns (address);
}
