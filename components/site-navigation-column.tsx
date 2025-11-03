import Link from "next/link";
import Image from "next/image";
import { NavigationItem } from "./navigation-button";

export function NavigationColumn() {
  return (
    <div className="flex md:fixed top-0 left-0 p-4 z-10">
      {/* Logo */}
      <div className="w-40 h-40 p-4 flex flex-none items-center justify-center">
        <Link href="/">
          <div className="w-full h-full rounded-full border-4 border-primary bg-background p-2 flex items-center justify-center">
            <Image 
              src="/logos/H_Logo.png" 
              alt="Logo" 
              width={160} 
              height={160}
              priority
              className="object-contain scale-110"
            />
          </div>
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="col-start-2 col-span-2 p-8 items-left">
        <ul className="space-y-2">
          <NavigationItem slug={"/articles"} title={"Articles"} />
          <NavigationItem slug={"/projects"} title={"Portfolio"} />
          <NavigationItem slug={"/about"} title={"About"} />
        </ul>
      </div>
    </div>
  );
}

export default NavigationColumn;