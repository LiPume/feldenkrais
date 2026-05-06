import { UserRole } from '@prisma/client';
import Link from 'next/link';

type Props = {
  role: UserRole;
  userLabel: string;
  studentId?: string;
};

type ActionCard = {
  title: string;
  description: string;
  href: string;
  tone?: 'primary' | 'secondary';
};

const studentActions: ActionCard[] = [
  {
    title: '找练习',
    description: '按身体部位进入练习库，找到适合的练习内容与音频。',
    href: '/practice-search',
    tone: 'primary',
  },
  {
    title: '新建反馈',
    description: '记录这次练习的感受，每个部位独立填写，追踪感知变化。',
    href: '/feedback/new',
  },
  {
    title: '我的反馈',
    description: '回顾练习历史，在时间轴中看见自己的觉察轨迹。',
    href: '/feedback',
  },
];

const adminTeachingActions: ActionCard[] = [
  {
    title: '老师端统计',
    description: '查看全班填写情况、练习反馈数和学生历史数据。',
    href: '/teacher',
    tone: 'primary',
  },
  {
    title: '练习库',
    description: '查看所有练习内容，也可以切换到个人视角使用反馈功能。',
    href: '/practice-search',
  },
];

const adminPersonalActions: ActionCard[] = [
  {
    title: '我的反馈',
    description: '以个人身份记录体验，测试流程或记录自己的练习感受。',
    href: '/feedback',
    tone: 'primary',
  },
  {
    title: '新建反馈',
    description: '直接进入反馈表单，记录个人练习中的觉察与变化。',
    href: '/feedback/new',
  },
];

function ActionGrid({ actions }: { actions: ActionCard[] }) {
  return (
    <div className="action-grid stagger-children">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className={`action-card card ${action.tone === 'primary' ? 'action-card--primary' : ''}`}
        >
          <div className="action-card-inner">
            <div>
              <h3 className="action-card-title">{action.title}</h3>
              <p className="action-card-desc">{action.description}</p>
            </div>
            <div className="action-card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function WorkspaceHero({ role, userLabel, studentId }: Props) {
  const isAdmin = role === UserRole.TEACHER;

  return (
    <section className={`workspace-hero ${isAdmin ? 'workspace-hero--admin' : ''}`}>
      <div className="workspace-hero-bg" />
      <div className="workspace-hero-inner">
        <div className="workspace-hero-content animate-fade-in-up">
          <p className="section-eyebrow workspace-hero-eyebrow">
            {isAdmin ? '管理后台' : '学生工作台'}
          </p>
          <h1 className="workspace-hero-title">{userLabel}</h1>
          {studentId && (
            <p className="workspace-hero-student-id">学号 {studentId}</p>
          )}
          <p className="workspace-hero-desc">
            {isAdmin
              ? '查看全班练习反馈统计与学生填写情况，也可以继续以个人身份做练习和记录反馈。'
              : '从这里开始：找练习、做反馈、回顾历史。慢慢来，感受每一个部位。'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function RoleWorkspaceHome({ role, userLabel, studentId }: Props) {
  if (role === UserRole.TEACHER) {
    return (
      <div className="workspace-page">
        <WorkspaceHero role={role} userLabel={userLabel} studentId={studentId} />

        <div className="workspace-body">
          <div className="workspace-section animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="workspace-section-header">
              <p className="section-eyebrow">管理</p>
              <h2 className="workspace-section-title">后台入口</h2>
              <div className="divider" />
              <p className="workspace-section-desc">
                查看全班与练习统计，下钻到某个学生或某个练习的详细反馈。
              </p>
            </div>
            <ActionGrid actions={adminTeachingActions} />
          </div>

          <div className="workspace-section animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="workspace-section-header">
              <p className="section-eyebrow">个人</p>
              <h2 className="workspace-section-title">个人使用</h2>
              <div className="divider" />
              <p className="workspace-section-desc">
                以个人身份进入反馈流程，与管理入口分开，避免混淆。
              </p>
            </div>
            <ActionGrid actions={adminPersonalActions} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <WorkspaceHero role={role} userLabel={userLabel} studentId={studentId} />

      <div className="workspace-body">
        <div className="workspace-section animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="workspace-section-header">
            <p className="section-eyebrow">常用</p>
            <h2 className="workspace-section-title">开始练习</h2>
            <div className="divider" />
            <p className="workspace-section-desc">
              三条主线入口：找练习、做反馈、回看历史。感受每个部位，关注自己的变化。
            </p>
          </div>
          <ActionGrid actions={studentActions} />
        </div>
      </div>
    </div>
  );
}
