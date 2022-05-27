// SPDX-License-Identifier: MIT
 

pragma solidity 0.8.10;

import "../interfaces/IFairLaunch.sol";
import "../SafeToken.sol";

// FairLaunch is a smart contract for distributing MOLE by asking user to stake the ERC20-based token.
contract MockFairLaunch is IFairLaunch {
  using SafeToken for address;

  // Info of each pool.
  struct PoolInfo {
    address stakeToken; // Address of Staking token contract.
    uint256 allocPoint; // How many allocation points assigned to this pool. MOLEs to distribute per block.
    uint256 lastRewardBlock; // Last block number that MOLEs distribution occurs.
    uint256 accMolePerShare; // Accumulated MOLEs per share, times 1e12. See below.
    uint256 accMolePerShareTilBonusEnd; // Accumated MOLEs per share until Bonus End.
  }

  // The Mole TOKEN!
  address public mole;
  address public proxyToken;
  uint256 public constant DEFAULT_HARVEST_AMOUNT = 10 * 1e18;

  PoolInfo[] public override poolInfo;

  constructor(address _mole, address _proxyToken) {
    mole = _mole;
    proxyToken = _proxyToken;
  }

  function addPool(address _stakeToken) external {
    poolInfo.push(
      PoolInfo({
        stakeToken: _stakeToken,
        allocPoint: 0,
        lastRewardBlock: 0,
        accMolePerShare: 0,
        accMolePerShareTilBonusEnd: 0
      })
    );
  }

  // Deposit Staking tokens to FairLaunchToken for MOLE allocation.
  function deposit(
    address _for,
    uint256 _pid,
    uint256 _amount
  ) external override {
    _pid = 0; // silence warning

    SafeToken.safeApprove(proxyToken, _for, _amount);
    proxyToken.safeTransferFrom(_for, address(this), _amount);
    SafeToken.safeApprove(proxyToken, _for, 0);
  }

  function withdrawAll(address _for, uint256 _pid) external override {
    _pid = 0; // silence warning

    if (proxyToken.myBalance() > 0) {
      SafeToken.safeApprove(proxyToken, _for, proxyToken.myBalance());
      proxyToken.safeTransfer(_for, proxyToken.myBalance());
      SafeToken.safeApprove(proxyToken, _for, 0);
    }
  }

  // Harvest MOLEs earn from the pool.
  function harvest(uint256 _pid) external override {
    _pid = 0; // silence warning
    require(DEFAULT_HARVEST_AMOUNT <= mole.myBalance(), "wtf not enough mole");
    SafeToken.safeApprove(mole, msg.sender, DEFAULT_HARVEST_AMOUNT);
    mole.safeTransfer(msg.sender, DEFAULT_HARVEST_AMOUNT);
    SafeToken.safeApprove(mole, msg.sender, 0);
  }
}
