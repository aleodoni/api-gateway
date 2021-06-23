export interface UserRole {
  readonly id: number;
  readonly enabled: boolean;
  readonly userId: number;
  readonly roleId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
