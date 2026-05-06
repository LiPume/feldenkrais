import { signOut } from '@/server/actions/auth';

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="signout-btn"
      >
        退出
      </button>
    </form>
  );
}
