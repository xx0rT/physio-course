import { motion } from "framer-motion";
import { Calendar, ArrowRight, User, Tag } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BlogPreviewSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 nejčastějších chyb při rehabilitaci zad",
      excerpt: "Zjistěte, které chyby dělají pacienti nejčastěji a jak je správně vyhnout pro rychlejší uzdravení.",
      image: "/home/post1.png",
      author: "Dr. Jana Nováková",
      authorImage: "/home/person1.png",
      date: "15. prosince 2024",
      category: "Rehabilitace",
      readTime: "5 min čtení"
    },
    {
      id: 2,
      title: "Moderní přístupy v manuální terapii",
      excerpt: "Jak se mění přístupy k manuální terapii a jaké nové techniky jsou dnes nejúčinnější pro léčbu.",
      image: "/home/post2.png",
      author: "MUDr. Petr Svoboda",
      authorImage: "/home/person2.png",
      date: "10. prosince 2024",
      category: "Techniky",
      readTime: "8 min čtení"
    },
    {
      id: 3,
      title: "Preventivní cvičení pro zdravá kolena",
      excerpt: "Komplexní průvodce prevencí zranění kolen včetně praktických cvičení a doporučení.",
      image: "/home/post3.png",
      author: "Mgr. Tereza Malá",
      authorImage: "/home/person3.png",
      date: "5. prosince 2024",
      category: "Prevence",
      readTime: "6 min čtení"
    }
  ];

  return (
    <MaxWidthWrapper className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-semibold mb-4">
          <Tag className="w-4 h-4" />
          <span>Novinky a poznatky</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6">
          Z našeho blogu
        </h2>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Nejnovější články, tipy a odborné poznatky ze světa fyzioterapie a rehabilitace
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-2xl transition-all group h-full flex flex-col">
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-teal-600 dark:text-teal-400 text-xs font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-800"
                    />
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {post.author}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button size="lg" variant="outline" className="group">
          Zobrazit všechny články
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </MaxWidthWrapper>
  );
};

export default BlogPreviewSection;
