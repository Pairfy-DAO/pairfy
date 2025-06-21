use aiken/collection/list
use cardano/transaction.{OutputReference, Transaction, NoDatum, Input, InlineDatum, Output}
use cardano/assets.{PolicyId}
use cardano/assets
use aiken/collection/dict
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Script, VerificationKey }
use aiken/interval

type POSIXTime =
  Int

pub type ThreadTokenInput {
  Mint
  Burn
}

validator threadtoken(token_name: ByteArray, utxo_ref: OutputReference, _timestamp: POSIXTime) {
   mint(redeemer: ThreadTokenInput, policy_id: PolicyId, self: Transaction) -> Bool {
    let Transaction { inputs, mint, .. } = self

    expect [Pair(asset_name, amount)] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()

    when redeemer is {
      Mint -> {
        expect Some(_input) = list.find(inputs, fn(input) { input.output_reference == utxo_ref })
       
        let must_be_amount = amount == 1

        let must_be_name = asset_name == token_name

        and {
            must_be_amount?,
            must_be_name?
        }
      }

      Burn -> amount == -1 && asset_name == token_name
    }
  }
}

pub type StateMachineDatum {
  state: Int,
  delivery: Option<POSIXTime>,
}

pub type StateMachineInput {
  Return
  Lock
  Cancel
  Shipped { delivery_param: POSIXTime }
  Appeal
  Received
  Collect
  Finish
}

validator statemachine(threadtoken: PolicyId, operator: VerificationKeyHash, seller: VerificationKeyHash, buyer: VerificationKeyHash, price: Int, fee: Int, pending_until: POSIXTime, shipping_until: POSIXTime, expire_until: POSIXTime) {
  spend(
    datum_opt: Option<StateMachineDatum>,
    redeemer: StateMachineInput,
    own_ref: OutputReference,
    self: Transaction,
  ) -> Bool {
        expect Some(datum) = datum_opt
        
        when (datum, redeemer) is {
          (StateMachineDatum { state, .. }, Return) -> {
            //Must be after pending state
            let must_be_state = state == 0  
            
            //It should be after pending_until
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> tx_earliest_time > pending_until 
              _ -> False
              }

            let must_be_signed = list.has(self.extra_signatories, buyer)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)
            
            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: -1,
              delivery: None
            }
            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
              must_be_state?,
              must_be_time?,
              must_be_signed?,
              must_be_policy?,
              must_be_datum?
            }
          }
          (StateMachineDatum{ state, .. }, Lock) -> {
            //Must be after pending state
            let must_be_state = state == 0

            //It should be before pending_until
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> tx_earliest_time < pending_until 
              _ -> False
              }

            let must_be_signed = list.has(self.extra_signatories, seller)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)

            let must_be_value = assets.lovelace_of(sm_output.value) == price
            
            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: 1,
              delivery: None
            }

            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and{
              must_be_state?,
              must_be_time?,
              must_be_signed?,
              must_be_policy?,
              must_be_value?,
              must_be_datum?
            }
          }
          (StateMachineDatum{ state, .. }, Cancel) -> {
            //Must be after locking state
            let must_be_state = state == 1
            
            //It should be after shipping_until
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> tx_earliest_time > shipping_until 
              _ -> False
              }

            let must_be_signed = list.has(self.extra_signatories, buyer)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)  

            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: -2,
              delivery: None
            }

            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
                must_be_state?,
                must_be_time?,
                must_be_signed?,
                must_be_policy?,
                must_be_datum?
                }
          }

          (StateMachineDatum{ state, .. }, Shipped { delivery_param }) -> {
            //Must be after locking state
            let must_be_state = state == 1
            
            //It should be before shipping_until
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> tx_earliest_time < shipping_until 
              _ -> False
              }
            
            let must_be_signed = list.has(self.extra_signatories, seller)
            
            let ms_7_days = 604_800_000
            
            //Delivery date must be greater than shipping_until
            let rule_1 = delivery_param > shipping_until

            //The delivery date + appeal window must be less than the expiration time of the contract
            let rule_2 = delivery_param + ms_7_days < expire_until
          
            //Both conditions must be true.
            let must_be_range = and {
              rule_1,
              rule_2
            }

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)

            let must_be_value = assets.lovelace_of(sm_output.value) == price         
            
            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
                          state: 2,
                          delivery: Some(delivery_param)
                        }
            
            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum
            
            and {
              must_be_state?,
              must_be_time?,
              must_be_signed?,
              must_be_range?,
              must_be_policy?,
              must_be_value?,
              must_be_datum?
            }
          }

          (StateMachineDatum{ state, delivery }, Appeal) -> {
            //The appeal must be after shipping state
            let must_be_state = state == 2
            
            //The appeal must be within the specified time.
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> when delivery is {
                                                    Some(delivery_date) -> {
                                                                           let ms_7_days = 604_800_000
                                                                           
                                                                           //The appeal must be within 7 days after the delivery date - 1.
                                                                           let rule_1 = tx_earliest_time > delivery_date
                                                                           //The appeal must be within 7 days after the delivery date - 2.
                                                                           let rule_2 = tx_earliest_time < delivery_date + ms_7_days

                                                                           and {
                                                                            rule_1,
                                                                            rule_2
                                                                           }
                                                                           }
                                                    _ -> False
                                                   }
              _ -> False
              }
            
            //The appeal must be signed by the buyer only.
            let must_be_signed = list.has(self.extra_signatories, buyer)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself - 1.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })
            
            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself - 2.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)  
            
            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: -3,
              delivery: None
            }

            //The state machine locks the price.
            let must_be_value = assets.lovelace_of(sm_output.value) == price

            //verification of the state machine new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
              must_be_state?,
              must_be_time?,
              must_be_signed?,
              must_be_policy?,
              must_be_value?,
              must_be_datum?
            }

          }

          (StateMachineDatum{ state, delivery }, Received) -> {
            //Must be after shipping state
            let must_be_state = state == 2

            let must_be_signed = list.has(self.extra_signatories, buyer)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })
            
            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)
            
            //The price is immutable in the state machine.
            let must_be_value = assets.lovelace_of(sm_output.value) == price          
                        
            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: 3,
              delivery: delivery
            }

            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
              must_be_state?,
              must_be_signed?,
              must_be_policy?,
              must_be_value?,
              must_be_datum?
            }
          }

          (StateMachineDatum{ state, delivery }, Collect) -> {
            //must be after received or shipping state
            let must_be_state = state == 3 || state == 2

            let must_be_signed = list.has(self.extra_signatories, seller)

            //Collect must be within the specified time.
            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> when delivery is {
                                                    Some(delivery_date) -> {
                                                                             if (state == 2) {
                                                                              let ms_7_days = 604_800_000
                                                                           
                                                                              //The appeal must be after 7 days delivery date + 7 days ( appeal window ).
                                                                              tx_earliest_time > delivery_date + ms_7_days
                                                                             } else {
                                                                                True
                                                                             }

                                                                           }
                                                    _ -> False
                                                   }
              _ -> False
              }

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 

            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })
            
            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself.
            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)

            //The fee is immutable in the state machine.
            let must_be_value = assets.lovelace_of(sm_output.value) == fee

            //verification of the new datum.
            let new_data: Data = StateMachineDatum {
              state: 4,
              delivery: None
            }

            //verification of the new datum.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
              must_be_state?,
              must_be_signed?,
              must_be_time?,
              must_be_policy?,
              must_be_value?,
              must_be_datum?
            }
          }

          (StateMachineDatum{ state, .. }, Finish) -> {
            //Must be after collected or appeal state.
            let must_be_state = state == 4 || state == -3

            let must_be_signed = list.has(self.extra_signatories, operator)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref }) 
            
            //It contains threadtoken
            let must_be_policy = list.has(assets.policies(sm_input.output.value), threadtoken)
            
            //TO BUY ---- TO SELLER ---- TO TREASURY
            and {
              must_be_state?,
              must_be_signed?,
              must_be_policy?
            }
          }
        }
  }
}

