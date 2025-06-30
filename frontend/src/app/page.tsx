import Image from "next/image";
import Link from "next/link";
import DashboardPage from "./dashboard/page";

export default function Home() {
  return (
    <>
    <div>
      
      <Link href='/dashboard'> Go to dashboard </Link>
      
    </div>
    </>
  );
}
