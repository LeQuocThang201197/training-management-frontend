export interface User {
  id: string;
  email: string;
  name: string;
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
  // Quản lý thẻ
  CREATE_TAG = "create:tag",
  EDIT_TAG = "edit:tag",
  DELETE_TAG = "delete:tag",
  VIEW_TAG = "view:tag",

  // Quản lý văn bản
  CREATE_DOCUMENT = "create:document",
  EDIT_DOCUMENT = "edit:document",
  DELETE_DOCUMENT = "delete:document",
  VIEW_DOCUMENT = "view:document",

  // Quản lý nhân sự
  MANAGE_PERSONNEL = "manage:personnel",
  VIEW_PERSONNEL = "view:personnel",

  // Quản lý tập huấn
  MANAGE_TRAINING = "manage:training",
  VIEW_TRAINING = "view:training",

  // ... thêm các permission khác
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
    Permission.VIEW_DOCUMENT,
    Permission.CREATE_DOCUMENT,
    Permission.MANAGE_PERSONNEL,
    Permission.MANAGE_TRAINING,
  ],

  [Role.TRAINING_OFFICER]: [
    Permission.VIEW_TAG,
    Permission.CREATE_TAG,
    Permission.VIEW_DOCUMENT,
    Permission.VIEW_PERSONNEL,
    Permission.VIEW_TRAINING,
  ],

  [Role.SPECIALIZED_TEAM_MEMBER]: [
    Permission.VIEW_TAG,
    Permission.VIEW_DOCUMENT,
    Permission.VIEW_TRAINING,
  ],

  [Role.SURVEY_RESPONDENT]: [Permission.VIEW_TAG, Permission.VIEW_DOCUMENT],

  [Role.GUEST]: [Permission.VIEW_TAG],
};
