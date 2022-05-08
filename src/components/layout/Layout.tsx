type Props = {
  children: JSX.Element[];
};

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-full flex flex-col items-center">{children}</div>
  );
};
export default Layout;
