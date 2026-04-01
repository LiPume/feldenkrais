const INTERNAL_STUDENT_EMAIL_DOMAIN = 'student.feldenkrais.local';

export function normalizeStudentId(studentId: string): string {
  return studentId.trim();
}

function encodeStudentId(studentId: string): string {
  return Array.from(normalizeStudentId(studentId).toLowerCase())
    .map((char) => char.codePointAt(0)?.toString(16).padStart(4, '0') ?? '')
    .join('');
}

export function buildStudentAuthEmail(studentId: string): string {
  return `student-${encodeStudentId(studentId)}@${INTERNAL_STUDENT_EMAIL_DOMAIN}`;
}

export function isInternalStudentEmail(email?: string | null): boolean {
  return Boolean(
    email?.trim().toLowerCase().endsWith(`@${INTERNAL_STUDENT_EMAIL_DOMAIN}`),
  );
}
