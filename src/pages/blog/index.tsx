import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { PrismaClient, Post as PrismaPost } from "@prisma/client";
import { motion } from "framer-motion"; // Import motion
import { BsEye } from "react-icons/bs";

const prisma = new PrismaClient();

type Post = Omit<PrismaPost, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

interface BlogProps {
  initialPosts: Post[];
  categories: string[];
}

const Blog: React.FC<BlogProps> = ({ initialPosts, categories }) => {
  const [posts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  // Filter berdasarkan pencarian dan kategori
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const contentLower = (post.content || "").toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (post.title.toLowerCase().includes(searchTermLower) ||
          contentLower.includes(searchTermLower)) &&
        (selectedCategory === "" || post.category === selectedCategory)
      );
    });
  }, [posts, searchTerm, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "All" ? "" : category);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          category: category === "All" ? "" : category,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  // Variants untuk animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: -50 }, // Muncul dari atas (y negatif)
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }, // Transisi lebih cepat
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }, // Hover lebih cepat
    },
  };

  return (
    <div className="p-8">
      <div className="text-center flex justify-between items-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold ">Source Code</h1>
        <Link
          className="bg-black text-white w-20 h-10 text-center flex items-center justify-center rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform duration-100 ease-in-out shadow-lg hover:shadow-2xl"
          href="/"
        >
          Back
        </Link>
      </div>

      {/* Input pencarian */}
      <input
        type="text"
        placeholder="Search posts..."
        className="p-3 mb-6 border-2 border-gray-300 rounded w-full focus:outline-none focus:border-black transition-all duration-500 ease-in-out"
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
      />

      {/* Tombol kategori */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <Button
              key={category}
              className={`flex-shrink-0 text-lg font-medium px-4 py-2 transition-colors duration-300 ease-in-out ${
                selectedCategory === category ||
                (selectedCategory === "" && category === "All")
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } rounded-full`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Daftar postingan */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            variants={containerVariants} // Tambahkan variants
            initial="hidden" // State awal
            animate="visible" // State setelah muncul
            whileHover="hover" // State saat hover
            className="relative p-1 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            style={{ minHeight: "350px" }} // Set ukuran minimum kartu
          >
            <Link href={`/blog/${post.id}`} className="block h-full">
              <div className="relative bg-white p-6 rounded-lg flex flex-col justify-between h-full">
                <div className="flex flex-col">
                  <Image
                    src={post.image || "/placeholder-image.jpg"}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {(post.content || "").substring(0, 100)}...
                  </p>
                </div>

                {/* category dan views di bawah */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <BsEye size={16} className="mr-1" />
                    <span className="text-sm">{post.views}</span>

                    <span className="text-sm text-blue-500 ml-1">Views</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="text-sm ml-1">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const posts = await prisma.post.findMany();
  const categorySet = new Set(posts.map((post) => post.category));
  const categories = ["All", ...Array.from(categorySet)];

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return {
    props: {
      initialPosts: serializedPosts,
      categories,
    },
    revalidate: 60, // Revalidate setiap 60 detik
  };
}

export default Blog;
