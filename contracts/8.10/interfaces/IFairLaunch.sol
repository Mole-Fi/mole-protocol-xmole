// SPDX-License-Identifier: MIT
 

pragma solidity 0.8.10;

interface IFairLaunch {
  function deposit(
    address _for,
    uint256 _pid,
    uint256 _amount
  ) external;

  function withdrawAll(address _for, uint256 _pid) external;

  function harvest(uint256 _pid) external;

  function poolInfo(uint256 _pid) external returns (address, uint256, uint256, uint256 ,uint256);
}
