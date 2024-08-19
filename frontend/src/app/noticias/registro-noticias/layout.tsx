const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-lora font-semibold">Registrar Noticias</h1>
      {children}
    </div>
  );
};

export default Layout;
