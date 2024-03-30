import * as React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

interface NavItemProps {
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label }) => (
  <div className="flex gap-0 justify-center bg-black bg-opacity-0">
    <Image src={icon} alt="" className="shrink-0 w-16 aspect-square" />
    <div className="flex-auto my-auto">{label}</div>
  </div>
);

const navigation = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/32bafbc63d41fc9d4d27293d615d8ca101f4881e7c6ddd313cb4c73b91c3475a?apiKey=02a94306e78448359892a08420d7da4a&", label: "Articles" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/32bafbc63d41fc9d4d27293d615d8ca101f4881e7c6ddd313cb4c73b91c3475a?apiKey=02a94306e78448359892a08420d7da4a&", label: "Portfolio" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/32bafbc63d41fc9d4d27293d615d8ca101f4881e7c6ddd313cb4c73b91c3475a?apiKey=02a94306e78448359892a08420d7da4a&", label: "About" },
];

interface ProjectProps {
  image: string;
  title: string;
}

const Project: React.FC<ProjectProps> = ({ image, title }) => (
  <div className="flex flex-col justify-center bg-white max-md:max-w-full">
    <div className="flex overflow-hidden relative flex-col items-center px-16 pt-20 w-full min-h-[253px] max-md:px-5 max-md:max-w-full">
      <Image src={image} alt={title} className="object-cover absolute inset-0 size-full" />
      <div className="relative justify-center px-14 py-4 mt-28 bg-black max-md:px-5 max-md:mt-10">
        {title}
      </div>
    </div>
  </div>
);

const projects = [
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/215519594f4fa9493ed1d421f90dfba970e6499af860ef8674aba6a645a4df76?apiKey=02a94306e78448359892a08420d7da4a&", title: "Cover Shooter" },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/c6d5988d99898ad1941706d250cf762e62f8081dea56ed3398003aff9097e239?apiKey=02a94306e78448359892a08420d7da4a&", title: "Justice Gun 2" },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/5289cddaf057bce32a079d55b34ac6c0b5e17568654b3b7035fdbbc1b740c31b?apiKey=02a94306e78448359892a08420d7da4a&", title: "Dirty Revolver" },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ce0e436c8a25b325f1a610dfb5e074cc428b213067e138193e57adde56a54dc0?apiKey=02a94306e78448359892a08420d7da4a&", title: "Behavior Tree" },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/b0f4b34d5df1becd4f207569e619230757687ec4267028f4bc854ced7092dfc7?apiKey=02a94306e78448359892a08420d7da4a&", title: "Widget Tips" },
  { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/3df72cc8944e9d2146f8ff417a08fc4a019804dbd78dece342a76a3af4a15851?apiKey=02a94306e78448359892a08420d7da4a&", title: "Component System" },
];

function MyComponent() {
  return (
    <div className="flex flex-col justify-center p-10 w-screen h-screen bg-black border border-black border-solid ml-[calc(50%_-_50vw)] max-md:px-5">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
          <div className="grow self-stretch pb-20 w-auto bg-black max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-[21%] max-md:ml-0 max-md:w-full">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a85005e1a88478ce614a846631f875c8552b01db73484670d1b347472830b4ac?apiKey=02a94306e78448359892a08420d7da4a&"
                  alt="Profile"
                  className="shrink-0 max-w-full aspect-square w-[100px] max-md:mt-10"
                />
              </div>
              <nav className="flex flex-col ml-5 w-[79%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col text-4xl font-light text-white whitespace-nowrap max-md:mt-10">
                  {navigation.map((item) => (
                    <NavItem key={item.label} icon={item.icon} label={item.label} />
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
        <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow self-stretch pb-20 w-auto text-4xl font-light text-center text-white bg-zinc-800 bg-opacity-0 max-md:mt-10 max-md:max-w-full">
            {projects.slice(0, 3).map((project, index) => (
              <Project
                key={project.title}
                image={project.image}
                title={project.title}
              />
            ))}
          </div>
        </section>
        <section className="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow self-stretch pb-20 w-auto text-4xl font-light text-center text-white bg-zinc-800 bg-opacity-0 max-md:mt-10 max-md:max-w-full">
            {projects.slice(3).map((project, index) => (
              <Project
                key={project.title}
                image={project.image}
                title={project.title}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyComponent;