// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.15;

import "./dependencies/uniswap-0.8/TransferHelper.sol";
import "./dependencies/uniswap-0.8/ISwapRouter.sol";

import "./oracles/UniswapV3Oracle.sol";

/// @title Uniswap V3 swapper
/// @author Volatility Smilers @Polygon Buidl It Hackathon
/// @notice swap token on Uniswap V3 
/// @dev Explain to a developer any extra details

contract Swapper is UniswapV3twap {
    // Does not work with SwapRouter02
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    // @dev gets price of token0 in terms of token1 
    // @dev calling estimateAmountOut() in /oracles/UniswapV3Oracle.sol
    function getPrice(address token0, address token1) public view returns (int) {
        address pool = getPool(token0,token1,3000);
        require(pool != address(0), "Pool does not exist on Uniswap V3");
        int price = int(estimateAmountOut(token0, 1e18, 500, token1));
        return price;   
    }
    // @dev swaps a fixed amount of WETH for a maximum possible amount of DAI
    function swapExactInputSingle(address token0, address token1, uint amountIn) internal returns (uint amountOut) {
        
        TransferHelper.safeTransferFrom(
            token0,
            address(this),
            address(this),
            amountIn
        );
        TransferHelper.safeApprove(token0, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: token0,
            tokenOut: token1,
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            // NOTE: In production, this value can be used to set the limit
            // for the price the swap will push the pool to,
            // which can help protect against price impact
            sqrtPriceLimitX96: 0
        });
        amountOut = swapRouter.exactInputSingle(params);
    }
    
    // @dev this function is not being used currently
    function swapExactOutputSingle(address token0, address token1, uint amountOut, uint amountInMaximum)
        internal
        returns (uint amountIn)
    {
        TransferHelper.safeTransferFrom(
            token0,
            msg.sender,
            address(this),
            amountInMaximum
        );
        TransferHelper.safeApprove(token0, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: token0,
                tokenOut: token1,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            // Reset approval on router
            TransferHelper.safeApprove(token0, address(swapRouter), 0);

            TransferHelper.safeTransfer(
                token0,
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }
}