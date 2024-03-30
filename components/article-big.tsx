import * as React from "react";

interface ArticleBig {
  backgroundImage: string;
  title: string;
}

function ArticleSection({ backgroundImage, title }: ArticleBig) {
  return (
    <section className="flex overflow-hidden relative flex-col items-center px-16 pt-20 w-full min-h-[253px] max-md:px-5 max-md:max-w-full">
      <img loading="lazy" src={backgroundImage} alt="" className="object-cover absolute inset-0 size-full" />
      <h1 className="relative justify-center px-14 py-4 mt-28 bg-black max-md:px-5 max-md:mt-10">{title}</h1>
    </section>
  );
}

export default function MyComponent() {
  return (
    <main>
      <ArticleSection backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/c6d5988d99898ad1941706d250cf762e62f8081dea56ed3398003aff9097e239?apiKey=02a94306e78448359892a08420d7da4a&" title="Justice Gun 2" />
    </main>
  );
}