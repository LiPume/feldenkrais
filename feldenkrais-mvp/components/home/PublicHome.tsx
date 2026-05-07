import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

const principles = [
  {
    title: '按身体进入',
    description: '从肩颈、脊柱、骨盆或腿脚开始，找到对应的练习音频。',
  },
  {
    title: '练后记录',
    description: '把强度、标签和左右差异记录下来，让感受有迹可循。',
  },
  {
    title: '回看变化',
    description: '在反馈历史中观察身体感知的变化，而不是只记住一次体验。',
  },
];

export default function PublicHome() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <Badge variant="warm">费登奎斯身体觉察</Badge>
          <h1 className="mt-6 font-[var(--font-display)] text-4xl font-medium leading-tight tracking-normal text-[var(--color-text-primary)] sm:text-5xl">
            用安静的练习，重新听见身体的反馈。
          </h1>
          <p className="mt-6 text-base leading-8 text-[var(--color-text-secondary)] sm:text-lg">
            按身体部位查找练习，跟随音频慢慢探索，再把练习前后的感受记录下来。这里不是打卡工具，而是一处稳定的觉察空间。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/practice-search"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-btn-primary)] bg-[var(--color-btn-primary)] px-5 text-base font-medium text-[var(--color-text-inverse)] shadow-[0_8px_20px_rgba(61,48,35,0.16)] transition-colors hover:bg-[var(--color-btn-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              开始找练习
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-btn-secondary-border)] bg-[var(--color-btn-secondary-bg)] px-5 text-base font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-btn-secondary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              登录 / 注册
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-[#dcc497] bg-[linear-gradient(145deg,#fffdfa,#f2e6d2)]">
          <CardContent className="p-6 sm:p-8">
            <div className="rounded-[var(--radius-lg)] border border-[#e2cda5] bg-white/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">今日练习建议</p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-medium tracking-normal text-[var(--color-text-primary)]">
                先观察，再移动。
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                选择一个最有感觉的部位，从 10 到 20 分钟的音频开始。练习结束后，用反馈表记录身体强度和感受词。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="neutral">肩颈</Badge>
                <Badge variant="neutral">脊柱</Badge>
                <Badge variant="neutral">骨盆</Badge>
                <Badge variant="muted">呼吸</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <h3 className="font-[var(--font-display)] text-xl font-medium tracking-normal text-[var(--color-text-primary)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
