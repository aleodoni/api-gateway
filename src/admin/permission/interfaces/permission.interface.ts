export interface Permission {
  readonly id: number;
  readonly name: string;
  readonly enabled: boolean;
  readonly roleId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
