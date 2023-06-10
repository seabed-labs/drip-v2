use anchor_lang::prelude::*;

use crate::errors::DripError;

// TODO: This file could use more exhaustive unit tests

pub const ADMIN_COUNT: usize = 20;
pub const GLOBAL_CONFIG_SPACE: usize = 8 + 8 + 32 + 32 * 20 + 8 * 20 + 8;

#[account]
#[derive(Default)]
pub struct GlobalConfig {
    pub version: u64,                          // 8
    pub super_admin: Pubkey,                   // 32
    pub admins: [Pubkey; ADMIN_COUNT],         // 32*20
    pub admin_permissions: [u64; ADMIN_COUNT], // 8*20
    pub default_drip_fee_bps: u64,             // 8
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AdminChange {
    Clear,
    ChangeAndResetPermissions(Pubkey),
    ResetPermissions,
    AddPermission(AdminPermission),
    RemovePermission(AdminPermission),
}

impl GlobalConfig {
    pub fn update_admin(&mut self, index: usize, admin_change: AdminChange) -> Result<()> {
        require!(index < ADMIN_COUNT, DripError::AdminIndexOutOfBounds);

        match admin_change {
            AdminChange::Clear => {
                self.admins[index] = Pubkey::default();
                self.admin_permissions[index] = 0;
            }
            AdminChange::ChangeAndResetPermissions(new_admin_pubkey) => {
                require!(
                    new_admin_pubkey.ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admins[index] = new_admin_pubkey;
                self.admin_permissions[index] = 0;
            }
            AdminChange::ResetPermissions => {
                self.admin_permissions[index] = 0;
            }
            AdminChange::AddPermission(permission) => {
                require!(
                    self.admins[index].ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admin_permissions[index] = permission.enable(self.admin_permissions[index]);
            }
            AdminChange::RemovePermission(permission) => {
                require!(
                    self.admins[index].ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admin_permissions[index] = permission.disable(self.admin_permissions[index]);
            }
        }

        Ok(())
    }
}

const ADMIN_BITMAP_FULL_SET_MASK: u64 = u64::MAX;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AdminPermission {
    InitPairConfig,
    Drip,
}

impl AdminPermission {
    fn to_mask(&self) -> u64 {
        match self {
            Self::InitPairConfig => 0b1,
            Self::Drip => 0b10,
        }
    }

    fn enable(&self, permissions_bitmap: u64) -> u64 {
        permissions_bitmap | self.to_mask()
    }

    fn disable(&self, permissions_bitmap: u64) -> u64 {
        permissions_bitmap & (ADMIN_BITMAP_FULL_SET_MASK ^ self.to_mask())
    }
}

#[cfg(test)]
mod test {
    use super::AdminPermission;

    #[test]
    fn test_enable() {
        let bitmap: u64 = 0b0;
        let new_bitmap = AdminPermission::InitPairConfig.enable(bitmap);
        assert_eq!(new_bitmap, 0b1);
        let new_bitmap = AdminPermission::Drip.enable(new_bitmap);
        assert_eq!(new_bitmap, 0b11);
    }

    #[test]
    fn test_disable() {
        let bitmap: u64 = 0b11;
        let new_bitmap = AdminPermission::InitPairConfig.disable(bitmap);
        assert_eq!(new_bitmap, 0b10);
        let new_bitmap = AdminPermission::Drip.disable(new_bitmap);
        assert_eq!(new_bitmap, 0b0);
    }
}
