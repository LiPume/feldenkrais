import { UserRole } from '@prisma/client';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

type Props = {
  role: UserRole;
  userLabel: string;
  studentId?: string;
};

type ActionCard = {
  badge?: string;
  description: string;
  href: string;
  title: string;
  tone?: 'primary' | 'secondary';
};

const studentActions: ActionCard[] = [
  {
    badge: '今日入口',
    title: '找练习',
    description: '按身体部位进入练习库，找到适合此刻状态的练习。',
    href: '/practice-search',
    tone: 'primary',
  },
  {
    title: '新建反馈',
    description: '练习前后记录身体部位、强度和感受词。',
    href: '/feedback/new',
  },
  {
    title: '我的反馈',
    description: '回看历史记录，观察身体觉察的变化轨迹。',
    href: '/feedback',
  },
];

const adminActions: ActionCard[] = [
  {
    badge: '后台',
    title: '进入管理后台',
    description: '查看全班反馈统计、学生填写情况和练习数据。',
    href: '/teacher',
    tone: 'primary',
  },
  {
    title: '查看练习库',
    description: '以学生视角检查练习内容和反馈入口。',
    href: '/practice-search',
  },
];

function WorkspaceLinkCard({ action }: { action: ActionCard }) {
  const primary = action.tone === 'primary';

  return (
    <Link
      href={action.href}
      className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
    >
      <Card
        className={
          primary
            ? 'h-full border-stone-900 bg-stone-950 text-stone-50 transition-transform group-hover:-translate-y-0.5'
            : 'h-full transition-transform group-hover:-translate-y-0.5'
        }
      >
        <CardContent className="flex h-full flex-col justify-between gap-6 p-5">
          <div>
            {action.badge && (
              <Badge variant={primary ? 'warm' : 'neutral'}>{action.badge}</Badge>
            )}
            <h3 className={primary ? 'mt-4 text-xl font-medium tracking-normal text-stone-50' : 'mt-4 text-xl font-medium tracking-normal text-stone-950'}>
              {action.title}
            </h3>
            <p className={primary ? 'mt-2 text-sm leading-6 text-stone-300' : 'mt-2 text-sm leading-6 text-stone-600'}>
              {action.description}
            </p>
          </div>
          <span className={primary ? 'text-sm font-medium text-stone-100' : 'text-sm font-medium text-stone-800'}>
            进入
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RoleWorkspaceHome({ role, userLabel, studentId }: Props) {
  const isAdmin = role === UserRole.TEACHER;
  const actions = isAdmin ? adminActions : studentActions;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_18px_50px_rgba(28,25,23,0.06)] sm:p-8">
        <Badge variant={isAdmin ? 'warm' : 'success'}>
          {isAdmin ? '管理后台' : '学生工作台'}
        </Badge>
        <h1 className="mt-5 text-3xl font-medium leading-tight tracking-normal text-stone-950 sm:text-4xl">
          {isAdmin ? '欢迎回来，进入管理视图。' : `你好，${userLabel}`}
        </h1>
        {studentId && (
          <p className="mt-2 text-sm text-stone-500">学号 {studentId}</p>
        )}
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
          {isAdmin
            ? '从这里查看全班练习反馈和学生填写情况。前端重建不会改变后台权限和数据统计逻辑。'
            : '从一次练习开始：选择身体部位，听音频，完成后记录反馈。慢一点，感受会更清楚。'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <WorkspaceLinkCard key={action.href} action={action} />
        ))}
      </section>
    </div>
  );
}
