export interface System {
  readonly id: number;
  readonly name: string;
  readonly desc: string;
  readonly enabled: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
