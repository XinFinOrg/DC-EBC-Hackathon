import {
    useContractReads,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
  } from "wagmi";
  import {
    Diamond,
    DIAMOND_ABI,
    LEVERAGE_ABI,
    LIQUIDATOR_ABI,
    PERP_FUTURES_ABI,
    PERP_OPTIONS_ABI,
    VIEW_ABI,
    XDC,
  } from "../../constants";

  enum TradingDirection {
    CALL = 0,
    PUT = 1,
  }
  
  export const useSellFuture = (
    amount: bigint,
    tokenAddress: `0x${string}`,
    pool: `0x${string}`,
    poolFee: number,
    leverage: number,
  ) => {
    const futureParamsStruct = {
      amount,
      token: tokenAddress,
      pool,
      poolFee,
      leverage,
      futureType: 1
    };
  
    const {
      config: createPerpFutureConfig,
      error: createPrepareFail,
      isError: hasCreatePrepareFailed,
      isFetching: isCreatePrepareFetching,
    } = usePrepareContractWrite({
      abi: PERP_FUTURES_ABI,
      address: Diamond,
      functionName:  "sellFutureContract",
      args: [futureParamsStruct],
    });
  
    const { data: perpFutureData, write: executePerpFuture } =
      useContractWrite(createPerpFutureConfig);
  
    const {
      isLoading: isPerpFutureLoading,
      isSuccess: isPerpFutureSuccessful,
      isError: isPerpFutureFailed,
    } = useWaitForTransaction({
      hash: perpFutureData?.hash,
    });
  
    return {
      isPerpFutureLoading,
      isPerpFutureSuccessful,
      executePerpFuture,
      createPrepareFail,
      hasCreatePrepareFailed,
      isCreatePrepareFetching,
      isPerpFutureFailed,
    };
  };
  
  export const useBuyFuture = (
    pool: `0x${string}`,
    owner: `0x${string}`,
    contractId: number
  ) => {
    const {
      config: createPerpFutureConfig,
      error: createPrepareFail,
      isError: hasCreatePrepareFailed,
      isFetching: isCreatePrepareFetching,
    } = usePrepareContractWrite({
      abi: PERP_FUTURES_ABI,
      address: Diamond,
      functionName: "buyFutureContract",
      args: [pool, owner, contractId, 0],
    });
  
    const { data: perpFutureBuyData, write: executePerpBuyFuture } =
      useContractWrite(createPerpFutureConfig);
  
    const {
      isLoading: isPerpBuyFutureLoading,
      isSuccess: isPerpBuyFutureSuccessful,
      isError: isPerpBuyFutureFailed,
    } = useWaitForTransaction({
      hash: perpFutureBuyData?.hash,
    });
  
    return {
      isPerpBuyFutureLoading,
      isPerpBuyFutureSuccessful,
      executePerpBuyFuture,
      createPrepareFail,
      hasCreatePrepareFailed,
      isCreatePrepareFetching,
      isPerpBuyFutureFailed,
    };
  };
  