////////////////////////////////////////////////////////// RETURN

test statemachine_return() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 10
  let price = 50000000
  let fee = 2000000

  ////////////////////////INPUT//////////////////////////  

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(50_000_000),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }

  ///////////////////////////////////////////////////////  

  let new_data: Data = StateMachineDatum {
      state: -1,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  /////////////////////////OUTPUT//////////////////////////////

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(50_000_000),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  /////////////////////////////////////////////////////////////

  let redeemer = Return       //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 0,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(pending_until + 1),
      extra_signatories: [buyer_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

////////////////////////////////////////////////////////////////////////LOCKING

test statemachine_locking() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" // self statemachine hash
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 10
  let price = 50_000_000
  let fee = 2000000

  //////////////////////////////INPUT////////////////////////////////

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  
  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 1,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Lock      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 0,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(pending_until - 1),
      extra_signatories: [seller_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

////////////////////////////////////////////////////////////////////////// CANCEL

test statemachine_cancel() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 10
  let price = 50000000
  let fee = 2000000

  ////////////////////////INPUT//////////////////////////  

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(50_000_000),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }

  ///////////////////////////////////////////////////////  

  let new_data: Data = StateMachineDatum {
      state: -2,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  /////////////////////////OUTPUT//////////////////////////////

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(50_000_000),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  /////////////////////////////////////////////////////////////

  let redeemer = Cancel       //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 1,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(shipping_until + 1),
      extra_signatories: [buyer_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

////////////////////////////////////////////////////////////////////////SHIPPING

test statemachine_shipping() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" // self statemachine hash
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let ms_60_days = 5_184_000_000
  let pending_until = 3
  let shipping_until = 6
  let expire_until = ms_60_days
  let price = 50_000_000
  let delivery_param = shipping_until + 1
  let fee = 2000000

  ////////////////////////////////////////////////////////////////////////

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }

  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 2,
      delivery: Some(delivery_param)
  }  

  let new_datum = InlineDatum(new_data)

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Shipped { delivery_param }      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 1,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(shipping_until - 1),
      extra_signatories: [seller_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

//////////////////////////////////////////////////////////////////////// APPEAL

test statemachine_appeal() {
  let ms_1_hour = 3_600_000
  let ms_60_days = 5_184_000_000
  let ms_1_day = 86_400_000 
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = ms_1_hour
  let shipping_until = ms_1_day
  let expire_until = ms_60_days
  let price = 50_000_000
  let delivery_date = shipping_until + 1
  let fee = 2000000
  
  ////////////////////////INPUT//////////////////////////  

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }

  ///////////////////////////////////////////////////////  

  let new_data: Data = StateMachineDatum {
      state: -3,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  /////////////////////////OUTPUT//////////////////////////////

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  /////////////////////////////////////////////////////////////

  let redeemer = Appeal       //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 2,
    delivery: Some(delivery_date)
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(delivery_date + 1),
      extra_signatories: [buyer_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

//////////////////////////////////////////////////////////////////////// RECEIVED

test statemachine_received() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 20
  let price = 50_000_000
  let delivery_param = shipping_until + 1
  let fee = 2000000

  ////////////////////////////////////////////////////////////////////////

  let input_1 =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }

  ////////////////////////////////////////////////////////  

  let new_data: Data = StateMachineDatum {
      state: 3,
      delivery: Some(delivery_param)
  }  

  let new_datum = InlineDatum(new_data)

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let seller_output =
    Output {
      address: Address {
        payment_credential: VerificationKey(seller_pubkeyhash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: NoDatum,
      reference_script: None,
    }  

  let redeemer = Received  //StateMachineInput
  
  let old_datum = StateMachineDatum {
    state: 2,
    delivery: Some(delivery_param)
  }

  let transaction =
    Transaction {
      inputs: [input_1],
      reference_inputs: [],
      outputs: [sm_output, seller_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(shipping_until + 1),
      extra_signatories: [buyer_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

//////////////////////////////////////////////////////////////////////////////// COLLECT

test statemachine_collect_1() {
  let ms_1_hour = 3_600_000
  let ms_60_days = 5_184_000_000
  let ms_1_day = 86_400_000 
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = ms_1_hour
  let shipping_until = ms_1_day
  let expire_until = ms_60_days
  let price = 50_000_000
  let delivery_date = shipping_until + 1
  let fee = 2000000

  //////////////////////////////INPUT////////////////////////////////

  let sm_input =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  
  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 4,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(fee),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Collect      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 3,
    delivery: Some(delivery_date)
  }

  let transaction =
    Transaction {
      inputs: [sm_input],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(1),
      extra_signatories: [seller_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}
//////////////////////////////////////////////////////////////////////// COLLECT 2

test statemachine_collect_2() {
  let ms_1_hour = 3_600_000
  let ms_60_days = 5_184_000_000
  let ms_1_day = 86_400_000 
  let ms_7_days = 604_800_000
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = ms_1_hour
  let shipping_until = ms_1_day
  let expire_until = ms_60_days
  let price = 50_000_000
  let delivery_date = shipping_until + 1
  let fee = 2000000

  //////////////////////////////INPUT////////////////////////////////

  let sm_input =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  
  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 4,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  let sm_output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(fee),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Collect      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 2,
    delivery: Some(delivery_date)
  }

  let transaction =
    Transaction {
      inputs: [sm_input],
      reference_inputs: [],
      outputs: [sm_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(delivery_date + ms_7_days + 1),
      extra_signatories: [seller_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

//////////////////////////////////////////////////////////////////////////////// FINISH - 1

test statemachine_finish_1() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" 
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 10
  let price = 50_000_000
  let fee = 2_000_000

  //////////////////////////////INPUT////////////////////////////////

  let sm_input =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(fee),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  
  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 5,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  let operator_output =
    Output {
      address: Address {
        payment_credential: VerificationKey(operator_pubkeyhash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(fee),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Finish      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: 4,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [sm_input],
      reference_inputs: [],
      outputs: [operator_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(1),
      extra_signatories: [operator_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}

//////////////////////////////////////////////////////////////////////////////// FINISH - 2

test statemachine_finish_2() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" // self statemachine hash
  let operator_pubkeyhash = #"33333333333333333333333333333333333333333333333333333333"
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let shipping_until = 6
  let expire_until = 10
  let price = 50_000_000
  let fee = 2_000_000

  //////////////////////////////INPUT////////////////////////////////

  let sm_input =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(price),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  
  ////////////////////////////////////////////////////////////////////////

  let new_data: Data = StateMachineDatum {
      state: 5,
      delivery: None
  }  

  let new_datum = InlineDatum(new_data)

  let operator_output =
    Output {
      address: Address {
        payment_credential: VerificationKey(operator_pubkeyhash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(price),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Finish      //StateMachineInput

  let old_datum = StateMachineDatum {
    state: -3,
    delivery: None
  }

  let transaction =
    Transaction {
      inputs: [sm_input],
      reference_inputs: [],
      outputs: [operator_output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(1),
      extra_signatories: [operator_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, operator_pubkeyhash, seller_pubkeyhash, buyer_pubkeyhash, price, fee, pending_until, shipping_until, expire_until, Some(old_datum), redeemer, own_ref, transaction)
}