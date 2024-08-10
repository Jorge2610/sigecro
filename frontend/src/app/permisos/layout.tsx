export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-lora">Permisos</h1>
      {children}
    </div>
  );
}
