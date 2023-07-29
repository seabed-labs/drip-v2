pub struct DripAmount {
    pub drip_amount_post_fees: u64,
    pub input_token_fee_amount: u64,
}

pub fn split_drip_amount_from_fees(
    drip_amount: &u64,
    // 0 to 10_000 bps
    drip_fee_bps: &u64,
    // 0 to 10_000 bps
    input_token_drip_fee_portion_bps: &u64,
) -> DripAmount {
    let input_drip_fee_bps = (drip_fee_bps * input_token_drip_fee_portion_bps) / 10_000;
    let input_token_fee_amount = (drip_amount * input_drip_fee_bps) / 10_000;
    let drip_amount_post_fees = drip_amount - input_token_fee_amount;
    DripAmount {
        drip_amount_post_fees,
        input_token_fee_amount,
    }
}
