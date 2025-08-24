import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";

const blogPosts = [
  {
    title: "The Unseen Struggles of Remote Work",
    slug: "struggles-of-remote-work",
    description: "Remote work is not always easy. Learn about the common struggles and how to overcome them.",
  },
  {
    title: "How to Avoid Cabin Fever When You Work from Home",
    slug: "avoid-cabin-fever",
    description: "Working from home can be isolating. Here are some tips to help you avoid cabin fever and stay connected.",
  },
  {
    title: "The Science of the Daily Grind: How Caffeine Really Works",
    slug: "science-of-coffee",
    description: "Unlock the secrets of your daily coffee. Learn how caffeine works to boost focus, and how to optimize its effects for maximum productivity.",
  },
  {
    title: "Beyond the Bean: Natural Ways to Boost Your Energy and Focus",
    slug: "beyond-the-bean",
    description: "Looking for ways to boost your energy without caffeine? Here are some natural methods to help you stay focused and productive.",
  },
  {
    title: "The Art of the Power Nap: Recharge Your Brain for Maximum Productivity",
    slug: "art-of-the-power-nap",
    description: "Feeling tired? A power nap might be just what you need. Learn how to nap effectively to boost your energy and focus.",
  },
];

const Blog = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>Blog - Brews and Bytes</title>
        <meta name="description" content="Read our latest blog posts on remote work, coffee, and productivity." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Brews & Bytes Blog
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your trusted resource for remote work, coffee, and productivity.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <h2 className="font-montserrat font-bold text-xl text-coffee-brown mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">{post.description}</p>
                  <Link href={`/blog/${post.slug}`}>
                    <a className="text-vibe-yellow hover:text-yellow-400 font-semibold">Read More &raquo;</a>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
