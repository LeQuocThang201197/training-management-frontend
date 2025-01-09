export interface User {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: number;
    key: string;
    value: string;
    type: string;
  };
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export enum Permission {
  CREATE_TAG = "create:tag",
  EDIT_TAG = "edit:tag",
  DELETE_TAG = "delete:tag",
  VIEW_TAG = "view:tag",
  // Thêm các permission khác...
}

export enum Role {
  ADMIN = "R1",
  MANAGER = "R2",
  TRAINING_OFFICER = "R3",
  SPECIALIZED_TEAM_MEMBER = "R4",
  SURVEY_RESPONDENT = "R5",
  GUEST = "R6",
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // Admin có tất cả quyền
  [Role.MANAGER]: [
    Permission.VIEW_TAG,
    Permission.CREATE_TAG,
    // Thêm các quyền khác...
  ],
  [Role.TRAINING_OFFICER]: [
    Permission.VIEW_TAG,
    Permission.CREATE_TAG,
    // Thêm các quyền khác...
  ],
  [Role.SPECIALIZED_TEAM_MEMBER]: [Permission.VIEW_TAG],
  [Role.SURVEY_RESPONDENT]: [Permission.VIEW_TAG],
  [Role.GUEST]: [Permission.VIEW_TAG],
};
