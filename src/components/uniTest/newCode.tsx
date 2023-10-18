import React, {useState} from 'react'
import { ethers } from 'ethers'
import { BaseProvider } from '@ethersproject/providers'
import {AlphaRouter, SwapOptionsSwapRouter02, SwapRoute, SwapType} from '@uniswap/smart-order-router'
import { TradeType, CurrencyAmount, Percent, Token, SUPPORTED_CHAINS } from '@uniswap/sdk-core'
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS, ERC20_ABI, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, V3_SWAP_ROUTER_ADDRESS,} from './libs/constants.ts'
import { CurrentConfig } from './libs/config.ts'
import { fromReadableAmount } from './libs/conversion.ts'
import classes from "./newCode.module.css"
import UniAbi from "./libs/UniAbi.json"



const address = '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb';

const uniswapAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"





const NewCode = () => {


const [currentRoute, setCurrentRoute] = useState<SwapRoute | undefined>(undefined)

const mainnetProvider = new ethers.providers.JsonRpcProvider(
    'https://eth-mainnet.g.alchemy.com/v2/HqWYoX-F7NdfHKak6bC23gpRfU6YOklW'
  )

function getMainnetProvider(): BaseProvider {
    return mainnetProvider
  }



  async function generateRoute(): Promise<SwapRoute | null> {
    const router = new AlphaRouter({
        chainId: 1,
        provider: getMainnetProvider(),
    })

    const options: SwapOptionsSwapRouter02 = {
        recipient: address,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
    }

    const route = await router.route(
        CurrencyAmount.fromRawAmount(
            CurrentConfig.tokens.in,
            fromReadableAmount(
                CurrentConfig.tokens.amountIn,
                CurrentConfig.tokens.in.decimals
            ).toString()
        ),
        CurrentConfig.tokens.out,
        TradeType.EXACT_INPUT,
        options
    )


    setCurrentRoute(route);

    return route
}






async function getTokenTransferApproval(
    token: Token
) {




    const provider = getMainnetProvider();
    const address = '0xb7995A51733FF820bbEEFb28770b688B10c1FcFb';
  
    if (!provider || !address) {
        console.log('No Provider Found')
        return "Failed"
    }

    try {
        const tokenContract = new ethers.Contract(
            token.address,
            ERC20_ABI,
            provider
        )

        const transaction = await tokenContract.approve(
            V3_SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
                TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
                token.decimals
            ).toString()
        )

        console.log(transaction);

        return "Ready"
    } catch (e) {
        console.error(e)
        return "Failed"
    }
}










const executeRoute = async() => {


        const res = {
            data: currentRoute?.methodParameters?.calldata,
            to: V3_SWAP_ROUTER_ADDRESS,
            value: currentRoute?.methodParameters?.value,
            from: address,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
          }


          const provider = new ethers.providers.Web3Provider(ethereum)


          const UniContract = new ethers.Contract(
            V3_SWAP_ROUTER_ADDRESS,
            UniAbi,
            provider
        )


        

         

          

         // const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in)





          const tokenIn = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
          const tokenOut = '0xae78736Cd615f374D3085123A210448E74Fc6393';
          const fee = 500
          const recipient = address; 
          const amountIn = 5000n;
          const amountOutMinimum = 0n;
          const sqrtPriceLimitX96 = 0;



          
          const receipt = await UniContract?.callStatic.exactInputSingle([
            tokenIn, 
            tokenOut, 
            fee, 
            recipient, 
            amountIn, 
            amountOutMinimum, 
            sqrtPriceLimitX96
          ]);
        
     

          console.log(receipt);
    
        
   

    
}
 


return (

    <div className={classes.container}>

    <div className={classes.wrapper}>
        <h2>UniTest</h2>







            <button onClick={generateRoute}>Create Route</button>
        

      

            <button onClick={executeRoute} >Execute Route</button>

        


    </div>

</div>
)



  
}

export default NewCode;
