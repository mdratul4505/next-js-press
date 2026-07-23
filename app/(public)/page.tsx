import { getMe } from "@/service/getme";

export default async function HomePage() {
  const user = await getMe()
  return (
    <div>
      hello nextjs !
    </div>
  );
}
