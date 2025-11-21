import { Form, useLoaderData } from 'react-router';
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { useOptionalUser } from '#app/utils/user.ts';
import { useState } from 'react';
import { Icon } from '#app/components/ui/icon.tsx';

export async function loader() {
  // Only admins can access
  // This should be enforced in the route config or loader
  // For now, just fetch all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      is_admin: true,
    },
  });
  return { users };
}

export async function action({ request }: { request: Request }) {
  const formData = await (request as Request).formData();
  const id = formData.get('id') as string;
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const is_admin = formData.get('is_admin') === 'on';
  await prisma.user.update({
    where: { id },
    data: { email, username, name, is_admin },
  });
  return null;
}

export default function AdminEditUsers() {
  const { users } = useLoaderData() as { users: Array<{ id: string; email: string; username: string; name: string | null; is_admin: boolean }> };
  const user = useOptionalUser() as (typeof users)[number] | undefined;

  const [editingId, setEditingId] = useState<string | null>(null);

  if (!user || !('is_admin' in user) || !user.is_admin) {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div className="container mt-10">
      <h2 className="text-h2 mb-6">Edit Users (Admin Only)</h2>
      <div className="flex gap-4 items-center w-full font-bold text-lg mb-2">
        <div className="flex-1 min-w-[200px] max-w-[400px] px-2">Email</div>
        <div className="flex-1 min-w-[200px] max-w-[400px] px-2">Username</div>
        <div className="flex-1 min-w-[200px] max-w-[400px] px-2">Name</div>
        <div className="flex items-center gap-2 px-2">Admin</div>
        <div className="ml-2 px-2">Edit</div>
      </div>
      <ul className="divide-y divide-muted">
        {users.map((u) => {
          const isEditing = editingId === u.id;
          return (
            <li key={u.id} className="py-4 flex items-center gap-6 text-base">
              {!isEditing ? (
                <div className="flex gap-4 items-center w-full">
                  <div className="flex-1 min-w-[200px] max-w-[400px] break-words px-2 py-1 rounded bg-muted text-lg">
                    {u.email}
                  </div>
                  <div className="flex-1 min-w-[200px] max-w-[400px] break-words px-2 py-1 rounded bg-muted text-lg">
                    {u.username}
                  </div>
                  <div className="flex-1 min-w-[200px] max-w-[400px] break-words px-2 py-1 rounded bg-muted text-lg">
                    {u.name ?? ''}
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-muted text-lg">
                    <input type="checkbox" checked={u.is_admin} readOnly />
                  </div>
                  <button type="button" className="ml-2 p-2 rounded hover:bg-accent" onClick={() => setEditingId(u.id)}>
                    <Icon name="pencil-2" size="md" />
                  </button>
                </div>
              ) : (
                <Form method="post" className="flex gap-4 items-center w-full text-lg" replace onBlur={e => { if (e.relatedTarget === null) setEditingId(null); }}>
                  <input type="hidden" name="id" value={u.id} />
                  <label className="flex flex-col text-xs flex-1 min-w-[200px] max-w-[400px]">
                    Email
                    <input
                      name="email"
                      defaultValue={u.email}
                      className="input px-3 py-2 border rounded focus:outline-accent text-lg"
                      style={{ width: '100%' }}
                      onBlur={e => e.target.form?.requestSubmit()}
                    />
                  </label>
                  <label className="flex flex-col text-xs flex-1 min-w-[200px] max-w-[400px]">
                    Username
                    <input
                      name="username"
                      defaultValue={u.username}
                      className="input px-3 py-2 border rounded focus:outline-accent text-lg"
                      style={{ width: '100%' }}
                      onBlur={e => e.target.form?.requestSubmit()}
                    />
                  </label>
                  <label className="flex flex-col text-xs flex-1 min-w-[200px] max-w-[400px]">
                    Name
                    <input
                      name="name"
                      defaultValue={u.name ?? ''}
                      className="input px-3 py-2 border rounded focus:outline-accent text-lg"
                      style={{ width: '100%' }}
                      onBlur={e => e.target.form?.requestSubmit()}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-xs px-2 py-1">
                    Admin
                    <input
                      type="checkbox"
                      name="is_admin"
                      defaultChecked={u.is_admin}
                      onChange={e => e.target.form?.requestSubmit()}
                    />
                  </label>
                  <button type="button" className="ml-2 p-2 rounded hover:bg-accent" onClick={() => setEditingId(null)}>
                    <Icon name="cross-1" size="md" />
                  </button>
                </Form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ErrorBoundary() {
  return <GeneralErrorBoundary />;
}
