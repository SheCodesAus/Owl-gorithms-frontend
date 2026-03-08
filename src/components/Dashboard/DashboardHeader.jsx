function DashboardHeader({ user }) {
  return (
    <header className="space-y-2">
      <h1 className="page-title">
        Welcome back{user?.first_name ? `, ${user.first_name}` : ""}!
      </h1>
      <p className="body-muted">
        Jump back into a list or preview what to tackle next with your team.
      </p>
    </header>
  );
}

export default DashboardHeader;