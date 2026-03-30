import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* 产品标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light tracking-wide text-stone-900 mb-3">
          身体觉察
        </h1>
        <p className="text-stone-500 text-base">
          选择部位，查找练习，记录感受
        </p>
      </div>

      {/* 两个入口按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          href="/practice-search"
          className="flex-1 text-center px-6 py-4 bg-stone-900 text-white text-base font-medium rounded-xl hover:bg-stone-700 transition-colors"
        >
          去找练习
        </Link>
        <Link
          href="/feedback/new"
          className="flex-1 text-center px-6 py-4 bg-white border border-stone-300 text-stone-800 text-base font-medium rounded-xl hover:bg-stone-50 transition-colors"
        >
          去做反馈
        </Link>
      </div>

      {/* 底部说明 */}
      <p className="mt-16 text-xs text-stone-400 text-center max-w-xs">
        按身体部位找练习，做完后记录身体感受。
        <br />
        数据仅保存在本地。
      </p>
    </div>
  );
}
