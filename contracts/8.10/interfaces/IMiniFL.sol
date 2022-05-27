// SPDX-License-Identifier: MIT
 

pragma solidity 0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IMiniFL {
  function stakingToken(uint256 _pid) external view returns (IERC20Upgradeable);

  function deposit(
    address _for,
    uint256 _pid,
    uint256 _amount
  ) external;

  function harvest(uint256 _pid) external;

  function withdraw(
    address _for,
    uint256 _pid,
    uint256 _amount
  ) external;
}
