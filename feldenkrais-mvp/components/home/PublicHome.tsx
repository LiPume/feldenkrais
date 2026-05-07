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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <Badge variant="warm">费登奎斯身体觉察</Badge>
          <h1 className="mt-5 text-4xl font-medium leading-tight tracking-normal text-stone-950 sm:text-5xl">
            用安静的练习，重新听见身体的反馈。
          </h1>
          <p className="mt-5 text-base leading-8 text-stone-600 sm:text-lg">
            按身体部位查找练习，跟随音频慢慢探索，再把练习前后的感受记录下来。这里不是打卡工具，而是一处稳定的觉察空间。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/practice-search"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-stone-950 bg-stone-950 px-5 text-base font-medium text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              开始找练习
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-stone-300 bg-white px-5 text-base font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              登录 / 注册
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-amber-100 bg-[#fffaf0]">
          <CardContent className="p-6 sm:p-8">
            <div className="rounded-2xl border border-amber-100 bg-white/75 p-5">
              <p className="text-sm font-medium text-stone-500">今日练习建议</p>
              <h2 className="mt-3 text-2xl font-medium tracking-normal text-stone-950">
                先观察，再移动。
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">
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
              <h3 className="text-lg font-medium tracking-normal text-stone-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
