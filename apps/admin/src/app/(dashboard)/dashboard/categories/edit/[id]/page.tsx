import CategoryEditor from "../../../../../../components/dashboard/category-editor";

// This is now a server component (no "use client" directive)
export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryEditor categoryId={id} />;
}
