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
    badge: '统计',
    title: '查看反馈总览',
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
      className="group block rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      <Card
        className={
          primary
            ? 'h-full border-[#6d583d] bg-[#3a3027] text-[#fff8ea] transition-transform group-hover:-translate-y-0.5'
            : 'h-full transition-transform group-hover:-translate-y-0.5'
        }
      >
        <CardContent className="flex h-full flex-col justify-between gap-6 p-5">
          <div>
            {action.badge && (
              <Badge variant={primary ? 'warm' : 'neutral'}>{action.badge}</Badge>
            )}
            <h3 className={primary ? 'mt-4 font-[var(--font-display)] text-2xl font-medium tracking-normal text-[#fff8ea]' : 'mt-4 font-[var(--font-display)] text-2xl font-medium tracking-normal text-[var(--color-text-primary)]'}>
              {action.title}
            </h3>
            <p className={primary ? 'mt-3 text-sm leading-7 text-[#e5d7bd]' : 'mt-3 text-sm leading-7 text-[var(--color-text-secondary)]'}>
              {action.description}
            </p>
          </div>
          <span className={primary ? 'text-sm font-medium text-[#fff8ea]' : 'text-sm font-medium text-[var(--color-text-primary)]'}>
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
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-soft)] bg-[linear-gradient(145deg,var(--color-surface),#f5ecdd)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <Badge variant={isAdmin ? 'warm' : 'success'}>
          {isAdmin ? '后台账号' : '学生工作台'}
        </Badge>
        <h1 className="mt-5 font-[var(--font-display)] text-3xl font-medium leading-tight tracking-normal text-[var(--color-text-primary)] sm:text-4xl">
          {isAdmin ? '欢迎回来，查看教学反馈。' : `你好，${userLabel}`}
        </h1>
        {studentId && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">学号 {studentId}</p>
        )}
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
          {isAdmin
            ? '从这里查看全班练习反馈、身体部位趋势和学生填写情况。'
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
