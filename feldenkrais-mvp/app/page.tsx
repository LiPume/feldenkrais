import Link from "next/link";

const studentFlow = [
  "按身体部位筛练习，直接进入练习详情和音频播放。",
  "完成练习后，按部位分别填写强度、标签、左右差异和备注。",
  "所有反馈写入数据库，后续可以继续回看自己的变化。",
];

const teacherFlow = [
  "在同一个项目里查看练习反馈数量和常见身体部位。",
  "按练习、阶段和日期范围筛选最近反馈。",
  "下钻到单个练习或学生历史，不需要切换第二套后台。",
];

export default function HomePage() {
  return (
    <div className="px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#f7f3ec_0%,#ffffff_48%,#efe6d5_100%)]">
          <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                Feldenkrais MVP
              </p>
              <h1 className="mt-4 text-4xl font-light leading-tight text-stone-950 md:text-5xl">
                费登奎斯身体觉察
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
                学生在这里找练习、听音频、记录身体反馈；老师在同一个项目里看统计、回看练习效果和学生历史。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/practice-search"
                  className="inline-flex items-center justify-center rounded-2xl bg-stone-950 px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                >
                  开始找练习
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white/80 px-6 py-4 text-sm font-medium text-stone-900 transition-colors hover:bg-white"
                >
                  登录或注册
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-[0_20px_50px_rgba(28,25,23,0.08)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  学生
                </p>
                <h2 className="mt-3 text-xl font-medium text-stone-950">
                  找练习并记录每个部位的变化
                </h2>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/practice-search"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-stone-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                  >
                    去找练习
                  </Link>
                  <Link
                    href="/feedback/new"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
                  >
                    去做反馈
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-stone-800 bg-stone-950 p-5 text-white shadow-[0_20px_50px_rgba(28,25,23,0.12)]">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  老师
                </p>
                <h2 className="mt-3 text-xl font-medium">
                  查看练习统计和学生历史
                </h2>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/teacher"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#efe6d5] px-4 py-3 text-sm font-medium text-stone-950 transition-colors hover:bg-[#e6d8bf]"
                  >
                    进入老师端
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-stone-700 px-4 py-3 text-sm font-medium text-stone-100 transition-colors hover:bg-stone-900"
                  >
                    老师登录
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              学生流程
            </p>
            <h2 className="mt-3 text-2xl font-medium text-stone-950">
              从身体部位进入，而不是从课程列表开始
            </h2>
            <div className="mt-6 space-y-4">
              {studentFlow.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-700">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-stone-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-200 bg-[#f7f3ec] p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
              老师视图
            </p>
            <h2 className="mt-3 text-2xl font-medium text-stone-950">
              用最小但足够的统计，快速看见练习反馈
            </h2>
            <div className="mt-6 space-y-4">
              {teacherFlow.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium text-stone-700">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-stone-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
