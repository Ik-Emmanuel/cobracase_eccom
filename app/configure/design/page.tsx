interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
  // make a db call if needed
  return <div>page {id}</div>;
};

export default page;
