{-# LANGUAGE DataKinds             #-}
{-# LANGUAGE DeriveAnyClass        #-}
{-# LANGUAGE DeriveGeneric         #-}
{-# LANGUAGE DerivingStrategies    #-}
{-# LANGUAGE FlexibleContexts      #-}
{-# LANGUAGE LambdaCase            #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE NamedFieldPuns        #-}
{-# LANGUAGE NoImplicitPrelude     #-}
{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE TemplateHaskell       #-}
{-# LANGUAGE TypeApplications      #-}
{-# LANGUAGE TypeOperators         #-}
{-# LANGUAGE ViewPatterns          #-}
{-# OPTIONS_GHC -fno-ignore-interface-pragmas #-}
{-# OPTIONS_GHC -fplugin-opt PlutusTx.Plugin:debug-context #-}
-- | A state machine with two states and two roles that take turns.
module Plutus.Contracts.Slave(
    SlaveState(..),
    Input(..),
    SlaveError(..),
    SlaveSchema,
    Params(..),
    StartParams(..),
    LockingParams(..),
    DeliveredParams(..),
    ReceivedParams(..),
    contract
    ) where

import Control.Lens
import Control.Monad (forever, void)
import Data.Aeson (FromJSON, ToJSON)
import Data.Monoid (Last (..))
import Data.Text (Text)
import GHC.Generics (Generic)
import Ledger (PaymentPubKeyHash)
import Ledger.Tx.Constraints (TxConstraints)
import Ledger.Tx.Constraints qualified as Constraints
import Ledger.Typed.Scripts qualified as Scripts
import Plutus.Contract
import Plutus.Contract.StateMachine (AsSMContractError (..), OnChainState, State (..), Void)
import Plutus.Contract.StateMachine qualified as SM
import Plutus.Script.Utils.Ada qualified as Ada
import Plutus.Script.Utils.Typed (ScriptContextV2)
import Plutus.Script.Utils.V2.Typed.Scripts qualified as V2
import Plutus.Script.Utils.Value (AssetClass, TokenName, Value)
import PlutusTx qualified
import PlutusTx.Prelude hiding (Applicative (..), check)

import Prelude qualified as Haskell

data SlaveState = SlaveState
    { cState      :: Integer
    , sLabel      :: BuiltinByteString
    , bSlot       :: Bool
    , pDelivered  :: Bool
    , pReceived   :: Bool
    , sWallet     :: PaymentPubKeyHash
    , bWallet     :: PaymentPubKeyHash
    , pPrice      :: Ada.Ada
    , sCollateral :: Ada.Ada
    , mToken      :: SM.ThreadToken
    } | Appeal | Finished
    deriving stock (Haskell.Eq, Haskell.Show, Generic)
    deriving anyclass (ToJSON, FromJSON)

data Params = Params
    { bWallet'     :: PaymentPubKeyHash
    , pPrice'      :: Ada.Ada
    , sCollateral' :: Ada.Ada
    }
    deriving stock (Haskell.Show, Generic)
    deriving anyclass (ToJSON, FromJSON)

data Input = Locking | Delivered | Received
    deriving stock (Haskell.Show, Generic)
    deriving anyclass (ToJSON, FromJSON)

-- | Arguments for the @"start"@ endpoint
data StartParams =
    StartParams
        { params :: Params
        } deriving stock (Haskell.Show, Generic)
          deriving anyclass (ToJSON, FromJSON)

-- | Arguments for the @"locking"@ endpoint
data LockingParams =
    LockingParams
        { lockingParams :: Params
        } deriving stock (Haskell.Show, Generic)
          deriving anyclass (ToJSON, FromJSON)

-- | Arguments for the @"delivered"@ endpoint
data DeliveredParams =
    DeliveredParams
        { deliveredParams :: Params
        } deriving stock (Haskell.Show, Generic)
          deriving anyclass (ToJSON, FromJSON)

-- | Arguments for the @"received"@ endpoint
data ReceivedParams =
    ReceivedParams
        { receivedParams :: Params
        } deriving stock (Haskell.Show, Generic)
          deriving anyclass (ToJSON, FromJSON)

type SlaveSchema =
        Endpoint "start" StartParams
        .\/ Endpoint "locking" LockingParams
        .\/ Endpoint "delivered" DeliveredParams
        .\/ Endpoint "received" ReceivedParams

data SlaveError =
    SlaveContractError ContractError
    | SlaveSMError SM.SMContractError
    | StoppedUnexpectedly
    deriving stock (Haskell.Show, Generic)
    deriving anyclass (ToJSON, FromJSON)

makeClassyPrisms ''SlaveError

instance AsSMContractError SlaveError where
    _SMContractError = _SlaveSMError

instance AsContractError SlaveError where
    _ContractError = _SlaveContractError

{-# INLINABLE transition #-}
transition :: Params -> State SlaveState -> Input -> Maybe (TxConstraints Void Void, State SlaveState)
transition params State{ stateData = oldData, stateValue = oldStateValue } input = case (oldData, input) of
    (SlaveState{cState, bWallet, pPrice}, Locking)      | cState == 0                           -> let constraints = Constraints.mustBeSignedBy bWallet
                                                                                                       newValue   =  oldStateValue + (Ada.toValue pPrice)
                                                                                                   in Just (constraints,
                                                                                                      State{stateData = oldData { cState = 1
                                                                                                                                , sLabel = "locking"
                                                                                                                                , bSlot  = True
                                                                                                                                }, stateValue = newValue })

    (SlaveState{cState, sWallet}, Delivered)    | cState == 1                           -> let constraints = Constraints.mustBeSignedBy sWallet in
                                                                                           Just (constraints,
                                                                                           State{ stateData = oldData { cState = 2
                                                                                                                      , sLabel = "delivered"
                                                                                                                      , pDelivered = True
                                                                                                                      }, stateValue = oldStateValue })

    (SlaveState{cState, bWallet}, Received)     | cState == 2                           -> let constraints = Constraints.mustBeSignedBy bWallet in
                                                                                           Just (constraints,
                                                                                           State{ stateData = Finished, stateValue = mempty })

    _                                                                                   -> Nothing

{-# INLINABLE machine #-}
machine :: Params -> SM.StateMachine SlaveState Input
machine params = SM.mkStateMachine Nothing (transition params) isFinal where
    isFinal Finished = True
    isFinal _        = False

{-# INLINABLE mkValidator #-}
mkValidator :: Params -> V2.ValidatorType (SM.StateMachine SlaveState Input)
mkValidator params = SM.mkValidator $ machine params

typedValidator :: Params -> V2.TypedValidator (SM.StateMachine SlaveState Input)
typedValidator = V2.mkTypedValidatorParam @(SM.StateMachine SlaveState Input)
    $$(PlutusTx.compile [|| mkValidator ||])
    $$(PlutusTx.compile [|| wrap ||])
    where
        wrap = Scripts.mkUntypedValidator @ScriptContextV2 @SlaveState @Input

client :: Params -> SM.StateMachineClient SlaveState Input
client params = SM.mkStateMachineClient $ SM.StateMachineInstance (machine params) (typedValidator params)

initialState :: Params -> PaymentPubKeyHash -> SM.ThreadToken -> SlaveState
initialState params pkh tt = SlaveState { cState = 0
                                        , sLabel = "waiting"
                                        , bSlot  = False
                                        , pDelivered = False
                                        , pReceived = False
                                        , sWallet = pkh
                                        , bWallet = bWallet' params
                                        , pPrice = pPrice' params
                                        , sCollateral = sCollateral' params
                                        , mToken = tt
                                        }

contract :: Contract () SlaveSchema SlaveError ()
contract  = forever endpoints where
        endpoints = selectList [start, locking, delivered, received]
        start =  endpoint @"start" $ \(StartParams{ params }) -> do
                                            pkh <- ownFirstPaymentPubKeyHash
                                            tt  <- SM.getThreadToken
                                            let theClient = client params
                                            void $ SM.runInitialise theClient (initialState params pkh tt) (Ada.toValue (sCollateral' params))
                                            logInfo @Text "[SELLER]=> @start"

        locking      = endpoint @"locking" $ \(LockingParams{ lockingParams }) -> do
                                              void (SM.runStep (client lockingParams) Locking)
                                              logInfo @Text "[BUYER]=> @locking"

        delivered    = endpoint @"delivered" $ \(DeliveredParams{ deliveredParams }) -> do
                                                void (SM.runStep (client deliveredParams) Delivered)
                                                logInfo @Text "[SELLER] => @delivered"

        received     = endpoint @"received" $ \(ReceivedParams{ receivedParams }) -> do
                                                void (SM.runStep (client receivedParams) Received)
                                                logInfo @Text "[BUYER] => @received"



















PlutusTx.unstableMakeIsData ''SlaveState
PlutusTx.makeLift ''SlaveState

PlutusTx.unstableMakeIsData ''Params
PlutusTx.makeLift ''Params

PlutusTx.unstableMakeIsData ''Input
PlutusTx.makeLift ''Input

