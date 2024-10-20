import React, { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy, FiEye } from "react-icons/fi";
import { PrismaClient, Post, ContentSection } from "@prisma/client";

const prisma = new PrismaClient();

interface PostDetailProps {
  post: Post & { contentSections: ContentSection[] };
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(post.views);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // Flag to detect if component has mounted
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true); // Set this true when component mounts

    import("prismjs").then((Prism) => {
      require("prismjs/components/prism-javascript");
      require("prismjs/themes/prism-okaidia.css");
      Prism.highlightAll();
    });
  }, [post]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (!hasMounted || viewIncremented || router.isFallback) return;

    const incrementViewCount = async () => {
      try {
        const response = await fetch("/api/incrementViewCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: post.id }),
        });
        const data = await response.json();
        setViews(data.views);
        setViewIncremented(true); // Ensure view count is incremented only once
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    };

    incrementViewCount();
  }, [hasMounted, post.id, router.isFallback, viewIncremented]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back
      </button>

      <div className="flex  items-start flex-col mb-6">
        <div className="flex items-center justify-between w-full text-gray-500 mb-5">
          <div className="flex items-center">
            <FiEye className="mr-2" />
            <span>{views} views</span>
          </div>
          <span className="text-sm ml-1">
            {new Date(post.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg text-gray-600">{post.description}</p>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto mb-8 rounded-lg shadow-md"
          loading="lazy"
        />
      )}

      {post.contentSections.map((section, index) => {
        const sectionNumber = index + 1;

        switch (section.type) {
          case "text":
            return (
              <p key={index} className="text-gray-700 mb-4 font-semibold">
                <span className="font-bold">{sectionNumber}. </span>
                {section.content}
              </p>
            );
          case "image":
            return (
              <div key={index} className="mb-8">
                <p className="font-bold mb-2">{sectionNumber}. </p>
                <Image
                  src={section.src || ""}
                  alt={`Section ${sectionNumber}`}
                  width={800}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            );
          case "code":
            return (
              <div key={index} className="relative mb-8">
                <p className="font-bold mb-2">{sectionNumber}. </p>
                <CopyToClipboard
                  text={section.content || ""}
                  onCopy={() => setCopied(true)}
                >
                  <button className="absolute right-4 top-12 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded px-2 py-1 text-sm text-gray-800 flex items-center">
                    {copied ? "Copied!" : "Copy"}
                    <FiCopy className="ml-2" />
                  </button>
                </CopyToClipboard>
                <pre className="bg-gray-900 text-white p-4 rounded-lg shadow-md overflow-x-auto max-w-full text-sm">
                  <code className="language-javascript">{section.content}</code>
                </pre>
              </div>
            );
          case "video":
            return (
              <div key={index} className="mb-8">
                <p className="font-bold mb-2">{sectionNumber}. </p>
                <video controls className="w-full h-auto rounded-lg shadow-md">
                  <source src={section.src || ""} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({ select: { id: true } });
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { contentSections: true },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

export default PostDetail;
