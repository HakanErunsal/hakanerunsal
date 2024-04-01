import Link from "next/link";
import { NavigationItem } from "./navigation-button";

export function NavigationColumn() {
  return (
    <div className="flex md:fixed top-0 left-0 p-4 z-10">
      {/* Logo */}
      <div className="w-32 h-32 p-4 flex flex-none items-center justify-center">
        <Link href="/">
          <img src="/images/logos/H_Logo.png" alt="Logo" className="w-full h-full" />
          <img src="/images/logos/Hakan_Logo.png" alt="Logo" className="w-full h-full" />
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="col-start-2 col-span-2 p-8 items-left">
        <ul className="space-y-2">
          <NavigationItem slug={"/articles"} title={"Articles"} />
          <NavigationItem slug={"/projects"} title={"Portfolio"} />
          <NavigationItem slug={"/blog"} title={"Blog"} />
          <NavigationItem slug={"/about"} title={"About"} />
        </ul>
      </div>
    </div>
  );
}

export default NavigationColumn;
