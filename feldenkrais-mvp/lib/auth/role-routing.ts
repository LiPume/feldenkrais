import { UserRole } from '@prisma/client';
import { isInternalStudentEmail } from '@/lib/auth/student-account';

export type AppNavItem = {
  href: string;
  label: string;
};

export function serializeRole(role: UserRole): 'student' | 'teacher' {
  return role === UserRole.TEACHER ? 'teacher' : 'student';
}

export function parseRoleListParam(value?: string | null): UserRole[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .flatMap((item) => {
      if (item === 'teacher') {
        return [UserRole.TEACHER];
      }

      if (item === 'student') {
        return [UserRole.STUDENT];
      }

      return [];
    });
}

export function getRoleLabel(role?: UserRole | null): string {
  if (role === UserRole.TEACHER) {
    return '老师';
  }

  if (role === UserRole.STUDENT) {
    return '学生';
  }

  return '访客';
}

export function getPostAuthPath(role: UserRole): string {
  if (role === UserRole.TEACHER) {
    return '/teacher';
  }

  return '/';
}

export function getNavigationItems(role?: UserRole | null): AppNavItem[] {
  if (role === UserRole.TEACHER) {
    return [
      { href: '/', label: '工作台' },
      { href: '/practice-search', label: '练习库' },
      { href: '/feedback', label: '我的反馈' },
    ];
  }

  if (role === UserRole.STUDENT) {
    return [
      { href: '/', label: '工作台' },
      { href: '/practice-search', label: '找练习' },
      { href: '/feedback', label: '我的反馈' },
    ];
  }

  return [
    { href: '/', label: '首页' },
    { href: '/practice-search', label: '找练习' },
  ];
}

export function getUserDisplayLabel(input: {
  fullName?: string | null;
  studentId?: string | null;
  email?: string | null;
}): string | null {
  return (
    input.fullName ??
    input.studentId ??
    (isInternalStudentEmail(input.email) ? null : input.email) ??
    null
  );
}

export function getUnauthorizedState(input: {
  actualRole?: UserRole | null;
  expectedRoles?: UserRole[];
}): {
  title: string;
  description: string;
  primaryAction: AppNavItem;
  secondaryActions: AppNavItem[];
} {
  const expectedTeacher = input.expectedRoles?.includes(UserRole.TEACHER) ?? false;
  const expectedStudent = input.expectedRoles?.includes(UserRole.STUDENT) ?? false;

  if (input.actualRole === UserRole.STUDENT && expectedTeacher) {
    return {
      title: '当前是学生账号',
      description: '管理后台仅对后台管理员开放。你可以回工作台继续找练习、记录反馈或查看自己的历史。',
      primaryAction: {
        href: '/',
        label: '回学生工作台',
      },
      secondaryActions: [
        { href: '/practice-search', label: '去找练习' },
        { href: '/feedback', label: '看我的反馈' },
      ],
    };
  }

  if (input.actualRole === UserRole.TEACHER && expectedStudent) {
    return {
      title: '当前是管理账号',
      description: '这个页面是学生自助流程页。管理账号可以从工作台进入后台统计和练习库。',
      primaryAction: {
        href: '/',
        label: '回工作台',
      },
      secondaryActions: [
        { href: '/teacher', label: '去老师端' },
        { href: '/feedback', label: '看我的反馈' },
      ],
    };
  }

  if (input.actualRole === UserRole.TEACHER) {
    return {
      title: '当前页面不适合管理账号',
      description: '管理账号可以从工作台进入后台统计和练习库，不需要在学生流程和管理流程之间来回跳转。',
      primaryAction: {
        href: '/',
        label: '回工作台',
      },
      secondaryActions: [
        { href: '/teacher', label: '去老师端' },
        { href: '/feedback', label: '看我的反馈' },
      ],
    };
  }

  return {
    title: '当前页面没有访问权限',
    description: '这个入口和你当前账号的角色不匹配。回到对应工作台会更顺。',
    primaryAction: {
      href: '/',
      label: '回工作台',
    },
    secondaryActions: [
      { href: '/practice-search', label: '去找练习' },
      { href: '/feedback', label: '看我的反馈' },
    ],
  };
}
