export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return <div className="p-sm">Reset Password Page Placeholder for Token: {params?.token}</div>;
}
