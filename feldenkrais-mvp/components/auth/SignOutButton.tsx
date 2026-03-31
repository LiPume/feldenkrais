import { signOut } from '@/server/actions/auth';

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
      >
        退出
      </button>
    </form>
  );
}
