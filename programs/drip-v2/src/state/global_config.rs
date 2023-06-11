use anchor_lang::prelude::*;

use crate::errors::DripError;

// TODO: This file could use more exhaustive unit tests

pub const ADMIN_COUNT: usize = 20;

#[account]
#[derive(Default, InitSpace)]
pub struct GlobalConfig {
    pub version: u8,
    pub super_admin: Pubkey,
    pub admins: [Pubkey; ADMIN_COUNT],
    pub admin_permissions: [u64; ADMIN_COUNT],
    pub default_drip_fee_bps: u64,
    pub fee_collector: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AdminStateUpdate {
    Clear,
    SetAdminAndResetPermissions(Pubkey),
    ResetPermissions,
    AddPermission(AdminPermission),
    RemovePermission(AdminPermission),
}

impl GlobalConfig {
    pub fn update_admin(&mut self, index: usize, admin_change: AdminStateUpdate) -> Result<()> {
        require!(index < ADMIN_COUNT, DripError::AdminIndexOutOfBounds);

        match admin_change {
            AdminStateUpdate::Clear => {
                self.admins[index] = Pubkey::default();
                self.admin_permissions[index] = 0;
            }
            AdminStateUpdate::SetAdminAndResetPermissions(new_admin_pubkey) => {
                require!(
                    new_admin_pubkey.ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admins[index] = new_admin_pubkey;
                self.admin_permissions[index] = 0;
            }
            AdminStateUpdate::ResetPermissions => {
                self.admin_permissions[index] = 0;
            }
            AdminStateUpdate::AddPermission(permission) => {
                require!(
                    self.admins[index].ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admin_permissions[index] = permission.enable(self.admin_permissions[index]);
            }
            AdminStateUpdate::RemovePermission(permission) => {
                require!(
                    self.admins[index].ne(&Pubkey::default()),
                    DripError::AdminPubkeyCannotBeDefault
                );
                self.admin_permissions[index] = permission.disable(self.admin_permissions[index]);
            }
        }

        Ok(())
    }

    pub fn is_authorized(&self, signer: &Signer, permission: AdminPermission) -> bool {
        if signer.key.eq(&self.super_admin) {
            return true;
        }

        let admin_index = self.admins.iter().position(|admin| admin.eq(signer.key));
        let admin_index = match admin_index {
            None => {
                return false;
            }
            Some(admin_index) => admin_index,
        };

        let admin_permissions_bitmap = self.admin_permissions[admin_index];
        permission.is_enabled(admin_permissions_bitmap)
    }
}

const FULL_U64_BITMAP: u64 = u64::MAX;

// NOTE: DO NOT EDIT (REORDER OR REMOVE OR ADD IN BETWEEN) AFTER DEPLOYMENT, ONLY APPEND
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum AdminPermission {
    Drip = 0,
    UpdateDefaultDripFees,
    UpdatePythPriceFeed,
    UpdateDefaultPairDripFees,
}

impl AdminPermission {
    fn to_mask(&self) -> u64 {
        1 << (self.clone() as u64)
    }

    fn enable(&self, permissions_bitmap: u64) -> u64 {
        permissions_bitmap | self.to_mask()
    }

    fn disable(&self, permissions_bitmap: u64) -> u64 {
        permissions_bitmap & (FULL_U64_BITMAP ^ self.to_mask())
    }

    pub fn is_enabled(&self, permissions_bitmap: u64) -> bool {
        permissions_bitmap & self.to_mask() != 0
    }
}

#[cfg(test)]
mod test {
    use super::AdminPermission;

    #[test]
    fn test_enable() {
        let bitmap: u64 = 0b0;
        let new_bitmap = AdminPermission::Drip.enable(bitmap);
        assert_eq!(new_bitmap, 0b1);
        let new_bitmap = AdminPermission::UpdateDefaultDripFees.enable(new_bitmap);
        assert_eq!(new_bitmap, 0b11);
    }

    #[test]
    fn test_disable() {
        let bitmap: u64 = 0b11;
        let new_bitmap = AdminPermission::Drip.disable(bitmap);
        assert_eq!(new_bitmap, 0b10);
        let new_bitmap = AdminPermission::UpdateDefaultDripFees.disable(new_bitmap);
        assert_eq!(new_bitmap, 0b0);
    }
}
