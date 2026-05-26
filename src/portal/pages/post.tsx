// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import type { Post } from "../types/portal-types";
// import { getPostBySlug } from "../lib/queries";
// import { Header } from "../components/header";
// import { PostMain } from "../components/main/post";
// import { Footer } from "../components/footer";
// import { PostMainSkeleton } from "../components/skeleton/post-skeleton";
// import { ErrorState } from "../components/error-state";
// 
// export function PostPage() {
//   const [postData, setPostData] = useState<Post | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { tag, post } = useParams<{ tag: string; post: string }>();
// 
//   useEffect(() => {
//     let active = true;
// 
//     async function fetchPost() {
//       if (!post || !tag) {
//         setError("Post nao encontrado.");
//         setIsLoading(false);
//         return;
//       }
// 
//       setIsLoading(true);
//       setError(null);
// 
//       const result = await getPostBySlug(post);
// 
//       if (!active) return;
// 
//       setPostData(result);
//       setIsLoading(false);
// 
//       if (!result) {
//         setError("Post nao encontrado.");
//       }
//     }
// 
//     void fetchPost();
// 
//     return () => {
//       active = false;
//     };
//   }, [post, tag]);
// 
//   useEffect(() => {
//     if (!postData) return;
// 
//     const url = `https://virtualbarber.com.br/portal/${postData.category}/${postData.slug}`;
// 
//     const setMeta = (selector: string, value: string) =>
//       document.querySelector(selector)?.setAttribute("content", value);
// 
//     const prevTitle = document.title;
//     const prevDesc =
//       document
//         .querySelector('meta[name="description"]')
//         ?.getAttribute("content") ?? "";
//     const prevOgImage =
//       document
//         .querySelector('meta[property="og:image"]')
//         ?.getAttribute("content") ?? "";
// 
//     document.title = `${postData.title} | Virtual Barber`;
//     setMeta('meta[name="description"]', postData.excerpt);
//     setMeta('meta[property="og:title"]', postData.title);
//     setMeta('meta[property="og:description"]', postData.excerpt);
//     setMeta('meta[property="og:url"]', url);
//     setMeta('meta[property="og:image"]', postData.cover_url);
//     setMeta('meta[name="twitter:title"]', postData.title);
//     setMeta('meta[name="twitter:description"]', postData.excerpt);
//     setMeta('meta[name="twitter:image"]', postData.cover_url);
//     document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
// 
//     return () => {
//       document.title = prevTitle;
//       setMeta('meta[name="description"]', prevDesc);
//       setMeta('meta[property="og:image"]', prevOgImage);
//       document
//         .querySelector('link[rel="canonical"]')
//         ?.setAttribute("href", "https://virtualbarber.com.br/");
//     };
//   }, [postData]);
// 
//   return (
//     <>
//       <Header />
//       {isLoading && <PostMainSkeleton />}
//       {!isLoading && error && <ErrorState isDark={false} message={error} />}
//       {!isLoading && !error && postData && <PostMain post={postData} />}
//       <Footer />
//     </>
//   );
// }
