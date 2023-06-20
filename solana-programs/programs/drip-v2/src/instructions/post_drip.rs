use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct PostDrip<'info> {
    pub signer: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PostDripParams {}

pub fn handle_post_drip(ctx: Context<PostDrip>, params: PostDripParams) -> Result<()> {
    todo!()
}
